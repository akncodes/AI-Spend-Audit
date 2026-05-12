
AI Spend Audit - Technical Specification
version: 1.0

# AI Spend Audit - Technical Specification

## Introduction

This specification defines the technical requirements, constraints, and interfaces for the AI Spend Audit application. It ensures clear, unambiguous guidance for development and AI-assisted code generation while maintaining consistency across the entire system.

---

## 1. Purpose & Scope

**Purpose**: Define the complete technical blueprint for building a web application that audits AI tool spending and provides optimization recommendations to startups and engineering teams.

**Scope**: It covers all six MVP features, data contracts, API specifications, UI component requirements, and integration patterns. 



**Assumptions**:
- Users have modern browsers with ES2020+ JavaScript support
- TypeScript 5.0+ will be used throughout
- Next.js 14+ is the framework
- Supabase is the backend database
- Anthropic API available for AI summaries

---

## 2. Definitions

| Term | Definition |
|------|-----------|
| **Audit** | Complete analysis of a user's AI tool spending with recommendations |
| **Lead** | User who has provided email and opted into follow-up |
| **Slug** | Unique URL-safe identifier for shareable audit reports (alphanumeric, 8-12 chars) |
| **API Route** | Next.js server-side endpoint (app/api/[route]/route.ts) |
| **Tool** | Supported AI service (Cursor, Claude, ChatGPT, etc.) |
| **Plan** | Specific pricing tier within a tool (e.g., Claude Pro) |
| **Vertical** | Industry classification (coding, writing, data, research, mixed) |
| **CAC** | Customer Acquisition Cost |
| **LTV** | Lifetime Value |
| **Conversion Rate** | % of audits → leads captured |
| **Fallback Template** | Pre-written summary for API failures |

---

## 3. Requirements, Constraints & Guidelines

### 3.1 Functional Requirements

**1: Spend Input Form**
- Support minimum 8 AI tools with multiple plans each
- Form fields: tool selection, plan, monthly spend, team size, use case
- Form state must persist to localStorage and survive page reload
- Real-time validation for numeric inputs (spend ≥ $0, team size 1-500)
- Submit button disabled until at least one tool is selected

**2: Audit Engine**
- Calculate per-tool savings recommendations
- Logic must be defensible
- Support plan downgrades and tool switches
- Output: tool-by-tool breakdown with specific reasoning
- All pricing data current as of submission date

**: Audit Results Page**
- Display hero metrics: total monthly/annual savings (large, prominent)
- Per-tool cards: current spend → recommendation → savings
- 1-sentence reason for each recommendation
- Conditional messaging:
  - If savings > $500/mo: Feature Credex prominently
  - If savings < $100/mo or optimal: Show "You're spending well"
- Responsive layout for mobile (320px+)

**4: AI-Generated Summary**
- Generate ~100-word personalized summary using Anthropic API
- Fallback to template if API fails or times out
- Summary must reference specific tools and amounts
- Must complete within 3 seconds (including API latency)

**5: Lead Capture & Storage**
- Email field (required), company name (optional), team size (optional)
- Validate email format
- Store in Supabase with timestamp
- Send transactional confirmation email
- Implement abuse prevention: rate limiting (max 5 submissions/hour per IP)

**6: Shareable Public URL**
- Generate unique slug for each audit
- Public URL format: `/share/[slug]`
- Slug must be URL-safe and non-sequential (use nanoid or uuid)
- Strip email and company name from public version
- Open Graph tags: og:title, og:description, og:image
- Twitter Card meta tags

### 3.2 Technical Constraints

**1: Performance**
- Lighthouse scores: Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90
- Page load time: ≤ 3 seconds (first contentful paint)
- API response time: ≤ 2 seconds
- Form submission: ≤ 3 seconds end-to-end

**2: Security**
- No secrets in git repo (use environment variables)
- Rate limiting on API endpoints (10 req/min per IP for public routes)
- Honeypot field on lead capture form
- Email validation before storage
- CORS headers configured for deployed domain only

**3: Accessibility**
- WCAG 2.1 AA compliance minimum
- Keyboard navigation fully functional
- Screen reader support for all interactive elements
- Color contrast ratio ≥ 4.5:1 for text
- Form error messages announced to screen readers

