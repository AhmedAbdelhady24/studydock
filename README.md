# StudyDock ⚓

> A local-first, privacy-respecting, single-user learning management dashboard backed by PostgreSQL. Designed for intensive software engineering roadmaps with strict progress preservation and auditable progress accounting.

![StudyDock Architecture](https://img.shields.io/badge/Architecture-Local--First%20%7C%20PostgreSQL-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.2%20App%20Router-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle%200.39-yellow)
![Docker](https://img.shields.io/badge/Docker-Compose%20Ready-2496ED)
![Tests](https://img.shields.io/badge/Tests-Vitest%2012%2F12%20Passing-emerald)

---

## 🌟 Core Design Principles & Invariants

1. **Local-First & Single-User Privacy**:
   - Web application is strictly bound to `127.0.0.1:3000`.
   - PostgreSQL runs in an isolated container bound only to localhost with named volume persistence (`studydock_postgres_data`).
   - Zero external telemetry, tracking, or cloud dependencies.

2. **Deterministic Progress Preservation**:
   - Re-importing revised learning plans matches tasks by immutable IDs (`w01_t01` through `w33_t07`).
   - Re-imports **never** overwrite completed checkboxes, confidence ratings, notes, DSA attempt logs, or study sessions.
   - Tasks removed from an upstream roadmap are safely archived (`archived_at = NOW()`), not deleted.

3. **Honest, Un-Gamified Metrics**:
   - A week is only counted as complete when **all active required tasks are done AND the Exit Checkpoint has been attested as passed**.
   - Total hours studied derive purely from real, logged study sessions—never from static planned targets.

4. **Spreadsheet Formula Defense**:
   - All CSV exports sanitize potential command and formula characters (`=`, `+`, `-`, `@`, `\t`, `\r`) with single-quote escaping to prevent formula injection when opened in Excel or Google Sheets.

---

## 🏗️ Architecture & Tech Stack

- **Framework**: Next.js 14 (App Router, Server Actions, Route Handlers)
- **Language**: TypeScript (Strict mode enabled, zero `any` in core domain)
- **Database & Migration**: PostgreSQL 16+ via Docker Compose, Drizzle ORM, `drizzle-kit`
- **Data Validation**: Zod schema validation & `csv-parse`/`csv-stringify`
- **Styling & UI**: Tailwind CSS, Radix UI primitives, Lucide icons, Dark-first engineering theme
- **Visualizations**: Recharts
- **Testing**: Vitest unit & integration test suite

---

## 🚀 Quickstart

### Option A: Complete Docker Compose (Recommended)

To run the complete application and database in isolated containers:

```bash
# 1. Start database and web application
docker compose up --build -d

# 2. Check container status
docker compose ps

# 3. Open your browser
open http://127.0.0.1:3000
```

### Option B: Local Node.js Development

If you prefer running Next.js directly on your host while running PostgreSQL in Docker:

```bash
# 1. Start the PostgreSQL container only
docker compose up -d db

# 2. Install dependencies
pnpm install

# 3. Run database migrations
pnpm db:migrate

# 4. Seed initial 33-week roadmap and course targets
pnpm db:seed

# 5. Start the development server
pnpm dev
```

Visit [http://127.0.0.1:3000](http://127.0.0.1:3000).

---

## 📋 Features Overview

### 1. Today View (`/`)
- Active focus week in flight with live task checklist.
- Key KPI cards: Overall completion %, Weeks completed / 33, Actual hours studied, DSA problems solved.
- Interactive Study Stopwatch timer with 1-click recording.
- Exit criteria gatekeeper with attestation review.

### 2. 33-Week Roadmap (`/roadmap`)
- Complete 33 weeks structured across 4 distinct phases:
  - **Phase 1**: Foundations & Systems Core (Weeks 1-8)
  - **Phase 2**: Distributed Backend & Data Engineering (Weeks 9-16)
  - **Phase 3**: Advanced Frontend & Micro-Architectures (Weeks 17-24)
  - **Phase 4**: Capstone, Production Mastery & System Design (Weeks 25-33)
- Quick status filters: *All (33)*, *Active*, *Completed*, *Remaining*.

### 3. Week Detail (`/weeks/[weekId]`)
- Task checklist grouped by category (*DSA*, *Architecture*, *Independent Coding*, *Course*, *Review*, *Checkpoint*).
- 1-to-5 star confidence rating per task.
- Inline notes and evidence links editor.
- Exit criteria checkpoint gatekeeper.

### 4. Course Curriculum Tracker (`/courses`)
- 16 foundational courses from `course_targets.csv`.
- Target coverage range comparison vs actual progress slider.
- Direct links to course references and learning strategies.

### 5. DSA Tracker (`/dsa`)
- Log LeetCode / NeetCode problem attempts by algorithmic pattern and difficulty.
- Track independent solve rate (% solved without editorial assistance).
- Filter attempts by category.

### 6. Study Sessions Logger (`/sessions`)
- Real-time digital stopwatch with Start, Pause, and Record.
- Manual retroactive session logger.
- Chronological session audit log.

### 7. Analytics Dashboard (`/analytics`)
- Recharts visualizations: Phase completion bars, weekly target vs actual hours, task category distributions.
- Progress invariant status overview.

### 8. Import & Export (`/import`)
- Safe CSV file uploader with schema validation.
- Interactive diff preview before committing to the database.
- One-click exports in CSV and JSON formats with formula sanitization.

---

## 💾 Database Backup & Restore

### Automated Backup
Creates a timestamped SQL dump in `./backups/`:

```bash
pnpm db:backup
# or directly:
bash scripts/db-backup.sh
```

### Restore from Backup
Restores a previous SQL snapshot:

```bash
bash scripts/db-restore.sh backups/studydock_backup_20261017_120000.sql
```

---

## 🧪 Testing & Verification

Run the automated test suite:

```bash
# Run all Vitest tests
pnpm test

# Run TypeScript typecheck
pnpm typecheck

# Run production build
pnpm build
```

---

## 📂 Project Structure

```
├── data/
│   └── import/
│       ├── plan_import.csv          # 33 weeks • 231 tasks fixture
│       ├── course_targets.csv       # 16 course goals fixture
│       └── product-engineer-33-week-import.zip
├── docs/
│   ├── adr/
│   │   └── 001-studydock-architecture.md
│   └── import-schema.md             # Schema specification v1.0
├── scripts/
│   ├── db-backup.sh                 # PostgreSQL backup script
│   ├── db-restore.sh                # PostgreSQL restore script
│   ├── markdown_to_csv.py           # Markdown-to-CSV parser
│   └── seed.ts                      # CLI database seeder
├── src/
│   ├── app/                         # Next.js App Router pages & APIs
│   │   ├── analytics/               # Recharts telemetry
│   │   ├── api/                     # REST Route Handlers
│   │   ├── courses/                 # Course tracking
│   │   ├── dsa/                     # DSA tracker
│   │   ├── import/                  # Import/export dashboard
│   │   ├── roadmap/                 # 33-week phase roadmap
│   │   ├── sessions/                # Study sessions log
│   │   └── weeks/[weekId]/          # Week detail view
│   ├── components/                  # UI components (Navbar, TaskItem, Timer, etc.)
│   ├── db/                          # Drizzle schema & PostgreSQL client
│   └── lib/                         # CSV parser, importer, exporter, metrics engine
├── tests/                           # Vitest test suite
├── Dockerfile                       # Multi-stage production container
├── docker-compose.yaml              # Local-first container orchestration
└── tailwind.config.ts               # Theme & styles configuration
```
