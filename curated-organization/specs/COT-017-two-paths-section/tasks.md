---

description: "Task list template for feature implementation"
---

# Tasks: Two Paths section

**Input**: Design documents from `/specs/COT-017-two-paths-section/`

**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Not requested in the feature specification — no automated test tasks are included. Validation is manual, via quickstart.md.

**Organization**: This feature has two user stories (US1: "Get started" card, P1; US2: "Book again" card, P2). Both cards are rendered by the same reusable `PathCard` sub-component, so that component and its shared section styling are built once as Foundational work; each story then adds its own card to the section.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) per plan.md — all paths are relative to `app/routes/pages/booking/`.

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure.

No setup tasks required — the `/booking` route, `index.tsx`, and sibling `components/hero/` already exist from COT-016; this feature only adds a new `components/two-paths/` folder.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the reusable `PathCard` sub-component and the section's shared grid/divider styling that BOTH user stories depend on, before either card can render.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T001 [P] Create `app/routes/pages/booking/components/two-paths/components/PathCard/PathCard.types.ts` exporting a `PathCardProps` interface: `icon: string`, `title: string`, `description: string`, `ctaLabel: string`, `ctaHref: string`, `variant: 'primary' | 'secondary'`
- [ ] T002 [P] Create `app/routes/pages/booking/components/two-paths/components/PathCard/pathCard.css` with camelCase class names (`.pathCard`, `.pathCard:hover`, `.pathIcon`, `.pathCard:hover .pathIcon`, `.pathTitle`, `.pathDesc`, `.pathBtn`, `.pathBtnPrimary`, `.pathBtnPrimary:hover`, `.pathBtnSecondary`, `.pathBtnSecondary:hover`) ported from the `.path-card`, `.path-card:hover`, `.path-icon`, `.path-title`, `.path-desc`, `.path-btn*` rules in `.specify/site-design/curated-book-mockup.html` (lines 211–219, 227–293) — card padding/flex/centering/transition, icon circle, serif title, description text, and solid/outlined button variants with their hover states
- [ ] T003 [P] Create `app/routes/pages/booking/components/two-paths/two-paths.css` with camelCase class names (`.twoPaths`, `.twoPaths .pathCard:first-child`, `.twoPaths .pathCard:last-child`) ported from the `.paths`, `.path-card:first-child`, `.path-card:last-child` rules in `.specify/site-design/curated-book-mockup.html` (lines 206–226): two-column grid, `border-bottom`, left card `border-right` + `--warm-white` background, right card `--warm-bg` background (the vertical divider between cards), plus a `@media (max-width: 768px)` override collapsing the grid to a single column, matching the breakpoint pattern in `app/routes/pages/booking/components/hero/hero.css`
- [ ] T004 [US1][US2] Create `app/routes/pages/booking/components/two-paths/components/PathCard/PathCard.tsx` exporting a typed `PathCard` function component that accepts `PathCardProps`, imports `./pathCard.css`, and renders `<div className="pathCard">` containing a `<div className="pathIcon">{icon}</div>`, `<div className="pathTitle">{title}</div>`, `<p className="pathDesc">{description}</p>`, and an `<a href={ctaHref} className={variant === 'primary' ? 'pathBtn pathBtnPrimary' : 'pathBtn pathBtnSecondary'}>{ctaLabel}</a>` (depends on T001, T002)

**Checkpoint**: `PathCard` is a fully reusable, typed component and `two-paths.css` defines the shared grid/divider chrome — both user stories can now proceed independently.

---

## Phase 3: User Story 1 - New client starts the intake questionnaire (Priority: P1) 🎯 MVP

**Goal**: Render the "Get started" card in the Two Paths section, with its icon, heading, description, and a solid "Start questionnaire" button linking to `#questionnaire`.

**Independent Test**: Load `/booking` and verify a card renders below the Hero with a "+" icon, the heading "Get started," the description "New to Curated? Tell us about your space and goals, then pick a time to meet. Takes about 3 minutes.," and a solid dark "Start questionnaire" button that links to `#questionnaire`.

### Implementation for User Story 1

