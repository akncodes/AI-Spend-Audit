# REFLECTION.md — End-of-Week Reflection (5 Questions)




---

## Q1: The Hardest Bug You Hit This Week, and How You Debugged It



### Your answer:

1. The hardest issue I faced  during this project was related to transactional email delivery. I initially planned to use Resend for sending audit confirmation emails after users submitted their reports  and the documentation was also simple to understand. The integration part was completed successfully and API calls were also working properly in local development. But once I tried to send the actual mail report from the application, it was unable to send the mail.

2. At first I thought I made some error in my backend code or environment variables. I checked the API routes multiple times, regenerated the API key, checked deployment logs, and even tried changing the request format. I spent a lot of time debugging the issue because locally everything looked correct but emails were still not being delivered properly.

3. After searching on the internet and reading documentation , I found that it needed a verified domain for proper email delivery. Since I was building the project quickly during the assignment timeline, I did not have a fully configured production domain setup for transactional emails.

4. I also created a separate test API route to check whether the problem was coming from my application logic or the email provider configuration. That helped me understand that the issue was not in my frontend or backend code but mainly with the provider setup and verification requirements.

5. Then I explored AWS SES and Postmark as alternatives, but similar issues were happening there too because they also required proper domain verification and setup steps. Finally, I decided to use Nodemailer because I had already used it in one of my previous projects and was more comfortable with its setup and debugging process. This issue taught me that many real-world problems are related to infrastructure and configuration instead of only coding mistakes.


---

## Q2: A Decision You Reversed Mid-Week, and What Made You Reverse It

### Your answer:
- I reversed mid-week was related to the architecture of the audit engine. On 8 may , I was use AI for generating both the personalized summary and the actual audit recommendations. My idea was that the LLM  analyzes the user selected tools, pricing, team size, and use case, then generate saving recommendation Of Ai.

- After implementing , I realized the response were inconsistent and sometimes not  accurate. In many cases, the AI suggested plans that were more expensive. But 10 may i realised i was doing a mistake . The assignment specifically mentioned that the audit logic should be defensible and finance-literate, I understood that relying fully on AI for calculations was not a good approach.

- Because of this reasom, I reversed the decision and moved the  audit engine to hardcoded rule-based logic based. instead off I created fixed pricing mappings, comparison rules, and recommendation conditions based on team size, usage type, and monthly spend. Then I used AI only for generating the personalized summary paragraph on top of the already calculated audit results. It  makes  the system much more reliable, easier , and financially consistent. It also reduced unnecessary API calls and improved response speed.


---

## Q3: What You Would Build in Week 2 If You Had It


### Your answer: 
In case if I had some additional time, then I would implement the following additions to the product:

1. Implementing the system of authentication, where each user should create an account prior to using this solution. Such action would be useful when tracking the audit history, organizing users and making the whole experience more personalized.

2. The feature allowing the download of the generated audit reports in various formats including PDF, image, spreadsheet, markdown.

3. Adding review and feedback functionality for the product where people can express their opinion on how helpful the product is for them and suggest improvements. The selected comments could also be displayed within the product itself.

4. Chatbot integrated into the website allowing people to ask more questions regarding their audit, suggestions for the prices, etc.

5. A fully functional admin panel containing information about all audit activity carried out by the users, storing their history and auditing data and providing analytics for such data, allowing finding out which tools users overspend on.

Improving the benchmarking feature in order to allow comparison of user's expenses with those of companies having similar number of employees and same usage patterns.


---

## Q4: How You Used AI Tools (Cursor, Claude, ChatGPT)

### Answer
---

1. I used the chatgpt for the research for problem statement, It helped me understanding the market of the AI. I used for the brainstroming this problem helped in understanding the problem statement and target audience. In the project management, I used it to create a project plan and roadmap. I used it to create a roadmap for the project. 

2. Used the Claude for the code of the project. It helped me in writing the code for the project. I used it to write the code for the project. It helped me in writing the code for the project. It helped me in writing the code for the project. 

3. Because i have no subscription for coding ai tool that why i used only claude for the coding part. Used the claude locally which help a lot in writing the code and debugging. 

4. For Designing the webPages I used the Lovable which help creating the frontend of the project. I liked it very much. 

5. I used the claude for writing test cases as well , i used claude to write the test cases for the project.

6. For Debugging the code i used the  claude localy and it helped a lot in debugging the code.
- Most of content of the project is writtten by  me either the chatgpt .      

---

## Q5: Self-Rating (1–10) on the basis of discipline, code quality, design sense, problem solving, entreprenuership thinking.

### Answer:
1. Discipline: 8/10, because i completed the project within the given time limit and tried to follow the project plan properly. Although intiallly on  8, 9 may i was doing research  work and designing work  but did not created the repo and pushed working status which is my mistake. 

2. Code quality: 7.5/10, I tried my best to write clean, maintainable, and well-structured code.

3. Design sense: 7/10, For this project i not focused much on the design part but if i get some i'll soon improve it.

4. Problem solving: 8/10,  I tried my best to identify and solve problems that I encountered during the project.

5. Entrepreunership thinking:6.5/10, Although i not having knowledge of the entrepreunership but i tried my best to think like an entrepreneur and create a product that solves a real-world problem.

Updated :- 12 may 2026