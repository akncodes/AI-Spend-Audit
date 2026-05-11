import { Recommendation, Savings } from "./types";

type AuditSummaryInput = {
  totalSavings: Savings;
  recommendations: Recommendation[];
};

// fallback text for when claude API times out or errors
const fallbacks = {
  high: (savings: number, tools: string[]) =>
    `Your team is significantly overspending on AI tools. We found over $${savings} in monthly savings by optimizing ${tools.join(", ")}. Switching to team plans and cutting redundant subscriptions can cut your burn rate without hurting productivity.`,

  medium: (savings: number, tools: string[]) =>
    `There are some real optimization opportunities here. You can save ~$${savings}/month by adjusting your plans for ${tools.join(", ")}. Small changes, meaningful results.`,

  low: (savings: number, tools: string[]) =>
    `Your AI spend looks pretty solid. Found minor savings of $${savings}/month across ${tools.join(", ")}. You're already on efficient plans for your team size.`,
};

export async function generateAuditSummary(
  auditData: AuditSummaryInput,
): Promise<string> {
  const { totalSavings, recommendations } = auditData;
  const monthlySavings = totalSavings.monthly;

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const controller = new AbortController();
    // Allow up to 5s for OpenRouter to respond
    timeoutId = setTimeout(() => controller.abort(), 5000);

    const prompt = `
      You are an expert AI Spend Auditor. Give a punchy, professional summary of a team's AI spending.

      Context:
      - Total Monthly Savings: $${monthlySavings}
      - Recommendations: ${JSON.stringify(recommendations)}

      Keep it around 100 words. Mention specific tools and savings amounts. Be direct, no fluff.
    `;

    const apiKey =
      process.env.OPENROUTER_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("Missing API Key");
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 200,
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error(
        `OpenRouter API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    return text.trim();
  } catch (error: unknown) {
    const isAbort = error instanceof Error && error.name === "AbortError";
    if (isAbort) {
      console.warn("AI summary timed out, using fallback");
    } else {
      console.error("AI summary failed:", error);
    }

    // pick fallback based on savings tier
    if (monthlySavings > 500) {
      return fallbacks.high(
        monthlySavings,
        recommendations.map((r) => r.toolId),
      );
    } else if (monthlySavings >= 100) {
      return fallbacks.medium(
        monthlySavings,
        recommendations.map((r) => r.toolId),
      );
    } else {
      return fallbacks.low(
        monthlySavings,
        recommendations.map((r) => r.toolId),
      );
    }
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}
