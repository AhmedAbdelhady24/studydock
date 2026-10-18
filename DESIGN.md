---
name: StudyDock
description: Local-First Engineering Tracker & Curriculum Studio
colors:
  bg-light: "#ffffff"
  bg-light-subtle: "#fafafa"
  bg-light-muted: "#f4f4f5"
  bg-dark: "#09090b"
  bg-dark-subtle: "#121215"
  bg-dark-muted: "#18181b"
  border-light: "rgba(0, 0, 0, 0.08)"
  border-dark: "rgba(255, 255, 255, 0.08)"
  text-light-primary: "#09090b"
  text-light-secondary: "#52525b"
  text-light-muted: "#71717a"
  text-dark-primary: "#f4f4f5"
  text-dark-secondary: "#d4d4d8"
  text-dark-muted: "#a1a1aa"
  accent: "#18181b"
  accent-dark: "#fafafa"
  dot-lecture: "#3b82f6"
  dot-reading: "#6366f1"
  dot-drill: "#f59e0b"
  dot-project: "#10b981"
  dot-exam: "#ef4444"
typography:
  display:
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.02em"
  caption:
    fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.3
  micro:
    fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.625rem"
    fontWeight: 500
    lineHeight: 1.2
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  badge-capsule:
    backgroundColor: "{colors.bg-light-muted}"
    textColor: "{colors.text-light-primary}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
---

## Overview

StudyDock's visual design system embodies understated technical craftsmanship. It is deliberate, calm, and information-dense, rejecting synthetic AI-generated aesthetic tropes (neon candy gradients, decorative floating glow orbs, multi-color card borders) in favor of crisp monochromatic surfaces, subtle hairline structure, and high-precision status micro-indicators.

## Colors

- **Neutral Palette:** Strict monochrome architecture with zinc/neutral tones.
  - Light Ground: `#ffffff` base, `#fafafa` cards, `#f4f4f5` muted panels.
  - Dark Ground: `#09090b` base, `#121215` cards, `#18181b` muted panels.
  - Borders: 1px hairline semi-transparent borders (`rgba(0,0,0,0.08)` on light, `rgba(255,255,255,0.08)` on dark).
- **Semantic Indicators:** Expressed exclusively as 6px or 8px solid category dots inside neutral pill capsules:
  - Lecture: Blue (`#3b82f6`)
  - Reading / Theory: Indigo (`#6366f1`)
  - Coding Drill: Amber (`#f59e0b`)
  - Milestone Project: Emerald (`#10b981`)
  - Exit Gatekeeper / Exam: Rose (`#ef4444`)

## Typography

The typography scale enforces distinct functional roles across the UI:
- **Display (`1.75rem / 28px`):** Main page headers, tracking -0.025em.
- **Headline (`1.25rem / 20px`):** Section titles and dialog headers.
- **Title (`1.125rem / 18px`):** Card titles and column headers.
- **Body (`0.875rem / 14px`):** Primary reading, descriptions, form inputs.
- **Label (`0.75rem / 12px`):** Secondary metadata, button labels, tabs.
- **Caption (`0.6875rem / 11px`):** Status descriptions, timestamps, sprint tags.
- **Micro (`0.625rem / 10px`):** Monospace task codes (`w01_t02`), category badge text, timecodes.
- **Tabular Figures:** `font-variant-numeric: tabular-nums` across all timers, statistics, and counters.

## Layout

- **Bento Overview:** Responsive modular grid with generous whitespace and clear visual rhythm.
- **Kanban Board:** Multi-column view with bounded drag lanes, sticky headers, and smooth column scrolling.
- **Slide-Over Drawers:** Right-docked task inspection drawer with backdrop scrim and hardware-accelerated spring entrance.
- **Responsive Navigation:** Collapsible sidebar navigation collapsing gracefully to a bottom bar or menu on mobile viewports.

## Elevation & Depth

- **Single Elevation Hierarchy:** Never combine thick borders with heavy multi-layer drop shadows. Elevation is stated cleanly:
  - Default cards: 1px hairline border + subtle micro-shadow (`0 1px 2px rgba(0, 0, 0, 0.04)`).
  - Hover / Dragged items: `scale(0.98)` on click, floating shadow (`0 12px 24px -4px rgba(0, 0, 0, 0.12)`).
  - Floating Drawers: Clean backdrop blur (`backdrop-blur-md`) with soft directional drop shadow.

## Shapes

- **Card Radii:** Bounded between 10px and 14px (`rounded-xl`).
- **Control Radii:** 6px to 8px (`rounded-md` / `rounded-lg`) for buttons and form inputs.
- **Status Capsules:** Full pill capsules (`rounded-full`) reserved strictly for status badges and tags.

## Components

- **Task Cards:** Crisp, scannable cards featuring title, estimated hours, difficulty rating, and category pill.
- **Progress Trackers:** Compact linear meters with smooth transitions and tabular percentage readouts.
- **Exit Gatekeeper Banners:** High-contrast verified seals with direct sign-off actions and immutable audit attestations.
- **Sonner Toast Stack:** Clean zero-shift notifications rendered on the top/bottom edge with high-contrast icon indicators.

## Do's and Don'ts

### Do's
- Use tabular numbers for all timers, counts, and statistical counters.
- Provide `:active` tactile feedback (`scale(0.97)` or `scale(0.98)`) on buttons and cards.
- Keep animation durations under 250ms with natural decelerating easing (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Ensure body text maintains at least 4.5:1 contrast in both light and dark themes.

### Don'ts
- Never use multi-stop violet/cyan/fuchsia text gradients.
- Never use colored neon box-shadow halos around chips or buttons.
- Never nest cards inside cards.
- Never use decorative background grid lines or artificial scanner lines on content surfaces.
