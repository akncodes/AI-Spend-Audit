import Anthropic from '@anthropic-ai/sdk';
import { AuditResponse, Recommendation } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// fallback text for when claude API times out or errors
const fallbacks = {
  high: (savings: number, tools: string[]) =>
    `Your team is significantly overspending on AI tools. We found over $${savings} in monthly savings by optimizing ${tools.join(', ')}. Switching to team plans and cutting redundant subscriptions can cut your burn rate without hurting productivity.`,

  medium: (savings: number, tools: string[]) =>
    `There are some real optimization opportunities here. You can save ~$${savings}/month by adjusting your plans for ${tools.join(', ')}. Small changes, meaningful results.`,

  low: (savings: number, tools: string[]) =>
    `Your AI spend looks pretty solid. Found minor savings of $${savings}/month across ${tools.join(', ')}. You're already on efficient plans for your team size.`,
};

export async function generateAuditSummary(auditData: Omit<AuditResponse, 'summary'>): Promise<string> {
  const { totalSavings, recommendations } = auditData;
  const monthlySavings = totalSavings.monthly;

  if (monthlySavings === 0) {
    return fallbacks.low(0, ['your current tools']);
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const controller = new AbortController();
    // TODO: make timeout configurable via env var
    timeoutId = setTimeout(() => controller.abort(), 2500);

    const prompt = `
      You are an expert AI Spend Auditor. Give a punchy, professional summary of a team's AI spending.

      Context:
      - Total Monthly Savings: $${monthlySavings}
      - Recommendations: ${JSON.stringify(recommendations)}

      Keep it around 100 words. Mention specific tools and savings amounts. Be direct, no fluff.
    `;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
      stop_sequences: ['\n'],
    }, { signal: controller.signal });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return text.trim();

  } catch (error: unknown) {
    const isAbort = error instanceof Error && error.name === 'AbortError';
    if (isAbort) {
      console.warn('AI summary timed out, using fallback');
    } else {
      console.error('AI summary failed:', error);
    }

    // pick fallback based on savings tier
    if (monthlySavings > 500) {
      return fallbacks.high(monthlySavings, recommendations.map(r => r.toolId));
    } else if (monthlySavings >= 100) {
      return fallbacks.medium(monthlySavings, recommendations.map(r => r.toolId));
    } else {
      return fallbacks.low(monthlySavings, recommendations.map(r => r.toolId));
    }
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}
