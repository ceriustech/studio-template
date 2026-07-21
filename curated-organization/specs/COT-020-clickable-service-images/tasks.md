---

description: "Task list template for feature implementation"
---

# Tasks: Clickable Service Images on Home Page

**Input**: Design documents from `/specs/COT-020-clickable-service-images/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested in the feature specification — no test tasks are included. Validation is manual via [quickstart.md](./quickstart.md).

**Organization**: This feature has a single user story (P1) — a small behavior addition to an existing component, so there is only one phase of implementation work.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) — paths follow the structure defined in [plan.md](./plan.md#source-code-repository-root):

```text
app/routes/pages/home/components/Services/
├── Services.tsx
├── ServiceCard.tsx
├── Services.types.ts
└── services.css
```

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

No setup tasks are required. `ServiceCard.tsx`, `Services.tsx`, `Services.types.ts`, and `services.css` already exist and are consumed only by the home page — this feature modifies them in place, per [plan.md](./plan.md#component-design-decisions).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

No foundational tasks are required for this feature. `react-router`'s `Link` component is already a project dependency and an established pattern (`Intro.tsx`, `BeforeAfter.tsx`), and the `/services` destination already exists as a route. Nothing blocks User Story 1.

**Checkpoint**: Foundation ready — User Story 1 implementation can begin immediately.

---

## Phase 3: User Story 1 - Click a service image to view all services (Priority: P1) 🎯 MVP

**Goal**: Each of the three service images in the home page's "Personalized services" section navigates to the Services page (`/services`) when clicked or activated via keyboard, without altering the section's visual appearance.

**Independent Test**: Load the home page, click each of the three service images in turn, and confirm the browser navigates to the Services page each time; separately, tab to each image with the keyboard and press Enter to confirm the same navigation occurs.

### Implementation for User Story 1

- [X] T001 [US1] In `app/routes/pages/home/components/Services/ServiceCard.tsx`, import `Link` from `react-router` and wrap the existing `serviceCardImg` element in `<Link to="/services" className="serviceCardImgLink" aria-label={\`View all services — ${title}\`}>`, keeping the inner `div.serviceCardImg` (with its `backgroundImage` style and existing `role="img"`/`aria-label={altText}` pair) unchanged inside the `Link`, per the accessible-name decision in [research.md](./research.md)
- [X] T002 [P] [US1] Add `.serviceCardImgLink` rules to `app/routes/pages/home/components/Services/services.css` (depends on T001's class name): `display: block` (so the link fills the existing `.serviceCardImg` area with no added inline-level whitespace) and a `:focus-visible` state matching the project's established pattern (`outline: 2px solid var(--brand-teal); outline-offset: 2px; border-radius: 2px;`, as used in `intro.css`'s `.textLink:focus-visible`), so the image link is clearly visible when reached by keyboard (FR-003, FR-004)
- [X] T003 [US1] Verify in the browser that the `.serviceCard:hover` elevation/shadow transition in `services.css` still triggers correctly when hovering over the now-linked image area (depends on T001, T002) — no code change expected if `.serviceCardImgLink` is `display: block` with no added margin/padding, confirm only (FR-005, SC-003)

**Checkpoint**: At this point, all three service images are clickable/keyboard-operable links to the Services page, and the section's visual appearance is unchanged — fully functional and independently testable end-to-end.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec and constitution

- [X] T004 Run [quickstart.md](./quickstart.md) validation: all 5 scenarios (image clicks, existing text link unaffected, keyboard pass, screen reader pass, visual regression check)
- [X] T005 [P] Run `npm run typecheck` from the repository root and confirm no new TypeScript errors were introduced in `ServiceCard.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No tasks — nothing blocks Phase 3
- **Foundational (Phase 2)**: No tasks — nothing blocks Phase 3
- **User Story 1 (Phase 3)**: T001 has no dependencies; T002 depends on T001 (references the `serviceCardImgLink` class it introduces); T003 depends on T001 and T002 (visual verification of the finished markup + styles)
- **Polish (Phase 4)**: Depends on Phase 3 completion

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories (this feature has only one story)

### Parallel Opportunities

- T002 touches a different file than T001 (`services.css` vs. `ServiceCard.tsx`) and can be drafted in parallel, though it depends on the class name T001 introduces landing first for the selector to have effect
- T005 can run in parallel with T004 (typecheck vs. manual QA — different concerns)

---

## Parallel Example: User Story 1

```bash
# T001 must land first to introduce the serviceCardImgLink class; T002 can then
# proceed independently in services.css while T003 waits on both:
Task: "Wrap serviceCardImg in a react-router Link in app/routes/pages/home/components/Services/ServiceCard.tsx"
Task: "Add .serviceCardImgLink display/focus-visible rules in app/routes/pages/home/components/Services/services.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Skip Phase 1 and Phase 2: no setup or foundational work required
2. Complete Phase 3: User Story 1 (T001–T003)
3. **STOP and VALIDATE**: Confirm all three images navigate to the Services page and the section looks unchanged
4. Deploy/demo if ready — this is the entire feature; there is no further increment

### Incremental Delivery

1. Add User Story 1 → Test independently → Deploy/Demo (MVP and full feature)
2. Run Phase 4 Polish → Final validation against spec and constitution

---

## Notes

- Single user story: US1 is both the MVP and the complete feature — there is no P2/P3 to layer on
- [P] tasks touch different files with no shared dependency
- Commit after each task or logical group
- No new props are added to `ServiceCardProps` — the destination is a fixed `/services` string, not per-card data, per [data-model.md](./data-model.md)
- The existing "View all services →" text link in `Services.tsx` is untouched by this feature (FR-006) — verified, not modified, in T004
