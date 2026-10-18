# Contributing to StudyDock

Thank you for your interest in contributing to StudyDock!

## Guiding Principles

1. **Local-First & Single-User Privacy**: StudyDock never phones home. All data lives in your local PostgreSQL database, and zero third-party telemetry is allowed.
2. **Deterministic Progress Preservation**: Schema migrations and syllabus re-imports must never delete or overwrite user progress, notes, or ratings.
3. **Design Engineering Standards**: Every interface component must adhere to Emil Kowalski micro-interaction standards (hardware-accelerated transforms, calibrated easing curves, zero tap delays, and proper touch boundaries).

## Development Setup

```bash
# 1. Start isolated PostgreSQL database
docker compose up -d db

# 2. Install dependencies
pnpm install

# 3. Apply schema migrations
pnpm db:migrate

# 4. Seed database
pnpm db:seed

# 5. Start dev server
pnpm dev
```

## Pull Request Checklist

Before opening a pull request, ensure all checks pass:

- [ ] `pnpm typecheck` passes with zero errors.
- [ ] `pnpm test` passes all Vitest unit and integration suites (12/12).
- [ ] `pnpm run audit` passes Fallow architectural boundaries.
- [ ] Verify Break-UI stress-test modes in development to ensure no layout overflows.
