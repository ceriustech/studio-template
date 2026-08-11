---

description: "Task list template for feature implementation"
---

# Tasks: Services About Section Mobile Rework

**Input**: Design documents from `/specs/COT-025-services-about-rework/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested for this feature (no automated test suite in this repo — see plan.md Technical Context). Verification is manual, via [quickstart.md](./quickstart.md).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app at `app/` (per [plan.md](./plan.md) Project Structure). This feature touches exactly two existing files — no new files, no Sanity schema/query changes:

- `app/routes/pages/services/components/about/index.tsx`
- `app/routes/pages/services/components/about/about.css`

---

## Phase 1: Setup

**Purpose**: Confirm the current baseline before restructuring it

- [X] T001 Review the current markup and styles in `app/routes/pages/services/components/about/index.tsx` and `app/routes/pages/services/components/about/about.css`: confirm the existing wrapper structure (`.aboutBrief` > `.aboutBriefImg` + `.aboutBriefText`, the latter containing `.sectionEyebrow`, `.sectionEyebrowDescription`, the body `<p>`, `.aboutSignature`, and `.aboutLogos`), and confirm `BREAKPOINTS.tablet` (`768px`) in `app/constants/index.ts` matches the `768px` value already used in `about.css` — no code changes in this task

**Checkpoint**: Baseline confirmed — restructuring can begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Not applicable for this feature.** The DOM restructuring both user stories rely on (splitting `.aboutBriefText` into separate header/body blocks) is delivered entirely within User Story 1 (T002), because that restructuring is also exactly what's needed to satisfy US1 on its own — there is no separate shared-but-invisible prerequisite to front-load. User Story 2 adds one additional CSS rule on top of US1's output; it introduces no new markup.

---

## Phase 3: User Story 1 - Mobile visitor reads the About section in the correct order (Priority: P1) 🎯 MVP

**Goal**: On mobile-width screens, the About section renders, top to bottom: eyebrow + heading, founder photo, body copy + signature, certification logos — matching the design screenshot.

**Independent Test**: Load the Services page at a mobile viewport width (e.g. 375px) and confirm the About section shows the eyebrow/heading first, then the photo, then the certification logos last — per [quickstart.md](./quickstart.md) mobile validation steps.

### Implementation for User Story 1

> **Correction during implementation**: T003/T004 originally planned to flip `about.css` to a mobile-first base with a desktop `min-width` override. Live review showed this put desktop in a temporarily-broken interim state before User Story 2 landed, and made the diff touch desktop-scoped rules for a mobile-only request. Implemented instead: the base (unprefixed) rules stay the visual desktop layout (now driven by `grid-template-areas` instead of 2-item DOM auto-placement, a mechanical requirement of T002's DOM reorder — not a visual change), and the reorder is expressed entirely inside the existing `@media (max-width: 768px)` block. See the updated [research.md](./research.md) and [plan.md](./plan.md) Constitution Check. This also removed the need for a separate User Story 2 CSS task (T006) — desktop was never modified outside the mobile media query, so nothing needs restoring.

- [X] T002 [US1] In `app/routes/pages/services/components/about/index.tsx`, restructure the JSX so `<section className="aboutBrief">` has four direct child blocks in this DOM order: (1) a new `<div className="aboutHeader">` wrapping the existing `<p className="sectionEyebrow">` and `<h2 className="sectionEyebrowDescription">`, (2) the existing `<div className="aboutBriefImg">` (photo), unchanged, (3) a new `<div className="aboutBriefBody">` wrapping the existing body `<p>` and `<div className="aboutSignature">`, (4) the existing `<div className="aboutLogos">`, unchanged — remove the now-empty `.aboutBriefText` wrapper entirely
- [X] T003 [US1] In `app/routes/pages/services/components/about/about.css`, keep the existing (desktop) `.aboutBrief` rule as the base — `padding: 100px 64px; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; background: var(--warm-white);` — and add `grid-template-areas: "image header" "image body" "image logos";` plus `grid-area: header;` / `grid-area: image;` / `grid-area: body;` / `grid-area: logos;` on `.aboutHeader`, `.aboutBriefImg`, `.aboutBriefBody`, and `.aboutLogos` respectively (so desktop renders identically to before, now via named areas instead of 2-item auto-placement); re-scope every selector previously prefixed `.aboutBriefText` (`.aboutBriefText .sectionEyebrow`, `.aboutBriefText h2`, `.aboutBriefText p`, `.aboutBriefText .aboutSignature`) to `.aboutHeader .sectionEyebrow`, `.aboutHeader h2`, `.aboutBriefBody p`, and `.aboutBriefBody .aboutSignature` — since `.aboutBriefText` no longer exists after T002
- [X] T004 [US1] In `app/routes/pages/services/components/about/about.css`'s existing `@media (max-width: 768px)` block, add `grid-template-areas: "header" "image" "body" "logos";` alongside the existing `grid-template-columns: 1fr;`/`gap: 32px;`, so mobile/tablet widths reflow to the stacked order matching the DOM; rename `.aboutBriefText p { max-width: none; }` to `.aboutBriefBody p { max-width: none; }` in that same block; in the `@media (max-width: 480px)` block, update the heading selector from `.aboutBriefText h2` to `.aboutHeader h2` (keep `font-size: 27px` and `.aboutBriefImg { height: 260px; }` as-is)
- [ ] T005 [US1] Manually verify per [quickstart.md](./quickstart.md) mobile validation: at 320px, 375px, 430px, and 768px viewport widths, confirm the About section renders eyebrow+heading, then photo, then body copy+signature, then logos, top to bottom, matching the design screenshot, and that DOM/reading order matches visual order (tab through or inspect the accessibility tree)

**Checkpoint**: User Story 1 is fully functional and independently testable — mobile-width screens show the correct order, and desktop/tablet widths are unaffected (unlike the original plan, there is no broken interim state, since desktop was never modified outside the mobile media query).

---

## Phase 4: User Story 2 - Desktop and tablet visitors see no regression (Priority: P2)

**Goal**: On desktop and larger tablet-width screens, the About section keeps its existing two-column layout (photo beside text), unchanged from before this feature.

**Independent Test**: Load the Services page at a desktop viewport width (e.g. 1024px, 1440px) and confirm the About section's two-column layout is visually unchanged from its pre-feature appearance — per [quickstart.md](./quickstart.md) desktop validation steps.

### Implementation for User Story 2

- [X] T006 [US2] ~~Add a `@media (min-width: 768px)` desktop override~~ — not needed. Because T003 kept the base (unprefixed) `.aboutBrief` rules as the desktop layout and only T004's existing `@media (max-width: 768px)` block was changed, desktop was never modified and requires no restoring override. No code change for this task.
- [ ] T007 [US2] Manually verify per [quickstart.md](./quickstart.md) desktop validation: at 1024px and 1440px viewport widths, confirm the About section renders as two columns (photo on one side; eyebrow/heading/body/signature/logos in reading order on the other side), with no visible difference from the section's appearance before this feature

**Checkpoint**: User Stories 1 AND 2 both work independently — mobile shows the reordered layout, desktop/tablet keep the original two-column layout

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility and full regression verification spanning both user stories

- [ ] T008 [P] Verify accessibility per the plan's Constitution Check: confirm no CSS `order` property was used anywhere (reordering is DOM-based, per [research.md](./research.md)), `alt` text on the photo and logo images is unchanged, and heading semantics (`h2` for the section heading) are preserved
- [ ] T009 [P] Run `npm run typecheck` and confirm no new errors introduced by T002–T006 (this repo has no separate lint script — `typecheck` is the only automated check)
- [ ] T010 Run the full [quickstart.md](./quickstart.md) validation (mobile, desktop, and accessibility/reading-order checks) end-to-end and confirm SC-001 through SC-003 in [spec.md](./spec.md) are met, with no regression to the rest of the Services page (hero, offerings, pricing sections)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Not applicable — see note above
- **User Story 1 (Phase 3)**: Depends on Setup (T001) — no dependency on User Story 2
- **User Story 2 (Phase 4)**: Depends on User Story 1's markup restructure (T002) and base grid areas (T003) existing, since it only adds an override on top of them — cannot be implemented before T002/T003 land
- **Polish (Phase 5)**: Depends on both user stories being complete (T002–T007)

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup (Phase 1) — no dependency on User Story 2
- **User Story 2 (P2)**: Depends on the `.aboutHeader` / `.aboutBriefImg` / `.aboutBriefBody` / `.aboutLogos` grid areas defined in T002/T003 — reuses them rather than introducing new markup, so it cannot be implemented independently of User Story 1's code, even though it is independently *testable* once in place

### Within Each Phase

- Markup restructure (T002) before CSS that targets the new class structure (T003, T004)
- Base mobile-first CSS (T003) before the obsolete-block cleanup that depends on it existing (T004)
- Manual verification tasks (T005, T007) last, after their preceding implementation tasks
- Desktop override (T006) after User Story 1's base grid areas (T003) are in place

### Parallel Opportunities

- T008 and T009 in Polish can run in parallel (independent checks, different concerns); T010 runs last since it validates the combined result
- No tasks within Phases 1–4 are parallelizable — T002/T003/T004 are sequential edits building on each other in the same two files, and T006 depends on their output

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 3: User Story 1 (T002–T005) — restructure the DOM and mobile-first base CSS
3. **STOP and VALIDATE**: Test User Story 1 independently per quickstart.md mobile validation
4. Deploy/demo if ready — this alone delivers the mobile-view fix described in the acceptance criteria (desktop temporarily also single-column until US2 lands)

### Incremental Delivery

1. Complete Setup (T001) → baseline confirmed
2. Add User Story 1 (T002–T005) → validate independently → demo (MVP — mobile matches the design)
3. Add User Story 2 (T006–T007) → validate independently → demo (desktop/tablet restored to original two-column layout)
4. Complete Polish (T008–T010) → full regression + accessibility pass

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- User Story 2 has no new markup of its own — T006 is a CSS-only override reusing the grid areas User Story 1 establishes, so US2 is a small, independently-testable addition rather than a parallel, independently-buildable track
- Commit after each task or logical group
- Stop at either checkpoint to validate story independently
