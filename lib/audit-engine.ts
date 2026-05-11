import {
  SelectedTool,
  Recommendation,
  AuditRequest,
  AuditResponse,
} from "./types";
import { TOOL_CONFIGS } from "./tools-config";

interface AuditResult {
  recommendation: Recommendation;
  calculatedCurrentSpend: number;
  calculatedRecommendedSpend: number;
}

function auditTool(
  tool: SelectedTool,
  teamSize: number,
  useCase: string,
): AuditResult {
  const config = TOOL_CONFIGS[tool.toolId];
  if (!config) {
    return {
      recommendation: {
        toolId: tool.toolId,
        action: "optimal",
        savings: { monthly: 0, annual: 0 },
        reason: "Tool configuration not found.",
      },
      calculatedCurrentSpend: tool.monthlySpend,
      calculatedRecommendedSpend: tool.monthlySpend
    };
  }

  const currentPlan = config.plans[tool.planId];
  
  // Calculate the actual total spend for this tool. 
  // If the user selected a free plan but typed $15, force it to $0.
  const isFreePlan = currentPlan?.price === 0;
  const effectiveSeats = Math.max(tool.seats || 1, teamSize);
  const calculatedSpend = isFreePlan ? 0 : (currentPlan ? currentPlan.price * effectiveSeats : tool.monthlySpend);
  
  // Only override with manual input if it's NOT a free plan and they input more than baseline (e.g. add-ons)
  const currentMonthlyTotal = isFreePlan ? 0 : Math.max(tool.monthlySpend, calculatedSpend);

  // cursor pro is solo-only — flag it for teams
  if (tool.toolId === "cursor" && tool.planId === "pro" && effectiveSeats > 1) {
    const businessPriceTotal = config.plans.business.price * effectiveSeats;
    const monthlySavings = currentMonthlyTotal - businessPriceTotal;

    if (monthlySavings > 0) {
      return {
        recommendation: {
          toolId: tool.toolId,
          action: "downgrade",
          targetPlan: "business",
          savings: { monthly: monthlySavings, annual: monthlySavings * 12 },
          reason: `Cursor Pro is for solo devs. For a team of ${effectiveSeats}, Business ($${config.plans.business.price}/mo/user) is recommended, saving $${monthlySavings}/mo.`,
        },
        calculatedCurrentSpend: currentMonthlyTotal,
        calculatedRecommendedSpend: businessPriceTotal
      };
    } else {
       return {
        recommendation: {
          toolId: tool.toolId,
          action: "switch",
          targetPlan: "business",
          savings: { monthly: 0, annual: 0 }, // We don't show negative savings in the UI
          reason: `Cursor Pro is for solo devs. You should switch to Business ($${config.plans.business.price}/mo/user) for a team of ${effectiveSeats} for security, even if it costs more.`,
        },
        calculatedCurrentSpend: currentMonthlyTotal,
        calculatedRecommendedSpend: currentMonthlyTotal // Clamp it so the necessary upgrade doesn't eat the total savings pool
      };
    }
  }

  // same logic for claude — team plan is cheaper per seat
  if (tool.toolId === "claude" && tool.planId === "pro" && effectiveSeats > 1) {
    const teamPriceTotal = config.plans.team.price * effectiveSeats;
    if (currentMonthlyTotal > teamPriceTotal) {
      const monthlySavings = currentMonthlyTotal - teamPriceTotal;
      return {
        recommendation: {
          toolId: tool.toolId,
          action: "downgrade",
          targetPlan: "team",
          savings: { monthly: monthlySavings, annual: monthlySavings * 12 },
          reason: `Team of ${effectiveSeats} paying individual Pro rates. Team plan is cheaper ($${config.plans.team.price}/mo/user).`,
        },
        calculatedCurrentSpend: currentMonthlyTotal,
        calculatedRecommendedSpend: teamPriceTotal
      };
    }
  }

  // TODO: add more tool-specific rules here as we expand coverage
  const alternativeToolId = config.alternatives?.[useCase];
  if (alternativeToolId) {
    const altConfig = TOOL_CONFIGS[alternativeToolId];
    // Include all plans, even $0 free plans, so we can suggest downgrades to free tiers
    const altPlans = Object.values(altConfig.plans);
    const cheapestAltPlan = altPlans.sort((a, b) => a.price - b.price)[0];

    if (cheapestAltPlan && cheapestAltPlan.price < currentMonthlyTotal) {
      const monthlySavings = currentMonthlyTotal - cheapestAltPlan.price;
      return {
        recommendation: {
          toolId: tool.toolId,
          action: "switch",
          targetPlan: cheapestAltPlan.name,
          savings: { monthly: monthlySavings, annual: monthlySavings * 12 },
          reason: `For ${useCase}, ${altConfig.name} starts at $${cheapestAltPlan.price}/mo — a cheaper option.`,
        },
        calculatedCurrentSpend: currentMonthlyTotal,
        calculatedRecommendedSpend: cheapestAltPlan.price
      };
    }
  }

  return {
    recommendation: {
      toolId: tool.toolId,
      action: "optimal",
      savings: { monthly: 0, annual: 0 },
      reason: "Current plan looks well-optimized for your team and use case.",
    },
    calculatedCurrentSpend: currentMonthlyTotal,
    calculatedRecommendedSpend: currentMonthlyTotal
  };
}

export function auditAllTools(
  tools: SelectedTool[],
  teamSize: number,
  useCase: string,
): Omit<AuditResponse, "auditId" | "publicSlug"> {
  let totalCurrentMonthly = 0;
  let totalRecommendedMonthly = 0;
  const recommendations: Recommendation[] = [];

  for (const tool of tools) {
    const { recommendation, calculatedCurrentSpend, calculatedRecommendedSpend } = auditTool(tool, teamSize, useCase);
    
    totalCurrentMonthly += calculatedCurrentSpend;
    totalRecommendedMonthly += calculatedRecommendedSpend;
    recommendations.push(recommendation);
  }

  const totalSavingsMonthly = totalCurrentMonthly - totalRecommendedMonthly;

  return {
    currentSpend: {
      monthly: totalCurrentMonthly,
      annual: totalCurrentMonthly * 12,
    },
    recommendations,
    totalSavings: {
      monthly: Math.max(0, totalSavingsMonthly),
      annual: Math.max(0, totalSavingsMonthly * 12),
    },
    summary: "",
  };
}