**4: Data & Deployment**
- No hardcoded secrets (use environment variables)
- Database: Supabase PostgreSQL only
- Frontend deployment: Vercel (or Netlify, Cloudflare Pages)
- All code in public GitHub repo
- CI/CD: GitHub Actions with lint + tests on every push

**CON-005: Browser Support**
- Modern browsers (Chrome, Firefox, Safari, Edge) latest 2 versions
- ES2020+ JavaScript features allowed
- CSS Grid and Flexbox required (IE11 not supported)

### 3.3 Guidelines & Patterns

**1: Component Structure**
- Use React functional components with hooks
- Avoid prop drilling (max 2 levels deep)
- Use Context API for cross-cutting concerns (theme, auth)
- Extract reusable components to `/components`

**2: State Management**
- Form state: React Hook Form library
- Server state: SWR or React Query
- Global state: Zustand or Context API
- Avoid Redux/MobX (overkill for this scope)

**3: Styling**
- Tailwind CSS for all styling
- shadcn/ui for component library
- No inline styles (except dynamic values)
- Consistent spacing scale: 0, 4, 8, 12, 16, 24, 32, 48px

**4: Error Handling**
- Use sonner toast notifications for user feedback
- Log errors to console in development, external service in production
- Implement exponential backoff for API retries (1s, 2s, 4s)
- Graceful degradation (app works even if AI API fails)



---

## 4. Interfaces & Data Contracts

### 4.1 API Endpoints

#### POST `/api/audit` — Create Audit
**Request**:
```json
{
  "tools": [
    {
      "toolId": "cursor",
      "planId": "pro",
      "monthlySpend": 20,
      "seats": 1
    },
    {
      "toolId": "claude",
      "planId": "pro",
      "monthlySpend": 20,
      "seats": 1
    }
  ],
  "teamSize": 5,
  "useCase": "coding"
}
```

**Response (200 OK)**:
```json
{
  "auditId": "uuid-string",
  "publicSlug": "abc12def45",
  "currentSpend": {
    "monthly": 40,
    "annual": 480
  },
  "recommendations": [
    {
      "toolId": "cursor",
      "action": "downgrade",
      "targetPlan": "hobby",
      "savings": {
        "monthly": 15,
        "annual": 180
      },
      "reason": "Team of 5 with shared Pro account wastes seats"
    }
  ],
  "totalSavings": {
    "monthly": 15,
    "annual": 180
  },
  "summary": "Based on your team size of 5 developers, you're overpaying..."
}
```

**Error Responses**:
- 400: Invalid tools or team size
- 429: Rate limited (too many requests)
- 500: Server error

#### GET `/api/audit/[slug]` — Retrieve Public Audit
**Response (200 OK)**:
```json
{
  "recommendations": [...],
  "totalSavings": {...},
  "summary": "..."
}
```

Note: Does NOT include email or company name.

#### POST `/api/leads` — Capture Lead
**Request**:
```json
{
  "auditId": "uuid-string",
  "email": "user@example.com",
  "companyName": "Acme Inc (optional)",
  "teamSize": "11-50 (optional)",
  "vertical": "coding (optional)"
}
```

**Response (200 OK)**:
```json
{
  "leadId": "uuid-string",
  "email": "user@example.com",
  "createdAt": "2026-05-07T10:30:00Z"
}
```

**Error Responses**:
- 400: Invalid email format
- 409: Email already captured for this audit
- 429: Rate limited

#### GET `/api/tools` — Get Tool Configurations
**Response (200 OK)**:
```json
[
  {
    "toolId": "cursor",
    "name": "Cursor",
    "plans": [
      { "planId": "hobby", "name": "Hobby", "price": 0, "billing": "free" },
      { "planId": "pro", "name": "Pro", "price": 20, "billing": "monthly" }
    ]
  }
]
```

### 4.2 Database Schema

