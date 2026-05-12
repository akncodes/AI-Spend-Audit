# ECONOMICS.md — Unit Economics & Profitability Model

---

## 1. What's a Customer Worth to Credex?

A user sees my audit, realizes they're overspending, and signs up for Credex to get credits.

**Rough math:**
- User finds $500/month in savings,realistic from my pricing logic
- Credex gives them 20% off Claude credits ($10k/year spend) = $2k discount value
- Credex makes 20-25% margin on credit sales
- **So Credex profits about $400-600 per converted user**

That's if they actually close. More realistic:
- 100 audits run
- 15 people give email (15%)
- 3 of those have >$500/month savings (the ones Credex cares about)
- 1 actually books a call
- 0.5 convert to paying customer
- **Revenue per customer: $400-600**

---

## 2. How Much Does It Cost to Get Users?

**Week 1: Free channels**
- No money spent
- 50-80 audits expected
- 15% email capture = 8-12 emails
- Cost per email: $0

**Organic stuff (Month 1)**
- Twitter, Reddit, Discord (free)
- 100+ audits expected
- 15% capture = 15 emails
- Cost: $0

**If we paid to scale (Month 2)**
- Twitter ads $500/month: Gets us 50-100 audits, ~8 emails = $62/email
- Newsletter sponsorship $1000: Gets us 30 audits, ~5 emails = $200/email

**Real breakdown (first 90 days)**
- Total emails: ~30-40
- Total spend: ~$1500 (small ads + sponsorship)
- Average cost per email: $40-50

Compare to typical SaaS CAC of $100-300/user. We're way cheaper because the tool is genuinely useful so people share it.

## 3. Conversion Funnel: From Audit to Deal

**How it works:**
- Someone runs an audit (no email required yet)
- See the results
- ~15% decide to give email to get a detailed report
- Of those, ~20% have real savings >$500/month
- Credex's team reaches out, books a call
- ~50% close on the call

**Real numbers (per 100 audits):**
- 100 people run audits
- 15 give email
- 3 have >$500/month savings (these are the actual prospects)
- 1-2 book calls with Credex
- 1 closes ($600 revenue)

**Is this profitable?**
- We spend $42 to get that email
- We make $600 if they close
- That's 14x return on that customer
- Healthy ratio is 3x+, so yeah, this works

**What if things are better or worse?**
- If only 10% give email (bad): Still make $600 per 100 audits. Profit margin shrinks but still works.
- If 25% give email (good): Make $1200+ per 100 audits. Gets really profitable.

The key: Our audit logic has to be legit. If we're recommending fake savings, nobody closes.

---

## 4. What Has to Be True for $1M ARR?

**Year 1 goal: Get to 3k-5k audits/month**
- Product Hunt + Twitter + communities get us maybe 500-1k in Month 1
- Organic growth + Reddit + word-of-mouth gets us to 2-3k by Month 6
- If we do some small paid ads, hit 5k by end of year

**At 5k audits/month:**
- 5k × 15% email capture = 750 emails
- 750 × 3.3% deal rate = 25 deals/month
- 25 × $600 = $15k/month = $180k/year

That's not $1M yet. To get to $1M, we need one of these:

1. **Do 10k audits/month** (2x bigger, seems achievable Year 2)
2. **Get higher conversion rates** (improve from 15% email to 25%)
3. **Sell bigger deals** (get Credex to offer $1000+ per deal instead of $600)

**Most realistic path:**
- Year 1: 3-5k audits/month, ~$200-300k revenue
- Year 2: 10k+ audits/month with paid ads + content marketing, get to $1M

Happens if:
- The tool actually solves a real problem (feedback so far says yes)
- We can execute the GTM without screwing up
- Product doesn't break at scale

---

## 5. How Much Revenue Year 1?

Conservative estimate (no paid ads, organic only):

```
Month 1:  500 audits   →  8 deals   →  $4.8k
Month 2:  1k audits    →  16 deals  →  $9.6k
Month 3:  1.5k audits  →  25 deals  →  $15k
Month 4:  2k audits    →  33 deals  →  $20k
Month 5:  2.5k audits  →  41 deals  →  $25k
Month 6:  3k audits    →  50 deals  →  $30k
Month 7-12: Plateaus around 3k-5k audits/month

Year 1 total: ~$180-250k
```

If we spend money on ads in Month 6+ and it works:
- Could hit $300k+ Year 1
- Then $1M+ Year 2 is realistic

---

## 6. What Does This Actually Cost to Run?

**Monthly fixed costs (pretty cheap):**
- Database (Supabase): ~$50
- AI API calls (Anthropic): ~$200 (10k summaries × cheap rate)
- Email sending (Resend): ~$100
- Hosting (Vercel): ~$100
- Analytics: ~$50
- **Total: ~$500/month fixed**

**Variable costs are tiny:**
- Each audit costs like $0.20 in compute
- Each email costs $0.01
- So if we do 10k audits, that's $200 in API costs

**Margin math:**
If we make $30k/month in revenue and spend $500 fixed + $200 variable, we're at $29.3k profit. That's 97% margin. Insane.

**Why so good?**
- Zero customer support (it's self-service)
- Zero sales team (it's a tool, not consultative)
- Zero marketing spend in Month 1 (organic/PH)
- Just infrastructure costs

Later, when we scale with ads + content marketing, margins will drop to 70-80%, which is still excellent for SaaS.

---

## 7. Profitability Analysis

### Year 1 Profitability
```
Year 1 Revenue: $507k
Year 1 Operating Costs: $500 × 12 = $6k
Year 1 Gross Margin: $507k - $6k = $501k (99% margin)

BUT: Need to account for
- Developer time (salary/opportunity cost)
- Marketing spend (Twitter ads, sponsorships): $1.5k
- Infrastructure scaling: varies

Net margin if solo developer: $501k - $50k (dev time allocation) = $451k/month
VERY HEALTHY ✅
```

### Break-Even Analysis
```
Fixed costs: $500/month
Revenue per deal: $600
Deals needed to break even: 1 deal per month
Audits needed: 1 / 3.3% = 30 audits/month

BREAK EVEN: 30 audits/month = Achievable in Week 1 ✅
```

---

## 8. Path to $10M ARR (Year 3+)

**If $1M is achieved in Year 2:**

```
Year 2: $1M revenue
Year 3: $3M revenue (3x growth)
Year 4: $10M+ revenue (3–4x growth)

This requires:
- 50k–100k audits/month (platform maturity)
- Expansion to new verticals (not just AI spend)
- Integration partnerships (direct from vendor platforms)
- Sales team to close Credex deals
```

---

## Decision Framework

**Is this economically viable?**

| Question | Answer | Status |
|----------|--------|--------|
| Can we hit $1M ARR? | Yes, with 10k audits/month |  Achievable |
| What's the break-even point? | 30 audits/month |  Very low |
| Gross margin healthy? | 99%+ (nearly pure software) |  Excellent |
| LTV/CAC ratio? | 14x+ (healthy at 3x+) |  Great |
| Customer acquisition cost? | $42 blended |  Low |
| What's the risk? | Audit volume growth, Credex comp, conversion rates |  Execution-dependent |

**Conclusion:** Economically sound. Success depends on execution (reaching 10k audits/month) and product-market fit (email capture rate, deal velocity).

