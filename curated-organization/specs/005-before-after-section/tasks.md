# Tasks: Implement Before and After Section

**Input**: Design documents from `/specs/005-before-after-section/`

**Prerequisites**: spec.md (required) is present. plan.md is not available in the feature directory, so tasks are generated directly from the feature specification and current component structure.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing home intro component structure and the source markup for the before/after section.

- [ ] T001 Review `app/routes/pages/home/components/Intro/Intro.tsx` and `app/routes/pages/home/components/Intro/intro.css`, and inspect `.specify/site-design/curated-home-mockup.html` for the `<!-- BEFORE / AFTER -->` markup.
- [ ] T002 Identify the exact class names, layout structure, and breakpoint rules required by the mockup for the before/after section.
- [ ] T003 [P] Define the CSS class naming plan in `app/routes/pages/home/components/Intro/intro.css`, using camelCase tokens that match the section design.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the base styles and layout structure needed before injecting the section markup.

- [ ] T004 Add base before/after section styles in `app/routes/pages/home/components/Intro/intro.css` for the section container, centered header, comparison grid, image cards, tags, captions, and neutral placeholder layout.
- [ ] T005 Add responsive rules in `app/routes/pages/home/components/Intro/intro.css` that follow the mockup breakpoints at 768px, 480px, and 360px.
- [ ] T006 Add placeholder styling in `app/routes/pages/home/components/Intro/intro.css` for missing before/after images to preserve the comparison layout.

---

## Phase 3: User Story 1 - Add Before / After section (Priority: P1) 🎯 MVP

**Goal**: Render a home page before/after comparison section that matches the design mockup and behaves correctly at responsive breakpoints.

**Independent Test**: The home page renders a centered before/after section with a fixed-width header, 2.5rem bottom margin, side-by-side panels on desktop, stacked panels on mobile, and a neutral placeholder if an image is missing.

- [ ] T007 [US1] Update `app/routes/pages/home/components/Intro/Intro.tsx` to insert the before/after section markup from `.specify/site-design/curated-home-mockup.html`, including the centered header and comparison pair.
- [ ] T008 [US1] Add meaningful `alt` text for the before and after images and ensure semantic heading order in `app/routes/pages/home/components/Intro/Intro.tsx`.
- [ ] T009 [US1] Ensure the section header block in `app/routes/pages/home/components/Intro/intro.css` is centered, constrained in width, and has `2.5rem` of bottom margin.
- [ ] T010 [US1] Implement the stacked panel layout at narrow widths in `app/routes/pages/home/components/Intro/intro.css` using the mockup's breakpoint rules.
- [ ] T011 [US1] Verify the neutral placeholder panel appears when a before or after image source is unavailable and that the layout remains intact.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Validate visual fidelity, confirm acceptance criteria, and document any implementation details.

- [ ] T012 [P] [US1] Perform a visual comparison of the rendered section against the provided design screenshot and adjust spacing, typography, or image alignment in `app/routes/pages/home/components/Intro/intro.css`.
- [ ] T013 [P] [US1] Validate the implementation against the acceptance criteria in `specs/005-before-after-section/spec.md`, including fallback behavior and responsive breakpoints.
- [x] T014 [P] Document the source of the responsive breakpoint rules and the before/after markup reference in `specs/005-before-after-section/spec.md` or a short comment in `app/routes/pages/home/components/Intro/intro.css`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: can start immediately.
- **Phase 2**: depends on Phase 1 completion.
- **Phase 3**: depends on Phase 2 completion.
- **Phase 4**: depends on Phase 3 completion.

### Story Dependencies

- **User Story 1 (P1)**: depends on foundational styles and breakpoint definitions.
- **Phase 4**: depends on User Story 1 implementation.

### Parallel Opportunities

- Tasks T003, T012, T013, and T014 can run in parallel with other tasks when they do not depend on the exact finished markup.
- Phase 3 implementation tasks should generally follow the order of markup first, then accessibility and responsive verification.

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: review current files and mockup source.
2. Complete Phase 2: define the before/after CSS structure and breakpoint behavior.
3. Complete Phase 3: insert the section markup and validate the experience.
4. Complete Phase 4: polish the final visual match and document implementation details.
