---

description: "Task list template for feature implementation"
---

# Tasks: Hamburger Menu for Navigation

**Input**: Design documents from `/specs/COT-019-hamburger-navigation-menu/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: No automated test suite exists in this repo and none was requested in the spec (see `research.md`). Verification is manual, via `quickstart.md`, referenced at the end of each phase below.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. All tasks touch the same three files (`app/routes/components/navigation/index.tsx`, `app/routes/components/navigation/navigation.types.ts`, `app/app.css`) since this feature modifies one existing shared component in place — `[P]` is used only where two tasks touch genuinely disjoint regions (e.g., CSS vs. TSX) that can't conflict.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app at `app/`. All paths below are relative to the repository root.

---

## Phase 1: Setup

**Purpose**: Prepare the existing `Navigation` component for the new toggle behavior; no new project, package, or route is created.

- [ ] T001 Import `Menu` and `X` icons from `lucide-react` into `app/routes/components/navigation/index.tsx` (already a project dependency — see `research.md`; no `package.json` change needed).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the `isMenuOpen` toggle state, the hamburger `<button>`, and the mobile menu container markup that every user story below depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T002 Add `isMenuOpen` local state (`useState<boolean>`, default `false`) to `app/routes/components/navigation/index.tsx`, per the state model in `data-model.md`.
- [ ] T003 Add a hamburger toggle `<button>` to the header in `app/routes/components/navigation/index.tsx`: `type="button"`, `aria-expanded={isMenuOpen}`, `aria-controls="mobile-nav-menu"`, `aria-label` set to "Open menu" / "Close menu" based on state, `onClick` toggles `isMenuOpen`; render the `Menu` icon when closed and the `X` icon when open.
- [ ] T004 Give the existing `<nav className="navLinks">` element `id="mobile-nav-menu"` in `app/routes/components/navigation/index.tsx` so `aria-controls` (T003) resolves to it, and drive a data attribute (e.g. `data-open={isMenuOpen}`) or conditional class off `isMenuOpen` for later CSS targeting.
- [ ] T005 [P] Add base `.navToggle` button styles to `app/app.css`: 44×44px minimum tap target, visible focus indicator consistent with the existing `:focus-visible` rules, `display: none` above the `tablet` breakpoint (reuse `min-width: 769px`, matching `QUERIES.minTablet` in `app/constants/index.ts`), `display: inline-flex` (or similar) at/below it.

**Checkpoint**: The hamburger button renders on mobile widths, toggles `isMenuOpen`, and exposes correct `aria-expanded`/`aria-controls` — but the mobile menu's open/closed *visual* state isn't wired to CSS yet (that's User Story 1).

---

## Phase 3: User Story 1 - Open mobile navigation via hamburger icon (Priority: P1) 🎯 MVP

**Goal**: On mobile-width viewports, primary links are collapsed behind the hamburger icon by default; tapping it reveals Home, Services, Gallery, and "Book now".

**Independent Test**: At a mobile-width viewport, confirm the header shows only the hamburger icon (no inline links), tap it, and confirm all links + the CTA become visible. Corresponds to `quickstart.md` Scenario 1.

### Implementation for User Story 1

- [ ] T006 [US1] In `app/app.css`, replace the current `@media (max-width: 768px) { .navLinks { flex-wrap: wrap; ... } }` block (COT-001's always-visible wrap behavior) with rules that hide `.navLinks` by default below the `tablet` breakpoint and reveal it as a panel when `[data-open="true"]` (or the equivalent class from T004) is present.
- [ ] T007 [US1] Style the open mobile menu panel in `app/app.css` (spacing, background, stacked link layout) so links and the "Book now" CTA are clearly legible and tappable when revealed, consistent with existing design tokens (`--warm-white`, `--charcoal`, `--taupe-dark`, etc. already used in `.nav`/`.navLinks`/`.navCta`).
- [ ] T008 [US1] Confirm in `app/routes/components/navigation/index.tsx` that the existing active-page logic (`isActive`, `aria-current="page"`, `.active` class) continues to apply unchanged to links rendered inside the mobile menu (FR-007) — no code change expected, verify only.

**Checkpoint**: `quickstart.md` Scenario 1 passes — User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Close mobile navigation and follow a link (Priority: P1)

**Goal**: Selecting a link in the open mobile menu navigates and closes the menu; toggling the hamburger again (or tapping outside) closes it without navigating.

**Independent Test**: With the mobile menu open, tap a link and confirm both navigation and menu closure; separately, tap the toggle/outside area and confirm the menu closes without navigating. Corresponds to `quickstart.md` Scenario 2 and the "tap outside" edge case.

### Implementation for User Story 2

- [ ] T009 [US2] Add an `onClick` handler to each nav link and the "Book now" CTA inside `.navLinks` in `app/routes/components/navigation/index.tsx` that sets `isMenuOpen` to `false` (link navigation itself is already handled by the existing `<Link>` components — this only needs to close the menu).
- [ ] T010 [US2] Verify the hamburger toggle button (T003) correctly flips `isMenuOpen` from `true` back to `false` when activated a second time, with no navigation side effect, in `app/routes/components/navigation/index.tsx`.
- [ ] T011 [P] [US2] Add a document-level click/touch listener (active only while `isMenuOpen` is `true`) in `app/routes/components/navigation/index.tsx` that closes the menu when a tap/click lands outside the header (`nav.navLinks` and the toggle button), cleaning the listener up on unmount/close.
- [ ] T012 [P] [US2] Add a `useEffect` in `app/routes/components/navigation/index.tsx`, keyed on `useLocation()`'s pathname, that sets `isMenuOpen` to `false` whenever the route changes — covers link selection (T009) as well as browser back/forward navigation (per spec Edge Cases).

**Checkpoint**: `quickstart.md` Scenario 2 and the rapid-toggle/outside-tap/back-forward edge cases pass — User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Navigation adapts correctly across viewport sizes (Priority: P2)

**Goal**: Exactly one navigation pattern (hamburger or inline links) is shown at any viewport width, with no overlap, duplication, or stuck state when resizing across the `tablet` breakpoint.

**Independent Test**: Resize the viewport across 768px in both directions and confirm the navigation switches cleanly between patterns, including when the mobile menu is open at the moment of crossing. Corresponds to `quickstart.md` Scenario 3.

### Implementation for User Story 3

- [ ] T013 [US3] Add a `resize` listener (or `matchMedia` listener against the `tablet` query) in `app/routes/components/navigation/index.tsx` that sets `isMenuOpen` to `false` when the viewport crosses from below `tablet` to at/above it (FR-008), cleaning the listener up on unmount.
- [ ] T014 [P] [US3] In `app/app.css`, add/confirm a `min-width: 769px` rule that unconditionally shows `.navLinks` inline and `display: none`s the `.navToggle` button, regardless of `isMenuOpen`/`data-open` state, so desktop/tablet widths can never render the hamburger pattern (SC-004).

**Checkpoint**: `quickstart.md` Scenario 3 passes — all three user stories are independently functional; navigation shows exactly one pattern at every width.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility verification, edge-case hardening, and cleanup that spans all three user stories.

- [ ] T015 [P] Run `quickstart.md` Scenario 4 (keyboard-only and screen reader pass) against the finished component; fix any gaps in focus order, accessible naming, or `aria-expanded` announcement found in `app/routes/components/navigation/index.tsx`.
- [ ] T016 Run `quickstart.md` Scenario 5 (rapid toggling, outside tap, back/forward) end-to-end and fix any inconsistent-state bugs found across `app/routes/components/navigation/index.tsx`.
- [ ] T017 Run `npm run typecheck` from the repository root and fix any TypeScript errors introduced by this feature.
- [ ] T018 [P] Remove any now-dead CSS left over from the pre-feature `@media (max-width: 768px)` wrap-only behavior in `app/app.css` that T006 did not already replace (constitution "No dead code").
- [ ] T019 Run all five `quickstart.md` scenarios end-to-end and confirm SC-001–SC-004 all pass.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup (needs the icon imports from T001) — BLOCKS all user stories.
- **User Stories (Phase 3-5)**: All depend on Foundational (Phase 2) completion.
  - US1 (P1) and US2 (P1) can proceed in parallel once Foundational is done, but both are needed for the feature's core acceptance criteria.
  - US3 (P2) can start after Foundational, but its resize-close behavior (T013) is easiest to verify once US1's open/close visuals (Phase 3) exist — implement US3 last in sequential delivery.
- **Polish (Phase 6)**: Depends on all three user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2). No dependency on US2/US3.
- **User Story 2 (P1)**: Can start after Foundational (Phase 2). Independently testable (toggle-closes and outside-tap-closes work even before US1's CSS panel styling exists, though the visual result is easier to confirm after Phase 3).
- **User Story 3 (P2)**: Can start after Foundational (Phase 2). Independently testable, but most meaningful to verify after US1 (Phase 3) so there's a visible open state to observe crossing the breakpoint.

### Within Each User Story

- Foundational state/markup (Phase 2) before any story-specific work.
- CSS and TSX tasks within a story may run in parallel where marked `[P]` (disjoint files/regions); unmarked tasks in the same file are sequential.
- Story complete and checkpoint validated (via `quickstart.md`) before moving to the next priority.

### Parallel Opportunities

- T005 (`app.css` base toggle styles) can run in parallel with the tail end of Phase 2's TSX tasks (T002-T004) since it's a different file.
- T011 and T012 (both US2, both in `index.tsx` but logically independent effects/listeners) can be developed in parallel by different people, then merged, since they don't share code paths.
- T014 (`app.css`) can run in parallel with T013 (`index.tsx`) within US3.
- T015 and T018 in Polish can run in parallel (accessibility pass vs. CSS cleanup, different concerns).

---

## Parallel Example: Phase 2 (Foundational)

```bash
# T002-T004 (index.tsx: state, button, container markup) are sequential — same file, same region.
# T005 can run alongside them:
Task: "Add base .navToggle button styles to app/app.css"
```

## Parallel Example: User Story 2

```bash
# T011 and T012 both touch index.tsx but are logically independent effects:
Task: "Add outside-click listener that closes the mobile menu in app/routes/components/navigation/index.tsx"
Task: "Add route-change effect that closes the mobile menu in app/routes/components/navigation/index.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T005) — CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T006-T008)
4. **STOP and VALIDATE**: Run `quickstart.md` Scenario 1 independently
5. At this point the hamburger opens and reveals links — closing behavior (US2) and resize correctness (US3) are not yet guaranteed, so this MVP is a demo checkpoint, not a mergeable feature; COT-019's acceptance criteria require US1 and US2 together at minimum.

