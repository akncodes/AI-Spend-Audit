# AI Spend Audit

Tool for auditing your team's AI software spending and finding savings opportunities. This Website helps the Ai use in saving the money. It compare the pricing of the subscription plan with our ai tool to check weather we are using the best plan or not.

Built with Next.js, Supabase, and Anthropic API.

## What it does

- You enter which AI tools your team uses (Cursor, Claude, ChatGPT, etc.)
- It calculates if you're on the right plan for your team size
- Shows potential monthly/annual savings
- Generates a shareable report link

## Demo Video

<video src="./public/demo.mp4" controls width="700" aspect-ratio="16:9"></video>

## Setup

```bash
npm install
cp .env.example .env.local
# fill in your Supabase and Anthropic keys
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
GMAIL_USER=
GMAIL_APP_PASSWORD=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Stack

- Next.js 15 (App Router)
- Supabase (Postgres + storage)
- Anthropic API (Claude Haiku for summaries)
- Nodemailer (email delivery)
- Zod + React Hook Form

## Running tests

```bash
npm test
```

## Decisions
- Used Next.js and Typescript for building the website because it is provide server side rendred website ,it is also a static website Seo friendly and faster.
- Used rule Based Audit Logic instead of AI because AI can hallucinate but initially i was used the complete AI based audit logic using Anthropic API for generating the Audit report but it started hallucinate the cost savings and plan ,so i have replaced it with rule based audit logic.
- Used Supabase for database and storage because it is provide easy to use database and storage. it is also easy for the scalling the webapplication.
- I used the nodemailer for sending the audit report to the user. Instead of the resend, postmark and the SES because they are paid services or need company email account and professional domain of the website but nodemailer is free to use.
- Used Vercel for deploying the website because it is provide easy to use deployment and hosting of the website. it is also easy for the scalling the webapplication.
- I also add page testimonials of all the three User interview. 