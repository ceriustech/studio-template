---

description: "Task list template for feature implementation"
---

# Tasks: Services Hero section

**Input**: Design documents from `/specs/COT-010-services-hero-section/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested in the feature specification — no test tasks are included. Validation is manual visual QA via [quickstart.md](./quickstart.md).

**Organization**: This feature has a single user story (P1) — a static section with no variations, so there is only one phase of implementation work.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) — paths follow the structure defined in [plan.md](./plan.md#source-code-repository-root):

```text
app/routes/pages/services/
├── index.tsx
└── components/hero/
    ├── index.tsx
    └── hero.css
```

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

No setup tasks are required. The `hero/` component directory and its placeholder `index.tsx` already exist at `app/routes/pages/services/components/hero/`, and `app/routes/pages/services/index.tsx` already imports and renders `<Hero />` as the first element.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

No foundational tasks are required for this feature. The global design tokens (`--cream`, `--charcoal`, `--taupe`, `--serif`, `--sans`) already exist in `app/app.css` and are reused as-is, per [research.md](./research.md). Nothing blocks User Story 1.

**Checkpoint**: Foundation ready — User Story 1 implementation can begin immediately.

---

## Phase 3: User Story 1 - Visitor immediately understands the Services page's purpose (Priority: P1) 🎯 MVP

**Goal**: Render a static Hero section as the first element of the Services page, showing a centered eyebrow label, headline, and supporting paragraph over a cream background with two clipped decorative circles, matching the design screenshot exactly.

**Independent Test**: Load the Services page and confirm the eyebrow ("THE SERVICES"), headline ("Bespoke solutions, gracefully executed"), and supporting paragraph render centered at the top of the page, with the two decorative circles visible and clipped to the section bounds, matching the design screenshot at desktop, tablet, and mobile widths.

### Implementation for User Story 1

- [X] T001 [P] [US1] Create `app/routes/pages/services/components/hero/hero.css` translating the `.services-hero`, `.services-hero::before`, `.services-hero::after`, `.services-hero .section-eyebrow` (combined with the generic `.section-eyebrow` rule), `.services-hero h1`, and `.services-hero p` rules from the `<!-- HERO -->` block in `.specify/site-design/curated-services-mockup.html` into camelCase class names (`.servicesHero`, `.servicesHero::before`, `.servicesHero::after`, `.sectionEyebrow`, `.servicesHero h1`, `.servicesHero p`), reusing the existing `--cream`/`--charcoal`/`--taupe`/`--serif`/`--sans` tokens from `app/app.css` (eyebrow: `font-family: var(--sans)`, `font-size: 10px`, `letter-spacing: 0.2em`, `text-transform: uppercase`, `color: var(--taupe)`, `margin-bottom: 16px`)
- [X] T002 [US1] Implement the `Hero` component in `app/routes/pages/services/components/hero/index.tsx` (depends on T001): import `./hero.css`; render `<section className="servicesHero">` containing `<p className="sectionEyebrow">The services</p>`, `<h1>Bespoke solutions, gracefully executed</h1>`, and `<p>Our all-inclusive organizing services are tailored to your lifestyle, your space, and your goals. Every project begins with listening.</p>`; the two decorative circles are drawn purely via the `::before`/`::after` CSS from T001 (no extra DOM elements needed), matching [data-model.md](./data-model.md)'s fixed content
- [X] T003 [US1] Add responsive scaling in `hero.css` (depends on T001): reduce section padding and headline font size at 768px and 480px breakpoints, reusing the exact breakpoints already established by sibling sections (`Intro`, `Footer`, `Testimonial`), matching spec Edge Cases

**Checkpoint**: At this point, the Hero section is fully functional, already wired into the Services page, and independently testable end-to-end.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec and constitution

- [ ] T004 Run [quickstart.md](./quickstart.md) validation: desktop screenshot match, tablet/mobile reflow, headline wrap, and decorative-shape clipping
- [ ] T005 [P] Confirm no dash-case CSS class names remain in `hero.css` (FR-006) and no `any` / `@ts-ignore` was introduced in `index.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No tasks — nothing blocks Phase 3
- **Foundational (Phase 2)**: No tasks — nothing blocks Phase 3
- **User Story 1 (Phase 3)**: T001 has no dependencies; T002 depends on T001; T003 depends on T001
- **Polish (Phase 4)**: Depends on Phase 3 completion

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories (this feature has only one story)

### Parallel Opportunities

- T001 has no dependencies and can start immediately
- T005 can run in parallel with T004 (different concerns: manual QA vs. code-style check)

---

## Parallel Example: User Story 1

```bash
# T001 has no dependency and can start immediately; T002 and T003 both depend on it
# and can be worked on once T001 lands, but touch the same file (index.tsx vs hero.css
# already split) so only T003 can trail T001 in parallel with T002 review:
Task: "Create app/routes/pages/services/components/hero/hero.css with camelCase class names"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Skip Phase 1 and Phase 2: no setup or foundational work required
2. Complete Phase 3: User Story 1 (T001–T003)
3. **STOP and VALIDATE**: Confirm the section matches the design screenshot exactly at all breakpoints
4. Deploy/demo if ready — this is the entire feature; there is no further increment

### Incremental Delivery

1. Add User Story 1 → Test independently → Deploy/Demo (MVP and full feature)
2. Run Phase 4 Polish → Final validation against spec and constitution

---

## Notes

- Single user story: US1 is both the MVP and the complete feature — there is no P2/P3 to layer on
- [P] tasks touch different files with no shared dependency
- Commit after each task or logical group
- Content (eyebrow, headline, paragraph) is fixed, hardcoded copy per spec Assumptions and plan.md Content Layer Decisions — no Sanity schema or query in this pass
- No `.types.ts` file for this component — it takes no props, matching the precedent already set by the merged home-page `hero` component, per [research.md](./research.md)
