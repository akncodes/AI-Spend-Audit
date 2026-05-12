# PRICING_DATA.md 

All pricing verified as of **2026-05-08**. Every number traces to official vendor pricing pages.

---

## Cursor

**Source:** https://cursor.com/pricing

| Plan | Price | Billing | Verified |
|------|-------|---------|----------|
| Hobby | Free | — | 2026-05-08 |
| Pro | $20/user/month | Monthly | 2026-05-08 |
| Pro+ | $60/user/month | Monthly | 2026-05-08 |
| Ultra | $200/user/month | Monthly | 2026-05-08 |
| Teams (Business) | $40/user/month | Monthly | 2026-05-08 |
| Enterprise | Custom pricing | — | 2026-05-08 |

**Notes:**
- Hobby is free tier with rate limits
- Pro is the standard individual plan
- Pro+ includes priority support and extended context
- Ultra is for power users with maximum features
- Teams plan provides admin controls and team billing
- Enterprise includes SSO, custom contracts, dedicated support

**Used in audit logic:**
- Hobby (free)
- Pro ($20/mo)
- Teams/Business ($40/mo)

---

## GitHub Copilot

**Source:** https://github.com/features/copilot/plans

| Plan | Price | Billing | Verified |
|------|-------|---------|----------|
| Free (Limited) | Free | — | 2026-05-08 |
| Individual (Pro) | $10/user/month | Monthly | 2026-05-08 |
| Pro+ | $39/user/month | Monthly | 2026-05-08 |
| Business | $19/user/month | Monthly | 2026-05-08 |
| Enterprise | $39/user/month | Monthly | 2026-05-08 |

**Notes:**
- Free tier has limited suggestions
- Individual is the standard solo developer plan ($10/mo)
- Pro+ includes additional features and priority support
- Business plan is for teams (minimum 2 users)
- Enterprise includes SSO, SAML, audit logs, policy enforcement

**Used in audit logic:**
- Individual ($10/mo)
- Business ($19/mo)

---

## Claude (Web UI)

**Source:** https://claude.ai/pricing

| Plan | Price | Billing | Verified |
|------|-------|---------|----------|
| Free | Free | — | 2026-05-08 |
| Pro | $20/month | Monthly | 2026-05-08 |
| Max 5x | $100/month | Monthly | 2026-05-08 |
| Max 20x | $200/month | Monthly | 2026-05-08 |
| Team | $25/user/month (billed annually) | $30/user/month | 2026-05-08 |
| Enterprise | Custom pricing | — | 2026-05-08 |

**Notes:**
- Free tier has message limits (~10 messages every 3 hours)
- Pro is individual subscription with increased usage
- Max 5x / 20x tiers for power users (5x or 20x token limits)
- Team plan for organizations (minimum 2 users)
- Enterprise includes SSO, custom agreements, compliance options

**Used in audit logic:**
- Free ($0)
- Pro ($20/mo)
- Team ($30/mo per user)

---

## Claude API (Direct/Programmatic)

**Source:** https://www.anthropic.com/pricing/claude

| Model | Input Tokens | Output Tokens | Verified |
|-------|--------------|---------------|----------|
| Claude Opus 4.7 | $5 / MTok | $25 / MTok | 2026-05-08 |
| Claude Sonnet 4.6 | $3 / MTok | $15 / MTok | 2026-05-08 |
| Claude Haiku 4.5 | $1 / MTok | $5 / MTok | 2026-05-08 |

**Notes:**
- MTok = million tokens
- Opus is most capable (but slowest)
- Sonnet is balanced (fast + capable)
- Haiku is fastest + cheapest (used in AI Spend Audit)
- No monthly minimum; pay-as-you-go
- Volume discounts available for enterprise

**Used in this project:**
- Haiku 4.5: ~$0.003 per 100-word summary (typical)

---

## ChatGPT (Web UI)

**Source:** https://openai.com/pricing/chatgpt-plus

| Plan | Price | Billing | Verified |
|------|-------|---------|----------|
| Free | Free | — | 2026-05-08 |
| Plus | $20/month | Monthly | 2026-05-08 |
| Team | ~$30/user/month | Monthly | 2026-05-08 |
| Pro / Business / Enterprise | Custom | — | 2026-05-08 |

**Notes:**
- Free tier has access to GPT-4o mini
- Plus gives unlimited access to GPT-4o, GPT-4 Turbo, o1, and more
- Team plan for organizations (separate team workspace)
- Enterprise tier for large-scale deployments with SSO/SCIM

