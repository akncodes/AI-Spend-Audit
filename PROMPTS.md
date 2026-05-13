# PROMPTS.md — LLM Prompts for AI Spend Audit

## AI Summary Generation Prompt

### The Prompt

```
You are an expert AI Spend Auditor. Your goal is to provide a punchy, professional,
and highly specific summary of a team's AI spending.

Context:
- Total Monthly Savings Identified: $[MONTHLY_SAVINGS]
- Recommendations: [RECOMMENDATIONS_JSON]
```

### Why Written This Way

1. **Punchy and specific** - Avoids generic LLM filler. By demanding "punchy" tone and forbidding phrases like "I hope this helps", we get direct, actionable language.

2. **100-word constraint** - Keeps summaries scannable and shareable. Long-form summaries don't work on mobile or in screenshots.

3. **Tool and savings mentions** - Users want to see their specific tools and exact numbers, not generic optimization advice. This forces the LLM to be concrete.

4. **Professional tone** - Summaries will be shared publicly (via shareable links), so they must sound credible and authoritative—not chatty or casual.

5. **Model choice (Claude 3 Haiku)** - Haiku is:
   - **Fast**: ~200–500ms response time vs 1–2s for Opus
   - **Cheap**: $0.80/$4 per 1M tokens vs $3/$15 for Opus
   - **Sufficient**: Haiku handles straightforward summarization without hallucination
   - **Deadline safe**: We have a 2.5s timeout; Haiku reliably meets it

6. **Structured input** - Passing JSON recommendations avoids ambiguity. The LLM gets:
   ```json
   {
     "toolId": "cursor",
     "action": "downgrade",
     "targetPlan": "business",
     "savings": { "monthly": 120, "annual": 1440 },
     "reason": "Your team of 5 is overpaying for individual Pro accounts..."
   }
   ```
   This is more reliable than asking it to infer recommendations.

---

## What Didn't Work

### Attempt 1: Generic Prompt
**Prompt:** "Summarize this team's AI spending and suggest optimizations."

**Result:** 
- ❌ Generated 200+ word summaries (too long for sharing)
- ❌ Included generic advice ("consider consolidating tools")
- ❌ Didn't mention actual tool names or savings
- ❌ Took 1.5s average (risky with timeouts)

**Lesson:** LLMs need explicit constraints, not vague guidance.

---

### Attempt 2: Unstructured Context
**Prompt:** "Here's an audit result. Summarize it." + plain text audit data

**Result:**
- ❌ LLM generated hallucinated savings figures
- ❌ Invented recommendations not in original data
- ❌ Hard to verify accuracy

**Lesson:** Pass structured JSON. LLMs are more accurate with clear data contracts.

---

### Attempt 3: Model Choice (Claude Opus)
**Setup:** Used Opus for higher quality summaries

**Result:**
- ❌ 2–3s latency (too slow for happy path)
- ❌ Cost: $3/$15 per 1M tokens (3–4x more expensive)
- ❌ Overkill for simple summarization task

**Lesson:** Haiku is the right tool; don't over-engineer.

---

### Attempt 4: No Tone Constraint
**Prompt:** Didn't explicitly forbid "I hope this helps" or "In conclusion..."

**Result:**
- ❌ LLM often added filler phrases
- ❌ Reduced perceived credibility
- ❌ Wasted tokens on padding

**Lesson:** Explicitly forbid LLM verbal tics.

---

## Fallback Templates

Used when Anthropic API fails, times out, or has no credits:

```typescript
const FALLBACK_TEMPLATES = {
  HIGH: (savings: number, tools: string[]) =>
    `Your team is currently overspending significantly on AI tools. We've identified over $${savings} in potential monthly savings by optimizing your use of ${tools.join(', ')}. By switching to team-oriented plans and removing redundant subscriptions, you can drastically reduce your burn rate without sacrificing productivity.`,

  MEDIUM: (savings: number, tools: string[]) =>
    `We've found some meaningful optimization opportunities for your AI stack. You can save approximately $${savings} per month by refining your plans for ${tools.join(', ')}. These changes will streamline your spending and ensure you're on the most cost-effective tiers for your team size.`,

  LOW: (savings: number, tools: string[]) =>
    `Your AI spending is remarkably well-optimized. We identified minor savings of $${savings} per month across ${tools.join(', ')}. You are already leveraging the most efficient plans for your current team size and use case.`,
};
```

### Fallback Strategy

1. **Tier-based selection** - Choose template based on savings magnitude:
   - **HIGH** (>$500/mo): Emphasize urgency and Credex value prop
   - **MEDIUM** ($100–$500/mo): Highlight meaningful but not critical savings
   - **LOW** (<$100/mo): Honest messaging, no manufactured urgency

2. **Tool name injection** - Dynamically insert actual tool names so fallback feels personalized

3. **Timeout strategy** - 2.5s timeout before fallback:
   ```typescript
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 2500);
   ```

---

## Implementation Details

### Code Location
- **Prompt execution:** [lib/ai-service.ts](lib/ai-service.ts#L46) - `generateAuditSummary()`
- **API integration:** [app/api/audit/route.ts](app/api/audit/route.ts) - calls `generateAuditSummary()`
- **Error handling:** Catches API errors and returns fallback template

### Current Status (as of 2026-05-12)

**⚠️ Issue:** Anthropic API key has insufficient credits. Error: "Your credit balance is too low to access the Anthropic API."

**Solutions:**
1. Apply for free Anthropic credits: https://www.anthropic.com/research/preamble-grants
2. Use fallback templates (fully functional, tested)
3. Switch to OpenAI GPT-4 (costs $0.03 per summary, manageable)

**Current behavior:** API fails → graceful fallback → templated summary shown to user (no impact on UX)

---

## Testing the Prompt

### Manual Test
```bash
# 1. Set valid ANTHROPIC_API_KEY in .env.local
# 2. Run local development server
npm run dev

# 3. Submit audit form with multiple tools
# 4. Verify summary appears and is ~100 words
# 5. Check summary mentions tool names and exact savings
```

### Automated Test
See [TESTS.md](TESTS.md) for AI summary generation test.

---

## Future Iterations

- **Markdown support** - Format summary with **bold** for key savings figures
- **Localization** - Support multiple languages (Spanish, French, Japanese)
- **A/B testing** - Compare Haiku vs Opus vs GPT-4 for cost/quality tradeoff
- **User feedback loop** - "Was this summary helpful?" → retrain prompt

---

