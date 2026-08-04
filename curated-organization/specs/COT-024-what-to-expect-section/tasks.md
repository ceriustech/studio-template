---

description: "Task list template for feature implementation"
---

# Tasks: What to Expect Section

**Input**: Design documents from `/specs/COT-024-what-to-expect-section/`

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

**Purpose**: Confirm the reference values this feature depends on before writing any component or layout code

- [ ] T001 Confirm the reference source for exact copy/CSS values — the "WHAT TO EXPECT" section in `.specify/site-design/curated-book-mockup.html` (markup ~lines 1203-1237, styles ~lines 517-569) — and confirm `PAGE_ROUTES_DATA.BOOKING.path` in `app/routes/constants/index.ts` resolves to `/booking`, for use in T004 and T005

**Checkpoint**: Reference values confirmed — Foundational component work can now begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the new `WhatToExpect` component that both user stories depend on (US1 renders it; US2 verifies it does *not* render outside `/booking`)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 [P] Create `app/routes/components/WhatToExpect/WhatToExpect.types.ts` defining `WhatToExpectStep` (`{ number: string; title: string; description: string }`) and an empty `WhatToExpectProps`, mirroring `Process.types.ts`'s `ProcessStep`/`ProcessProps` shape (see [research.md](./research.md))
- [ ] T003 [P] Create `app/routes/components/WhatToExpect/whatToExpect.css` translating the mockup's `.expect*` rules (T001) to camelCase per this project's convention: `.whatToExpect` (section padding/background), `.whatToExpectHeader` (centered, margin-bottom), `.whatToExpectGrid` (3-column grid, `max-width: 900px`, centered), `.whatToExpectStep`, `.whatToExpectNum`, `.whatToExpectTitle`, `.whatToExpectDesc`, `.whatToExpectConnector`, plus the `@media (max-width: 768px)` single-column/hidden-connector override — matching `process.css`'s structure
- [ ] T004 Create `app/routes/components/WhatToExpect/index.tsx`: a hardcoded `WhatToExpectStep[]` array with exactly the three steps from spec FR-004 ("Confirmation email", "30-minute consultation", "Custom proposal" with their descriptions, numbered "01"/"02"/"03"), rendering a `<section className="whatToExpect">` with a `.whatToExpectHeader` (`<p className="sectionEyebrow">What to Expect</p>` + `<h2 className="sectionHeading">After you book</h2>`) and a `.whatToExpectGrid` mapping each step to a `<div className="whatToExpectStep">` (`.whatToExpectNum`, `<h3 className="whatToExpectTitle">`, `<p className="whatToExpectDesc">`), with an `aria-hidden="true"` `.whatToExpectConnector` div between all but the last step — mirroring `Process.tsx`'s structure and index check (depends on T002, T003)

**Checkpoint**: `WhatToExpect` renders correctly on its own (e.g. spot-checked by temporarily mounting it) — both user stories can now proceed

---

## Phase 3: User Story 1 - Booking visitor sees what happens after they book (Priority: P1) 🎯 MVP

**Goal**: A visitor on `/booking` sees the "What to Expect" section (eyebrow, "After you book" heading, three numbered steps) in place of the sitewide "Ready to transform your space?" call-to-action.

**Independent Test**: Navigate to `/booking` and confirm the "What to Expect" section appears instead of the `Cta` section, showing the three-step breakdown, matching the design — per [quickstart.md](./quickstart.md) Scenario 1.

### Implementation for User Story 1

- [ ] T005 [US1] In `app/root.tsx`, import `useLocation` from `react-router` (matching the existing pattern in `app/routes/components/navigation/index.tsx`), `PAGE_ROUTES_DATA` from `./routes/constants`, and `WhatToExpect` from `./routes/components/WhatToExpect`; inside the `Layout` component, read `const location = useLocation();` and replace the unconditional `<Cta />` with `{location.pathname === PAGE_ROUTES_DATA.BOOKING.path ? <WhatToExpect /> : <Cta />}`
- [ ] T006 [US1] Manually verify per [quickstart.md](./quickstart.md) Scenario 1: navigate to `/booking`, confirm the "What to Expect" section (not `Cta`) renders with the exact eyebrow/heading/step content and order from FR-003/FR-004, matching the design mockup and screenshot at both desktop and mobile (≤480px) widths

