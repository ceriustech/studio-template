---

description: "Task list template for feature implementation"
---

# Tasks: Services About section

**Input**: Design documents from `/specs/COT-011-services-about-section/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested in the feature specification — no test tasks are included. Validation is manual visual QA via [quickstart.md](./quickstart.md).

**Organization**: This feature has a single user story (P1) — a static section with no variations, so there is only one phase of implementation work.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) — paths follow the structure defined in [plan.md](./plan.md#source-code-repository-root):

```text
app/routes/pages/services/
├── index.tsx
└── components/about/
    ├── index.tsx
    └── about.css
```

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

No setup tasks are required. The `about/` component directory and its placeholder `index.tsx` already exist at `app/routes/pages/services/components/about/`, and `app/routes/pages/services/index.tsx` already imports and renders `<About />` as the second element, directly after `<Hero />`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

No foundational tasks are required for this feature. The global design tokens (`--warm-white`, `--charcoal`, `--muted`, `--taupe`, `--taupe-dark`, `--serif`, `--sans`) already exist in `app/app.css` and are reused as-is, per [research.md](./research.md). Nothing blocks User Story 1.

**Checkpoint**: Foundation ready — User Story 1 implementation can begin immediately.

---

## Phase 3: User Story 1 - Visitor learns who Curated is and what they do (Priority: P1) 🎯 MVP

**Goal**: Render a static About section directly below the Hero on the Services page, showing a two-column layout — a full-bleed photograph with a gradient overlay on one side, and an eyebrow label, headline, paragraph, and signature on the other — matching the design screenshot exactly.

**Independent Test**: Load the Services page and confirm the About section renders directly below the Hero, with the photograph and gradient overlay on one side and the "ABOUT CURATED" eyebrow, "Where order meets elegance" headline, descriptive paragraph, and "— The Curated Team" signature on the other, matching the design screenshot at desktop, tablet, and mobile widths.

### Implementation for User Story 1

- [X] T001 [P] [US1] Create `app/routes/pages/services/components/about/about.css` translating the `.about-brief`, `.about-brief-img`, `.about-brief-img-overlay`, `.about-brief-text .section-eyebrow` (combined with the generic `.section-eyebrow` rule), `.about-brief-text h2`, `.about-brief-text p`, and `.about-brief-text .about-signature` rules from the `<!-- ABOUT BRIEF -->` block in `.specify/site-design/curated-services-mockup.html` into camelCase class names (`.aboutBrief`, `.aboutBriefImg`, `.aboutBriefImgOverlay`, `.aboutBriefText .sectionEyebrow`, `.aboutBriefText h2`, `.aboutBriefText p`, `.aboutBriefText .aboutSignature`), reusing the existing `--warm-white`/`--charcoal`/`--muted`/`--taupe`/`--taupe-dark`/`--serif`/`--sans` tokens from `app/app.css`:
  - `.aboutBrief`: `padding: 100px 64px`, `display: grid`, `grid-template-columns: 1fr 1fr`, `gap: 64px`, `align-items: center`, `background: var(--warm-white)`
  - `.aboutBriefImg`: `height: 420px`, `background-size: cover`, `background-position: center`, `position: relative`, `overflow: hidden`
  - `.aboutBriefImgOverlay`: `position: absolute`, `inset: 0`, `background: linear-gradient(135deg, rgba(245, 240, 232, 0.05) 0%, rgba(44, 44, 42, 0.04) 100%)`
  - `.aboutBriefText .sectionEyebrow`: base eyebrow styling (`font-family: var(--sans)`, `font-size: 10px`, `letter-spacing: 0.2em`, `text-transform: uppercase`, `color: var(--taupe)`) plus `margin-bottom: 14px`
  - `.aboutBriefText h2`: `font-family: var(--serif)`, `font-size: 32px`, `font-weight: 400`, `color: var(--charcoal)`, `margin-bottom: 20px`, `line-height: 1.2`
  - `.aboutBriefText p`: `font-family: var(--sans)`, `font-size: 14px`, `font-weight: 300`, `color: var(--muted)`, `line-height: 1.9`, `max-width: 440px`
  - `.aboutBriefText .aboutSignature`: `margin-top: 28px`, `font-family: var(--serif)`, `font-size: 16px`, `font-style: italic`, `color: var(--taupe-dark)`, `letter-spacing: 0.02em`
- [X] T002 [US1] Implement the `About` component in `app/routes/pages/services/components/about/index.tsx` (depends on T001): import `./about.css`; render `<section className="aboutBrief">` containing a `<div className="aboutBriefImg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1000&q=80&auto=format')" }}>` with a nested `<div className="aboutBriefImgOverlay" />`, and a `<div className="aboutBriefText">` containing `<p className="sectionEyebrow">About Curated</p>`, `<h2>Where order meets elegance</h2>`, the descriptive paragraph ("Curated is a professional organizing studio serving the NOVA and DMV area. We transform cluttered, overwhelming spaces into functional sanctuaries — homes and offices that look beautiful and work effortlessly for the way you actually live. Every project starts with listening, and every system we build is designed to last long after we leave."), and `<div className="aboutSignature">— The Curated Team</div>`, matching [data-model.md](./data-model.md)'s fixed content
- [X] T003 [US1] Add responsive scaling in `about.css` (depends on T001): at the 768px breakpoint, collapse `.aboutBrief` to `grid-template-columns: 1fr` (stacked layout), reduce `gap` to `32px`, reduce `.aboutBriefImg` height to `300px`, and remove the `max-width` constraint on `.aboutBriefText p`; at the 480px breakpoint, further reduce `.aboutBriefImg` height to `260px` and `.aboutBriefText h2` font-size to `27px`; reusing the exact breakpoints already established by the sibling `Hero` section, consolidating the mockup's finer-grained 960px/720px/520px/380px rules per [research.md](./research.md), matching spec Edge Cases

**Checkpoint**: At this point, the About section is fully functional, already wired into the Services page, and independently testable end-to-end.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec and constitution

- [ ] T004 Run [quickstart.md](./quickstart.md) validation: desktop screenshot match, tablet/mobile column stacking, image-load-failure fallback, and paragraph reflow
- [ ] T005 [P] Confirm no dash-case CSS class names remain in `about.css` (FR-006) and no `any` / `@ts-ignore` was introduced in `index.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No tasks — nothing blocks Phase 3
- **Foundational (Phase 2)**: No tasks — nothing blocks Phase 3
- **User Story 1 (Phase 3)**: T001 has no dependencies; T002 depends on T001; T003 depends on T001
- **Polish (Phase 4)**: Depends on Phase 3 completion

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories (this feature has only one story)

