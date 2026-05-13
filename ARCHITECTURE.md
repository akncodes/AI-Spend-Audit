---
title: AI Spend Audit - Architecture & System Design
version: 1.0
date_created: 2026-05-07
last_updated: 2026-05-07
owner: Development Team
tags: [architecture, design, infrastructure, system-design]
---

# AI Spend Audit - Architecture & System Design

## 1. System Architecture Diagram

```mermaid
graph TB
    subgraph Client["Client Layer (Browser)"]
        LandingPage["Landing Page\n(Form)")
        ResultsPage["Results Page\n(Audit Display)"]
        SharePage["Share Page\n(Public Audit)"]
        LocalStorage["LocalStorage\n(Form State)"]
    end

    subgraph NextJS["Next.js Application"]
        FormHandler["Form Handler\n(Client-side validation)"]
        AuditAPI["POST /api/audit\n(Audit Calculation)"]
        ShareAPI["GET /api/audit/:slug\n(Retrieve Public)"]
        LeadsAPI["POST /api/leads\n(Lead Capture)"]
        ToolsAPI["GET /api/tools\n(Tool Configs)"]
    end

    subgraph Services["Service Layer"]
        AuditEngine["Audit Engine\n(Logic & Math)"]
        AIService["AI Summary Service\n(Anthropic API)"]
        EmailService["Email Service\n(Resend/SES)"]
        SlugGen["Slug Generator\n(nanoid)"]
    end

    subgraph Data["Data Layer"]
        Database["Supabase PostgreSQL\n(Audits, Leads, Tools)"]
        Cache["In-Memory Cache\n(Tool Configs)"]
    end

    subgraph External["External APIs"]
        AnthropicAPI["Anthropic API\n(LLM Summaries)"]
        EmailProvider["Email Provider\n(Resend/SES)"]
    end

    LandingPage -->|"1. User inputs"| FormHandler
    FormHandler -->|"2. Persist state"| LocalStorage
    LandingPage -->|"3. Submit form"| AuditAPI
    AuditAPI -->|"4. Validate input"| AuditEngine
    AuditEngine -->|"5. Calculate recommendations"| AuditEngine
    AuditAPI -->|"6. Generate slug"| SlugGen
    AuditAPI -->|"7. Call AI"| AIService
    AIService -->|"8. Generate summary"| AnthropicAPI
    AIService -->|"9. Fallback template"| AIService
    AuditAPI -->|"10. Store audit"| Database
    AuditAPI -->|"11. Return results"| ResultsPage
    ResultsPage -->|"12. Display audit"| ResultsPage
    ResultsPage -->|"13. Share link"| SharePage
    SharePage -->|"14. Get public data"| ShareAPI
    ShareAPI -->|"15. Query database"| Database
    ResultsPage -->|"16. Capture email"| LeadsAPI
    LeadsAPI -->|"17. Validate & store"| Database
    LeadsAPI -->|"18. Send confirmation"| EmailService
    EmailService -->|"19. Deliver email"| EmailProvider
    LandingPage -->|"20. Load tools"| ToolsAPI
    ToolsAPI -->|"21. Check cache"| Cache
    Cache -->|"22. Cache miss"| Database

    style Client fill:#e1f5ff
    style NextJS fill:#fff3e0
    style Services fill:#f3e5f5
    style Data fill:#e8f5e9
    style External fill:#fce4ec
```

---

## 2. Data Flow: User Input → Audit Result