### Incremental Delivery

1. Setup + Foundational → toggle state and button exist, not yet visually wired.
2. Add User Story 1 → mobile menu opens/reveals links → validate Scenario 1.
3. Add User Story 2 → menu closes correctly (link select, re-toggle, outside tap, back/forward) → validate Scenario 2 + edge cases.
4. Add User Story 3 → resize-boundary correctness → validate Scenario 3.
5. Polish → accessibility + edge-case hardening + cleanup → validate Scenarios 4-5 and full SC-001–SC-004.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (single small PR, same files).
2. Once Foundational is done:
   - Developer A: User Story 1 (CSS-heavy — `app.css` panel styling)
   - Developer B: User Story 2 (TSX-heavy — close handlers/listeners)
   - Developer C: User Story 3 (resize listener + CSS guard)
3. Because all three stories touch `app/routes/components/navigation/index.tsx`, coordinate merge order (US1 → US2 → US3 recommended) to avoid conflicting edits to the same file; `app.css` changes (T005, T006, T007, T014) are lower-conflict-risk since each story adds distinct rules.

---

## Notes

- [P] tasks = different files or clearly disjoint code regions, no dependencies.
- [Story] label maps task to specific user story for traceability.
- All three user stories ultimately touch the same three files (`index.tsx`, `navigation.types.ts`, `app.css`) — true parallelism is limited; sequence within a file even when working across stories.
- Verify each phase against its `quickstart.md` scenario before moving to the next.
- Commit after each task or logical group.
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independent testability.