- [ ] T005 [US1] Create `app/routes/pages/booking/components/two-paths/index.tsx` exporting a prop-less `TwoPaths` function component that imports `./two-paths.css`, `PathCard` from `./components/PathCard/PathCard`, and `PathCardProps` from `./components/PathCard/PathCard.types`; define a local `cards: PathCardProps[]` array containing exactly one entry so far — `{ icon: '+', title: 'Get started', description: 'New to Curated? Tell us about your space and goals, then pick a time to meet. Takes about 3 minutes.', ctaLabel: 'Start questionnaire', ctaHref: '#questionnaire', variant: 'primary' }` — and render `<div className="twoPaths">{cards.map((card) => <PathCard key={card.title} {...card} />)}</div>` (depends on T004)
- [ ] T006 [US1] Update `app/routes/pages/booking/index.tsx` to import `TwoPaths` from `./components/two-paths` and render it directly after `<Hero />` inside the route's `<main>` (depends on T005)

**Checkpoint**: `/booking` renders Hero followed by the "Get started" card, fully styled and functional on its own — this is the MVP slice.

---

## Phase 4: User Story 2 - Returning client books another session (Priority: P2)

**Goal**: Add the "Book again" card alongside "Get started," completing the two-card grid with its icon, heading, description, and an outlined "Schedule now" button linking to `#calendly`.

**Independent Test**: Load `/booking` and verify a second card renders to the right of "Get started" with a "↻" icon, the heading "Book again," the description "Welcome back. Skip the intake and go straight to scheduling your next session.," and an outlined "Schedule now" button that links to `#calendly`, separated from the first card by a single vertical divider.

### Implementation for User Story 2

- [ ] T007 [US2] Update the `cards` array in `app/routes/pages/booking/components/two-paths/index.tsx` to append the second entry — `{ icon: '↻', title: 'Book again', description: 'Welcome back. Skip the intake and go straight to scheduling your next session.', ctaLabel: 'Schedule now', ctaHref: '#calendly', variant: 'secondary' }` — completing the two-column grid (depends on T005/T006)

**Checkpoint**: Both cards render side by side with the divider and distinct backgrounds from `two-paths.css`, matching the full design screenshot.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification against the spec's success criteria.

- [ ] T008 Run `quickstart.md` validation steps 1–11 against `/booking` at desktop (≥1280px), tablet (~768px), and mobile (~375px) widths, including hover states, keyboard focus on both CTA buttons, and both link targets, comparing side-by-side with the design screenshot (SC-001, SC-002, SC-003)
- [ ] T009 Run `npm run typecheck` and lint to confirm no TypeScript or lint errors were introduced

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: N/A for this feature — no stale files to clear
- **Foundational (Phase 2)**: No dependencies — can start immediately. T001, T002, T003 can run in parallel; T004 depends on T001 and T002. BLOCKS both user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (needs `PathCard` and `two-paths.css`) — T005 depends on T004; T006 depends on T005
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion and on T005/T006 (extends the same `cards` array and file created in US1) — not independently deployable in parallel with US1 since they share one file, but independently testable/verifiable as its own increment once added
- **Polish (Phase 5)**: Depends on both user stories being complete

### Parallel Opportunities

- T001, T002, T003 (Foundational) touch different files and can run in parallel
- T008 and T009 in Polish can run in parallel

---

## Parallel Example: Foundational Phase

```bash
# Launch all independent-file Foundational tasks together:
Task: "Create PathCard.types.ts with PathCardProps"
Task: "Create pathCard.css with camelCase classes for the card, icon, title, description, and buttons"
Task: "Create two-paths.css with the grid, divider, and background rules"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (`PathCard` component + both stylesheets — CRITICAL, blocks both stories)
2. Complete Phase 3: User Story 1 (the "Get started" card, wired into `/booking`)
3. **STOP and VALIDATE**: Load `/booking` and confirm the "Get started" card matches its acceptance scenarios
4. Deploy/demo if ready — a single-card increment is a legitimate, independently valuable MVP

### Incremental Delivery

1. Complete Foundational → `PathCard` and shared styling ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (full two-card section, matches design screenshot exactly)
4. Complete Polish → Full cross-viewport and success-criteria validation

---

## Notes

- [P] tasks = different files, no dependencies
- [US1]/[US2] labels map tasks to their user story for traceability
- T004 (`PathCard.tsx`) is foundational because both stories render through it, but is still tagged for both stories since it's a direct prerequisite for each
- Commit after each task or logical group
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence beyond the shared `cards` array append in T007
