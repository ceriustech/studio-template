---

description: "Task list template for feature implementation"
---

# Tasks: Add Site Logo and Certification Labels

**Input**: Design documents from `/specs/COT-023-add-site-logo-labels/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested for this feature (no automated test suite in this repo). Verification is manual, via [quickstart.md](./quickstart.md).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app at `app/` (per [plan.md](./plan.md) Project Structure). No `backend/`/`frontend/` split, no Sanity schema or query changes for this feature.

---

## Phase 1: Setup

**Purpose**: Confirm the one prerequisite asset this feature depends on is in place before editing any component

- [ ] T001 Confirm `app/assets/curated-logo.png` exists and note its intrinsic size (319×316px) for use as the `width`/`height` attributes in T002

**Checkpoint**: Asset confirmed — both user stories can now proceed (no other foundational/blocking work: the two stories touch entirely separate files)

---

## Phase 2: User Story 1 - Brand logo visible in site header (Priority: P1) 🎯 MVP

**Goal**: Every page's header shows the Curated logo mark beside the existing "CURATED" wordmark and "PROFESSIONAL ORGANIZING" tagline, matching the design.

**Independent Test**: Load any page and confirm the circular Curated logo mark appears in the header next to the wordmark/tagline, at both desktop and mobile widths, per [quickstart.md](./quickstart.md) Scenario 1.

### Implementation for User Story 1

- [ ] T002 [US1] In `app/routes/components/navigation/index.tsx`, import `curated-logo.png` from `~/assets/curated-logo.png` and render it as an `<img>` inside the `.navBrand` container, before the existing `navBrandName`/`navBrandTagline` block, with `alt=""` (decorative — see [research.md](./research.md)) and explicit `width`/`height` matching the asset's aspect ratio
- [ ] T003 [US1] In `app/app.css`, extend the existing `.navBrand` rule block (~line 136) to lay the new logo image out beside the wordmark/tagline text (flex row + gap, vertical alignment), sizing the image appropriately for the header without changing `.navToggle` or `.navLinks` behavior on mobile
- [ ] T004 [US1] Manually verify per [quickstart.md](./quickstart.md) Scenario 1: logo renders on at least two different routes, and stays visible/legible with the mobile hamburger menu at ≤480px width

**Checkpoint**: User Story 1 is fully functional and independently testable — header logo visible sitewide

---

## Phase 3: User Story 2 - Certification labels on the Services page (Priority: P2)

**Goal**: The Services page "About Curated" section shows a "CPO Certified" label with the circular certification logo and a "NAPO Member" label with the NAPO title logo, matching the design.

**Independent Test**: Visit the Services page, scroll to "About Curated", and confirm both labels appear paired with their respective logos, at both desktop and mobile widths, per [quickstart.md](./quickstart.md) Scenario 2.

### Implementation for User Story 2

- [ ] T005 [US2] In `app/routes/pages/services/components/about/index.tsx`, add a "CPO Certified" text label paired with `napoCircularLogo` and a "NAPO Member" text label paired with `napoTitleLogo` inside `.aboutLogos` (e.g. wrap each `<img>` and its label in a small container so they stay associated)
- [ ] T006 [US2] In `app/routes/pages/services/components/about/about.css`, add styles for the new label elements (reusing the existing eyebrow-style typography already used for "About Curated" — uppercase, letter-spacing, small size/muted color) and adjust `.aboutLogos` layout so each label stays visually paired with its logo, including within the existing `@media (max-width: 768px)` and `@media (max-width: 480px)` blocks
- [ ] T007 [US2] Manually verify per [quickstart.md](./quickstart.md) Scenario 2: both labels are visible and correctly paired with their logos at desktop width and at ≤480px mobile width

**Checkpoint**: User Stories 1 AND 2 both work independently — header logo sitewide, certification labels on the Services page

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility and regression verification spanning both user stories

- [ ] T008 [P] Verify accessibility per [quickstart.md](./quickstart.md) Scenario 3: inspect the header `<img>` and confirm `alt=""`, and confirm the "CPO Certified"/"NAPO Member" labels are real text nodes (not images), not just visually implied
- [ ] T009 Run `npm run typecheck` and confirm no new errors introduced by T002–T006 (this repo has no separate lint script — `typecheck` is the only automated check)
- [ ] T010 Run full [quickstart.md](./quickstart.md) validation (all four scenarios) end-to-end and confirm SC-001 through SC-003 in [spec.md](./spec.md) are met, with no existing header or About-section content removed or visually broken

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **User Story 1 (Phase 2)**: Depends only on Setup (T001) — no dependency on User Story 2
- **User Story 2 (Phase 3)**: Depends only on Setup (T001) — no dependency on User Story 1 (touches entirely different files: `about/` vs `navigation/`)
- **Polish (Phase 4)**: Depends on both user stories being complete (T002–T007)

There is no separate Foundational phase for this feature — the two stories are independent enough (disjoint files, no shared new types/state) that Setup alone is sufficient before either can start.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup (T001) — no dependency on User Story 2
- **User Story 2 (P2)**: Can start after Setup (T001) — no dependency on User Story 1

### Within Each User Story

- Markup task before its matching CSS task (CSS targets class names introduced by the markup task)
- Manual verification task last, after markup + CSS are both done

### Parallel Opportunities

- User Story 1 (T002–T004) and User Story 2 (T005–T007) can be worked on in parallel by different people once T001 is done — they touch entirely disjoint files
- Within Polish, T008 and T009 can run in parallel (independent checks); T010 runs last since it validates the combined result

---

## Parallel Example: User Story 1 vs User Story 2

```bash
# Once T001 is done, these two stories can proceed in parallel:
Task: "T002 [US1] Add curated-logo.png to app/routes/components/navigation/index.tsx"
Task: "T005 [US2] Add certification labels to app/routes/pages/services/components/about/index.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: User Story 1 (T002–T004) — sitewide header logo
3. **STOP and VALIDATE**: Test User Story 1 independently per quickstart.md Scenario 1
4. Deploy/demo if ready — header logo alone already matches part of the design

### Incremental Delivery

1. Complete Setup (T001) → ready for both stories
2. Add User Story 1 (T002–T004) → validate independently → demo (MVP)
3. Add User Story 2 (T005–T007) → validate independently → demo
4. Complete Polish (T008–T010) → full regression + accessibility pass

---

## Notes

- [P] tasks = different files/commands, no dependencies
- [Story] label maps task to specific user story for traceability
- Both user stories are independently completable and testable — no cross-story dependency
- Commit after each task or logical group
- Stop at either checkpoint to validate story independently
