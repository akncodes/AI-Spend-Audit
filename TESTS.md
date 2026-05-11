# TESTS.md — Automated Test Suite



## How to Run Tests

### Install Test Dependencies
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom happy-dom
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Specific Test File
```bash
npm test -- __tests__/audit-engine.test.ts
```

### Run with Coverage
```bash
npm test -- --coverage
```
## Result

```bash
✓ __tests__/audit-engine.test.ts (14)
✓ __tests__/form-validation.test.ts (5)

Test Files  2 passed (2)
      Tests  19 passed (19)
   Start at  17:14:21
   Duration  7.90s
```

---

## Test Files

### 1. `__tests__/audit-engine.test.ts`
**What it covers:** Core audit engine logic  
**Number of tests:** 12 test cases

| Test Name | What It Tests | Why It Matters |
|-----------|---------------|----------------|
| Plan Mismatch - Cursor | Detects when solo plan (Pro) used for teams | Catches overpayment for team plans |
| Plan Mismatch - Claude | Recommends Team plan over multiple Pro accounts | Major savings for multi-person teams |
| Optimal Plan Detection | Correctly identifies well-optimized plans (no action) | Avoids false positives |
| Cheaper Alternatives | Suggests Cursor for coding vs Claude Pro | Core value prop: surfacing cheaper options |
| Alternative Not Applicable | Doesn't recommend switch if it's more expensive | Avoids bad recommendations |
| Monthly Savings Calc | Calculates savings correctly | Financial accuracy critical |
| Annual Savings Calc | Annual = monthly × 12 | Foundation for ROI calculations |
| Total Savings Aggregation | Sums savings across multiple tools | Reporting accuracy |
| Zero Savings for Optimal | Handles optimal plans (0 savings) correctly | Edge case handling |
| Multiple Tools Audit | Processes 3+ tools in one audit | Real-world scenarios |
| Empty Tools Array | Handles zero tools gracefully | Edge case robustness |
| Unknown Tool Handling | Doesn't crash on unrecognized tools | Production safety |

---

### 2. `__tests__/form-validation.test.ts`
**What it covers:** Spend form validation (Zod schemas)  
**Number of tests:** 6 test cases

| Test Name | What It Tests | Why It Matters |
|-----------|---------------|----------------|
| Valid Form Submission | Accepts correct data | Happy path verification |
| Missing Required Fields | Rejects empty tools array | Data integrity |
| Negative Spend Rejection | Rejects negative monthly spend | Invalid data detection |
| Invalid Use Case | Rejects unknown use cases | Enum validation |
| Multiple Tools | Accepts 3+ tools in one audit | Real-world complexity |
| Invalid Team Size | Rejects zero or negative team size | Input validation |

---

## Test Coverage Goals

| Module | Target | Current |
|--------|--------|---------|
| audit-engine.ts | 80%+ | [In progress] |
| form-schemas.ts | 90%+ | [In progress] |
| api/audit/route.ts | 70%+ | [Future: API integration tests] |
| types.ts | 100% | [Type definitions, no logic] |

---

## Implementation Examples

### Test Structure
```typescript
import { describe, it, expect } from 'vitest';
import { auditAllTools } from '../lib/audit-engine';
import { SelectedTool } from '../lib/types';

describe('Audit Engine - Core Logic', () => {
  it('should detect plan mismatch', () => {
    const tools: SelectedTool[] = [
      { toolId: 'cursor', planId: 'pro', monthlySpend: 100, seats: 5 }
    ];

    const result = auditAllTools(tools, 5, 'coding');
    
    expect(result.recommendations[0].action).not.toBe('optimal');
    expect(result.recommendations[0].savings.monthly).toBeGreaterThan(0);
  });
});
```

### Running Tests in CI
Tests run automatically on every push via `.github/workflows/ci.yml`:
1. Lint (ESLint)
2. Tests (Vitest)
3. Build (Next.js)

All must pass for green status.

---

## Test Scenarios Covered

### Audit Engine Logic
✅ Plan mismatch detection (team size vs. individual plans)  
✅ Cheaper alternative suggestions (use case-based)  
✅ Savings calculations (monthly & annual)  
✅ Multiple tools in one audit  
✅ Edge cases (zero tools, unknown tools, invalid plans)  

### Form Validation
✅ Valid submissions accepted  
✅ Missing fields rejected  
✅ Invalid data types rejected  
✅ Enum validation (use case field)  
✅ Multiple tools in one form  

### Future Tests Needed
- [ ] API route integration tests (POST /api/audit)
- [ ] Lead capture tests (email validation, storage)
- [ ] AI service tests (fallback templates, timeout handling)
- [ ] Shareable URL generation tests (slug uniqueness)
- [ ] Email sending tests (Resend API mocking)

---








