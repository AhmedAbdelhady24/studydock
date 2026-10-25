# Optional AI / Forward Deployed Engineer — Six-Week Study Tracker

> **Separate StudyDock plan.** These weeks follow the **33-week** Product Engineer core and are numbered **34–39** for human readability. Import CSV `week_number` is **1–6 within this separate plan**, ensuring no collisions with the existing imported core weeks. All tasks have fresh IDs. Nothing here is required to finish the core roadmap.

**Budget:** Aim for 15–18 hours per extension week, but adjust based on practice and available time; no locally measured viewing durations are available for these external resources. Continue 2 *distinct* DSA problems per week and one explicit design exercise.

**Resource choices:** [CS50P](https://cs50.harvard.edu/python/) selected Python fundamentals, [AI SDK v6](https://ai-sdk.dev/docs/introduction), [Maxime Labonne LLM Engineer](https://github.com/mlabonne/llm-course), official integration docs and a single AIHero capstone as reference. Do not schedule the Andrew Ng ML specialization or the LLM Scientist track here.


## Week 34 — Python for integration work
**StudyDock week 1/6** • **16-hour target**

**Learning focus:** Python functions, exceptions, libraries, unit tests and file I/O; CSV, JSON and validation.

**Primary resource:** Harvard CS50P (selected).

- [ ] Study CS50P Weeks 0 and 3–6 selectively; skim basics already mastered in TypeScript ([Reference](https://cs50.harvard.edu/python/))
- [ ] Build a Python CSV/JSON importer with schema checks, deduplication and CLI errors
- [ ] Write automated tests for malformed rows, bad encodings and idempotent reruns
- [ ] Solve 2 distinct algorithm problems in TypeScript or Python, recording patterns and complexity
- [ ] Use adapter boundaries and an explicit validation layer between input and domain data
- [ ] Record independent code evidence, tests and lessons learned
- [ ] Exit: importer passes fresh-file tests and invalid inputs fail safely

**Evidence:** link to code/tests, 2 DSA problem IDs, design note, and what failed before it worked.


## Week 35 — Enterprise APIs, identity and webhooks
**StudyDock week 2/6** • **16-hour target**

**Learning focus:** OAuth fundamentals, API rate limits, retries, webhook signatures, idempotency and mapping.

**Primary resource:** Official OAuth/webhook/API references.

- [ ] Study official OAuth, webhook-signature, pagination and retry docs; no new full video course ([Reference](https://oauth.net/2/))
- [ ] Build an authenticated integration adapter with pagination and schema mapping
- [ ] Implement signed webhooks, idempotency keys, retries/backoff and replay tests
- [ ] Solve 2 distinct problems, one involving maps/sets or deduplication
- [ ] Explain Adapter vs Facade; draw the failure modes and retry state machine
- [ ] Demonstrate permission-scoped tokens, log redaction and integration tests
- [ ] Exit: replayed webhook does not duplicate state and invalid signatures are denied

**Evidence:** link to code/tests, 2 DSA problem IDs, design note, and what failed before it worked.


## Week 36 — Structured AI output in a real product
**StudyDock week 3/6** • **16-hour target**

**Learning focus:** Typed generative API calls, Zod parsing, structured output, privacy and human review.

**Primary resource:** AIHero AI SDK v6 Crash Course.

- [ ] Study AI SDK v6 Crash Course selectively; follow current generateText + Output.object structured-output API ([Reference](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data))
- [ ] Add human-confirmed category/urgency suggestion to FeedbackHub or a focused isolated integration
- [ ] Create fixtures for invalid output, model failure, timeouts and cost/latency logs
- [ ] Solve 2 distinct timed problems and explain complexity
- [ ] Model requested/pending/accepted/rejected AI suggestions with a discriminated union
- [ ] Never auto-apply output; verify schema and allow user correction
- [ ] Exit: AI feature works with human override, fallback and tests

**Evidence:** link to code/tests, 2 DSA problem IDs, design note, and what failed before it worked.


## Week 37 — LLM Engineer: model access and retrieval
**StudyDock week 4/6** • **16-hour target**

**Learning focus:** Token/context budgets, retrieval, embeddings, citations, chunking, access control.

**Primary resource:** Maxime Labonne LLM Engineer (selected topics).

- [ ] Read LLM Engineer sections Running LLMs, Vector Storage and RAG (not LLM Scientist) ([Reference](https://github.com/mlabonne/llm-course))
- [ ] Build a small permission-aware retrieval corpus and query path with source provenance
- [ ] Compare lexical-only vs vector/hybrid retrieval using a fixed small evaluation set
- [ ] Solve 2 distinct problems, one involving graphs or priority queues
- [ ] Explain repository interfaces, tenant isolation and separation of retrieval from generation
- [ ] Record failure examples; block retrieval across tenants/users
- [ ] Exit: correct source documents returned and permissions are verified

**Evidence:** link to code/tests, 2 DSA problem IDs, design note, and what failed before it worked.


## Week 38 — Agents, tools and evaluation
**StudyDock week 5/6** • **16-hour target**

**Learning focus:** Tool execution, approval gates, prompt injection defense, offline evaluations, tracing.

**Primary resource:** Maxime Labonne LLM Engineer + evaluation docs.

- [ ] Read LLM Engineer sections Agents and Security; revisit Harness Engineering L09–L14 as needed ([Reference](https://github.com/mlabonne/llm-course))
- [ ] Implement one reversible read-only tool and one gated write action requiring explicit confirmation
- [ ] Build a repeatable evaluation set and report task success, latency and cost
- [ ] Solve 2 distinct timed problems
- [ ] Compare safe tool interface, approval boundary, least privilege and state machines
- [ ] Test prompt injection, failed tools, revoked permissions and partial completion
- [ ] Exit: tool calls auditable, gated and evaluation results reproducible

**Evidence:** link to code/tests, 2 DSA problem IDs, design note, and what failed before it worked.


## Week 39 — Deployment and customer-ready handoff
**StudyDock week 6/6** • **16-hour target**

**Learning focus:** Deployment, monitoring, handoff docs, uptime, AI output quality, privacy and observability.

**Primary resource:** Maxime Labonne LLM Engineer + chosen AIHero capstone.

- [ ] Read LLM Engineer Deployment and Inference Optimization sections. Choose AIHero DeepSearch OR Personal Assistant as a reference, not both. ([Reference](https://github.com/mlabonne/llm-course))
- [ ] Ship a scoped demo or capstone with realistic input data and runbook
- [ ] Create a customer-facing walkthrough and architecture/limitations note
- [ ] Solve 2 distinct problems; do a mock coding explanation
- [ ] Defend architecture choices in a 30-minute review: permissions, quality, cost, latency and scale
- [ ] Run full E2E tests and capture measurements; document known limitations
- [ ] Exit: end-to-end demo reproducible from clean checkout and explanations backed by evidence

**Evidence:** link to code/tests, 2 DSA problem IDs, design note, and what failed before it worked.


## Exit gate

Finish only when the Week 39 capstone demonstrates a real integration with correct permissions, tests, an evaluation set, deployed behavior or reproducible local demo, and a clear explanation of operational tradeoffs.

## Deferred resources

- **Andrew Ng Machine Learning Specialization:** defer unless your career direction changes toward ML/model engineering.
- **AIHero DeepSearch vs AI Personal Assistant:** select at most one capstone; they are alternative examples, not two required courses.
- **CS50P:** finish only selected Python lectures relevant to ingestion and integration, not a redundant full introductory programming sequence.
