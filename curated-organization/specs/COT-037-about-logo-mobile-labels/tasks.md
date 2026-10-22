---

description: "Task list for COT-037: Hide About Section Logo Labels on Mobile"
---

# Tasks: Hide About Section Logo Labels on Mobile

**Input**: Design documents from `/specs/COT-037-about-logo-mobile-labels/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested for this feature, and this repo has no automated test suite. Verification is manual, following [quickstart.md](./quickstart.md), plus `npm run typecheck`.

**Organization**: Tasks are grouped by user story. This feature has a single story (US1).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app at `app/` (see [plan.md](./plan.md), Project Structure). The only source file touched is `app/routes/pages/services/components/about/about.css`. No markup, types, Sanity schema, or query changes.

---

## Phase 1: Setup

**Purpose**: Confirm the target selectors and media query exist as the plan assumes before editing.

- [X] T001 Confirm that `app/routes/pages/services/components/about/about.css` contains the `.aboutLogoLabel` rule and the `/* Responsive: Mobile (480px and below) */` `@media (max-width: 480px)` block at the end of the file, and that `.aboutLogoLabel` doesn't appear in any other stylesheet under `app/` (so the change can't leak to other sections, per FR-006)

**Checkpoint**: Selectors confirmed. There is no foundational phase, because no shared infrastructure, types, or content are involved.

---

## Phase 2: User Story 1 - Uncluttered credential logos on mobile (Priority: P1) 🎯 MVP

**Goal**: At viewports 480px and below, the Services page "About Curated" section shows only the credential logo images, with no labels and no leftover gap. At widths above 480px, labels show exactly as they do today.

**Independent Test**: Open `/services` at 375px and confirm no labels are visible and both logos sit side by side under the signature. Then widen to 481px or more and confirm the labels reappear ([quickstart.md](./quickstart.md) scenarios 1–6).

### Implementation for User Story 1

- [X] T002 [US1] In `app/routes/pages/services/components/about/about.css`, inside the existing `@media (max-width: 480px)` block at the end of the file, add a `.aboutLogoLabel { display: none; }` rule. Use tab indentation to match the file. Don't change the base `.aboutLogoLabel` rule, the `768px` block, `index.tsx`, or `About.types.ts` (see [research.md](./research.md) R1 and R2 for why it's 480px and `display: none`)
- [X] T003 [US1] Visually check logo alignment at 375px on `/services` ([research.md](./research.md) R4). If both logos look clearly misaligned once labels are hidden, add `.aboutLogos { align-items: center; }` inside the same `@media (max-width: 480px)` block in `app/routes/pages/services/components/about/about.css`. Otherwise make no change
- [X] T004 [US1] Manually verify [quickstart.md](./quickstart.md) scenarios 1–6 on `/services`: labels hidden at 375px and 480px, visible at 481px, 768px, and 1280px with unchanged styling, and they hide and reappear live while resizing without a reload

**Checkpoint**: User Story 1 is complete. This is the full scope of the ticket.

---

## Phase 3: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, regression checks, and the review gate.

- [X] T005 [P] At 375px on `/services`, inspect each `.aboutLogoItem img` in DevTools and confirm it has a non-empty, descriptive `alt` attribute ([quickstart.md](./quickstart.md) scenario 7, FR-005)
- [X] T006 [P] At 375px, confirm the other Services sections (hero, offerings, pricing) look unchanged from `main` ([quickstart.md](./quickstart.md) scenario 8, FR-006)
- [X] T007 Run `npm run typecheck` and confirm it passes. Then run `git diff --stat` and confirm `app/routes/pages/services/components/about/about.css` is the only changed file under `app/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. Start immediately.
- **User Story 1 (Phase 2)**: Depends on T001.
- **Polish (Phase 3)**: Depends on T002–T004.

### Within User Story 1

- T002 → T003 (the alignment check needs labels hidden first) → T004 (verify the final CSS)

### Parallel Opportunities

- T005 and T006 are read-only checks of different parts of the page, so they can run in parallel after T004.
- T002 and T003 edit the same file in sequence, so they can't run in parallel.

## Parallel Example: Polish

```text
Task: "T005 Inspect badge <img> alt attributes at 375px on /services"
Task: "T006 Confirm hero, offerings, and pricing sections are unchanged at 375px"
```

## Implementation Strategy

### MVP (User Story 1 only)

1. T001: confirm the selectors.
2. T002: add the one-line rule. This alone meets the ticket's acceptance criterion.
3. T003 and T004: alignment check and visual verification.
4. **Stop and validate**: run the full [quickstart.md](./quickstart.md).
5. T005–T007: accessibility, regression, and typecheck gate before opening the PR.

The MVP is the whole feature, so there's no incremental delivery beyond this.

## Notes

- Commit with Conventional Commits, e.g. `style: hide about logo labels on mobile (COT-037)`.
- Don't comment out the base `.aboutLogoLabel` rule or add dead CSS (constitution, Development Workflow: "No dead code").
