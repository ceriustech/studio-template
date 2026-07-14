---

description: "Task list template for feature implementation"
---

# Tasks: Call To Action section

**Input**: Design documents from `/specs/COT-008-call-to-action-section/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested in the feature specification — no test tasks are included. Validation is manual visual/interaction QA via [quickstart.md](./quickstart.md).

**Organization**: This feature has a single user story (P1) — a static section with no variations, so there is only one phase of implementation work.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) — paths follow the structure defined in [plan.md](./plan.md#source-code-repository-root):

```text
app/routes/pages/home/
├── index.tsx
└── components/Cta/
    ├── Cta.tsx
    ├── Cta.types.ts
    └── cta.css
```

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [X] T001 Create the `Cta` component directory at `app/routes/pages/home/components/Cta/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

No foundational tasks are required for this feature. The global design tokens (`--cream`, `--charcoal`, `--charcoal-soft`, `--warm-white`, `--muted`, `--serif`, `--sans`) and the shared `.sectionHeading` class already exist in `app/app.css` / `app/routes/pages/home/components/Intro/intro.css` and are reused as-is, per [research.md](./research.md). The `/booking` route already exists (`PAGE_ROUTES_DATA.BOOKING.path` in `app/routes/constants/index.ts`) and only needs to be referenced. Nothing blocks User Story 1.

**Checkpoint**: Foundation ready — User Story 1 implementation can begin immediately after Phase 1.

---

## Phase 3: User Story 1 - Visitor is prompted to book a consultation (Priority: P1) 🎯 MVP

**Goal**: Render a static Call To Action section on the home page, after Testimonial and before the footer, showing a heading, subtext, and a "Book a consultation" button over a background image with an overlay, matching the design screenshot exactly.

**Independent Test**: Load the home page, scroll to the final section before the footer, and confirm the heading, subtext, and button render centered over the background image/overlay, matching the design screenshot at desktop and mobile widths, and that selecting the button navigates to `/booking`.

### Implementation for User Story 1

- [X] T002 [P] [US1] Define `CtaProps` type in `app/routes/pages/home/components/Cta/Cta.types.ts` per [data-model.md](./data-model.md) (no per-instance content — an empty/no-op props type, since heading, subtext, button label, and destination are fixed values owned by the component)
- [X] T003 [P] [US1] Create `app/routes/pages/home/components/Cta/cta.css` translating the `.cta-block`, `.cta-bg`, `.cta-overlay`, `.cta-content`, `.cta-block .section-heading`, `.cta-block-sub`, `.cta-btn`, and `.cta-btn:hover` rules from the `<!-- CTA -->` block in `.specify/site-design/curated-home-mockup.html` into camelCase class names (`.cta`, `.ctaBg`, `.ctaOverlay`, `.ctaContent`, `.cta .sectionHeading`, `.ctaSub`, `.ctaBtn`), reusing the existing `--cream`/`--charcoal`/`--charcoal-soft`/`--warm-white`/`--muted`/`--serif`/`--sans` tokens from `app/app.css` and the shared `.sectionHeading` class
- [X] T004 [US1] Implement `Cta` component in `app/routes/pages/home/components/Cta/Cta.tsx` (depends on T002, T003): import `Link` from `react-router` and `PAGE_ROUTES_DATA` from `app/routes/constants`; render `<section className="cta">` containing a `.ctaBg` background layer, a `.ctaOverlay` layer, and a `.ctaContent` wrapper with `<h2 className="sectionHeading">Ready to transform your space?</h2>`, `<p className="ctaSub">Your complimentary 30-minute consultation starts here</p>`, and `<Link to={PAGE_ROUTES_DATA.BOOKING.path} className="ctaBtn">Book a consultation</Link>`
- [X] T005 [US1] Wire the section into `app/routes/pages/home/index.tsx`: import `Cta` and render `<Cta />` immediately after `<Testimonial />` (depends on T004)
- [X] T006 [US1] Add mobile-first reflow styles in `cta.css` (depends on T003): scale `.cta`/`.ctaBlock` padding down at the 768px, 480px, and 360px breakpoints and reduce `.ctaBtn` padding/font-size at 480px, matching the mockup's `.cta-block`/`.cta-btn` media queries, while keeping the button at a minimum 44×44px tap target, per spec FR-007

**Checkpoint**: At this point, the Call To Action section is fully functional, wired into the home page, and independently testable end-to-end.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec and constitution

- [ ] T007 Run [quickstart.md](./quickstart.md) validation: desktop screenshot match, button navigation to `/booking`, hover/focus state, mobile viewport legibility, and slow-loading background image legibility
- [ ] T008 [P] Confirm no dash-case CSS class names remain in `cta.css` (FR-008), no `any` / `@ts-ignore` was introduced in `Cta.tsx` or `Cta.types.ts` (constitution TypeScript-strict check), and the booking link uses `PAGE_ROUTES_DATA.BOOKING.path` rather than a hardcoded `/booking` string

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: No tasks — nothing blocks Phase 3
- **User Story 1 (Phase 3)**: Depends on Phase 1 (T001). T002 and T003 can run in parallel; T004 depends on both; T005 depends on T004; T006 depends on T003
- **Polish (Phase 4)**: Depends on Phase 3 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependency on other stories (this feature has only one story)

### Parallel Opportunities

- T002 and T003 can run in parallel (different files: `Cta.types.ts` vs `cta.css`)
- T008 can run in parallel with T007 (different concerns: manual QA vs. code-style check)

---

## Parallel Example: User Story 1

```bash
# Launch T002 and T003 together — different files, no shared dependency:
Task: "Define CtaProps type in app/routes/pages/home/components/Cta/Cta.types.ts"
Task: "Create app/routes/pages/home/components/Cta/cta.css with camelCase class names"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Skip Phase 2: no foundational work required
3. Complete Phase 3: User Story 1 (T002–T006)
4. **STOP and VALIDATE**: Confirm the section matches the design screenshot exactly and the button navigates to `/booking`
5. Deploy/demo if ready — this is the entire feature; there is no further increment

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP and full feature)
3. Run Phase 4 Polish → Final validation against spec and constitution

---

## Notes

- Single user story: US1 is both the MVP and the complete feature — there is no P2/P3 to layer on
- [P] tasks touch different files with no shared dependency
- Commit after each task or logical group
- Content (heading, subtext, button label) is fixed, hardcoded copy per spec Assumptions and plan.md Content Layer Decisions — no Sanity schema or query in this pass
