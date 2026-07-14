---

description: "Task list template for feature implementation"
---

# Tasks: Testimonial section

**Input**: Design documents from `/specs/COT-007-testimonial-section/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested in the feature specification — no test tasks are included. Validation is manual visual/interaction QA via [quickstart.md](./quickstart.md).

**Organization**: This feature has two user stories (P1, P2). Tasks are grouped under each; US2 builds directly on US1's static presentation, per spec.md.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) — paths follow the structure defined in [plan.md](./plan.md#source-code-repository-root):

```text
app/routes/pages/home/
├── index.tsx
└── components/Testimonial/
    ├── Testimonial.tsx
    ├── Testimonial.types.ts
    ├── useTestimonialCarousel.ts
    └── testimonial.css
```

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [X] T001 Create the `Testimonial` component directory at `app/routes/pages/home/components/Testimonial/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

No foundational tasks are required for this feature. The global design tokens (`--taupe`, `--taupe-light`, `--charcoal-soft`, `--serif`, `--sans` in `app/app.css`) already exist and are reused as-is, confirmed in [research.md](./research.md). Nothing blocks User Story 1.

**Checkpoint**: Foundation ready — User Story 1 implementation can begin immediately after Phase 1.

---

## Phase 3: User Story 1 - Visitor reads a client testimonial to build trust (Priority: P1) 🎯 MVP

**Goal**: Render a Testimonial section on the home page, after Process, showing a star rating, decorative quote mark, quote text, and client attribution for a single configured testimonial, with no navigation controls, matching the design screenshot exactly.

**Independent Test**: Load the home page with the placeholder array left at one entry, scroll to the Testimonial section, and confirm the star rating, quote mark, quote text, and attribution render centered and match the design screenshot at desktop and mobile widths, with no navigation controls visible.

### Implementation for User Story 1

- [X] T002 [P] [US1] Define `TestimonialItem` and `TestimonialProps` types in `app/routes/pages/home/components/Testimonial/Testimonial.types.ts` per [data-model.md](./data-model.md) (`quote`, `clientName`, `clientLocation`, `rating` fields)
- [X] T003 [P] [US1] Create `app/routes/pages/home/components/Testimonial/testimonial.css` translating the `.testimonial`, `.testimonial-stars`, `.testimonial-quote-mark`, `.testimonial-text`, and `.testimonial-attr` rules from the `<!-- TESTIMONIAL -->` block in `.specify/site-design/curated-home-mockup.html` into camelCase class names (`.testimonial`, `.testimonialStars`, `.testimonialQuoteMark`, `.testimonialText`, `.testimonialAttr`), reusing the existing `--taupe`, `--taupe-light`, `--charcoal-soft`, `--serif`, `--sans` tokens from `app/app.css`
- [X] T004 [US1] Implement `Testimonial` component in `app/routes/pages/home/components/Testimonial/Testimonial.tsx` (depends on T002, T003): define a placeholder `testimonials: TestimonialItem[]` array starting with one entry matching the mockup's copy ("Client testimonial will go here...", "— Client name, Arlington, VA", 5 stars); render `<section className="testimonial">` showing the first/active entry's star rating (visual stars plus a text-equivalent `aria-label`, e.g. "5 out of 5 stars"), a decorative quote mark (`aria-hidden="true"`), the quote text, and the "— Client name, Location" attribution line, centered; render no navigation controls at this stage
- [X] T005 [US1] Wire the section into `app/routes/pages/home/index.tsx`: import `Testimonial` and render `<Testimonial />` immediately after `<Process />` (depends on T004)
- [X] T006 [US1] Add mobile-first reflow styles in `testimonial.css` (depends on T003) so the star rating, quote mark, text, and attribution remain legible and centered at narrow viewport widths without overlapping or cut-off content, per spec FR-009

**Checkpoint**: At this point, the Testimonial section is fully functional for a single testimonial, wired into the home page, and independently testable end-to-end.

---

## Phase 4: User Story 2 - Visitor browses multiple client testimonials (Priority: P2)

**Goal**: Let visitors navigate forward and backward through any number of configured testimonials, with looping at both ends and navigation controls that only appear when more than one testimonial exists.

**Independent Test**: Expand the placeholder array to three or more entries, load the home page, and confirm the visitor can navigate forward and backward through all testimonials (with looping at the ends), each rendering the same layout as User Story 1 with no stale or overlapping content.

### Implementation for User Story 2