### Step-by-Step Flow
```
User Input → auditAllTools() → For each tool: auditTool()
                                    ↓
                    [Apply Rules in Priority Order]
                                    ↓
                    1. Check tool-specific rules (Cursor Pro for teams)
                    2. Check plan-specific rules (Claude Team vs Pro)
                    3. Check alternatives (ChatGPT → Cursor for coding)
                    4. Default: Mark as "optimal"
                                    ↓
                    Return recommendation + calculated spend
                                    ↓
              Aggregate all recommendations → Total savings
```
```
1. USER INTERACTION
   ├─ User lands on homepage
   ├─ Click on start free Audit

2. FORM INTERACTION
   ├─ A form is displayed Fill this form to get started with your free AI Spend Audit.
   ├─ Client loads tool configurations from GET /api/tools
   ├─ Client renders form with tools (from cache if available)
   └─ Form state managed by React Hook Form + localStorage

3. FORM SUBMISSION
   ├─ Client validates inputs with Zod schema
   ├─ If invalid: Show error toast, stop
   ├─ If valid: POST to /api/audit with form data

4. AUDIT ENGINE PROCESSING (Server-side)
   ├─ Receive form data {tools, teamSize, useCase}
   ├─ For each tool:
   │  ├─ Get tool config from cache
   │  ├─ Validate user's plan is real
   │  ├─ Check if plan matches team size
   │  ├─ Recommend downgrade if applicable
   │  ├─ Suggest alternatives if cheaper
   │  └─ Calculate per-tool savings
   ├─ Aggregate total monthly/annual savings
   └─ Return to client

5. AI SUMMARY GENERATION
   ├─ Call Anthropic API with audit context
   ├─ If success: Return summary (~100 words)
   ├─ If timeout or error: Use fallback template
   └─ Include specific tool names and amounts

6. STORAGE
   ├─ Store audit record in Supabase
   ├─ Generate unique slug (8-12 chars)
   ├─ Create public URL: share
   └─ Return auditId to client

7. CLIENT DISPLAY
   ├─ Render results page with:
   │  ├─ Hero: Total savings (monthly/annual)
   │  ├─ Per-tool breakdown
   │  ├─ AI-generated summary
   │  ├─ Credex CTA (if savings > $500/mo)
   │  ├─ Lead capture form
   │  └─ Share buttons
  

8. SHARING
   ├─ User clicks "Share Report"
   ├─ Generate public slug URL
   ├─ User copies/shares link
   ├─ Public user visits share

9. LEAD CAPTURE
   ├─ User enters email + optional fields
   ├─ Validate email format
   ├─ Send transactional confirmation email
   └─ Show success message
```

---

## 3. Technology Stack Justification

### Why Next.js?

Honestly? I've deployed on Vercel before and it's frictionless. With a 7-day deadline, I didn't want to deal with containerization or manual DevOps. Next.js gives me:

- **Full-stack in one repo** — API routes + frontend, no separate backend service
- **Vercel deploys instantly** — Zero config. Push → live. That mattered.
- **Fast cold starts** — Edge functions are quick enough



### Why TypeScript?

Not optional. I used TypeScript because it helped reduce runtime errors and made the code easier to maintain as the project grew.

### Why Supabase?
I used the supabase because its is very easy to set up and free tier is also very generous. Free setup also provides Enough data to store audits. 
Supabase also provide authentication, storage, and database in one place which is very convenient.
Supabase give Postgres (real sql, not nosql) as a database with free tier. 
Supabase pricing is also sane — $25/mo once we're serious, not per-query billing that surprises you.

### Why Anthropic API?

Credex has a partnership with Anthropic (obvious advantage). Claude's summaries are also genuinely good — Claude understands context in a way that feels more natural than GPT-4 for this use case. 
Although i also tried the openrouter api for this project, but it was not giving the expected results. Summmary is not correct and it's very slow.


### Why Tailwind + shadcn/ui?

I used the Tailwind CSs because its very easy to use and provides a lot of features. It very easy to understand.
In tailwind we not need to create a separate file for the style.. it will very fast for making a project
I was also studied and learn the tailwind from my previous project that project was very time taking for styling.

---

## 4. Scaling: From MVP to 10k Audits/Day

### Current Architecture Bottlenecks

**At MVP (100 audits/day)**:
- Deployed as a single Vercel hosted Next.js application
- Used in-memory caching for storing tool configuration and pricing data
- Direct database communication using Supabase connections
- Server-side API routes handled audit calculations and report generation
- Public shareable audit pages generated using dynamic slug-based routing 

**At 10k audits/day**, 
1. **Anthropic API rate limits** 
2. **Supabase connection pool**
3. **Edge function cold starts**


### Scaling Strategy

```
Phase 1 (Current) — 100 audits/day
├─ Single Next.js on Vercel
├─ Direct Supabase connections
└─ Anthropic API calls

Phase 2 (1k audits/day) — Add queuing
├─ Bull queue for AI summaries 
├─ Batch API calls to Anthropic 
└─ Implement connection pooling 

Phase 3 (10k audits/day) — Async-first
├─ Move AI generation to background worker 
├─ Redis-backed rate limiter 
├─ CDN cache on /api/tools 
├─ Database: Primary (write) + Replica 
└─ Audit engine caching 
```





---

## 5. Component Hierarchy & Structure

