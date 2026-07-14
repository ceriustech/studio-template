---

description: "Task list template for feature implementation"
---

# Tasks: Footer section

**Input**: Design documents from `/specs/COT-009-footer-section/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested in the feature specification — no test tasks are included. Validation is manual visual/interaction QA via [quickstart.md](./quickstart.md).

**Organization**: This feature has a single user story (P1) — a static section with no variations, so there is only one phase of implementation work.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) — paths follow the structure defined in [plan.md](./plan.md#source-code-repository-root):

```text
app/routes/pages/home/
├── index.tsx
└── components/Footer/
    ├── Footer.tsx
    ├── Footer.types.ts
    └── footer.css
```

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [X] T001 Create the `Footer` component directory at `app/routes/pages/home/components/Footer/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

No foundational tasks are required for this feature. The global design tokens (`--cream`, `--charcoal`, `--taupe`, `--taupe-dark`, `--serif`, `--sans`) already exist in `app/app.css` and are reused as-is, per [research.md](./research.md). The `/services`, `/gallery`, and `/booking` routes already exist (`PAGE_ROUTES_DATA` in `app/routes/constants/index.ts`) and only need to be referenced; the "About" link and all Connect/social links use placeholder `#` anchors, per [research.md](./research.md). Nothing blocks User Story 1.

**Checkpoint**: Foundation ready — User Story 1 implementation can begin immediately after Phase 1.

---

## Phase 3: User Story 1 - Visitor finds site-wide navigation and business info at a glance (Priority: P1) 🎯 MVP

**Goal**: Render a static Footer section as the final element of the home page, showing the brand block, "Navigate"/"Connect"/"Hours" columns, a divider, and a bottom bar (copyright + social links), matching the design screenshot exactly.

**Independent Test**: Load the home page, scroll to the bottom, and confirm the brand name/description, three link columns, divider, and bottom bar render as shown in the design screenshot at desktop, tablet, and mobile widths, and that the "Services," "Gallery," and "Book" links navigate to their existing routes.

### Implementation for User Story 1

- [X] T002 [P] [US1] Define `FooterProps` type in `app/routes/pages/home/components/Footer/Footer.types.ts` per [data-model.md](./data-model.md) (no per-instance content — an empty/no-op props type, since all brand copy, links, and hours are fixed values owned by the component)
- [X] T003 [P] [US1] Create `app/routes/pages/home/components/Footer/footer.css` translating the `.footer`, `.footer-grid`, `.footer-brand-name`, `.footer-brand-desc`, `.footer-heading`, `.footer-links`, `.footer-links a`, `.footer-links a:hover`, `.footer-divider`, `.footer-bottom`, `.footer-social`, and `.footer-social a:hover` rules from the `<!-- FOOTER -->` block in `.specify/site-design/curated-home-mockup.html` into camelCase class names (`.footer`, `.footerGrid`, `.footerBrandName`, `.footerBrandDesc`, `.footerHeading`, `.footerLinks`, `.footerLinks a`, `.footerDivider`, `.footerBottom`, `.footerSocial`), reusing the existing `--cream`/`--charcoal`/`--taupe`/`--taupe-dark`/`--serif`/`--sans` tokens from `app/app.css`
- [X] T004 [US1] Implement `Footer` component in `app/routes/pages/home/components/Footer/Footer.tsx` (depends on T002, T003): import `Link` from `react-router` and `PAGE_ROUTES_DATA` from `app/routes/constants`; render a semantic `<footer className="footer">` containing a `.footerGrid` with four columns — (1) `.footerBrandName` "CURATED" + `.footerBrandDesc` two-line description, (2) a "Navigate" `<h3 className="footerHeading">` + `.footerLinks` list with About (`#`), Services (`<Link to={PAGE_ROUTES_DATA.SERVICES.path}>`), Gallery (`<Link to={PAGE_ROUTES_DATA.GALLERY.path}>`), Book (`<Link to={PAGE_ROUTES_DATA.BOOKING.path}>`), (3) a "Connect" heading + `.footerLinks` list with Email/Phone/Instagram (`#` placeholders), (4) an "Hours" heading + `.footerLinks` list with the three hours entries as `#` anchors — followed by a `.footerDivider` and a `.footerBottom` with the copyright span and a `.footerSocial` block containing Instagram/Facebook `#` anchors
- [X] T005 [US1] Wire the section into `app/routes/pages/home/index.tsx`: import `Footer` and render `<Footer />` as the final element after `<Cta />` (depends on T004)
- [X] T006 [US1] Add responsive reflow styles in `footer.css` (depends on T003): reflow `.footerGrid` to two columns at 768px and one column at 480px, and switch `.footerBottom` to a centered, vertically-stacked column at 480px, matching the mockup's `.footer-grid`/`.footer-bottom` media queries, per spec FR-009

**Checkpoint**: At this point, the Footer section is fully functional, wired into the home page, and independently testable end-to-end.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec and constitution

- [ ] T007 Run [quickstart.md](./quickstart.md) validation: desktop screenshot match, link navigation (Navigate/Connect/social), hover/focus state, tablet/mobile reflow, and long-content wrap
- [ ] T008 [P] Confirm no dash-case CSS class names remain in `footer.css` (FR-010), no `any` / `@ts-ignore` was introduced in `Footer.tsx` or `Footer.types.ts` (constitution TypeScript-strict check), and internal links use `PAGE_ROUTES_DATA` (`SERVICES`, `GALLERY`, `BOOKING`) rather than hardcoded path strings

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: No tasks — nothing blocks Phase 3
- **User Story 1 (Phase 3)**: Depends on Phase 1 (T001). T002 and T003 can run in parallel; T004 depends on both; T005 depends on T004; T006 depends on T003
- **Polish (Phase 4)**: Depends on Phase 3 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependency on other stories (this feature has only one story)

### Parallel Opportunities

- T002 and T003 can run in parallel (different files: `Footer.types.ts` vs `footer.css`)
- T008 can run in parallel with T007 (different concerns: manual QA vs. code-style check)

---

## Parallel Example: User Story 1

```bash
# Launch T002 and T003 together — different files, no shared dependency:
Task: "Define FooterProps type in app/routes/pages/home/components/Footer/Footer.types.ts"
Task: "Create app/routes/pages/home/components/Footer/footer.css with camelCase class names"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Skip Phase 2: no foundational work required
3. Complete Phase 3: User Story 1 (T002–T006)
4. **STOP and VALIDATE**: Confirm the section matches the design screenshot exactly and all links navigate correctly
5. Deploy/demo if ready — this is the entire feature; there is no further increment

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP and full feature)
3. Run Phase 4 Polish → Final validation against spec and constitution

---

## Notes

- Single user story: US1 is both the MVP and the complete feature — there is no P2/P3 to layer on
- [P] tasks touch different files with no shared dependency
- Commit after each task or logical group
- Content (brand copy, link labels, hours) is fixed, hardcoded copy per spec Assumptions and plan.md Content Layer Decisions — no Sanity schema or query in this pass