- [X] T007 [P] [US2] Implement `useTestimonialCarousel` hook in `app/routes/pages/home/components/Testimonial/useTestimonialCarousel.ts` per [data-model.md](./data-model.md) state transitions: accepts the testimonial count, returns the active index and `next()`/`previous()` handlers that wrap around at both bounds (`(index + 1) % length`, `(index - 1 + length) % length`)
- [X] T008 [US2] In `Testimonial.tsx` (depends on T004, T007): expand the placeholder `testimonials` array to 2–3 entries shaped per [data-model.md](./data-model.md) (`quote`, `clientName`, `clientLocation`, `rating`), integrate `useTestimonialCarousel` to track the active index, and render only the active entry's star rating, quote text, and attribution (fully replacing the previous entry's content on change, per FR-007)
- [X] T009 [US2] In `Testimonial.tsx` and `testimonial.css` (depends on T008): add previous/next navigation buttons, rendered only when `testimonials.length > 1` (per FR-004/FR-005), each with an explicit `aria-label` ("Previous testimonial" / "Next testimonial") and wired to the hook's `previous()`/`next()` handlers
- [X] T010 [US2] In `Testimonial.tsx` (depends on T008): wrap the active testimonial's text/attribution content in an `aria-live="polite"` region so screen reader users are notified when the slide changes, per the constitution's WCAG 2.1 AA requirement
- [X] T011 [US2] In `testimonial.css` (depends on T009): style the navigation controls to match the site's minimal visual language, ensuring a minimum 44×44px touch target and reachability at mobile widths, per spec FR-009

**Checkpoint**: At this point, User Stories 1 AND 2 both work — the section supports one or many testimonials with looping navigation.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec and constitution

- [ ] T012 Run [quickstart.md](./quickstart.md) validation: single-testimonial screenshot match, multi-testimonial navigation and looping, mobile viewport legibility, keyboard/screen-reader accessibility spot-check, and long-quote-text layout stability
- [ ] T013 [P] Confirm no dash-case CSS class names remain in `testimonial.css` (FR-010) and no `any` / `@ts-ignore` was introduced in `Testimonial.tsx`, `Testimonial.types.ts`, or `useTestimonialCarousel.ts` (constitution TypeScript-strict check)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: No tasks — nothing blocks Phase 3
- **User Story 1 (Phase 3)**: Depends on Phase 1 (T001). T002 and T003 can run in parallel; T004 depends on both; T005 depends on T004; T006 depends on T003
- **User Story 2 (Phase 4)**: Depends on User Story 1 (T004) for the component to extend. T007 can start in parallel with US1 (new, independent file); T008 depends on T004 and T007; T009 and T010 depend on T008; T011 depends on T009
- **Polish (Phase 5)**: Depends on Phase 3 and Phase 4 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependency on other stories
- **User Story 2 (P2)**: Extends the `Testimonial` component built in US1 (per spec.md, US2 builds directly on US1's static presentation); not independently buildable before US1, but independently testable once both are complete

### Parallel Opportunities

- T002 and T003 can run in parallel (different files: `Testimonial.types.ts` vs `testimonial.css`)
- T007 can be built in parallel with any US1 task (new, independent file with no dependency on `Testimonial.tsx`)
- T013 can run in parallel with T012 (different concerns: manual QA vs. code-style check)

---

## Parallel Example: User Story 1

```bash
# Launch T002 and T003 together — different files, no shared dependency:
Task: "Define TestimonialItem and TestimonialProps types in app/routes/pages/home/components/Testimonial/Testimonial.types.ts"
Task: "Create app/routes/pages/home/components/Testimonial/testimonial.css with camelCase class names"
```

## Parallel Example: User Story 2

```bash
# T007 has no dependency on the US1 component files and can be built alongside them:
Task: "Implement useTestimonialCarousel hook in app/routes/pages/home/components/Testimonial/useTestimonialCarousel.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Skip Phase 2: no foundational work required
3. Complete Phase 3: User Story 1 (T002–T006)
4. **STOP and VALIDATE**: Confirm the single-testimonial section matches the design screenshot exactly, with no navigation controls
5. Deploy/demo if ready — a single, static testimonial is a complete, shippable increment

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently (expand placeholder array, verify navigation/looping) → Deploy/Demo
4. Run Phase 5 Polish → Final validation against spec and constitution

---

## Notes

- Two user stories: US1 (static single-testimonial render) is the MVP; US2 (carousel navigation) extends it — they are not developed by fully independent teams in parallel, since US2 directly modifies the component US1 creates
- [P] tasks touch different files with no shared dependency
- Commit after each task or logical group
- Content is a hardcoded placeholder array per spec Assumptions and the user's explicit direction (see plan.md Content Layer Decisions) — no Sanity schema or query in this pass
