---

description: "Task list template for feature implementation"
---

# Tasks: Process section

**Input**: Design documents from `/specs/COT-006-process-section/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested in the feature specification — no test tasks are included. Validation is manual visual QA via [quickstart.md](./quickstart.md).

**Organization**: This feature has a single user story (P1). All implementation tasks are grouped under it.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) — paths follow the structure defined in [plan.md](./plan.md#source-code-repository-root):

```text
app/routes/pages/home/
├── index.tsx
└── components/Process/
    ├── Process.tsx
    ├── Process.types.ts
    └── process.css
```

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [ ] T001 Create the `Process` component directory at `app/routes/pages/home/components/Process/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

No foundational tasks are required for this feature. The global design tokens (`--warm-bg`, `--taupe-light`, `--charcoal`, `--muted`, `--serif`, `--sans` in `app/app.css`) and the shared `.sectionEyebrow` / `.sectionHeading` classes (defined in `app/routes/pages/home/components/Intro/intro.css`) already exist and are reused as-is by sibling sections — confirmed in [research.md](./research.md). Nothing blocks User Story 1.

**Checkpoint**: Foundation ready — User Story 1 implementation can begin immediately after Phase 1.

---

## Phase 3: User Story 1 - Visitor understands the service process at a glance (Priority: P1) 🎯 MVP

**Goal**: Render a static Process section on the home page, between Services and Before/After, showing an eyebrow, heading, and three ordered steps (Consultation, Design + shop, Organizing day) with connector marks, matching the design screenshot exactly.

**Independent Test**: Load the home page, scroll to the section between Services and Before/After, and confirm the eyebrow, heading, and three numbered steps with descriptions render and visually match the design screenshot at both desktop and mobile widths.

### Implementation for User Story 1

- [ ] T002 [P] [US1] Define `ProcessStep` and `ProcessProps` types in `app/routes/pages/home/components/Process/Process.types.ts` per [data-model.md](./data-model.md)
- [ ] T003 [P] [US1] Create `app/routes/pages/home/components/Process/process.css` translating the `.process`, `.process-header`, `.process-grid`, `.process-step`, `.process-num`, `.process-title`, `.process-desc`, and `.process-connector` rules from the `<!-- PROCESS -->` block in `.specify/site-design/curated-home-mockup.html` into camelCase class names (`.process`, `.processHeader`, `.processGrid`, `.processStep`, `.processNum`, `.processTitle`, `.processDesc`, `.processConnector`), reusing the existing `--warm-bg`, `--taupe-light`, `--charcoal`, `--muted`, `--serif`, `--sans` tokens from `app/app.css` and the existing global `.sectionEyebrow` / `.sectionHeading` classes (do not redefine them)
- [ ] T004 [US1] Implement `Process` component in `app/routes/pages/home/components/Process/Process.tsx` (depends on T002, T003): import `process.css`; render a `<section className="process">` with a header (`<p className="sectionEyebrow">The process</p>`, `<h2 className="sectionHeading">How it works</h2>`) and a `processGrid` of three steps — `01 Consultation`, `02 Design + shop`, `03 Organizing day` — each with number (`<div className="processNum">`), title (`<h3 className="processTitle">`), and description (`<p className="processDesc">`) per [data-model.md](./data-model.md) fixed content table; include an `aria-hidden="true"` connector element after steps 1 and 2 only (none after step 3)
- [ ] T005 [US1] Wire the section into `app/routes/pages/home/index.tsx`: import `Process` and render `<Process />` between `<Services />` and `<BeforeAfter />` (depends on T004)
- [ ] T006 [US1] Add mobile-first reflow styles in `process.css` (depends on T003) so `.processGrid` stacks/reflows below the desktop breakpoint without overlapping text, truncation, or loss of step order (01, 02, 03), per spec Edge Cases and FR-007

**Checkpoint**: At this point, the Process section is fully functional, wired into the home page, and independently testable end-to-end.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec and constitution

- [ ] T007 Run [quickstart.md](./quickstart.md) validation: compare the rendered section against the design screenshot at desktop (≥1280px) and mobile (≤768px) widths, and confirm heading semantics (`<h2>` section heading, `<h3>` step titles) and `aria-hidden` connectors
- [ ] T008 [P] Confirm no dash-case CSS class names remain in `process.css` (FR-008) and no `any` / `@ts-ignore` was introduced in `Process.tsx` / `Process.types.ts` (constitution TypeScript-strict check)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: No tasks — nothing blocks Phase 3
- **User Story 1 (Phase 3)**: Depends on Phase 1 (T001). T002 and T003 can run in parallel; T004 depends on both; T005 depends on T004; T006 depends on T003
- **Polish (Phase 4)**: Depends on Phase 3 completion (T005, T006)

### Parallel Opportunities

- T002 and T003 can run in parallel (different files: `Process.types.ts` vs `process.css`)
- T008 can run in parallel with T007 (different concerns: visual QA vs. code-style check)

---

## Parallel Example: User Story 1

```bash
# Launch T002 and T003 together — different files, no shared dependency:
Task: "Define ProcessStep and ProcessProps types in app/routes/pages/home/components/Process/Process.types.ts"
Task: "Create app/routes/pages/home/components/Process/process.css with camelCase class names"
```

---

## Implementation Strategy

### MVP First (and only) — User Story 1

1. Complete Phase 1: Setup (T001)
2. Skip Phase 2: no foundational work required
3. Complete Phase 3: User Story 1 (T002–T006)
4. **STOP and VALIDATE**: Run Phase 4 (T007–T008) against the design screenshot
5. This is the entire feature — there is no incremental multi-story rollout for this section

---

## Notes

- Single user story — no cross-story dependency concerns
- [P] tasks touch different files with no shared dependency
- Commit after each task or logical group
- Content is static/hardcoded per spec Assumptions — no Sanity, no loader changes
