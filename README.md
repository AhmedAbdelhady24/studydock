<h3 align="center">
  <img src="public/icon.svg" alt="StudyDock" width="80"><br>
  StudyDock<br>
  <sub>Local-First Engineering Tracker & Curriculum Studio</sub>
</h3>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14.2%20App%20Router-black?logo=next.js&logoColor=white" alt="Next.js"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-Strict%205.7-3178C6?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://orm.drizzle.team"><img src="https://img.shields.io/badge/ORM-Drizzle%200.39-C5F74F?logo=drizzle&logoColor=black" alt="Drizzle ORM"></a>
  <a href="https://www.postgresql.org"><img src="https://img.shields.io/badge/Database-PostgreSQL%2016-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
  <a href="https://vitest.dev"><img src="https://img.shields.io/badge/Tests-12%2F12%20Passing-6E9F18?logo=vitest&logoColor=white" alt="Vitest"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-34A853" alt="License"></a>
  <img src="https://img.shields.io/badge/Telemetry-Zero%20(Local%20Only)-blueviolet" alt="Zero Telemetry">
</p>

<p align="center">
  <a href="assets/showreel-motion.mp4">
    <img src="assets/showreel-motion.gif" alt="StudyDock 15-second Product Motion Film" width="840">
  </a>
</p>
<p align="center">
  <em>15-Second Product Motion Film · <a href="assets/showreel-motion.mp4">Watch High-Res MP4</a> · <a href="public/docs/studydock-architecture.html">Interactive Architecture</a></em>
</p>

**StudyDock** is an open, local-first workbench engineered to track intensive software engineering curricula without cloud lock-in, data leaks, or vanity metrics. Backed by PostgreSQL 16, it pairs daily execution tools (60fps Kanban, focus timer telemetry, DSA problem tracking) with long-horizon curriculum version control.

---

## Key Features

- **⚡ 60fps Kanban Workbench**: Optimistic drag-and-drop task orchestration (*To Do*, *In Progress*, *Done*), slide-over detail drawer, and category filtering (*DSA*, *Architecture*, *Implementation*).
- **⏱️ Focus Session Telemetry**: Integrated digital stopwatch with 1-click recording, manual session audit logs, and weekly target vs. actual hours reconciliation.
- **🧠 DSA Drill Tracker**: Algorithmic problem bank categorized by pattern (Two Pointers, Sliding Window, DP, Graphs), difficulty metrics, and independent solve rate evaluation.
- **🗺️ Curriculum Engine & Gatekeeper**: Multi-phase syllabus progression requiring mandatory exit checkpoint attestations before advancing to subsequent weeks.
- **🔄 Deterministic CSV Sync**: Safe syllabus updates via immutable task IDs (`w01_t01`), formula-injection defense, and non-destructive re-imports.
- **🔒 Zero Telemetry & 100% Offline**: Runs exclusively on `localhost` with persistent Docker volume storage and zero external network dependencies.

---

## Visual Overview

<p align="center">
  <a href="screenshots/01_today_drawer.png"><img src="screenshots/01_today_drawer.png" width="48%" alt="Today Workbench & Drawer"></a>
  <a href="screenshots/02_roadmap.png"><img src="screenshots/02_roadmap.png" width="48%" alt="33-Week Roadmap Pipeline"></a>
</p>
<p align="center">
  <a href="screenshots/05_dsa.png"><img src="screenshots/05_dsa.png" width="48%" alt="DSA Problem Bank"></a>
  <a href="screenshots/07_analytics.png"><img src="screenshots/07_analytics.png" width="48%" alt="Study Hours Analytics"></a>
</p>

---

## Videos & Architecture

- **15s Product Motion Film**: [Watch MP4](assets/showreel-motion.mp4) · [Preview GIF](assets/showreel-motion.gif) · [Interactive HTML](videos/showreel-motion/index.html)
- **Interactive System Architecture**: [Explore Live SVG Diagram](public/docs/studydock-architecture.html) · [Diagram GIF](assets/studydock-architecture.gif)
- **Product Setup Walkthrough**: [Watch MP4](assets/studydock-demo.mp4) · [Setup GIF](assets/studydock-setup-and-demo.gif)
- **Architecture Video Tour**: [Watch MP4](assets/studydock-architecture.mp4)

---

## Quickstart

Requires **Docker** (or Node.js 20+ and pnpm 9+).

### Option A: Complete Docker Compose (Fastest)

```bash
git clone https://github.com/AhmedAbdelHady24/studydock.git
cd studydock
docker compose up --build -d
open http://127.0.0.1:3000
```

### Option B: Local Host Development

```bash
# 1. Start isolated PostgreSQL database
docker compose up -d db

# 2. Install dependencies & initialize database
pnpm install
pnpm db:migrate
pnpm db:seed

# 3. Start development server
pnpm dev
```

Visit [http://127.0.0.1:3000](http://127.0.0.1:3000).

---

## Operational Commands

| Command | Action |
|---|---|
| `pnpm dev` | Start development server on `localhost:3000` |
| `pnpm test` | Run Vitest unit & integration test suite (12/12 passing) |
| `pnpm test:e2e` | Run Playwright end-to-end integration tests |
| `pnpm typecheck` | Run TypeScript strict compiler verification |
| `pnpm db:migrate` | Apply pending Drizzle schema migrations to PostgreSQL |
| `pnpm db:seed` | Ingest initial 33-week syllabus and course targets |
| `pnpm db:backup` | Export atomic timestamped SQL dump to `./backups/` |
| `pnpm db:restore` | Restore database snapshot (`bash scripts/db-restore.sh <file>`) |

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.7 (Strict Mode)
- **Database**: PostgreSQL 16 (Dockerized, persistent volume)
- **ORM**: Drizzle ORM 0.39 (`drizzle-kit`)
- **Styling**: Tailwind CSS, Lucide Icons, Sonner Toasts
- **Testing**: Vitest, Playwright, Fallow Codebase Intelligence

---

## License & Disclaimer

MIT License. See [LICENSE](LICENSE) for details.

StudyDock is an independent, local-first open-source productivity workbench designed for individual self-directed study and deliberate software engineering practice.
