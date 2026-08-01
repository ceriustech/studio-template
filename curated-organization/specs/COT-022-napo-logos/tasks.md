---

description: "Task list for Add NAPO Logos to Footer and Services Page"
---

# Tasks: Add NAPO Logos to Footer and Services Page

**Input**: Design documents from `/specs/COT-022-napo-logos/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: Not requested — the spec does not call for automated tests and no test framework (Vitest/Playwright/Jest) exists in this repo. Verification is via `npm run typecheck`, lint, and the manual scenarios in `quickstart.md` (see Polish phase).

**Organization**: Tasks are grouped by user story. Both stories are fully independent of each other — they touch different components (`About` vs. `Footer`) and can be implemented and tested in either order.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app at `app/`, per `plan.md` Project Structure. No `backend/`/`frontend/` split, no `tests/` directory (no test framework configured).

---

## Phase 1: Setup

**Purpose**: Confirm the starting state before touching any component.

- [X] T001 Verify `app/assets/napo-circular-logo.png` and `app/assets/napo-title-logo.png` exist and visually match the reference design (circular badge, then title wordmark); no asset changes are needed if they already match.

---

## Phase 2: Foundational

**Not applicable** — the two user stories touch entirely separate files (`About` component vs. `Footer` component) and share no code, state, or blocking setup beyond the already-existing assets confirmed in Phase 1. No foundational tasks are required; user story work can begin immediately after Phase 1.

---

## Phase 3: User Story 1 - View credential logos on the Services page (Priority: P1) 🎯 MVP

**Goal**: Both NAPO logos render in the Services page About section, circular logo first, matching the reference design.

**Independent Test**: Navigate to `/services`, scroll to the About section, and confirm both logos render below the "— The Curated Team" signature per `quickstart.md` Scenario 1 — without touching the Footer at all.

### Implementation for User Story 1

- [X] T002 [US1] In `app/routes/pages/services/components/about/index.tsx`, import both logo assets (`import napoCircularLogo from "~/assets/napo-circular-logo.png"` and `import napoTitleLogo from "~/assets/napo-title-logo.png"`) and render a logo row — `<img>` for `napoCircularLogo` then `<img>` for `napoTitleLogo`, each with descriptive `alt` text (e.g. "NAPO member" / "NAPO — National Association of Productivity and Organizing Professionals") and explicit `width`/`height` — placed immediately below the `.aboutSignature` element ("— The Curated Team"), wrapped in a container with `className="aboutLogos"`.
- [X] T003 [US1] In `app/routes/pages/services/components/about/about.css`, add `.aboutLogos` styles (flex row, `align-items: center`, `gap`) below the existing `.aboutSignature` rule, and extend the file's existing `@media (max-width: 768px)` and `@media (max-width: 480px)` blocks only if needed so both logos stay legible and non-overlapping down to 320px width.

**Checkpoint**: User Story 1 is fully functional and independently testable — the Services page About section shows both logos per the design.

---

## Phase 4: User Story 2 - View credential logos in the site footer (Priority: P2)

**Goal**: Both NAPO logos render in the shared Footer's brand column, circular logo first, on every page.

**Independent Test**: Load any page (e.g. Home, Gallery), scroll to the footer, and confirm both logos render below "Serving the NOVA / DMV area." per `quickstart.md` Scenario 2 — without depending on User Story 1's changes.

### Implementation for User Story 2

- [X] T004 [US2] In `app/routes/components/Footer/index.tsx`, import both logo assets (`import napoCircularLogo from "~/assets/napo-circular-logo.png"` and `import napoTitleLogo from "~/assets/napo-title-logo.png"`) and render a logo row — `<img>` for `napoCircularLogo` then `<img>` for `napoTitleLogo`, each with descriptive `alt` text and explicit `width`/`height` — placed immediately below the `.footerBrandDesc` paragraph ("Serving the NOVA / DMV area."), wrapped in a container with `className="footerLogos"`.
- [X] T005 [US2] In `app/routes/components/Footer/footer.css`, add `.footerLogos` styles (flex row, `align-items: center`, `gap`) below the existing `.footerBrandDesc` rule, and extend the file's existing `@media (max-width: 768px)` and `@media (max-width: 480px)` blocks only if needed so both logos stay legible and non-overlapping down to 320px width.

**Checkpoint**: User Stories 1 AND 2 both work independently — logos appear in the Services page About section and in the footer on every page.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Confirm the change is clean and matches the spec's success criteria end-to-end.

- [ ] T006 [P] Run `npm run typecheck` from the repo root and fix any type errors introduced by the new asset imports or markup.
- [ ] T007 [P] Run the project's lint command and fix any lint errors introduced by the changes in `about/index.tsx`, `about.css`, `Footer/index.tsx`, and `footer.css`.
- [ ] T008 Execute all validation scenarios in `specs/COT-022-napo-logos/quickstart.md` (Services page, footer on a second page, accessibility check, no-regressions check) at mobile, tablet, and desktop widths.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Not applicable — nothing blocks the user stories.
- **User Stories (Phase 3, Phase 4)**: Both depend only on Phase 1 (assets confirmed present). They do not depend on each other and can proceed in either order or in parallel.
- **Polish (Phase 5)**: Depends on both User Story 1 and User Story 2 being complete (validates the full feature end-to-end).

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1. No dependency on User Story 2.
- **User Story 2 (P2)**: Can start after Phase 1. No dependency on User Story 1.

### Within Each User Story

- Markup task (imports + `<img>` row) before its paired CSS task, since the CSS task styles the `className` the markup task introduces.
- Story complete once both its tasks are done.

### Parallel Opportunities

- T001 has no parallel counterpart (single verification task).
- User Story 1 (T002-T003) and User Story 2 (T004-T005) touch entirely different files and can be worked on in parallel by different people once Phase 1 is done.
- T006 and T007 (typecheck, lint) can run in parallel with each other in Phase 5.

---

## Parallel Example: User Story 1 vs. User Story 2

```bash
# After T001 completes, these two stories can proceed at the same time:
Task: "US1 — import logos and add logo row to app/routes/pages/services/components/about/index.tsx, style via about.css"
Task: "US2 — import logos and add logo row to app/routes/components/Footer/index.tsx, style via footer.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001).
2. Complete Phase 3: User Story 1 (T002-T003).
3. **STOP and VALIDATE**: Confirm the Services page About section shows both logos correctly (Scenario 1 in `quickstart.md`).
4. Demo if ready — this alone satisfies half the acceptance criteria.

### Incremental Delivery

1. Setup (T001) → foundation confirmed.
2. User Story 1 (T002-T003) → validate independently → demo (partial MVP: Services page).
3. User Story 2 (T004-T005) → validate independently → demo (full feature: footer on every page).
4. Polish (T006-T008) → typecheck, lint, full quickstart validation → done.

---

## Notes

- [P] tasks = different files, no dependencies.
- [Story] label maps each task to US1 or US2 for traceability back to `spec.md`.
- No test tasks are included — no test framework is configured in this repo, and the spec does not request TDD.
- Commit after each task or logical pair (markup + its CSS).
- Both user stories can be validated independently using the corresponding scenario in `quickstart.md`.