```
ai-spend-audit/
├── app/                        # Next.js App Router: All pages and routes
│   ├── (audit)/                # Grouped routes for the audit flow
│   ├── api/                    # API endpoints (e.g., Anthropic, Nodemailer)
│   ├── scan/                   # The main scan/audit form page
│   ├── testimonials/           # The new Testimonials page we just added!
│   ├── globals.css             # Global Tailwind styles
│   ├── layout.tsx              # Main application layout & metadata
│   └── page.tsx                # The Landing Page
│
├── components/                 # Reusable React components
│   ├── common/                 # Shared components (headers, footers)
│   ├── forms/                  # Form inputs and handling
│   ├── results/                # Components for displaying audit results/savings
│   ├── share/                  # Components for sharing the report
│   └── ui/                     # Base UI components (Card, Avatar, Button, etc.)
│
├── lib/                        # Utility functions, business logic, and integrations
│   ├── audit-engine.ts         # Rule-based logic for calculating savings
│   ├── email-service.ts        # Nodemailer integration
│   └── ...
│
├── public/                     # Static assets
│   └── demo.mp4                # Your demo video
│
├── supabase/                   # Supabase configuration and migrations
│   └── migrations/
│
├── __tests__/                  # Unit and integration tests
├── scripts/                    # Helper scripts (e.g., database seeding)
│
├── .env.example                # Example environment variables
├── .env.local                  # Your actual local secrets (git ignored)
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
└── README.md                   # Project documentation


scripts/ 

styles/ 
```

### Key Structural Notes

- **`(audit)` route group** — The parentheses mean this folder does not create a URL segment. `/results/[slug]` and `/share/[slug]` are the actual URLs.
- **Server vs Client Components** — Pages are Server Components by default. `AuditResultsClient.tsx` is the only Client Component in the results flow (marked with `"use client"`).
- **`audit-service.ts` vs `api/audit/[slug]/route.ts`** — Both the API route and Server Components use the same `getAuditBySlug()` from `audit-service.ts`. The Server Component calls it directly (no HTTP). The API route wraps it in an HTTP response for external consumers.
- **`tools-config.ts`** — This is the single source of truth for pricing. All data was manually verified against `PRICING_DATA.md`. A future improvement is to auto-generate this file from `PRICING_DATA.md` at build time.
- **`components/common`, `components/results`, `components/share`** — These folders exist but are currently empty. Their intended components (e.g., `RecommendationCard`, `ShareButton`) are currently implemented inline inside the page files. Extracting them is a planned refactor.```

---

## 6. API Architecture

### Request/Response Pattern

```typescript
// Consistent error response
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string; // "INVALID_INPUT", "RATE_LIMITED", "INTERNAL_ERROR"
    message: string;
  };
};
```

### Rate Limiting Strategy

```
GET /api/tools — No limit (cached aggressively)
POST /api/audit — 10 req/min per IP (generous for users testing)
POST /api/leads — 5 req/hour per IP (spam prevention)
GET /api/audit/:slug — 100 req/min per IP (share links)
```

### Error Handling Pyramid

```
1. Input Validation (400 Bad Request)
   └─ Zod schema, email format, numeric ranges

2. Business Logic (409 Conflict)
   └─ Duplicate email, invalid tool combo

3. External APIs (503 Service Unavailable)
   └─ Anthropic timeout → fallback template
   └─ Email service fail → retry with exponential backoff

4. Database (500 Internal Error)
   └─ Connection pool exhausted
   └─ Query timeout
```

---

## 7. Performance Optimization Strategy

### Frontend

```
- Code splitting implemneted using Next.js page-based routing .
Form state managed on the client side to avoid unnecessary re-renders and improve responsiveness.
Tool and pricing data cached with hourly revalidation for better performance and reduced API calls.
CSS optimized using Tailwind CSS .
```

### Backend

```
Database indexing applied on queried fields such as slug and email for faster  lookups.
Optimized database queries by selecting only the required columns instead of fetching unnecessary data.
Tool configuration and pricing data cached in-memory with a TTL of 1 hour to reduce repeated reads.
API architecture designed to support pagination in the future if audit or lead data grows significantly.
Structured logging implemented with contextual metadata for easier debugging and monitoring.


```

### Deployment

```
I deploye it on the Vercel because it provides best features for deploying nextjs applications. Auto scaling and edge functions.
It also provides CDN to store static assets and HTTP cache to cache control headers on public URLs.
Easy to Cache-Control headers on public URLs.
```

---

## 8. Security Architecture

### Authentication & Authorization

```
Landing page, results, share — No auth required
Admin dashboard (future) — Credential-based 
API routes — Rate limiting + CORS 
```


### Abuse Prevention

```
I used the Rate Limiting mechanism with Token bucket algorithm to prevent the abuse of the system.
Honeypot form field helps in catching the bots.
Email validation by syntax and the domain checks.
CORS: Restrict to deployed domain only
```

---

---

## 9. Testing Architecture

### Unit Tests
```
lib/audit-engine.ts — Logic for each tool, calculation
lib/validators.ts — Input validation edge cases
```

### Integration Tests
```
api/audit/route.ts — Form → DB → Response
api/leads/route.ts — Email validation, storage
api/tools/route.ts — Caching behavior
```

### E2E Tests (Playwright)
```
Landing → Form submission → Results display
Results → Email capture → Confirmation
Results → Share link → Public page works
```



e

