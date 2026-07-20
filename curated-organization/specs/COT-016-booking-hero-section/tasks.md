---

description: "Task list template for feature implementation"
---

# Tasks: Booking Hero section

**Input**: Design documents from `/specs/COT-016-booking-hero-section/`

**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Not requested in the feature specification — no automated test tasks are included. Validation is manual, via quickstart.md.

**Organization**: This feature has a single user story (P1), so all implementation tasks live in one phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) per plan.md — all paths are relative to `app/routes/pages/booking/`.

---

## Phase 1: Setup

**Purpose**: Clear the way for the `components/hero/` placement decided in plan.md by removing the mismatched pre-existing empty stubs.

- [X] T001 Delete the empty pre-existing stub files that don't match the chosen structure: `app/routes/pages/booking/hero/index.tsx`, `app/routes/pages/booking/booking.types.ts`, `app/routes/pages/booking/utils.ts` (all currently empty; superseded by `app/routes/pages/booking/components/hero/`, and the route needs no route-level types/utils for this feature)

**Checkpoint**: `app/routes/pages/booking/` contains only `index.tsx`, ready for the new `components/hero/` folder.

---

## Phase 2: Foundational

**Purpose**: Blocking prerequisites for all user stories.

No foundational infrastructure is needed — this feature has exactly one user story, no shared/generic components, no Sanity schema or query, and no Cloudinary usage (per plan.md Constitution Check). Proceed directly to Phase 3 after Phase 1.

---

## Phase 3: User Story 1 - Visitor immediately understands the Booking page's purpose (Priority: P1) 🎯 MVP

**Goal**: Render a centered Hero section at the top of the Booking page with an eyebrow label, headline, supporting paragraph, and two decorative circular shapes, matching the design screenshot exactly.

**Independent Test**: Load `/booking` and verify the "BOOK A CONSULTATION" eyebrow, "Let's transform your space" headline, and supporting paragraph render centered at the top of the page, with the two decorative circles visible, matching the design screenshot.

### Implementation for User Story 1

- [X] T002 [P] [US1] Create `app/routes/pages/booking/components/hero/hero.css` with camelCase class names (`.bookingHero`, `.sectionEyebrow`) ported from the `.book-hero` rule set in `.specify/site-design/curated-book-mockup.html` (lines 153–203): centered text, `--cream` background, `overflow: hidden`, the two `::before`/`::after` decorative circles (top-left and bottom-right per the mockup's `.book-hero::before`/`::after`), eyebrow/heading/paragraph typography using `--serif`/`--sans`/`--charcoal`/`--muted`/`--taupe` tokens, and responsive overrides at `max-width: 768px` and `max-width: 480px` mirroring the structure of `app/routes/pages/gallery/components/hero/hero.css`
- [X] T003 [P] [US1] Create `app/routes/pages/booking/components/hero/index.tsx` exporting a prop-less `Hero` function component that imports `./hero.css` and renders `<section className="bookingHero">` containing `<p className="sectionEyebrow">Book a consultation</p>`, `<h1>Let's transform your space</h1>`, and `<p>Your complimentary 30-minute consultation starts here. Choose your path below.</p>`, matching the markup shape of `app/routes/pages/gallery/components/hero/index.tsx`
- [X] T004 [US1] Update `app/routes/pages/booking/index.tsx` to import `Hero` from `./components/hero` and render it as the first element inside the route's `<main>`/root return (depends on T003)

**Checkpoint**: `/booking` renders the Hero section as the first element of the page; content, centering, decorative shapes, and camelCase styling all match the mockup and design screenshot.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final verification against the spec's success criteria.

- [ ] T005 Run `quickstart.md` validation steps 1–6 against `/booking` at desktop (≥1280px), tablet (~768px), and mobile (~375px) widths, comparing side-by-side with the design screenshot (SC-001, SC-002)
- [X] T006 Run `npm run typecheck` and lint to confirm no TypeScript or lint errors were introduced (typecheck passes cleanly; no lint script/config exists in this project)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: N/A for this feature — no blocking work
- **User Story 1 (Phase 3)**: Depends on Phase 1 (stub files removed) — T002 and T003 can run in parallel; T004 depends on T003
- **Polish (Phase 4)**: Depends on Phase 3 completion

### Parallel Opportunities

- T002 (`hero.css`) and T003 (`index.tsx`) touch different files and can be done in parallel, though T003's `className` values must match the class names T002 defines
- T005 and T006 in Polish can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch both new-file tasks for User Story 1 together:
Task: "Create app/routes/pages/booking/components/hero/hero.css with camelCase classes ported from the mockup"
Task: "Create app/routes/pages/booking/components/hero/index.tsx rendering the Hero markup"
```

---

## Implementation Strategy

### MVP First (and Only) Scope

1. Complete Phase 1: Setup (remove stale stubs)
2. Complete Phase 3: User Story 1 (the entire feature — there is only one story)
3. Complete Phase 4: Polish (visual/responsive validation + typecheck/lint)
4. **STOP and VALIDATE**: Compare `/booking` against the design screenshot at desktop, tablet, and mobile widths

This feature has no Phase 2 Foundational work and no additional user stories — Phase 3 alone is both the MVP and the complete feature.

---

## Notes

- [P] tasks = different files, no dependencies
- [US1] label maps every implementation task to the feature's single user story
- Commit after each task or logical group
- Avoid: vague tasks, same-file conflicts
