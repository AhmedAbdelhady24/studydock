# ADR 001: StudyDock Core Architecture & Technology Stack

## Status
Accepted

## Context
The user needs a local-first, single-user learning management tool (StudyDock) to track a 33-week engineering roadmap. The application must run locally via Docker Compose, persist progress safely across plan re-imports, record DSA attempts, track study sessions, attest week exit checkpoints, and visualize real progress without fabricated metrics or external SaaS telemetry.

## Decision

### 1. Unified Next.js Application Architecture
We choose a single **Next.js (App Router)** service rather than separate frontend and backend microservices.
- **Rationale:** StudyDock is a personal project utility, not a distributed system demonstration. Next.js App Router provides Server Actions, Route Handlers, React Server Components (RSC), and standard client components in one tightly integrated, type-safe TypeScript repository. Adding an Express/Fastify layer would add unnecessary serialization overhead, duplicate schema declarations, and complicate deployment.

### 2. Database & ORM
- **Database:** PostgreSQL 16+.
- **ORM:** Drizzle ORM with `drizzle-kit` versioned SQL migrations.
- **Rationale:**
  - Relational integrity: Foreign keys (`plans` -> `weeks` -> `tasks` -> `task_progress`) and strict check constraints enforce the invariant that definitions remain distinct from user progress.
  - Transactions: Atomic imports require all-or-nothing rollback capabilities on malformed CSV rows.
  - Performance & footprint: Drizzle is lightweight, executes raw SQL without heavy runtime overhead, and provides typed schema definitions that mirror PostgreSQL types directly.

### 3. CSV Parsing & Validation
- **Engine:** `csv-parse` (RFC 4180 compliant) + `zod` for type inference and runtime schema validation.
- **Formula Injection Defense:** Prefixing `=, +, -, @` with apostrophes during export, and strict string coercion during import.
- **Progress Preservation Invariant:** Ingested task records upsert task metadata by stable `task_id`. Mutable progress (`task_progress`) records are created if missing, but existing status, timestamps, notes, DSA logs, and study sessions are strictly untouched.

### 4. Containerization & Networking
- **Multi-stage Dockerfile:** Builds the Next.js standalone output with Node LTS.
- **Docker Compose:** Spawns `web` and `postgres`.
- **Security Boundary:**
  - PostgreSQL port `5432` is not published to the host network (internal bridge only).
  - Web service binds strictly to `127.0.0.1:3000` to prevent unintended LAN exposure.
  - PostgreSQL data is persisted in a named Docker volume (`postgres_data`).

### 5. UI & Polish
- **Components:** Tailwind CSS + Radix UI primitives / shadcn/ui.
- **Charts:** Recharts for completion trends, hours per week, and course coverage.
- **Design Guidelines:** Applying `frontend-design` and `make-interfaces-feel-better` (concentric radii, tabular numbers, optical alignments, zero fabricated gamification).

## Consequences
- Single containerized deployment (`docker compose up --build`) provides immediate out-of-the-box local operation.
- No cloud authentication or telemetry required.
- Easy backup and restore via standard PostgreSQL dump/restore scripts.
