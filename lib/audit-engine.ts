import {
  SelectedTool,
  Recommendation,
  AuditRequest,
  AuditResponse,
} from "./types";
import { TOOL_CONFIGS } from "./tools-config";

function auditTool(
  tool: SelectedTool,
  teamSize: number,
  useCase: string,
): Recommendation {
  const config = TOOL_CONFIGS[tool.toolId];
  if (!config) {
    return {
      toolId: tool.toolId,
      action: "optimal",
      savings: { monthly: 0, annual: 0 },
      reason: "Tool configuration not found.",
    };
  }

  const currentPlan = config.plans[tool.planId];
  const currentMonthlyTotal = tool.monthlySpend;

  // cursor pro is solo-only — flag it for teams
  if (tool.toolId === "cursor" && tool.planId === "pro" && teamSize > 1) {
    const businessPrice = config.plans.business.price;
    const monthlySavings = currentMonthlyTotal - businessPrice;

    if (monthlySavings > 0) {
      return {
        toolId: tool.toolId,
        action: "downgrade",
        targetPlan: "business",
        savings: { monthly: monthlySavings, annual: monthlySavings * 12 },
        reason: `Cursor Pro is for solo devs. For a team of ${teamSize}, Business ($${businessPrice}/mo) is cheaper.`,
      };
    }
  }

  // same logic for claude — team plan is cheaper per seat
  if (tool.toolId === "claude" && tool.planId === "pro" && teamSize > 1) {
    const teamPrice = config.plans.team.price * teamSize;
    if (currentMonthlyTotal > teamPrice) {
      const monthlySavings = currentMonthlyTotal - teamPrice;
      return {
        toolId: tool.toolId,
        action: "downgrade",
        targetPlan: "team",
        savings: { monthly: monthlySavings, annual: monthlySavings * 12 },
        reason: `Team of ${teamSize} paying individual Pro rates. Team plan is cheaper.`,
      };
    }
  }

  // TODO: add more tool-specific rules here as we expand coverage
  const alternativeToolId = config.alternatives[useCase];
  if (alternativeToolId) {
    const altConfig = TOOL_CONFIGS[alternativeToolId];
    const altPlans = Object.values(altConfig.plans).filter((p) => p.price > 0);
    const cheapestAltPlan = altPlans.sort((a, b) => a.price - b.price)[0];

    if (cheapestAltPlan && cheapestAltPlan.price < currentMonthlyTotal) {
      const monthlySavings = currentMonthlyTotal - cheapestAltPlan.price;
      return {
        toolId: tool.toolId,
        action: "switch",
        targetPlan: cheapestAltPlan.name,
        savings: { monthly: monthlySavings, annual: monthlySavings * 12 },
        reason: `For ${useCase}, ${altConfig.name} starts at $${cheapestAltPlan.price}/mo — a cheaper option.`,
      };
    }
  }

  return {
    toolId: tool.toolId,
    action: "optimal",
    savings: { monthly: 0, annual: 0 },
    reason: "Current plan looks well-optimized for your team and use case.",
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
    totalCurrentMonthly += tool.monthlySpend;

    const recommendation = auditTool(tool, teamSize, useCase);
    recommendations.push(recommendation);

    const toolSavings = recommendation.savings.monthly;
    totalRecommendedMonthly += tool.monthlySpend - toolSavings;
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