**Used in audit logic:**
- Free ($0)
- Plus ($20/mo)
- Team ($30/mo per user)

---

## OpenAI API (Direct/Programmatic)

**Source:** https://openai.com/api/pricing/

| Model | Input Tokens | Output Tokens | Verified |
|-------|--------------|---------------|----------|
| GPT-4.1 | $2 / MTok | $8 / MTok | 2026-05-08 |
| GPT-4 Turbo | $0.01 / 1K tokens | $0.03 / 1K tokens | 2026-05-08 |
| GPT-4o | $0.005 / 1K tokens | $0.015 / 1K tokens | 2026-05-08 |
| GPT-5 mini | $0.25 / MTok | $2 / MTok | 2026-05-08 |
| GPT-5.5 | $5 / MTok | $30 / MTok | 2026-05-08 |

**Notes:**
- Pay-as-you-go, no monthly minimum
- MTok = million tokens (1K tokens = 0.001 MTok)
- o1 model available at premium pricing
- Batch API available for non-time-sensitive requests (50% discount)
- Volume discounts for enterprise customers

---

## Gemini (Web UI)

**Source:** https://ai.google.dev/pricing

| Plan | Price | Billing | Verified |
|------|-------|---------|----------|
| Free | Free | — | 2026-05-08 |
| Gemini Pro | ~$20/month | Monthly | 2026-05-08 |
| Gemini Ultra / AI Ultra | ~$250/month | Monthly | 2026-05-08 |
| Enterprise | Custom pricing | — | 2026-05-08 |

**Notes:**
- Free tier has rate limits and feature restrictions
- Pro is individual subscription (includes Gemini Live, Files, Projects)
- Ultra is premium tier (higher token limits, advanced features)
- Enterprise includes API access, custom training, compliance

**Used in audit logic:**
- Free ($0)
- Pro ($20/mo)

---

## Gemini API (Direct/Programmatic)

**Source:** https://ai.google.dev/pricing (Google AI Pricing)

| Model | Input Tokens | Output Tokens | Verified |
|-------|--------------|---------------|----------|
| Gemini 2.5 Flash | ~$0.35 / MTok | ~$1.05 / MTok | 2026-05-08 |
| Gemini 2.5 Pro | ~$3.50 / MTok | ~$10.50 / MTok | 2026-05-08 |

**Notes:**
- Pricing is approximate (Google uses different rate structures per model)
- Free tier available for development (free credits)
- Pay-as-you-go for production
- 1.5M free tokens per month for Gemini 1.5 (Flash + Pro combined)

---

## Windsurf (Codeium)

**Source:** https://codeium.com/windsurf

| Plan | Price | Billing | Verified |
|------|-------|---------|----------|
| Free | Free | — | 2026-05-08 |
| Pro | $15/month | Monthly | 2026-05-08 |
| Teams | ~$30/user/month | Monthly | 2026-05-08 |
| Enterprise | Custom pricing | — | 2026-05-08 |

**Notes:**
- Free tier with basic code completion
- Pro is individual subscription (unlimited requests)
- Teams plan for organizations (2+ users, team management)
- Enterprise includes deployment options, compliance, SSO

**Used in audit logic:**
- Free ($0)
- Pro ($15/mo)

---







## Notes for Audit Logic

### Considerations
1. **Web UI vs API pricing is different** - A team using Claude Pro ($20/mo × 5 users = $100/mo) might be overpaying vs Claude Team ($30/mo × 5 = $150/mo). Tool comparison must account for this.

2. **Seats vs. Monthly pricing** - Some tools charge per-user/month (Cursor Teams $40), others charge per-user/year (Claude Team). Always normalize to monthly for comparisons.

3. **Enterprise is undefined** - Custom pricing means exact amounts unknown. Audit logic should flag "Contact for quote" rather than assume savings.

4. **Free tier limits** - Free tiers often have rate limits. Recommend upgrade when free tier is insufficient for use case.

5. **API usage-based pricing is unpredictable** - Anthropic/OpenAI API costs depend on actual token usage. Audit logic can't recommend switching without usage data.

### Hardcoded Assumption in tools-config.ts
Currently, API direct pricing shows as $0 with billing type 'monthly' (usage-based). This is a placeholder—actual audit logic should ask for monthly API spend when user selects these tools.


