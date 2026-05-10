# DEVLOG.md — Daily Development Log (7 Days Required)

**Submission Deadline:** 2026-05-15 (7 days from 2026-05-08)  
**Format:** One entry per day, even if you took the day off

---

## Day 1 — 2026-05-08

**Hours worked:** 2  
**What I did:**
- Set up project structure (Next.js, TypeScript, Tailwind)
- Created core types and audit engine skeleton


**What I learned:**
- Next.js 16 has async params that need to be awaited (vs. Next.js 15)
- Badge component from shadcn/ui pattern works well with CVA for styling
- Form state persistence is easier with React Hook Form + localStorage

**Blockers / what I'm stuck on:**
- Anthropic API key has no credits (need to apply for free tier or use fallback)
- Supabase connection working but not fully tested

**Plan for tomorrow:**
- Implement remaining audit engine logic (plan detection, alternatives)
- Build results page and shareable URL feature
- Test API routes end-to-end

---

## Day 2 — 2026-05-09

**Hours worked:** 2.5  
**What I did:**
- Had a silly bug that would cause zero spend values to validate successfully. This was because — wasn't actually checking whether it validated properly.
- Was spending about 45 minutes trying to figure out why the form would keep reverting after refreshing the page. Apparently Next.js hydration occurs before localStorage loads.
-Made the website responsive.

**What I learned:**

- Combining localStorage and Next.js hydration causes problems. It doesn’t work well if you randomly stick it in somewhere without checking if you're running on the client side or not.
- I should have considered mobile-first design rather than going for desktop-first design. Shrinking designs is far more difficult than expanding them.

**Blockers / what I'm stuck on:**
- For sending result on the Email using the resend api  but it not working.

**Plan for tomorrow:**
- Improve the the UI result page and Home Page.
- Create a repo for the project and push it to github.


---

## Day 3 — 2026-05-10

**Hours worked:** 3  
**What I did:**


**What I learned:**
- Today, I realised doing something wrong so i readed the document thoroughly again found that i missed the research part which i started today. 
- Created a Repo for the project and push it to github.
-While exploring SES, Resend, and Postmark, I noticed that these email services are mainly built for startups and companies, so things like domain verification and production setup can feel a bit difficult for individual developers or personal projects.
- Adding Landing page.
- Create the Interview.md File and Done first interview with Vishwadeep Singh.
- Create the Devlog.md File and  Updated it.

**Blockers / what I'm stuck on:**
The Email Issue still not solved. Will work on it. 

**Plan for tomorrow:**
- Email report sending issue will solv e


