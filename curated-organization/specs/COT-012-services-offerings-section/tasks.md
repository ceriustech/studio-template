---

description: "Task list template for feature implementation"
---

# Tasks: Services Offerings section

**Input**: Design documents from `/specs/COT-012-services-offerings-section/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested in the feature specification — no test tasks are included. Validation is manual visual QA via [quickstart.md](./quickstart.md).

**Organization**: Tasks are grouped by user story (P1: existing three items, P2: Legacy Transitions, P3: Executive Functioning Coach) to enable independent implementation and testing of each story, on top of a shared `ServiceItem` foundation used by all of them.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) — paths follow the structure defined in [plan.md](./plan.md#source-code-repository-root):

```text
app/routes/pages/services/
├── index.tsx
└── components/service/
    ├── index.tsx
    ├── service.css
    └── components/ServiceItem/
        ├── ServiceItem.tsx
        ├── ServiceItem.types.ts
        └── serviceItem.css
```

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

No setup tasks are required. The `service/` component directory and its placeholder `index.tsx` already exist at `app/routes/pages/services/components/service/`, and `app/routes/pages/services/index.tsx` already imports and renders `<Service />` as the third element, directly after `<About />` and before `<Pricing />`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the reusable `ServiceItem` sub-component that every user story (all five service items) renders through. Per [research.md](./research.md), this is a single typed, alternating-orientation component shared by items 1–5, so it must exist before any story can render a real item.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T001 [P] Create `app/routes/pages/services/components/service/components/ServiceItem/ServiceItem.types.ts` exporting a `ServiceItemProps` type per [data-model.md](./data-model.md)'s ServiceItem prop contract: `eyebrow: string`, `heading: string`, `description: string`, `imageUrl: string`, `items: string[]`, `ctaLabel: string`, `reversed?: boolean`
- [ ] T002 [P] Create `app/routes/pages/services/components/service/components/ServiceItem/serviceItem.css` translating the `.service-item`, `.service-item.reverse .service-img`, `.service-item.reverse .service-text`, `.service-img`, `.service-img-overlay`, `.service-text`, `.service-text .section-eyebrow`, `.service-text h2`, `.service-text > p`, `.service-includes`, `.service-includes li`, `.service-includes li:last-child`, `.service-dash`, `.service-cta`, `.service-cta:hover`, and `.service-item.reverse .service-text` (alt background) rules from the `SERVICE ITEMS (alternating)` block in `.specify\site-design\curated-services-mockup.html` into camelCase class names (`.serviceItem`, `.serviceItem.reversed .serviceImg`, `.serviceItem.reversed .serviceText`, `.serviceImg`, `.serviceImgOverlay`, `.serviceText`, `.serviceText .sectionEyebrow`, `.serviceText h2`, `.serviceText > p`, `.serviceIncludes`, `.serviceIncludes li`, `.serviceIncludes li:last-child`, `.serviceDash`, `.serviceCta`, `.serviceCta:hover`), reusing the existing `--warm-white`/`--warm-bg`/`--charcoal`/`--muted`/`--taupe`/`--taupe-light`/`--taupe-dark`/`--border`/`--serif`/`--sans` tokens from `app/app.css`:
  - `.serviceItem`: `display: grid`, `grid-template-columns: 1fr 1fr`, `min-height: 520px`
  - `.serviceItem.reversed .serviceImg`: `order: 2`
  - `.serviceItem.reversed .serviceText`: `order: 1`
  - `.serviceItem.reversed .serviceText` (alt bg): `background: var(--warm-bg)`
  - `.serviceImg`: `background-size: cover`, `background-position: center`, `position: relative`, `overflow: hidden`, `min-height: 520px`
  - `.serviceImgOverlay`: `position: absolute`, `inset: 0`, `background: linear-gradient(135deg, rgba(245, 240, 232, 0.08) 0%, rgba(44, 44, 42, 0.05) 100%)`
  - `.serviceText`: `display: flex`, `flex-direction: column`, `justify-content: center`, `padding: 72px 80px`, `background: var(--warm-white)`
  - `.serviceText .sectionEyebrow`: `margin-bottom: 14px` (combined with the base `.sectionEyebrow` rule already established by sibling sections)
  - `.serviceText h2`: `font-family: var(--serif)`, `font-size: 32px`, `font-weight: 400`, `color: var(--charcoal)`, `margin-bottom: 18px`, `line-height: 1.2`
  - `.serviceText > p`: `font-family: var(--sans)`, `font-size: 14px`, `font-weight: 300`, `color: var(--muted)`, `line-height: 1.8`, `margin-bottom: 28px`, `max-width: 420px`
  - `.serviceIncludes`: `list-style: none`, `margin-bottom: 32px`
  - `.serviceIncludes li`: `font-family: var(--sans)`, `font-size: 13px`, `font-weight: 300`, `color: var(--taupe-dark)`, `padding: 10px 0`, `border-bottom: 1px solid var(--border)`, `display: flex`, `align-items: center`, `gap: 12px`
  - `.serviceIncludes li:last-child`: `border-bottom: none`
  - `.serviceDash`: `width: 12px`, `height: 1px`, `background: var(--taupe-light)`, `flex-shrink: 0`
  - `.serviceCta`: `display: inline-block`, `font-family: var(--sans)`, `font-size: 12px`, `font-weight: 500`, `letter-spacing: 0.08em`, `text-transform: uppercase`, `color: var(--charcoal)`, `border: 1px solid var(--charcoal)`, `padding: 14px 32px`, `text-decoration: none`, `transition: all 0.3s`, `align-self: flex-start`
  - `.serviceCta:hover`: `background: var(--charcoal)`, `color: var(--warm-white)`
  - Responsive, reusing the breakpoints already established by the sibling `Hero`/`About` sections (768px/480px), per [research.md](./research.md)'s decision to consolidate the mockup's finer-grained 960px/720px/520px/380px rules: at ≤768px, `.serviceItem` becomes `grid-template-columns: 1fr` with `min-height: auto`, `.serviceItem.reversed .serviceImg` / `.serviceItem.reversed .serviceText` reset to `order: initial`, `.serviceImg` `min-height: 320px`, `.serviceText > p` `max-width: none`; at ≤480px, `.serviceText h2` `font-size: 27px`, `.serviceImg` `min-height: 280px`, `.serviceIncludes` `margin-bottom: 28px`, `.serviceIncludes li` `align-items: flex-start`, `line-height: 1.5`, `.serviceCta` `width: 100%`, `text-align: center`
- [ ] T003 [US-shared] Implement `ServiceItem` in `app/routes/pages/services/components/service/components/ServiceItem/ServiceItem.tsx` (depends on T001, T002): import `./serviceItem.css`; accept `ServiceItemProps`; render `<section className={reversed ? 'serviceItem reversed' : 'serviceItem'}>` containing a `<div className="serviceImg" style={{ backgroundImage: \`url('${imageUrl}')\` }}>` with a nested `<div className="serviceImgOverlay" />`, and a `<div className="serviceText">` containing `<p className="sectionEyebrow">{eyebrow}</p>`, `<h2>{heading}</h2>`, `<p>{description}</p>`, a `<ul className="serviceIncludes">` mapping `items` to `<li key={item}><span className="serviceDash" />{item}</li>`, and `<a href="#" className="serviceCta">{ctaLabel}</a>`

**Checkpoint**: Foundation ready — `ServiceItem` renders any single item correctly given props; User Story 1 implementation can begin.

---

## Phase 3: User Story 1 - Visitor browses the three core service offerings (Priority: P1) 🎯 MVP

**Goal**: Render the Service section on the Services page with the first three items — Home Organizing, Unpacking + Move-in, Business + Office — in their correct alternating layout, matching the design screenshot exactly.

**Independent Test**: Load the Services page and scroll to the Service section. Verify three service items render in order — Home Organizing (01), Unpacking + Move-in (02, reversed), Business + Office (03) — each with an image, numbered eyebrow, heading, description, bulleted list of inclusions, and a "Get started" link, matching [data-model.md](./data-model.md)'s items 1–3 and the design screenshot.

### Implementation for User Story 1

- [ ] T004 [US1] Implement the `Service` container in `app/routes/pages/services/components/service/index.tsx` (depends on T003): define a module-level `services` data array with the three entries from [data-model.md](./data-model.md) (Home organizing / `01` / not reversed; Unpacking + move-in / `02` / reversed; Business + office / `03` / not reversed), each with its exact `heading`, `description`, `imageUrl`, `items` list, and `ctaLabel: 'Get started'` taken verbatim from the `<!-- SERVICE 1 -->` / `<!-- SERVICE 2 -->` / `<!-- SERVICE 3 -->` blocks in `.specify\site-design\curated-services-mockup.html`; render `<>{services.map((s) => <ServiceItem key={s.heading} {...s} />)}</>` (or an equivalent fragment/section wrapper) so each entry renders via `ServiceItem`, with `reversed` computed as `index % 2 === 1` per [research.md](./research.md)

**Checkpoint**: At this point, the Service section renders items 1–3 fully functional, wired into the Services page, and independently testable end-to-end against the design screenshot.

---

## Phase 4: User Story 2 - Visitor learns about the Legacy Transitions service (Priority: P2)

**Goal**: Add a fourth service item, "Legacy Transitions," continuing the alternating layout (reversed, per FR-005) directly after Business + Office.

**Independent Test**: Scroll to the fourth item in the Service section and verify it displays the eyebrow "04", heading "Legacy Transitions", the specified descriptive subtext, the specified background image, and the four-item bulleted list, with a reversed (text-left, image-right) layout.

### Implementation for User Story 2

- [ ] T005 [US2] Add the fourth entry to the `services` data array in `app/routes/pages/services/components/service/index.tsx` (depends on T004): `eyebrow: '04'`, `heading: 'Legacy Transitions'`, `description: 'We guide families through major life transitions with absolute discretion, care and ease. Whether navigating a sensitive downsize or honoring the estate of a loved one, we manage the entire process by transforming overwhelming logistics into a peaceful, respectful transition'`, `imageUrl: 'https://plus.unsplash.com/premium_photo-1733324428864-3450ea2da8bf?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'`, `items: ['Compassionate discretionary sorting', 'Responsible consignment & Donation curation', 'Seamless Heirloom Logistics — ensuring family pieces reach their next home safely', 'Digital decluttering and legacy protection']`, `ctaLabel: 'Get started'`; confirm the array-index-derived `reversed` logic from T004 correctly marks this (4th, index 3) item as reversed with no per-item override needed

**Checkpoint**: At this point, User Stories 1 AND 2 both work — items 1–4 render correctly with the alternation intact.

---

## Phase 5: User Story 3 - Visitor learns about the Executive Functioning Coach service (Priority: P3)

**Goal**: Add a fifth service item, "Executive Functioning Coach," continuing the alternating layout (non-reversed, per FR-005) directly after Legacy Transitions.

**Independent Test**: Scroll to the fifth item in the Service section and verify it displays the eyebrow "05", heading "Executive Functioning Coach", the specified descriptive subtext, the specified background image, and the three-item bulleted list, with a non-reversed (image-left, text-right) layout.

### Implementation for User Story 3

- [ ] T006 [US3] Add the fifth entry to the `services` data array in `app/routes/pages/services/components/service/index.tsx` (depends on T004; independent of T005's content but touches the same array): `eyebrow: '05'`, `heading: 'Executive Functioning Coach'`, `description: 'Executive functioning skills are the mental processes that help us plan, organize, manage time, stay focused, and follow through on tasks in everyday life'`, `imageUrl: 'https://plus.unsplash.com/premium_photo-1661754876215-247b4db12e83?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'`, `items: ['30-60 minute virtual coaching sessions', 'Personalized strategies', 'Compassionate accountability to help you build and maintain sustainable habits']`, `ctaLabel: 'Get started'`; confirm the array-index-derived `reversed` logic from T004 correctly marks this (5th, index 4) item as non-reversed with no per-item override needed

**Checkpoint**: All five service items are now rendered and independently functional; the full alternating pattern (non-reversed, reversed, non-reversed, reversed, non-reversed) holds across all five.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec and constitution

- [ ] T007 Run [quickstart.md](./quickstart.md) validation: desktop screenshot match for items 1–3, content accuracy for items 4–5, alternation check across all five items, tablet/mobile column stacking, image-load-failure fallback, and variable list-length/long-form-copy reflow
- [ ] T008 [P] Confirm no dash-case CSS class names remain in `serviceItem.css` (FR-008) and no `any` / `@ts-ignore` was introduced in `ServiceItem.tsx` or `service/index.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No tasks — nothing blocks Phase 2
- **Foundational (Phase 2)**: T001 and T002 have no dependencies and can run in parallel; T003 depends on both — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (T003)
- **User Story 2 (Phase 4)**: Depends on T004 (User Story 1's data array must exist before appending to it)
- **User Story 3 (Phase 5)**: Depends on T004; independent of User Story 2's content, but shares the same file as T005 so should land as a separate commit after or before it, not concurrently
- **Polish (Phase 6)**: Depends on Phases 3–5 completion

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories — fully independent once Foundational is done
- **User Story 2 (P2)**: Builds on the data array User Story 1 creates (T004), but is independently verifiable once added — items 1–3 continue to work unchanged
- **User Story 3 (P3)**: Builds on the data array User Story 1 creates (T004), but is independently verifiable once added — items 1–4 continue to work unchanged

### Parallel Opportunities

- T001 and T002 have no dependencies on each other and can start immediately in parallel
- T008 can run in parallel with T007 (different concerns: manual QA vs. code-style check)
- T005 and T006 both modify the same file (`service/index.tsx`); they are logically independent (each adds one array entry) but should be committed sequentially to avoid merge conflicts

---

## Parallel Example: Foundational Phase

```bash
# T001 and T002 touch different files and have no shared dependency:
Task: "Create ServiceItem.types.ts with the ServiceItemProps contract"
Task: "Create serviceItem.css translating the mockup's service-item rules to camelCase"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Skip Phase 1: no setup work required
2. Complete Phase 2: Foundational (T001–T003) — builds the reusable `ServiceItem`
3. Complete Phase 3: User Story 1 (T004) — items 1–3 render and match the screenshot
4. **STOP and VALIDATE**: Confirm items 1–3 match the design screenshot exactly at all breakpoints
5. Deploy/demo if ready — this is the MVP increment

### Incremental Delivery

1. Complete Foundational → `ServiceItem` ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP: items 1–3)
3. Add User Story 2 → Test independently → Deploy/Demo (items 1–4, Legacy Transitions added)
4. Add User Story 3 → Test independently → Deploy/Demo (items 1–5, full feature)
5. Run Phase 6 Polish → Final validation against spec and constitution

---

## Notes

- Three user stories, in priority order: US1 (existing three items) is the MVP; US2 (Legacy Transitions) and US3 (Executive Functioning Coach) each add one further item on top
- [P] tasks touch different files with no shared dependency
- Commit after each task or logical group
- Content (headings, descriptions, images, list entries, CTA label) for all five items is fixed, hardcoded copy per spec Assumptions and plan.md Content Layer Decisions — no Sanity schema or query in this pass
- `ServiceItem` is always paired with `ServiceItem.types.ts` since it takes typed props and is reused five times, per the constitution's architecture rule and [research.md](./research.md); `Service`'s own `index.tsx` stays prop-less with no `.types.ts`, matching the precedent already set by the sibling `Hero`/`About` components on this route
