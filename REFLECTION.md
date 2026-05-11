# REFLECTION.md — End-of-Week Reflection (5 Questions)




---

## Q1: The Hardest Bug You Hit This Week, and How You Debugged It



### Your answer:

- The hardest issue I faced  during this project was related to transactional email delivery. I initially planned to use Resend for sending audit confirmation emails after users submitted their reports  and the documentation was also simple to understand. The integration part was completed successfully and API calls were also working properly in local development. But once I tried to send the actual mail report from the application, it was unable to send the mail.

- At first I thought I made some error in my backend code or environment variables. I checked the API routes multiple times, regenerated the API key, checked deployment logs, and even tried changing the request format. I spent a lot of time debugging the issue because locally everything looked correct but emails were still not being delivered properly.

- After searching on the internet and reading documentation , I found that it needed a verified domain for proper email delivery. Since I was building the project quickly during the assignment timeline, I did not have a fully configured production domain setup for transactional emails.

- I also created a separate test API route to check whether the problem was coming from my application logic or the email provider configuration. That helped me understand that the issue was not in my frontend or backend code but mainly with the provider setup and verification requirements.

- Then I explored AWS SES and Postmark as alternatives, but similar issues were happening there too because they also required proper domain verification and setup steps. Finally, I decided to use Nodemailer because I had already used it in one of my previous projects and was more comfortable with its setup and debugging process. This issue taught me that many real-world problems are related to infrastructure and configuration instead of only coding mistakes.


---

## Q2: A Decision You Reversed Mid-Week, and What Made You Reverse It

### Your answer:
I reversed mid-week was related to the architecture of the audit engine. On 8 may , I was use AI for generating both the personalized summary and the actual audit recommendations. My idea was that the LLM  analyzes the user selected tools, pricing, team size, and use case, then generate saving recommendation Of Ai.

After implementing , I realized the response were inconsistent and sometimes not  accurate. In many cases, the AI suggested plans that were more expensive. But 10 may i realised i was doing a mistake . The assignment specifically mentioned that the audit logic should be defensible and finance-literate, I understood that relying fully on AI for calculations was not a good approach.

Because of this reasom, I reversed the decision and moved the  audit engine to hardcoded rule-based logic based. instead off I created fixed pricing mappings, comparison rules, and recommendation conditions based on team size, usage type, and monthly spend. Then I used AI only for generating the personalized summary paragraph on top of the already calculated audit results. It  makes  the system much more reliable, easier , and financially consistent. It also reduced unnecessary API calls and improved response speed.


---

## Q3: What You Would Build in Week 2 If You Had It


### Your answer:

---

## Q4: How You Used AI Tools (Cursor, Claude, ChatGPT)

### Answer
---


---