**Table: audits**
```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_slug VARCHAR(12) UNIQUE NOT NULL,
  tools_selected JSONB NOT NULL, -- array of {toolId, planId, spend, seats}
  team_size INT NOT NULL CHECK (team_size >= 1 AND team_size <= 500),
  vertical VARCHAR(50) NOT NULL,
  current_spend_monthly DECIMAL(10, 2) NOT NULL,
  recommended_spend_monthly DECIMAL(10, 2) NOT NULL,
  total_savings_monthly DECIMAL(10, 2) NOT NULL,
  recommendations JSONB NOT NULL, -- full recommendation array
  ai_summary TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**Table: leads**
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  team_size VARCHAR(50),
  vertical VARCHAR(50),
  captured_at TIMESTAMP DEFAULT now(),
  email_sent BOOLEAN DEFAULT false,
  lead_status VARCHAR(50) DEFAULT 'new' -- new, contacted, converted
);

CREATE UNIQUE INDEX idx_audit_email ON leads(audit_id, email);
```

### 4.3 Component API

**ToolSelector Component**
```tsx
interface ToolSelectorProps {
  tools: ToolConfig[];
  selectedTools: SelectedTool[];
  onAddTool: (toolId: string) => void;
  onRemoveTool: (toolId: string) => void;
  onUpdateTool: (toolId: string, updates: Partial<SelectedTool>) => void;
}

interface SelectedTool {
  toolId: string;
  planId: string;
  monthlySpend: number;
  seats: number;
}
```

**AuditResults Component**
```tsx
interface AuditResultsProps {
  auditData: AuditResponse;
  isLoading?: boolean;
  onCaptureLead?: (email: string) => void;
}
```

---

## 5. Acceptance Criteria

**1: Spend Input Form Validation**
- **Given** user lands on homepage
- **When** they select 1+ tools and enter spend amounts
- **Then** form data persists to localStorage and survives page reload

**2: Audit Calculation**
- **Given** user submits form with 2 tools (Cursor Pro $20, Claude Pro $20)
- **When** system processes audit with team size 5
- **Then** recommendation identifies overspend and suggests downgrade with reasoning

**3: Results Page Display**
- **Given** audit is calculated
- **When** results page renders
- **Then** total monthly/annual savings displayed prominently, per-tool cards shown

**4: AI Summary Generation**
- **Given** audit results are ready
- **When** API is called to generate summary
- **Then** personalized summary displays within 3 seconds OR fallback template shown

**5: Lead Capture**
- **Given** user views results
- **When** they enter email and submit
- **Then** data stored in Supabase and confirmation email sent within 10 seconds

**6: Shareable URL**
- **Given** audit created
- **When** unique slug generated
- **Then** `/share/[slug]` page accessible, OG tags correct for social sharing

---



## 6. Dependencies & External Integrations

### External Systems
- **1**: Anthropic API — Generate personalized audit summaries, fallback required
- **2**: Supabase PostgreSQL — Primary data store for audits and leads
- **3**: Email Service (Resend/SES) — Transactional email delivery

### Third-Party Services
- **1**: Vercel — Hosting and CI/CD (99.95% SLA)
- **2**: Anthropic API — LLM summaries (rate limits apply)

### Infrastructure Dependencies
- **1**: Node.js 18+ runtime
- **2**: PostgreSQL 14+ database
- **2**: npm/yarn package manager

### Technology Platform Dependencies
- **1**: Next.js 14+ — React framework
- **2**: React 18+ — UI library
- **3**: TypeScript 5+ — Type safety
- **4**: Tailwind CSS 3+ — Styling framework
- **5**: shadcn/ui — Component library

---

## 7. Examples & Edge Cases

### Example: Cursor Pro with Team Overspend
```
Input:
- Cursor Pro: $20/month, 5 seats = $100/month total
- Team size: 5 developers

Recommendation:
- Issue: Pro plan limited to solo use; Team plan is $40/month for 2-5 people
- Savings: $100 - $40 = $60/month

Reason: "Cursor Pro is designed for solo developers. 
For your team of 5, the Team plan ($40/month) covers all users at lower cost."
```

### Example: API Failure Graceful Degradation
```
Scenario: Anthropic API returns 429 (rate limited)

Expected Behavior:
1. Error caught in try-catch
2. Fallback template used based on savings tier
3. User sees summary without AI generation
4. Page still functional, no errors shown
5. Error logged for monitoring
```

### Example: Email Already Captured
```
Scenario: User tries to capture same email twice for same audit

Expected Behavior:
1. Second submission returns 409 Conflict
2. Error message: "This email is already associated with this audit"
3. User can view their existing lead or try different email
```


