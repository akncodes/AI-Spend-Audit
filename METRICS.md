# METRICS.md 


---

## North Star Metric: Total AI Spend Audited

**The one number that matters:** How much monthly AI spending has our users submitted to audits?

**Why?** Because it directly tells us:
- Are we reaching the right users? (they're spending on AI tools)
- How much money is at stake? (bigger spend = bigger savings opportunity for Credex)
- Is the product solving a real problem? (more audits = more users find value)
- How many Credex deals are possible? (direct correlation with revenue)

**Target:** $100k/month of audited spend by end of Year 1

**How we measure it:**
If User 1 audits $2k/month (Cursor $500 + Claude $300 + ChatGPT $1.2k), and User 2 audits $5k/month, our North Star that month is $7k.

Simple as that.

---

## 3 Input Metrics (What Drives the North Star)

### #1: Audit Volume (How many people use this?)

- **What we're tracking:** Number of audits run per month
- **Why it matters:** More audits = larger North Star, duh
- **Target:** 1k audits/month by Month 6. 10k by year end.
- **How we measure:** Database count of audits created
- **Dashboard:** Show daily, weekly, monthly trends

If audit volume isn't growing, either nobody knows about this or the product sucks. So this is a leading indicator of everything.

### #2: Email Capture Rate (What % actually want a follow-up?)

- **What we're tracking:** % of people who give email after seeing results
- **Why it matters:** Email = sales lead. Higher % = better conversion path to Credex deals
- **Target:** 15% baseline, 20% if we optimize messaging
- **How we measure:** (emails captured) / (audits run) × 100

If this is 5%, either the recommendations are garbage or we're not convincing people to share email. If it's 25%, we're doing great.

We'll see this number go up as we improve the UX and results clarity.

### #3: Savings Identified (Is our audit actually finding money?)

- **What we're tracking:** Average monthly savings recommended per audit
- **Why it matters:** Bigger savings = more likely to convert. Also shows if our logic is good.
- **Target:** $500/month average savings per audit
- **How we measure:** Sum all recommended savings / count of audits

If this is $100, either we're being too conservative or the market doesn't have optimization opportunities. If it's $2k, we're finding real value.
- Marketing proof point ("Average savings: $X/month")

**How calculated:**
```
Savings Identified = SUM(savings.monthly) for all audits

Example:
- Audit 1: $100 savings identified
- Audit 2: $500 savings identified
- Audit 3: $0 savings (optimal plan)

Total Savings Identified = $600 that month
```

**Tracked via:** Supabase
```sql
SELECT SUM(recommendations.savings.monthly) FROM audits;
```

**Target:**
- Average savings per audit: $100–$200
- Total savings identified: $100k/month (Year 1 end)

---

## Supporting Metrics

### Engagement Metrics
| Metric | Target | Tracked Via |
|--------|--------|-------------|
| Page load time | <2s | Vercel analytics |
| Form abandonment | <50% | GA events |
| Results page views | >90% | GA page views |
| Share link clicks | 10%+ of audits | Custom tracking |
| Return visitors | 5%+ | GA cohort analysis |

### Quality Metrics
| Metric | Target | Tracked Via |
|--------|--------|-------------|
| Audit completion time | <3 min | GA event timing |
| Form errors | <5% | Form validation logs |
| API error rate | <0.1% | Sentry / error tracking |
| AI summary quality | Qualitative feedback | Manual review + user feedback |

### Conversion Metrics
| Metric | Target | Tracked Via |
|--------|--------|-------------|
| Email capture rate | 15%+ | Supabase |
| High-savings rate (>$500/mo) | 10%+ | Supabase analysis |
| Consultation requests | 5%+ of high-savings | Email tracking |
| Credex conversion rate | 50%+ of qualified | Credex internal data |

---

## First Instrumentation Plan

### Week 1: Set Up Basic Tracking

**What to instrument:**
```javascript
// 1. Audit created event
analytics.track('Audit Created', {
  tool_count: 2,
  team_size: 5,
  use_case: 'coding',
  total_spend: 2000,
});

// 2. Email captured event
analytics.track('Email Captured', {
  email_submitted: true,
  savings_identified: 500,
  is_high_savings: true,
});

// 3. Share link created event
analytics.track('Share Link Created', {
  slug: 'abc123',
  audits_referenced: 2,
});

// 4. Share link visited event
analytics.track('Share Link Visited', {
  slug: 'abc123',
  is_returning_visitor: false,
});
```

**Tracking platforms:**
- Google Analytics 4 (free, built-in to Next.js)
- Supabase database (for precise audits/emails count)
- Optional: Mixpanel, Amplitude (if need cohort analysis)

### Week 2: Dashboard Setup

**Create simple dashboard showing:**
```
┌─────────────────────────────┐
│ REAL-TIME METRICS DASHBOARD │
├─────────────────────────────┤
│ Audits Run Today:    5      │
│ Audits Run This Mo:  128    │
│                             │
│ Email Capture Rate:  14.8%  │
│ Total Spend Audited: $256k  │
│ Total Savings Found: $48k   │
│                             │
│ Avg Savings/Audit:   $375   │
│ Avg Spend/Audit:     $2k    │
└─────────────────────────────┘
```

**Implementation:**
- Google Sheets + GA connector (free, simple)
- Vercel Analytics dashboard (built-in)
- Supabase SQL queries + simple viz

---

## Pivot Thresholds

### When Would We Pivot?

**Red Flag Thresholds:**
| Metric | Red Flag | Action |
|--------|----------|--------|
| Email capture rate | <5% after Week 2 | Revisit form/messaging |
| Audit completion | >5 min average | Simplify form |
| High-savings rate | <5% after 100 audits | Audit engine logic too conservative |
| Form error rate | >20% | Form UX issues |

**Example pivot decision:**
```
If email capture rate = 5% after Week 2:
→ Assumption was wrong: users don't want to share email
→ Pivot 1: Try email capture AFTER summary (currently before)
→ Pivot 2: Make email optional, emphasize shareable link instead
→ Pivot 3: Add different incentive (PDF download, calendar reminder)
```

**Green Flag: Keep Scaling**
```
If email capture rate = 15%+ AND
   High-savings rate = 10%+ AND
   Audits growing 20%+ week-over-week
→ Product-market fit likely
→ Scale: increase marketing spend
→ Focus: conversion optimization (Credex deals)
```

---

## Monthly Review Cadence

### Week 1 of Each Month: Metrics Review

**Questions to answer:**
1. Did we hit targets for each input metric?
2. What changed vs last month? (↑ or ↓)
3. Which channels are driving audits? (Product Hunt, Twitter, organic?)
4. Are email capture rates holding steady?
5. What's the earliest indicator of trouble?

**Action items:**
- [ ] Update dashboard
- [ ] Flag any declining metrics
- [ ] Celebrate wins
- [ ] Plan adjustments

### Monthly Goals
| Month | Audits | Emails | Avg Savings | North Star |
|-------|--------|--------|-------------|-----------|
| Month 1 | 500 | 75 | $300 | $150k |
| Month 2 | 1k | 150 | $350 | $350k |
| Month 3 | 2k | 300 | $400 | $800k |
| Month 4 | 3k | 450 | $400 | $1.2M |
| Month 5 | 4k | 600 | $450 | $1.8M |
| Month 6 | 5k | 750 | $500 | $2.5M |

---

## Tracking Implementation

### Step 1: Google Analytics Setup
```
In Next.js:
import { useEffect } from 'react';
import { pageview } from '@/lib/gtag';

export default function Page() {
  useEffect(() => {
    pageview('Audit Results');
  }, []);
  
  return ...
}
```

### Step 2: Custom Events
```typescript
// Track audit created
import gtag from 'gtag';

gtag.event('audit_created', {
  tool_count: tools.length,
  total_spend: totalSpend,
  team_size: teamSize,
});
```

### Step 3: Supabase Queries (Daily)
```sql
-- Daily audit count
SELECT COUNT(*) FROM audits WHERE DATE(created_at) = CURRENT_DATE;

-- Email capture rate
SELECT 
  COUNT(*) as total_audits,
  COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as emails_captured,
  ROUND(100 * COUNT(CASE WHEN email IS NOT NULL THEN 1 END) / COUNT(*), 2) as capture_rate
FROM audits 
WHERE created_at >= NOW() - INTERVAL '30 days';

-- North Star (total spend)
SELECT SUM(total_spend) as total_audited_spend FROM audits WHERE created_at >= NOW() - INTERVAL '30 days';
```

---

## Data Privacy & Retention

- All events tracked anonymously (no PII in GA)
- Supabase data retained for 12 months then archived
- Email addresses encrypted at rest
- No third-party data sharing (except Credex for qualified leads)

---

## Success Criteria (Month 1)

✅ **Must have:**
- [ ] Dashboard set up and showing real data
- [ ] Email capture rate ≥ 10%
- [ ] Audits > 0 (proof of concept)
- [ ] Average savings > $100 (audit logic working)

⚠️ **Nice to have:**
- [ ] Email capture rate ≥ 15%
- [ ] 100+ audits (early traction)
- [ ] Share link clicks (viral loop signal)

---

**Last Updated:** 2026-05-08  
**Status:** Ready to implement  
**Next Steps:**
1. Set up GA tracking code
2. Deploy Supabase queries
3. Create simple dashboard
4. Begin daily metric reviews
