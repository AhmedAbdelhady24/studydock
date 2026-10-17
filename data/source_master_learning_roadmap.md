# Product Engineer — Updated Master Learning Roadmap & Resource Archive

**Version:** 2026-10-16 (v2, consolidated)
**Primary path:** 30-week Product Engineer / Full-Stack Engineer core
**Optional path:** 6-week AI / Forward Deployed Engineer specialization
**Planned workload:** 15–18 focused hours per week (16-hour baseline)
**Status:** Study plan, not a claim of course completion or demonstrated engineering ability

> **The single source of truth.** This revision supersedes the previous definitive 36-week syllabus and master archive whenever they conflict. It preserves the decision history and resources you reported owning/downloaded, while implementing the latest six roadmap improvement proposals and the updated course-completion expectations. This is a *learning plan*, not a verbatim chat export or a verification of files on your PC.
>
> **Career identity today:** Technical Project Manager with previous software engineering experience and active coding projects. **Future target:** Product Engineer, with AI/FDE optional. Don't present target-role skills as current expertise before you can demonstrate them.



## Navigation

- [Goals, baseline, operating rules](#1-goals-baseline-and-operating-rules)
- [What's changed in this edition](#2-accepted-changes-and-qualified-decisions)
- [How to measure course completion](#3-expected-course-completion-and-hours)
- [Learning resources: master inventory](#4-complete-course-and-book-inventory)
- [Weekly schedule and phase map](#5-weekly-schedule-and-phase-map)
- [Flagship product and architecture](#6-feedbackhub-portfolio-specification)
- [Detailed 36-week syllabus](#7-week-by-week-execution-plan)
- [Interview preparation and checkpoints](#8-interview-training-and-competency-gates)
- [Skip/defer decisions](#9-exact-skip-and-defer-list)
- [Learning workflow, templates and tracking](#10-study-workflow-and-tracking-templates)
- [Resource links and historical decision log](#11-resource-links-and-history)

---



## 1. Goals, baseline, and operating rules



### 1.1 Baseline and scope

Self-assessment: **JavaScript/TypeScript 1/3; React/frontend 0/3; Node/PostgreSQL 0/3; DSA 0/3; architecture/system design 0/3.** This is a subjective *current readiness* baseline and not evidence of zero prior experience. The plan capitalizes on previous Android, Angular, React, TypeScript and technical project delivery exposure without assuming independent proficiency.

**Primary skills:** TypeScript, HTML/CSS, Tailwind, React, Vite, Next.js App Router, Node/Express, PostgreSQL, Drizzle, secure auth, Vitest/React Testing Library, Playwright, Docker, CI/CD, analytics, user feedback, problem solving, system design, communication. Learn a *separate* Next.js full-stack slice rather than mashing frameworks together. NestJS is elective, AI is introduced only if baseline product is healthy.

**Proof standard:** Independently design/build/debug/test/deploy a full-stack app, explain trade-offs, conduct a real user research/release loop, solve common coding problems and pass representative practical/design mocks. A portfolio README is not evidence unless there is functioning code and a working demo.

**Scope explicitly excluded:** No ecommerce/Shopify/store-related flagship project, no invented business traction, no artificial AI-agent complexity, no mandatory cloud certificates, Kubernetes, microservices or second backend language.

### 1.2 Rules to avoid course collecting

1. **Learn → implement alone → test/debug → explain → commit → repeat.** Watching a video is not completion until the exercise works and can be explained independently.
2. **Move through competency gates, not dates.** A 30-week estimate can stretch; do not skip an unsatisfied gate.
3. **No AI-generated solutions** for exercises, algorithms, timed practical interviews or tests intended to measure your skill. AI explanations, post-attempt review and boilerplate assistance are allowed, with verification and clear ownership.
4. **Courses are inputs, shipped work is the output.** When weekly time is short, cut optional lessons before coding, tests, or DSA.
5. **One substantial portfolio application before a second project.** Avoid widening the feature list until the MVP has real feedback.
6. **Don't learn a framework to avoid learning its underlying runtime:** TypeScript before React, React before Next.js, Express/SQL before NestJS.

---



## 2. Accepted changes and qualified decisions


| Proposal                                            | Final decision             | Practical consequence                                                                                                                                                          |
| --------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Shorten early untyped JavaScript                    | **Accepted, with gate**    | Weeks 1–2 JS; strict TS from Week 3. Add a week if closure/async fundamentals still fail.                                                                                      |
| Use Epic React v2 as React spine                    | **Accepted, with support** | Weeks 8–10 Epic React Fundamentals/Hooks; Complete Intro v9 selective beginner fallback and ecosystem; no forced advanced content.                                             |
| Add Tailwind + Radix/shadcn                         | **Accepted**               | Raw CSS practice once, then Tailwind from Week 8; use accessible primitives in production. A scratch dialog is learning-only.                                                  |
| Separate Next.js vs standalone Express architecture | **Accepted**               | Default: Vite+Express remains FeedbackHub; Weeks 20–21 build a smaller isolated Next.js full-stack slice with its own DAL/storage. Optional deliberate migration path instead. |
| Move NestJS/books; use AI coding agents             | **Partially accepted**     | DDIA paired with PostgreSQL Week 18, NestJS elective Week 27, no blanket 19-week AI ban; independent assessment mode always.                                                   |
| Pull one small AI feature into core                 | **Accepted conditionally** | Weeks 25–26 AI SDK v6/structured suggestion only if MVP launched/stable; otherwise AI SDK basics shift to Week 33.                                                             |


**Technical detail:** For AI SDK v6, prefer version-current structured output with `generateText`/`streamText` and `Output.object()` (verify the exact currently installed SDK API); do not blindly copy older `generateObject`/`streamObject` samples.

---



## 3. Expected course completion and hours

**These percentages are target ranges for syllabus exposure/exercises, not actual progress indicators and not independently verified counts of a course's videos/exercises.** Full completion requires independently working through the required labs and genuinely finishing the course modules; do not equate watched minutes with competence. The selected React course switch supersedes earlier percentage assumptions when they conflict.

### 3.1 Core courses, Week 30 targets


| Course                                       | Week(s)                 | Target material covered | Intent                                             |
| -------------------------------------------- | ----------------------- | ----------------------- | -------------------------------------------------- |
| JavaScript: The Hard Parts v3                | 1–2                     | 80–100%                 | Potential full completion if exercises pass        |
| Total TypeScript Pro Essentials              | 3–5                     | 40–65%                  | Practical core; defer advanced exercises           |
| CSS for JavaScript Developers                | 6–10                    | 50–70%                  | Layout, responsive, Grid, key browser mechanics    |
| Epic React v2                                | 8–12                    | 30–45%                  | Fundamentals/Hooks + selected advanced exercises   |
| Complete Intro to React v9                   | 8–12                    | 15–30%                  | Intro fallback; TanStack Query/Router, Vitest only |
| Testing Fundamentals                         | 11–12                   | 80–100%                 | Recommended complete-course target                 |
| Introduction to Node.js v3                   | 13–14                   | 100%                    | Recommended complete-course target                 |
| API Design in Node.js v5                     | 14–19                   | 80–100%                 | Near/full completion, aligned with project         |
| Complete Intro to SQL & PostgreSQL           | 17–19                   | 80–100%                 | Near/full completion                               |
| The Last Algorithms Course You'll Need       | 1–19 in parallel        | 80–100%                 | Core concepts, alongside actual DSA drills         |
| Next.js Fundamentals v4                      | 20–21                   | 70–100%                 | Full-stack slice, current docs supplementation     |
| Playwright: Automated Testing & AI Workflows | 22–23                   | 60–80%                  | Core browser E2E exercises                         |
| Web Security v2                              | 16, 22–23               | 50–75%                  | Priority web vulnerability/defense topics          |
| Tom Ray: Master NestJS                       | 27 elective             | 0–30%                   | Only one small selected module if time             |
| Ultimate Design Patterns                     | 27–30                   | 20–40%                  | Selected real-world patterns                       |
| AI SDK v6 Crash Course                       | 25–26 **only if ready** | 0–100%                  | Optional core extension; otherwise move to Week 33 |


**Core full-course priorities (where feasible):** JavaScript Hard Parts; Last Algorithms Course; Introduction to Node.js v3; API Design Node.js v5; Complete Intro to SQL/PostgreSQL; Testing Fundamentals. The rest is deliberately selective, not unfinished obligations.

### 3.2 Optional AI/FDE course targets, Week 36


| Resource                                       | Target                            | Condition                                      |
| ---------------------------------------------- | --------------------------------- | ---------------------------------------------- |
| AIHero AI SDK v6 Crash Course                  | 80–100%                           | Finish Week 25–26 or Week 33                   |
| AIHero DeepSearch **OR** AI Personal Assistant | ~35–60% of the **chosen** pathway | Relevant capstone sections only; unchosen = 0% |
| AI Coding for Real Engineers                   | ~10–30%                           | Selected context/test/review workflow lessons  |
| Claude Code for Real Engineers                 | ~10–30%                           | Optional supporting reference                  |
| AI Coding Crash Course (overlap)               | 0%                                | Skip                                           |




### 3.3 Focused-hour budget (16h × 30 weeks = 480h)


| Activity                                        | Planning hours | Weekly average |
| ----------------------------------------------- | -------------- | -------------- |
| Courses, reading, guided labs                   | 120            | 4h             |
| Independent coding, portfolio, tests, debugging | 210            | 7h             |
| DSA and practical interview drills              | 100            | 3.3h           |
| System design, mocks, product discovery/review  | 50             | 1.7h           |
| **Total**                                       | **480**        | **16h**        |


Use the weekly stage allocation later in this file; this aggregate is a planning example, not a time log. At 15–18h weekly, the 30-week core is **450–540 hours**, and the optional 6 weeks add **90–108 hours**.

---



## 4. Complete course and book inventory

**Provenance:** All owned/downloaded statuses below come from your statements and screenshots, not a scan of your PC. **If any historical week placement in the catalog differs from the updated weekly syllabus, the new weekly syllabus and completion table above win.**

### 4.1 How to interpret status labels

- **Owned / supplied by you:** You explicitly listed these in your pre-existing PC course/book collection or showed them in your screenshots.
- **Recommended + reported downloaded:** Assistant recommended these and you said you subsequently downloaded the recommendations. Versions/contents are not independently audited.
- **Free online reference:** Use when relevant; downloading is not required.
- **Optional paid reference:** Discussed as a possible supplement; not required and not presumed purchased.
- **Core / selective / defer / skip:** These are *study decisions*, not judgments of course quality.



### 4.2 Existing courses: JavaScript, TypeScript, React and CSS


| Course                                                      | Provenance                | Action       | When/how to use it                                                        |
| ----------------------------------------------------------- | ------------------------- | ------------ | ------------------------------------------------------------------------- |
| JavaScript: The Hard Parts v3 (Frontend Masters)            | Owned                     | **Core**     | Weeks 1–2; execution context, closures, async                             |
| Frontend Masters: TypeScript 5+ Fundamentals                | Owned                     | Selective    | Alternative explanation if stuck in Pro Essentials                        |
| Frontend Masters: Intermediate TypeScript                   | Owned                     | Defer/lookup | Generics/inference and advanced types when needed                         |
| Total TypeScript: TypeScript Pro Essentials (2024-7)        | Owned/shown in screenshot | **Core**     | Weeks 3–5; exercises before passive lectures                              |
| Total TypeScript: Professional TypeScript Training (2023-8) | Shown in screenshot       | Skip         | Older overlapping material                                                |
| Complete Intro to React v9 (Frontend Masters)               | Owned                     | Selective    | Weeks 10–12; ecosystem and beginner fallback                              |
| Intermediate React v6 (Frontend Masters)                    | Owned                     | Defer        | Redundant for current 0/3 baseline                                        |
| Epic React v2 (React 19)                                    | Owned                     | **Core**     | Weeks 8–10; Fundamentals and Hooks workshops; selected advanced exercises |
| Next.js Fundamentals v4 (Frontend Masters)                  | Owned                     | **Core**     | Weeks 20–21                                                               |
| CSS for JavaScript Developers (2021, Josh Comeau)           | Owned                     | **Core**     | Weeks 6–10; layout, Grid, responsive UI                                   |
| Eloquent JavaScript                                         | Owned book                | Reference    | Basic JS explanation and exercises                                        |
| JavaScript: The Definitive Guide                            | Owned book                | Reference    | Language/API lookup                                                       |
| Learn React with TypeScript                                 | Owned book                | Reference    | UI/TS integration clarification                                           |
| HTML & CSS Essentials For Dummies                           | Owned book                | Reference    | Basic HTML/CSS gaps                                                       |




### 4.3 Existing courses: Node.js, backend and full stack


| Course                                                   | Provenance               | Action           | When/how to use it                                                     |
| -------------------------------------------------------- | ------------------------ | ---------------- | ---------------------------------------------------------------------- |
| NestJS Fundamentals 2025                                 | Owned                    | Defer            | Use for targeted explanation only                                      |
| Tom Ray: Master NestJS by Building Real-World Projects   | Owned                    | **Elective**     | Week 27 as elective only; focus on Project 1 DI/modules/guards/testing |
| CodeWithMosh: Spring Boot Mastering REST API Development | Owned                    | Skip now         | Java backend alternative outside target stack                          |
| CodeWithMosh: Spring Boot Mastering the Fundamentals     | Owned (.rar noted)       | Skip now         | Not needed alongside Node ecosystem                                    |
| NeetCode.io Full Stack Development                       | Owned                    | Skip as course   | Duplicates primary React/Node track                                    |
| Full Stack Open (University of Helsinki)                 | Free online, recommended | Selected modules | Parts 3, 4, 9, 11, 12, 13 as needed                                    |




### 4.4 Existing courses: algorithms, architecture and design


| Resource                                                                          | Provenance       | Action             | When/how to use it                                            |
| --------------------------------------------------------------------------------- | ---------------- | ------------------ | ------------------------------------------------------------- |
| NeetCode algorithms content                                                       | Owned/referenced | **Core practice**  | Continuous; learn patterns + problems                         |
| JavaScript Algorithms and Data Structures Masterclass                             | Owned (.zip)     | Reference          | Revisit tricky DSA concepts only                              |
| Master the Coding Interview: Data Structures + Algorithms                         | Owned            | Defer/skip         | Too much overlap with NeetCode                                |
| The Ultimate Design Patterns Part 1 (Memento through Visitor, per user's listing) | Owned            | **Selected**       | Weeks 24–27; Strategy, Factory, Observer, Adapter, State etc. |
| Software Essentialist                                                             | Owned (.zip)     | Optional           | Code quality reflection, not prerequisite                     |
| Grokking Algorithms                                                               | Owned book       | **Selected**       | Weeks 1–12, Big O and DSA patterns                            |
| Effective TypeScript                                                              | Owned book       | **Selected**       | Alongside TS and project code                                 |
| Head First Design Patterns                                                        | Owned book       | Reference          | Conceptual explanations in design phase                       |
| Refactoring                                                                       | Owned book       | **Selected**       | When improving actual project code                            |
| Clean Code                                                                        | Owned book       | Critical reference | Take pragmatic lessons, not dogma                             |
| Domain-Driven Design                                                              | Owned book       | Defer              | Apply only when domain complexity warrants it                 |
| Designing Data-Intensive Applications                                             | Owned book       | **Selected later** | Transactions, indexes, messaging and consistency              |
| 97 Things Every Programmer Should Know                                            | Owned book       | Optional           | Occasional short reading                                      |




### 4.5 Existing courses: AI coding, AI SDK and agent applications


| Course                                                               | Provenance                              | Action                            | When/how to use it                                        |
| -------------------------------------------------------------------- | --------------------------------------- | --------------------------------- | --------------------------------------------------------- |
| Claude Code for Real Engineers (11 lessons + code)                   | Owned                                   | Optional workflow reference       | Read after you can implement/review code independently    |
| AIHero: AI Coding Crash Course (2026-8)                              | Shown in screenshot (duplicate entries) | Skip as full course               | Agent usage overlaps other workflow material              |
| AIHero: AI Coding for Real Engineers (2026-6)                        | Shown in screenshot                     | Optional                          | Engineering review, context, test and approval discipline |
| AIHero: AI SDK v6 Crash Course (2026-2)                              | Shown in screenshot                     | **Core if AI branch chosen**      | Optional Weeks 25–26 (if stable), otherwise Week 33       |
| AIHero: Build DeepSearch in TypeScript (2025-7)                      | Shown in screenshot                     | Choose one capstone               | Weeks 34–36 option A                                      |
| AIHero: Build Your Own AI Personal Assistant in TypeScript (2025-12) | Shown in screenshot                     | Choose one capstone               | Weeks 34–36 option B                                      |
| AI Engineering — Chip Huyen                                          | Previously recommended book             | Optional, ownership not confirmed | AI product reliability, systems and evaluations           |
| DeepLearning.AI short courses                                        | Previously recommended online           | Optional                          | Targeted AI concepts, not mandatory                       |




### 4.6 Courses recommended subsequently (you reported downloading these)


| Course                                                      | Why it fills a gap                                       | Placement    | Status                        |
| ----------------------------------------------------------- | -------------------------------------------------------- | ------------ | ----------------------------- |
| Introduction to Node.js v3 — Scott Moss                     | Node runtime, modules, I/O, HTTP and async               | Weeks 13–14  | **Core, reported downloaded** |
| API Design in Node.js v5 — Scott Moss                       | TypeScript Express, validation, auth, database and tests | Weeks 14–19  | **Core, reported downloaded** |
| Complete Intro to SQL & PostgreSQL — Brian Holt             | SQL/querying/schema fundamentals before ORM              | Weeks 17–19  | **Core, reported downloaded** |
| The Last Algorithms Course You'll Need — ThePrimeagen       | Big O, data structures and TypeScript algorithms         | Start Week 1 | **Core, reported downloaded** |
| Testing Fundamentals — Steve Kinney                         | Practical unit/integration testing, mocking and design   | Weeks 11–12  | **Core, reported downloaded** |
| Playwright: Automated Testing & AI Workflows — Steve Kinney | E2E UI tests, browser automation and verification        | Week 22      | **Core, reported downloaded** |
| Web Security v2 — Steve Kinney                              | XSS, CSRF, injection, sessions and security mindset      | Week 22      | **Core, reported downloaded** |


**No need to buy more courses before you finish the first phase.** The additional suggestions were meant to resolve exact gaps, not increase your video workload indefinitely.

### 4.7 Additional owned books and historical material

You also mentioned several Angular-specific books, including **Become a Ninja with Angular**, **Learning Angular**, and **Angular Projects**. Preserve them in your library but do not put Angular retraining into the 30-week core unless a relevant job requires it.

You reported having **at least 15 programming books**, but only a subset of exact titles was supplied in the conversation. This inventory is complete **relative to the titles you disclosed**, not a claim about every file physically present on your PC.

### 4.8 Free online resources used in the curriculum


| Topic               | Resource                                                | When to use                                          |
| ------------------- | ------------------------------------------------------- | ---------------------------------------------------- |
| Computer science    | Harvard CS50x                                           | Selected algorithms, data structures, memory and SQL |
| Beginner JS         | javascript.info                                         | Early syntax and execution gaps                      |
| Browser, HTML/CSS   | MDN Web Development                                     | Throughout CSS/React phases                          |
| React               | react.dev/learn                                         | Canonical API and concepts                           |
| Next.js             | nextjs.org/learn                                        | Current App Router material                          |
| Full stack          | Full Stack Open                                         | Targeted Node, tests, DB, containers and CI          |
| SQL                 | SQLBolt and PostgreSQL documentation                    | SQL practice/reference                               |
| Testing             | Vitest, Testing Library, Playwright docs                | Testing phases                                       |
| Security            | OWASP Top 10 and PortSwigger Academy                    | Weeks 16 and 22, then ongoing                        |
| DevOps              | Docker and GitHub Actions docs                          | Week 23                                              |
| Product engineering | PostHog Product Engineer Handbook                       | Product ownership and outcomes                       |
| DSA                 | LeetCode 75, NeetCode, Grind 75                         | Continuous interview track                           |
| Interviewing        | Tech Interview Handbook / Frontend Interview Handbook   | Live coding and communication                        |
| Design patterns     | Refactoring.Guru TypeScript                             | Weeks 24–30                                          |
| System design       | System Design Primer                                    | Weeks 27–30                                          |
| AI APIs             | OpenAI API documentation and platform-specific SDK docs | Optional Weeks 33–36                                 |




### 4.9 Optional paid recommendations discussed but **not required**


| Resource                                     | Recommendation                                    | Purchase needed? |
| -------------------------------------------- | ------------------------------------------------- | ---------------- |
| ByteByteGo: Coding Interview Patterns        | Useful if free DSA explanations are insufficient  | No               |
| ByteByteGo: Object-Oriented Design Interview | Optional support for low-level-design mocks       | No               |
| ByteByteGo: System Design Interview          | Optional worked examples                          | No               |
| Reforge product strategy/experimentation     | Deprioritized given existing TPM/product exposure | No               |
| Other advanced React/TypeScript bundles      | Avoid duplicating courses already owned           | No               |


---

---



## 5. Weekly schedule and phase map


| Weeks | Phase                                    | Primary resource(s)                                        | Expected proof                                      |
| ----- | ---------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| 1–2   | Rapid JavaScript foundation              | Hard Parts v3 + javascript.info                            | Typed-ready utilities and async/client behavior     |
| 3–5   | TypeScript and web fundamentals          | Pro Essentials + Effective TS selections                   | Strict TS helpers and usable typed web forms        |
| 6–7   | CSS/HTML/UI fundamentals                 | CSS for JavaScript Developers + MDN                        | Responsive raw-CSS dashboard, Tailwind intro        |
| 8–12  | React and tests                          | Epic React v2 + selected React v9 + Testing Fundamentals   | Tested React SPA feedback flows                     |
| 13–19 | Node, Express, PostgreSQL                | Node.js v3, API Design v5, SQL course                      | Authenticated working full-stack CRUD with tests    |
| 20–23 | Next.js and production readiness         | Next.js v4, Playwright, Web Security, Docker/CI            | Separate full-stack Next slice; deployable main app |
| 24–26 | Product release and iteration            | PostHog; AI SDK v6 only if stable                          | Real MVP, user feedback, measured improvement       |
| 27–30 | Interview prep and elective architecture | NeetCode, design patterns, selected Tom Ray NestJS         | Timed practical/DSA/design mocks and applications   |
| 31–36 | **Optional** AI/FDE specialization       | AIHero SDK, selected capstone, integration/eval references | Secure customer workflow, retrieval, evaluations    |




### Default stage allocation


| Stage                | Guided resources | Build, debug, tests | DSA / practical | Product/design/mocks | Total |
| -------------------- | ---------------- | ------------------- | --------------- | -------------------- | ----- |
| Weeks 1–7            | 6h               | 7h                  | 2h              | 1h                   | 16h   |
| Weeks 8–19           | 4h               | 8h                  | 3h              | 1h                   | 16h   |
| Weeks 20–26          | 3h               | 8h                  | 3h              | 2h                   | 16h   |
| Weeks 27–30          | 2h               | 4h                  | 5h              | 5h                   | 16h   |
| Weeks 31–36 optional | 3h               | 8h                  | 2h              | 3h                   | 16h   |


DSA begins on Week 1 and runs the whole core. Interview mocks gradually become more important from Week 12. Begin exploratory applications after Week 19 **only if** your API, UI, tests and explanation demonstrate competence; otherwise keep building.

---



## 6. FeedbackHub portfolio specification



### Problem and MVP

FeedbackHub is a **customer-feedback collection and triage application** for a small team. It is *not* a giant PM suite. Choose actual candidate users, interview them if possible and make assumptions explicit. Do not fake uptake, interview counts or outcomes.

**MVP functionality:**

- [ ] Authorized users can submit feedback with title, description and category.
- [ ] Users can search/filter a list, and get loading/empty/error/permission states.
- [ ] Original authors can edit their allowed data; maintainers can change status.
- [ ] Server validates inputs and access. Every cross-tenant read/write is checked.
- [ ] PostgreSQL schema supports users, organizations/tenants, feedback, category and status history with migration tests.
- [ ] Unit, API integration and Playwright browser tests cover main flows and security boundaries.
- [ ] Docker/GitHub Actions support a clean checkout, automated tests and deployment.
- [ ] PostHog events instrument key actions without exposing unnecessary personal data.
- [ ] At least one shipped UX/product change is supported by real feedback or clearly labeled informed hypothesis.

**Engineering non-goals before MVP:** payments, advanced roadmaps, enterprise SSO, real-time collaboration, microservices, elaborate LLM agents.

### Architecture: make it deliberate

**Default Path B (recommended for current skills):**

```text
FeedbackHub (primary deployed product)
Browser → React + TypeScript + Vite + TanStack Query + Tailwind
        → standalone Express REST API (Zod, auth, service/repository layers)
        → PostgreSQL + Drizzle, migrations and transactions

Weeks 20–21 separate learning slice (not another FeedbackHub backend):
Browser → Next.js App Router UI + server components/actions
        → server-only data access layer
        → isolated PostgreSQL test schema/database via Drizzle
```

Build a small *triage dashboard vertical slice* using current Next.js full-stack patterns. Prevent two applications from independently writing the same production records. It is okay to use a read-only integration to the main API and separately demonstrate a real server action on an isolated table.

**Alternative Path A:** Save working SPA/Express branch or tag, then migrate FeedbackHub to a unified Next.js app with a proper data-access layer. Choose this if you strongly prefer one unified product. **Never accidentally maintain overlapping business logic in two backends.**

### Optional AI feature (only after stable launch)

Use AI SDK v6 for *suggested* feedback category/urgency or duplicate hints. Validate against Zod, show uncertainty and errors, require human acceptance, and preserve a manual workflow when the model is down. Avoid writing customer data to external models without appropriate user permission.

### Evidence, docs and user outcomes

Keep `docs/PRD.md`, `docs/decision-log.md`, `docs/architecture.md`, `docs/api-contract.md`, `docs/permissions.md`, `docs/test-plan.md`, `docs/user-feedback.md`, `docs/retrospectives/`, `docs/operations.md`, and `CASE_STUDY.md`. Small and accurate beats large and unused. Include real deployment URL when available, coverage of important tests, actual user feedback, and a clear account of code you independently implemented versus agent-assisted edits.

---



## 7. Week-by-week execution plan

**Every week has explicit lessons, concepts, coding work, the portfolio increment, interview practice and a completion gate.** Check the relevant boxes before advancing; the lesson titles are *topic maps*, not guarantees that a given course version has the same chapter numbering.

### Phase A — Rapid JavaScript Reset (Weeks 01–02)



#### Week 01 — JavaScript refresh: syntax, functions, debugging

**Weekly outcome:** Can write functions and debug wrong results without implementation assistance.

**Course sections to study**

Hard Parts v3: execution contexts and basic principles; javascript.info skim.

**Concept checklist**

- [ ] Variables/types and coercion.
- [ ] Functions, default/rest parameters, control flow.
- [ ] Arrays/objects and reference identity.
- [ ] Breakpoints, stack traces, developer tools.
- [ ] Big O intuition.

**Independent lab / testing**

- [ ] Implement `groupBy`, `uniqueBy`, `sumBy` and a minimal CLI; add unit tests.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Write a 1-page FeedbackHub problem statement and define one target user workflow.

**Technical interview track**

- [ ] Two easy array/hash-map exercises; explain complexity aloud.

**Definition of done**

- [ ] Can write functions and debug wrong results without implementation assistance.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-01.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 02 — JavaScript runtime: closure, async and HTTP

**Weekly outcome:** Can explain closures and task ordering and implement retry logic independently.

**Course sections to study**

Hard Parts v3: closures, higher-order functions, promises/event loop, prototypes.

**Concept checklist**

- [ ] Lexical scope and closures.
- [ ] Higher-order functions and callbacks.
- [ ] Promises, async/await and error propagation.
- [ ] Event loop, microtasks, tasks.
- [ ] Fetch, HTTP statuses, timeouts and AbortController.

**Independent lab / testing**

- [ ] Implement `debounce`, `throttle`, `memoize`, and `fetchJson` with timeout, retry/backoff and tests; cap the number of retries.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Sketch MVP user journey; interview or consult 1–2 potential users if available; record assumptions otherwise.

**Technical interview track**

- [ ] 2 easy problems in JS, plus implement a stack manually and trace asynchronous output order.

**Definition of done**

- [ ] Can explain closures and task ordering and implement retry logic independently.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-02.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.

---



### Phase B — Strict TypeScript (Weeks 03–05)



#### Week 03 — TypeScript essentials

**Weekly outcome:** No `any` shortcuts or unchecked casts in core utility code; explain type narrowing.

**Course sections to study**

Total TypeScript Pro Essentials: foundations, inference, objects, narrowing; Effective TypeScript selective items.

**Concept checklist**

- [ ] Tsconfig `strict` and compiler errors.
- [ ] Primitive, union and literal types.
- [ ] Interfaces vs type aliases.
- [ ] Discriminated unions and narrowing.
- [ ] Typed functions and null handling.

**Independent lab / testing**

- [ ] Port the Week 2 HTTP client to strict TypeScript; model success/error as a discriminated union; test invalid inputs.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Create one-page PRD with stable feature IDs and acceptance criteria, keeping the MVP narrow.

**Technical interview track**

- [ ] Start TypeScript DSA: array/hash map patterns, 2 easy problems.

**Definition of done**

- [ ] No `any` shortcuts or unchecked casts in core utility code; explain type narrowing.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-03.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 04 — Practical generics and safe TypeScript

**Weekly outcome:** Can write and explain a generic utility without copying a course solution.

**Course sections to study**

Pro Essentials: function types, generics, indexed access, inference, utility types.

**Concept checklist**

- [ ] Generic functions and constraints.
- [ ] Optional/readonly properties.
- [ ] `unknown` and runtime validation.
- [ ] Type inference pitfalls.
- [ ] Typing asynchronous return values.

**Independent lab / testing**

- [ ] Build a typed pagination/filter library; write compile-time/type-level examples and runtime tests.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Define FeedbackHub data model concepts: feedback, users, categories, status, permissions.

**Technical interview track**

- [ ] 2 easy problems using Map/Set and two pointers; retry one older problem.

**Definition of done**

- [ ] Can write and explain a generic utility without copying a course solution.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-04.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 05 — TypeScript consolidation and web semantics

**Weekly outcome:** Types survive actual UI/API boundary; can explain compile-time vs runtime validation.

**Course sections to study**

Pro Essentials: select remaining practical modules; MDN: HTML forms, HTTP; Effective TS items on modeling.

**Concept checklist**

- [ ] DOM events and type-safe handlers.
- [ ] HTTP requests/responses and REST constraints.
- [ ] Valid states as unions.
- [ ] Module imports, build tooling and npm.
- [ ] Semantic forms and browser validation.

**Independent lab / testing**

- [ ] Create a typed browser app that submits a form to a mocked endpoint; include timeout/error UI and input validation.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Write initial API contract and pick MVP acceptance tests; create `docs/decision-log.md`.

**Technical interview track**

- [ ] 2 easy binary-search or prefix-sum exercises in TS, revisit hashing.

**Definition of done**

- [ ] Types survive actual UI/API boundary; can explain compile-time vs runtime validation.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-05.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.

---



### Phase C — CSS & Semantic Web (Weeks 06–07)



#### Week 06 — CSS mental models and semantic HTML

**Weekly outcome:** Can reproduce a responsive screen and explain the layout without Tailwind.

**Course sections to study**

CSS for JavaScript Developers: rendering/flow, box model, Flexbox, positioning (matching modules in your edition); MDN.

**Concept checklist**

- [ ] Cascade/specificity/inheritance.
- [ ] Box sizing, margins, normal flow.
- [ ] Flexbox and layout sizing.
- [ ] Positioned elements and stacking contexts.
- [ ] Semantic headings/forms and focus visibility.

**Independent lab / testing**

- [ ] Implement FeedbackHub static page (header, sidebar, cards, form) using plain CSS and semantic HTML; keyboard-only walkthrough.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Create clickable static UX prototype and ask a user to perform one task.

**Technical interview track**

- [ ] 2 easy problems on string traversal or linked-list intro.

**Definition of done**

- [ ] Can reproduce a responsive screen and explain the layout without Tailwind.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-06.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 07 — Responsive CSS, Grid, Tailwind introduction

**Weekly outcome:** No overflow or broken keyboard flow at common viewport sizes.

**Course sections to study**

Josh Comeau: responsive design, Grid, stacking, typography (targeted); Tailwind official docs.

**Concept checklist**

- [ ] Grid and responsive breakpoints.
- [ ] Fluid layout and intrinsic sizing.
- [ ] Accessible contrast and focus.
- [ ] Tailwind utility design and theme tokens.
- [ ] CSS debugging in dev tools.

**Independent lab / testing**

- [ ] Complete one raw-CSS responsive dashboard and then style a separate component using Tailwind; compare approaches.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Establish design tokens and component conventions for FeedbackHub.

**Technical interview track**

- [ ] Two-pointer/sliding-window drills; 2 easy problems and one review.

**Definition of done**

- [ ] No overflow or broken keyboard flow at common viewport sizes.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-07.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.

---



### Phase D — React & Frontend Testing (Weeks 08–12)



#### Week 08 — React fundamentals via exercises

**Weekly outcome:** Can build a functional typed feature without following along video line-by-line.

**Course sections to study**

Epic React v2: React Fundamentals workshop; React docs; Complete Intro v9 fallback on JSX/state.

**Concept checklist**

- [ ] TSX, components and props.
- [ ] Controlled state and re-rendering.
- [ ] State vs derived values.
- [ ] Lists/keys and composition.
- [ ] Tailwind styling for product components.

**Independent lab / testing**

- [ ] Implement typed FeedbackHub feedback list, filters and status pill; add unit tests for pure derived data.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Create issue backlog and choose 3 must-have interactions from the PRD.

**Technical interview track**

- [ ] 2–3 easy array/sliding-window problems; explain React rendering orally.

**Definition of done**

- [ ] Can build a functional typed feature without following along video line-by-line.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-08.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 09 — Forms, hooks and accessible UI

**Weekly outcome:** Keyboard-accessible create/edit form with error, cancel, and focus restoration.

**Course sections to study**

Epic React: React Hooks exercises; React docs on state/forms; Radix/shadcn docs.

**Concept checklist**

- [ ] UseState and state transitions.
- [ ] Controlled forms and validation.
- [ ] Props, event types and custom hooks.
- [ ] Accessible dialog behavior, focus management.
- [ ] When to use headless primitives.

**Independent lab / testing**

- [ ] Make create/edit feedback form using typed handlers and Zod; build a one-off native dialog learning exercise, then use accessible Radix/shadcn UI in product.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Write 3 acceptance tests for submitting, editing, and validating feedback.

**Technical interview track**

- [ ] 2–3 easy recursion/stack exercises; 60-minute small React form practice.

**Definition of done**

- [ ] Keyboard-accessible create/edit form with error, cancel, and focus restoration.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-09.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 10 — Effects, async state, data fetching

**Weekly outcome:** Can explain when not to use useEffect and avoid stale updates.

**Course sections to study**

Epic React: React Hooks selected async/effects exercises; Complete Intro v9: TanStack Query sections.

**Concept checklist**

- [ ] Effects vs event handlers.
- [ ] Data fetching and race conditions.
- [ ] Loading/error/empty/success state machine.
- [ ] TanStack Query cache fundamentals.
- [ ] Retries, cancellation and stale responses.

**Independent lab / testing**

- [ ] Build typed mock API and feedback fetch/mutate flows with explicit async states; test slow, failed and empty cases.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Record feedback load/save flow and failure UX; keep API adapter replaceable.

**Technical interview track**

- [ ] 2–3 tree/DFS introduction problems and one old DSA review.

**Definition of done**

- [ ] Can explain when not to use useEffect and avoid stale updates.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-10.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 11 — React ecosystem and test fundamentals

**Weekly outcome:** Tests catch at least one deliberate regression and do not depend on layout internals.

**Course sections to study**

Complete Intro React v9: TanStack Router/Query/Vitest material; Steve Kinney Testing Fundamentals.

**Concept checklist**

- [ ] React test boundaries and behavior assertions.
- [ ] Vitest matchers, spies, mocks.
- [ ] React Testing Library best practices.
- [ ] URL-driven navigation and state.
- [ ] Component organization and accessibility.

**Independent lab / testing**

- [ ] Cover create/edit/filter feature with tests; replace brittle implementation assertions with user-observable behavior.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Run a review with one potential user; track 3 usability findings.

**Technical interview track**

- [ ] 2–3 tree/stack questions and a short JS/TS oral quiz.

**Definition of done**

- [ ] Tests catch at least one deliberate regression and do not depend on layout internals.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-11.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 12 — Frontend MVP checkpoint

**Weekly outcome:** Independent 90-minute frontend task passes keyboard, testing and code explanation checks.

**Course sections to study**

Epic React: relevant advanced API exercises only; React docs; Testing Fundamentals review.

**Concept checklist**

- [ ] Rendering and performance basics.
- [ ] Composition and state ownership.
- [ ] Accessibility QA.
- [ ] Error boundaries concepts.
- [ ] Trade-off explanations.

**Independent lab / testing**

- [ ] Ship responsive FeedbackHub frontend backed by a typed mock adapter, with tests and documented known limitations.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Freeze MVP backlog; record UI/usability improvements and explicit non-goals.

**Technical interview track**

- [ ] One 60–90 minute frontend live build, 2 DSA questions.

**Definition of done**

- [ ] Independent 90-minute frontend task passes keyboard, testing and code explanation checks.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-12.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.

---



### Phase E — APIs & Data (Weeks 13–19)



#### Week 13 — Node.js runtime and backend fundamentals

**Weekly outcome:** Can run, debug and test a CLI/service without scaffolding from AI.

**Course sections to study**

Introduction to Node.js v3: modules, npm, I/O, HTTP, async testing.

**Concept checklist**

- [ ] Node vs browser runtime.
- [ ] Modules, package resolution.
- [ ] File I/O and streams fundamentals.
- [ ] Error propagation and async operations.
- [ ] Process/env handling.

**Independent lab / testing**

- [ ] Implement small TS Node CSV/JSON import CLI with robust errors and tests; inspect the Node debugger.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Document backend boundaries and choice of Express over framework-only APIs.

**Technical interview track**

- [ ] 2–3 linked list or recursion problems.

**Definition of done**

- [ ] Can run, debug and test a CLI/service without scaffolding from AI.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-13.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 14 — Express, REST and validation

**Weekly outcome:** Can implement request, validation, error and response from scratch.

**Course sections to study**

Introduction to Node.js v3 finish; API Design Node.js v5: Express, routing, middleware, Zod.

**Concept checklist**

- [ ] Request lifecycle and middleware.
- [ ] REST verbs/status codes.
- [ ] Schema validation and sanitization.
- [ ] Central error handling.
- [ ] Pagination and API contract evolution.

**Independent lab / testing**

- [ ] Build standalone Express API for FeedbackHub using temporary in-memory persistence; contract tests.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Align frontend typed API adapter to the actual backend contracts.

**Technical interview track**

- [ ] 2–3 binary search/interval questions.

**Definition of done**

- [ ] Can implement request, validation, error and response from scratch.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-14.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 15 — API testing, reliability and service boundaries

**Weekly outcome:** API failures are controlled, tests reproduce bugs, and error messages do not leak secrets.

**Course sections to study**

API Design Node.js v5: testing, controller/service separation, errors.

**Concept checklist**

- [ ] Test pyramid and integration tests.
- [ ] Vitest/Supertest style API tests.
- [ ] Structured errors and correlation IDs.
- [ ] Retry/timeouts/idempotency fundamentals.
- [ ] Dependency boundaries.

**Independent lab / testing**

- [ ] Add happy/invalid/404/error tests, request IDs, and repository/service seam; simulate external integration failures.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Specify error messages and observable behavior for users.

**Technical interview track**

- [ ] 2–3 BFS/DFS or tree problems; mock API implementation task.

**Definition of done**

- [ ] API failures are controlled, tests reproduce bugs, and error messages do not leak secrets.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-15.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 16 — Authentication, authorization, security basics

**Weekly outcome:** Cross-user unauthorized access denied even by direct API calls.

**Course sections to study**

API Design Node.js v5: auth; Web Security v2 selected auth concepts; OWASP.

**Concept checklist**

- [ ] Sessions/cookies/token trade-offs.
- [ ] Password hashes and secrets.
- [ ] Authorization vs authentication.
- [ ] Ownership/role checks on server.
- [ ] CSRF/XSS and CORS basics.

**Independent lab / testing**

- [ ] Add authentication, organization ownership check and negative authorization tests; minimize permissions.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Define actor roles and permission matrix in docs.

**Technical interview track**

- [ ] 2–3 graph basics problems and implement a small guard without AI.

**Definition of done**

- [ ] Cross-user unauthorized access denied even by direct API calls.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-16.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 17 — SQL and relational data modeling

**Weekly outcome:** Can explain query correctness and write joins without an ORM.

**Course sections to study**

Complete Intro to SQL & PostgreSQL: fundamentals/joins; SQLBolt.

**Concept checklist**

- [ ] Relations, primary/foreign keys.
- [ ] JOINs and aggregation.
- [ ] Constraints and normalization.
- [ ] Parameterized SQL and injection prevention.
- [ ] Schema migrations concept.

**Independent lab / testing**

- [ ] Design PostgreSQL schema and implement SQL queries for feedback, users, status history and category metrics.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Review data retention needs and organization boundaries.

**Technical interview track**

- [ ] 2–3 joins/SQL interview prompts and hashing review.

**Definition of done**

- [ ] Can explain query correctness and write joins without an ORM.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-17.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 18 — PostgreSQL indexes, transactions and concurrency

**Weekly outcome:** Can demonstrate and explain concurrency fix and appropriate index.

**Course sections to study**

SQL course: indexes/transactions; DDIA Ch. 3 (storage/indexes) and Ch. 7 (transactions), edition-aware.

**Concept checklist**

- [ ] B-tree and index access.
- [ ] EXPLAIN query plans.
- [ ] ACID and transaction isolation.
- [ ] Race conditions, lost updates.
- [ ] Unique constraints and conflict handling.

**Independent lab / testing**

- [ ] Simulate two users editing same feedback status; use transaction or optimistic concurrency; show failing and passing test.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Define correctness and audit requirements for status updates.

**Technical interview track**

- [ ] 2–3 interval/heaps problems and small SQL design question.

**Definition of done**

- [ ] Can demonstrate and explain concurrency fix and appropriate index.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-18.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 19 — Drizzle ORM and full-stack integration

**Weekly outcome:** Can demo full-stack MVP from local clean environment and explain data flow.

**Course sections to study**

API Design Node.js v5: Drizzle/migrations; Drizzle docs; backend lessons review.

**Concept checklist**

- [ ] ORM vs handwritten SQL.
- [ ] Migrations and rollback.
- [ ] Schema validation across boundaries.
- [ ] Integration testing with a real DB.
- [ ] Environment and seed scripts.

**Independent lab / testing**

- [ ] Replace in-memory persistence with PostgreSQL/Drizzle; connect Vite UI, Express API and DB; run integration suite.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Run end-to-end feedback submission/permission test with realistic fixture data.

**Technical interview track**

- [ ] Full-stack build mock: add feedback filter API + UI; 2 DSA problems.

**Definition of done**

- [ ] Can demo full-stack MVP from local clean environment and explain data flow.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-19.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.

---



### Phase F — Next.js & Production Engineering (Weeks 20–23)



#### Week 20 — Next.js vertical slice, architecture comparison

**Weekly outcome:** Can explain both architectures without claiming one is universally superior.

**Course sections to study**

Next.js Fundamentals v4: App Router, Server Components, layouts; Next.js Learn; AI coding workflow notes selectively.

**Concept checklist**

- [ ] App Router and layouts.
- [ ] Server vs client execution.
- [ ] Data access layer and server-only code.
- [ ] Server actions vs route handlers.
- [ ] SPA+API vs unified Next design.

**Independent lab / testing**

- [ ] Default Path B: retain production FeedbackHub as Vite+Express. Build isolated Next.js triage dashboard mini-app with its own test DB/schema and direct server-side read/write via DAL; no duplicate writers to FeedbackHub tables. Alternate Path A: migrate with branch/tag and clear ownership.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Record architecture decision ADR comparing two independently working solutions.

**Technical interview track**

- [ ] 60-minute React table challenge; 2 mixed problems.

**Definition of done**

- [ ] Can explain both architectures without claiming one is universally superior.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-20.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 21 — Next.js forms, cache boundaries, performance

**Weekly outcome:** Demonstrate working Next data mutation and explain cache safety.

**Course sections to study**

Next.js Fundamentals v4: fetching/cache/auth; official version-current docs.

**Concept checklist**

- [ ] Server Actions and validation.
- [ ] Route handlers and API purposes.
- [ ] Data freshness and invalidation.
- [ ] Auth and tenant scope of caches.
- [ ] Loading/error boundaries and performance.

**Independent lab / testing**

- [ ] Complete small Next app form+mutation with Zod and DB layer; demonstrate stale-cache bug and correction; preserve main FeedbackHub architecture.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Document Next vs SPA trade-offs and latency/complexity measurements if captured.

**Technical interview track**

- [ ] Frontend system design exercise and 2 DSA reviews.

**Definition of done**

- [ ] Demonstrate working Next data mutation and explain cache safety.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-21.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 22 — End-to-end tests and web security

**Weekly outcome:** No critical authorization or regression issue in release flows; reproducible E2E run.

**Course sections to study**

Steve Kinney Playwright course; Web Security v2; OWASP / PortSwigger selected labs.

**Concept checklist**

- [ ] Browser E2E reliability and selectors.
- [ ] Auth setup and test fixtures.
- [ ] XSS/CSRF/IDOR/SQLi classes.
- [ ] Cookie and session security.
- [ ] Least-privilege environment credentials.

**Independent lab / testing**

- [ ] Add Playwright smoke suite for primary FeedbackHub flows; run selected security labs and negative tests; fix one realistic bug.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Record release risks and a concrete security acceptance checklist.

**Technical interview track**

- [ ] 90-minute practical exercise: paginated table or autocomplete; 2 DSA problems.

**Definition of done**

- [ ] No critical authorization or regression issue in release flows; reproducible E2E run.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-22.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 23 — Docker, CI/CD, observability and AI workflow discipline

**Weekly outcome:** A fresh checkout can run project and tests; changes blocked by failing CI.

**Course sections to study**

Docker docs, GitHub Actions docs, FSO targeted Parts 11–12; AI coding for real engineers selected lessons.

**Concept checklist**

- [ ] Dockerfile, Compose dev setup.
- [ ] CI testing/build and migration safety.
- [ ] Secrets and environment management.
- [ ] Basic logs/metrics/request tracing.
- [ ] Human review of AI-generated code.

**Independent lab / testing**

- [ ] Make repeatable local containers, lint/typecheck/unit/integration/E2E CI stages and preview deployment; adopt two-gear workflow for production code (independent implementation vs agent-assisted boilerplate).
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Publish operational runbook, deployment checklist and rollback steps.

**Technical interview track**

- [ ] System design discussion of request lifecycle; 2 DSA problems.

**Definition of done**

- [ ] A fresh checkout can run project and tests; changes blocked by failing CI.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-23.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.

---



### Phase G — Product Launch & Iteration (Weeks 24–26)



#### Week 24 — Product MVP launch and support

**Weekly outcome:** Actual deploy and usable workflow; operational risks and unresolved issues documented.

**Course sections to study**

PostHog Product Engineer Handbook; analytics docs; React/API test and deployment review.

**Concept checklist**

- [ ] Release readiness and feature gating.
- [ ] Onboarding and activation definition.
- [ ] Production bugs and incident triage.
- [ ] Privacy-safe analytics.
- [ ] Support/feedback loop.

**Independent lab / testing**

- [ ] Launch FeedbackHub to a small appropriate audience; instrument events: feedback_created, feedback_viewed, status_changed; test handling with user consent as appropriate.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Seek 3–5 genuine testers if possible; record what was actually obtained, no fabricated counts.

**Technical interview track**

- [ ] Mixed practical build and 2 DSA problems; mock debugging round.

**Definition of done**

- [ ] Actual deploy and usable workflow; operational risks and unresolved issues documented.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-24.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 25 — Measure, interview and iterate

**Weekly outcome:** A real change justified by feedback; optional AI must degrade gracefully and not write without approval.

**Course sections to study**

PostHog funnels/analytics; continuous discovery material as reference; AI SDK v6 only if core stable.

**Concept checklist**

- [ ] Interview question design.
- [ ] Funnels and event correctness.
- [ ] Hypothesis to iteration.
- [ ] Metrics vs vanity analytics.
- [ ] Optional LLM structured output + review.

**Independent lab / testing**

- [ ] Fix top user-identified friction and add tests. OPTIONAL: take AI SDK v6 intro and prototype suggested feedback category/urgency using current structured outputs and human review.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Write one product experiment/iteration memo with baseline and observed data, or explicitly mark insufficient data.

**Technical interview track**

- [ ] 1 behavioral mock, DSA mixed review, system design on feedback workflow.

**Definition of done**

- [ ] A real change justified by feedback; optional AI must degrade gracefully and not write without approval.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-25.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 26 — Refactor, case study and optional AI handoff

**Weekly outcome:** Explain three code decisions and one measured or observed product improvement.

**Course sections to study**

Refactoring selected examples; Effective TypeScript; optional AI SDK v6 remaining intro.

**Concept checklist**

- [ ] Refactoring vs rewriting.
- [ ] Maintainability and type boundaries.
- [ ] Operational follow-up.
- [ ] Business outcome explanation.
- [ ] LLM output validation and graceful fallback when optional.

**Independent lab / testing**

- [ ] Refactor one high-friction module and prove behavior preserved by tests; if AI feature started, add schema validation, version metadata and explicit confirmation.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Finish case study: problem, constraints, technical ownership, testing, actual metrics, next steps.

**Technical interview track**

- [ ] 1 product/engineering storytelling mock and medium DSA practice.

**Definition of done**

- [ ] Explain three code decisions and one measured or observed product improvement.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-26.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.

---



### Phase H — Interviews & OOP (Weeks 27–30)



#### Week 27 — OOP, low-level design and optional NestJS

**Weekly outcome:** Can justify pattern selection without overengineering; NestJS is optional if mocks need time.

**Course sections to study**

Ultimate Design Patterns selected patterns; Refactoring.Guru; Tom Ray Project 1 SELECTIVE elective.

**Concept checklist**

- [ ] SOLID applied pragmatically.
- [ ] Composition vs inheritance.
- [ ] Strategy, Factory, Adapter, Observer, State.
- [ ] Dependency injection, modules/guards.
- [ ] Testing under abstractions.

**Independent lab / testing**

- [ ] Build notification/pricing-state exercise in plain TS. Optional: one Tom Ray NestJS Project 1 module showing DI, guards and tests; do not start a second full project.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Document why each pattern adds value and where simple code was better.

**Technical interview track**

- [ ] One 45-minute LLD mock + 2–3 DSA problems.

**Definition of done**

- [ ] Can justify pattern selection without overengineering; NestJS is optional if mocks need time.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-27.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 28 — System design and SQL interview practice

**Weekly outcome:** Explains trade-offs and failure recovery with realistic complexity.

**Course sections to study**

System Design Primer; DDIA selective chapters; backend design notes.

**Concept checklist**

- [ ] Capacity assumptions.
- [ ] APIs and data modeling.
- [ ] Cache/queue trade-offs.
- [ ] Consistency/failure modes.
- [ ] Observability and auth at scale.

**Independent lab / testing**

- [ ] Design multi-tenant notifications or feedback ingestion service; create sequence diagram and failure table.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Make architecture presentation using real FeedbackHub constraints.

**Technical interview track**

- [ ] One 45-minute system design mock + SQL question set + 2 DSA.

**Definition of done**

- [ ] Explains trade-offs and failure recovery with realistic complexity.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-28.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 29 — Timed frontend/backend practical rounds

**Weekly outcome:** Can produce working, tested features within reasonable time without AI solutions.

**Course sections to study**

Frontend Interview Handbook; NeetCode review; React/Node reference material.

**Concept checklist**

- [ ] Timeboxed requirements analysis.
- [ ] Clean implementation under pressure.
- [ ] Debugging unfamiliar code.
- [ ] Test prioritization.
- [ ] Communicating trade-offs.

**Independent lab / testing**

- [ ] Two 60–90 minute builds: searchable paginated table; validated REST endpoint with database interaction.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Practice explaining product priorities under time constraints.

**Technical interview track**

- [ ] One live coding mock, one bug-fix mock, 2–3 DSA reviews.

**Definition of done**

- [ ] Can produce working, tested features within reasonable time without AI solutions.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-29.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 30 — Final interview and application readiness

**Weekly outcome:** Apply based on demonstrated skills, not course percentages; record weak areas and next steps.

**Course sections to study**

NeetCode / Grind75 gaps; System Design Primer; behavioral STAR archive.

**Concept checklist**

- [ ] DSA strengths and gaps.
- [ ] System design and architecture.
- [ ] Product Engineer product-sense interviews.
- [ ] Practical coding and debugging.
- [ ] Target-role calibration.

**Independent lab / testing**

- [ ] Complete coding, API/React, system design and behavioral mock loop; final security/reliability pass on project.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Polish 1-page case study and README; list only verifiable responsibilities and results; prepare tailored resume stories.

**Technical interview track**

- [ ] 2 timed coding problems + one design mock + one behavioral mock.

**Definition of done**

- [ ] Apply based on demonstrated skills, not course percentages; record weak areas and next steps.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-30.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.

---



### Optional Phase I — AI/FDE Engineering (Weeks 31–36)



#### Week 31 — FDE: Python integration fundamentals (optional)

**Weekly outcome:** Handles malformed, duplicate, missing and differently encoded data safely.

**Course sections to study**

Python official tutorial, pytest, httpx selectively; use TypeScript instead if target role does not need Python.

**Concept checklist**

- [ ] Python typing, virtual environments.
- [ ] CSV/JSON parsing and schema checks.
- [ ] HTTP clients and error handling.
- [ ] Pytest and CLI packaging.
- [ ] Privacy-safe data handling.

**Independent lab / testing**

- [ ] Write a Python or TS import CLI for messy support feedback, preserving rejected-record report and idempotency.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Describe customer data source, fields, permissions and success criteria.

**Technical interview track**

- [ ] One 45-minute data-wrangling/debugging mock.

**Definition of done**

- [ ] Handles malformed, duplicate, missing and differently encoded data safely.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-31.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 32 — FDE: enterprise integration and operational reliability

**Weekly outcome:** Duplicate/out-of-order events and external outages do not corrupt product records.

**Course sections to study**

OAuth/OIDC docs, webhook docs, API design/OWASP references.

**Concept checklist**

- [ ] OAuth scopes and least privilege.
- [ ] Signature verification and dedupe.
- [ ] Pagination, rate limits, backoff.
- [ ] Incremental ETL and mapping.
- [ ] Observability and replay.

**Independent lab / testing**

- [ ] Build a mock support platform ingestion webhook/API with tenant isolation, dedupe and replayable retry failure tests.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Present customer deployment integration diagram and permission boundary.

**Technical interview track**

- [ ] One integration-debugging mock; justify API contract assumptions.

**Definition of done**

- [ ] Duplicate/out-of-order events and external outages do not corrupt product records.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-32.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 33 — FDE: LLM SDK and structured workflows

**Weekly outcome:** The workflow remains useful when AI unavailable; no silent write action.

**Course sections to study**

AIHero AI SDK v6 crash course (finish if not covered Weeks 25–26); up-to-date SDK docs.

**Concept checklist**

- [ ] Model selection, context and token budgets.
- [ ] GenerateText/streamText structured outputs.
- [ ] Schemas and invalid model responses.
- [ ] Tool call interface basics.
- [ ] Fallback, logging and privacy.

**Independent lab / testing**

- [ ] Build reliable feedback categorization suggestion with validation, timeout/cost budget and user acceptance.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Define success metric and user-facing failure message for AI triage.

**Technical interview track**

- [ ] Explain one sample LLM failure and how to detect it.

**Definition of done**

- [ ] The workflow remains useful when AI unavailable; no silent write action.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-33.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 34 — FDE: retrieval, grounding and access boundaries

**Weekly outcome:** No cross-tenant leakage in retrieval tests; references map to accessible sources.

**Course sections to study**

Choose ONE AIHero capstone: DeepSearch OR Personal Assistant; relevant search/permissions docs.

**Concept checklist**

- [ ] BM25 and keyword retrieval.
- [ ] Embeddings where justified.
- [ ] Relevance and source citations.
- [ ] Tenant-level permission enforcement.
- [ ] Staleness and hallucination limits.

**Independent lab / testing**

- [ ] Add permission-aware, read-only retrieval of sample documentation; show cited results and explicit unknown responses.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Validate user cases with permission, out-of-date and zero-results scenarios.

**Technical interview track**

- [ ] Threat-model unauthorized retrieval and assess failures.

**Definition of done**

- [ ] No cross-tenant leakage in retrieval tests; references map to accessible sources.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-34.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 35 — FDE: tool calling, approval and prompt-injection defense

**Weekly outcome:** No unauthorized/unapproved action can execute, evidenced by tests.

**Course sections to study**

Selected AIHero agent/tool chapters; current AI SDK; OWASP LLM guidance.

**Concept checklist**

- [ ] Tool schema and argument validation.
- [ ] Prompt injection and untrusted content.
- [ ] Human approval for writes.
- [ ] Auditing and idempotency.
- [ ] Timeouts, retries and failure recovery.

**Independent lab / testing**

- [ ] Add read-only lookup tool and approval-gated status update; test malicious upstream instructions and invalid tool arguments.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Explain customer trust boundaries and support procedures.

**Technical interview track**

- [ ] Security/design mock: identify four abuse cases.

**Definition of done**

- [ ] No unauthorized/unapproved action can execute, evidenced by tests.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-35.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.



#### Week 36 — FDE: evaluations and customer rollout

**Weekly outcome:** Defensible evaluation report, scoped customer story and demonstrable recovery from failure.

**Course sections to study**

AIHero eval/observability material; SDK evaluations references.

**Concept checklist**

- [ ] Task-success evaluation design.
- [ ] Labeled datasets and representative failures.
- [ ] Precision, recall and false positives.
- [ ] Traces/latency/cost.
- [ ] Customer rollout and incident plans.

**Independent lab / testing**

- [ ] Create a small fixed evaluation dataset; compare baseline vs change, trace failures and document cost/latency; conduct live integration demo.
- [ ] Write or run appropriate happy-path, invalid-input and regression tests; explain one failure without AI writing the fix.

**FeedbackHub / product milestone**

- [ ] Write customer discovery, solution, deployment, ROI assumptions, and support handoff summary.

**Technical interview track**

- [ ] 90-minute customer-integrated debugging and architecture mock.

**Definition of done**

- [ ] Defensible evaluation report, scoped customer story and demonstrable recovery from failure.
- [ ] Save a working commit/PR or reproducible lab and a 5–10 line retrospective in `docs/retrospectives/week-36.md`.
- [ ] Explain the solution, trade-offs and edge cases in 5 minutes without reading your notes.

---



## 8. Interview training and competency gates



### 8.1 Continuous algorithm progression


| Weeks | Focus                                               | Pace                                |
| ----- | --------------------------------------------------- | ----------------------------------- |
| 1–4   | Big O, arrays, maps, strings, two pointers          | ~2 new easy problems/week + reviews |
| 5–8   | Sliding window, binary search, stacks, linked lists | ~2–3/week in TypeScript             |
| 9–12  | Recursion, trees, graph traversals basics           | ~2–3/week + frontend exercise       |
| 13–19 | BFS/DFS, heaps, intervals, backtracking basics      | ~2–3/week + API/SQL exercises       |
| 20–26 | Basic DP, mixed practice, timed implementation      | ~2–3/week + practical rounds        |
| 27–30 | Mixed problems, mocks, weakness remediation         | timed mocks and spaced re-solves    |


**Target:** Approximately 45–70 distinct deeply understood DSA problems by the end of the core, *plus* re-solves and independent implementation tasks; increase only for algorithm-intensive employers. For each problem: explain brute force, optimized approach, Big O, edge cases and one test. Record spaced re-solves after 2, 7 and ~21 days when possible.

### 8.2 Interview round coverage

- **JS/TS and frontend:** explain closures, event loop, promises, effects, hooks, typing React props/events, state ownership, accessible forms, caching and performance.
- **Backend/practical:** implement auth-protected API, pagination, request validation, SQL joins/indexing and tests; debug unfamiliar errors.
- **OOP/LLD:** Strategy, Factory, Adapter, Observer, State; composition, dependency injection, state machine; overengineering warnings.
- **System design:** clarify requirements, API/data model, concurrency, indexes, caching, queues, idempotency, security, observability, operational failures, alternatives.
- **Product/behavioral:** prepare ~8 clear situation–action–result stories using actual projects; distinguish delivery leadership from code ownership.
- **FDE optional:** demonstrate customer discovery, scoped integrations, least privilege, rollout support, debugging and measured operational impact.



### 8.3 Competency gates


| Gate         | Timing  | Required proof                                                                             |
| ------------ | ------- | ------------------------------------------------------------------------------------------ |
| JS           | End W2  | Build and explain closure/async utilities; correct tests                                   |
| TS           | End W5  | Strict types on real utilities and web form; no type escapes                               |
| CSS          | End W7  | Responsive accessible raw-CSS reference UI; Tailwind conceptual understanding              |
| React        | End W12 | Complete UI interaction independently in 90 minutes, with behavior tests                   |
| Backend      | End W19 | End-to-end auth, React UI, Express API, Postgres and migrations; negative permission tests |
| Production   | End W23 | Green CI, repeatable local setup, deployment, E2E and baseline security                    |
| Product      | End W26 | Real product release and at least one evidence-backed iteration; AI optional               |
| Interviews   | End W30 | Representative timed coding, practical, design and behavioral rounds                       |
| FDE optional | End W36 | Secure customer integration, bounded AI tools, eval report and deployment demo             |


At each gate, **do not advance just because of the calendar**. Record whether a weakness is a knowledge gap, independent speed issue, or communication problem. An interview-ready claim should be based on completed mock outcomes, not course percentages.

### 8.4 Application timeline

Begin exploratory applications after Week 19 only if the full-stack gate passes, and increase them after Weeks 23–26. Seek Product Engineer, Full-Stack Engineer (Product), software engineer on product-led teams; selectively consider customer-facing Solutions/FDE jobs with significant actual coding. A role title is insufficient evidence of daily engineering responsibility.

---



## 9. Exact skip and defer list


| Resource/area                                                              | Decision                                | When to revisit                                                   |
| -------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------- |
| Full Intro to React v9 **entire** course                                   | **Don't do entire course** (use 15–30%) | If Epic React fundamentals are too steep or ecosystem gap remains |
| Intermediate React v6                                                      | **Skip**                                | Only if a relevant component technique is missing                 |
| Older Total TypeScript Professional Training                               | **Skip**                                | None during core                                                  |
| Frontend Masters TypeScript Fundamentals + Intermediate (entire sequences) | **Skip as full second curriculum**      | Reference if Pro Essentials needs alternate explanation           |
| Epic React advanced workshops **in full**                                  | **Defer**                               | After W12 when real React needs arise                             |
| CSS for JS deep animations/decorative work                                 | **Defer**                               | Product design need                                               |
| NestJS Fundamentals 2025 + full Tom Ray multi-project path                 | **Defer**                               | After W30 or Node/Express confidence                              |
| MongoDB/GraphQL/microservices/Kubernetes/Terraform/cloud certs             | **Skip**                                | Role-specific requirement                                         |
| Spring Boot and Angular courses                                            | **Skip**                                | Role-specific demand                                              |
| Multiple full DSA courses                                                  | **Skip**                                | Use NeetCode/Grind75 + The Last Algorithms Course                 |
| Entire Full Stack Open curriculum                                          | **Skip full completion**                | Target Parts 3/4/9/11/12/13 only for gaps                         |
| Full readings of DDD/Clean Code/Refactoring/DDIA                           | **Skip full cover-to-cover**            | Read relevant chapter at project need                             |
| AIHero DeepSearch and Personal Assistant **both**                          | **Choose one**                          | Complete other later if needed                                    |
| More paid programming courses                                              | **No new purchases needed**             | After a checkpoint reveals a true gap                             |


**What not to skip:** independent implementation, testing, Git, SQL fundamentals, auth/authorization, JavaScript runtime mechanics, user feedback, core design decisions, and interview practice.

---



## 10. Study workflow and tracking templates



### 10.1 Reusable weekly page

```markdown
# Week XX — Topic

- Week dates: ____ to ____
- Planned hours: ____ / Actual hours: ____
- Courses and lessons targeted: ____
- [ ] Concepts explained independently
- [ ] Course exercises attempted first without solution
- [ ] Coding lab runs and tests pass
- [ ] Portfolio feature completed or documented
- [ ] DSA patterns practiced and mistakes logged
- [ ] One code review / refactor
- [ ] Retrospective + commit/PR evidence

## Problems I struggled with
...
## Engineering decisions
...
## Gate result: PASS / RETRY
...
## Next-week adjustment
...
```



### 10.2 Course tracker (do not conflate coverage and completion)


| Course                           | Intended chapters/workshops          | Actual chapters/workshops | Independently completed labs | Recorded progress % | Next action |
| -------------------------------- | ------------------------------------ | ------------------------- | ---------------------------- | ------------------- | ----------- |
| JavaScript Hard Parts            | Core runtime lessons                 |                           |                              |                     |             |
| Total TypeScript Pro Essentials  | Fundamentals to practical generics   |                           |                              |                     |             |
| Epic React v2                    | Fundamentals/Hooks/selected advanced |                           |                              |                     |             |
| CSS for JavaScript Developers    | Layout and responsive modules        |                           |                              |                     |             |
| Node.js v3, API v5, SQL          | Core                                 |                           |                              |                     |             |
| Next.js v4, Playwright, Security | Selected chapters                    |                           |                              |                     |             |
| Tom Ray NestJS (elective)        | Project 1 slices                     |                           |                              |                     |             |
| AIHero SDK v6 (optional)         | Crash course                         |                           |                              |                     |             |




### 10.3 Two-gear AI development rules

**Gear 1: independent competency** — Code without assistant completion or generated solutions for labs, DSA, timed practical tasks, core algorithms and assessed architecture. Learn to debug with breakpoints, logs, tests and official docs first.

**Gear 2: assisted product delivery** — AI may explain concepts, review a completed attempt, suggest edge cases, accelerate scaffolding, generate draft documentation and tests to review, and help refactor. YOU retain architecture/security decisions, validate tests independently, and can reproduce critical changes manually. This applies from Week 1 in reasonable limits, with more scope after Week 20 once fundamentals are stronger.

**Always log:** which deliverables are independent, which contain agent-assisted code, what was tested, and what remains risky. Never use AI to misrepresent hiring-assessment work.

### 10.4 User and outcome evidence rules

Record: anonymized interview notes when permission is obtained; baseline KPI definition; captured analytics events; actual measured values and sample size; hypotheses; reasons for changing a feature; limitations. If you have no real users yet, label results **prototype assumptions** and seek real feedback rather than inventing figures.

---



## 11. Resource links and history



### 11.1 Primary learning resources

- [JavaScript: The Hard Parts v3](https://frontendmasters.com/courses/javascript-hard-parts-v3/) · [javascript.info](https://javascript.info/)
- [Total TypeScript Pro Essentials](https://www.totaltypescript.com/workshops/typescript-pro-essentials) · [Effective TypeScript resources](https://effectivetypescript.com/)
- [CSS for JavaScript Developers](https://www.joshwcomeau.com/courses/css-for-js/) · [Tailwind CSS](https://tailwindcss.com/docs/installation) · [shadcn/ui](https://ui.shadcn.com/) · [Radix Primitives](https://www.radix-ui.com/primitives)
- [Epic React](https://www.epicreact.dev/) · [Complete Intro to React v9](https://react-v9.holt.courses/) · [React Learn](https://react.dev/learn)
- [Testing Fundamentals](https://frontendmasters.com/courses/testing/) · [Vitest](https://vitest.dev/guide/) · [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Introduction to Node.js v3](https://frontendmasters.com/courses/node-js-v3/) · [API Design in Node.js v5](https://frontendmasters.com/courses/api-design-nodejs-v5/)
- [Complete Intro to SQL & PostgreSQL](https://frontendmasters.com/courses/sql/) · [PostgreSQL docs](https://www.postgresql.org/docs/current/) · [Drizzle](https://orm.drizzle.team/docs/overview)
- [Next.js Fundamentals v4](https://frontendmasters.com/courses/next-js-v4/) · [Next.js Learn](https://nextjs.org/learn)
- [Playwright](https://frontendmasters.com/courses/playwright/) · [Web Security v2](https://frontendmasters.com/courses/web-security-v2/) · [OWASP Top 10](https://owasp.org/www-project-top-ten/) · [PortSwigger Academy](https://portswigger.net/web-security)
- [Docker](https://docs.docker.com/get-started/) · [GitHub Actions](https://docs.github.com/en/actions) · [PostHog Product Engineer Handbook](https://posthog.com/product-engineer/what-is-a-product-engineer)
- [The Last Algorithms Course You'll Need](https://frontendmasters.com/courses/algorithms/) · [NeetCode roadmap](https://neetcode.io/roadmap) · [Grind 75](https://www.techinterviewhandbook.org/grind75/) · [System Design Primer](https://github.com/donnemartin/system-design-primer) · [Refactoring.Guru](https://refactoring.guru/design-patterns/typescript)
- [Tom Ray's NestJS course](https://www.tomray.dev/nestjs-course) · [NestJS docs](https://docs.nestjs.com/)
- [AI SDK v6 Crash Course](https://www.aihero.dev/workshops/ai-sdk-v6-crash-course) · [AI SDK docs](https://ai-sdk.dev/docs/introduction)
- [AIHero DeepSearch](https://www.aihero.dev/cohorts/build-deepsearch-in-typescript) · [AIHero AI Personal Assistant](https://www.aihero.dev/cohorts/build-your-own-ai-personal-assistant-in-typescript)
- [CS50x](https://cs50.harvard.edu/x/) · [Full Stack Open](https://fullstackopen.com/en/) · [MDN Learn](https://developer.mozilla.org/en-US/docs/Learn_web_development)