### Parallel Opportunities

- T001 has no dependencies and can start immediately
- T005 can run in parallel with T004 (different concerns: manual QA vs. code-style check)

---

## Parallel Example: User Story 1

```bash
# T001 has no dependency and can start immediately; T002 and T003 both depend on it
# and can be worked on once T001 lands, but touch the same file (index.tsx vs about.css
# already split) so only T003 can trail T001 in parallel with T002 review:
Task: "Create app/routes/pages/services/components/about/about.css with camelCase class names"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Skip Phase 1 and Phase 2: no setup or foundational work required
2. Complete Phase 3: User Story 1 (T001–T003)
3. **STOP and VALIDATE**: Confirm the section matches the design screenshot exactly at all breakpoints
4. Deploy/demo if ready — this is the entire feature; there is no further increment

### Incremental Delivery

1. Add User Story 1 → Test independently → Deploy/Demo (MVP and full feature)
2. Run Phase 4 Polish → Final validation against spec and constitution

---

## Notes

- Single user story: US1 is both the MVP and the complete feature — there is no P2/P3 to layer on
- [P] tasks touch different files with no shared dependency
- Commit after each task or logical group
- Content (eyebrow, headline, paragraph, signature, photo URL) is fixed, hardcoded copy per spec Assumptions and plan.md Content Layer Decisions — no Sanity schema or query in this pass
- No `.types.ts` file for this component — it takes no props, matching the precedent already set by the sibling `Hero` component on this route, per [research.md](./research.md)
