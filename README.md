# AI Spend Audit

Tool for auditing your team's AI software spending and finding savings opportunities.

Built with Next.js, Supabase, and Anthropic API.

## What it does

- You enter which AI tools your team uses (Cursor, Claude, ChatGPT, etc.)
- It calculates if you're on the right plan for your team size
- Shows potential monthly/annual savings
- Generates a shareable report link

## Setup

```bash
npm install
cp .env.example .env.local
# fill in your Supabase and Anthropic keys
npm run dev
```

## Env vars needed

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Stack

- Next.js 15 (App Router)
- Supabase (Postgres + storage)
- Anthropic API (Claude Haiku for summaries)
- Resend (email delivery)
- Zod + React Hook Form

## Running tests

```bash
npm test
```