**Checkpoint**: User Story 1 is fully functional and independently testable — `/booking` shows "What to Expect"

---

## Phase 4: User Story 2 - Visitors on every other page continue to see the booking call-to-action (Priority: P2)

**Goal**: Every route other than `/booking` continues to show the existing "Ready to transform your space?" `Cta` section, unchanged.

**Independent Test**: Navigate to any non-booking route (e.g. `/`, `/services`, `/gallery`) and confirm the `Cta` section still renders exactly as before, and that navigating away from `/booking` swaps the section back — per [quickstart.md](./quickstart.md) Scenario 2.

### Implementation for User Story 2

- [ ] T007 [US2] Manually verify per [quickstart.md](./quickstart.md) Scenario 2: navigate to `/`, `/services`, and `/gallery` and confirm the `Cta` section still renders unchanged on each (this is the else-branch of the conditional added in T005 — no additional code change is needed for this story, since `app/routes/components/Cta/` itself is untouched); then navigate from `/booking` to another route and confirm the section swaps back to `Cta`

**Checkpoint**: User Stories 1 AND 2 both work independently — `/booking` shows "What to Expect", every other route still shows `Cta`

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, type-safety, and full regression verification spanning both user stories

- [ ] T008 [P] Verify accessibility per the plan's Constitution Check: confirm `.whatToExpectConnector` elements have `aria-hidden="true"`, the section uses a semantic `<h2>` (eyebrow/heading) and `<h3>` per step title, and no interactive elements were introduced
- [ ] T009 [P] Run `npm run typecheck` and confirm no new errors introduced by T002–T005 (this repo has no separate lint script — `typecheck` is the only automated check)
- [ ] T010 Run full [quickstart.md](./quickstart.md) validation (all three scenarios) end-to-end and confirm SC-001 through SC-003 in [spec.md](./spec.md) are met, with no regression to the Booking page's own content (`Hero`, `TwoPaths`, `Questionnaire`/`Calendar`) or to `Footer` rendering on any route

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001) — BLOCKS both user stories (the `WhatToExpect` component must exist before `root.tsx` can render it or before its absence-elsewhere can be verified)
- **User Story 1 (Phase 3)**: Depends on Foundational (T002–T004) — no dependency on User Story 2
- **User Story 2 (Phase 4)**: Depends on the conditional added in T005 (Phase 3) — it verifies the else-branch of that same edit, so it cannot start before T005 lands
- **Polish (Phase 5)**: Depends on both user stories being complete (T002–T007)

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) completes — no dependency on User Story 2
- **User Story 2 (P2)**: Depends on T005 (the single conditional in `root.tsx` that both stories share) — cannot be verified independently of that edit existing, but requires no code of its own

### Within Each Phase

- Types and CSS (T002, T003) before the component that imports them (T004)
- Component creation (T004) before it is wired into the layout (T005)
- Manual verification tasks last, after their preceding implementation task

### Parallel Opportunities

- T002 and T003 can run in parallel (different files, no dependency between them) — both are prerequisites for T004
- Within Polish, T008 and T009 can run in parallel (independent checks); T010 runs last since it validates the combined result

---

## Parallel Example: Foundational Phase

```bash
# Once T001 is done, these two can proceed in parallel:
Task: "T002 [P] Create app/routes/components/WhatToExpect/WhatToExpect.types.ts"
Task: "T003 [P] Create app/routes/components/WhatToExpect/whatToExpect.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002–T004) — the `WhatToExpect` component itself
3. Complete Phase 3: User Story 1 (T005–T006) — wire it into `/booking`
4. **STOP and VALIDATE**: Test User Story 1 independently per quickstart.md Scenario 1
5. Deploy/demo if ready — this alone delivers the full visible change from the design

### Incremental Delivery

1. Complete Setup + Foundational (T001–T004) → `WhatToExpect` component ready
2. Add User Story 1 (T005–T006) → validate independently → demo (MVP)
3. Add User Story 2 (T007) → validate the else-branch → demo
4. Complete Polish (T008–T010) → full regression + accessibility pass

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- User Story 2 has no implementation task of its own — T005 is a single conditional shared by both stories, so US2 is purely a verification pass on that same edit
- Commit after each task or logical group
- Stop at either checkpoint to validate story independently
