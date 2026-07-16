---

description: "Task list template for feature implementation"
---

# Tasks: Services Pricing section

**Input**: Design documents from `/specs/COT-013-services-pricing-section/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested in the feature specification — no test tasks are included. Validation is manual visual QA via [quickstart.md](./quickstart.md).

**Organization**: Tasks are grouped by user story (P1: header/tagline, P1: Lead + Associate Organizer cards, P2: Fees card) to enable independent implementation and testing of each story, on top of a shared `PricingCard` foundation used by the two card-bearing stories.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) — paths follow the structure defined in [plan.md](./plan.md#source-code-repository-root):

```text
app/routes/pages/services/
├── index.tsx
└── components/pricing/
    ├── index.tsx
    ├── pricing.css
    └── components/PricingCard/
        ├── PricingCard.tsx
        ├── PricingCard.types.ts
        └── pricingCard.css
```

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

No setup tasks are required. The `pricing/` component directory and its placeholder `index.tsx` already exist at `app/routes/pages/services/components/pricing/`, and `app/routes/pages/services/index.tsx` already imports and renders `<Pricing />` as the fourth and final element, directly after `<Service />`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the reusable `PricingCard` sub-component that the two card-bearing user stories (organizer cards and fees card) render through. Per [research.md](./research.md), this is a single typed component supporting both content shapes (rate + prose description, or a fee-notes list), so it must exist before either card-bearing story can render a real card.

**⚠️ CRITICAL**: No card-bearing user story work can begin until this phase is complete

- [ ] T001 [P] Create `app/routes/pages/services/components/pricing/components/PricingCard/PricingCard.types.ts` exporting a `PricingCardProps` type per [data-model.md](./data-model.md)'s PricingCard prop contract: `eyebrow: string`, `title: string`, `price?: string`, `description?: string`, `features?: string[]`, `featured?: boolean`, `ctaLabel?: string`
- [ ] T002 [P] Create `app/routes/pages/services/components/pricing/components/PricingCard/pricingCard.css` translating the `.pricing-card`, `.pricing-card:hover`, `.pricing-card.featured`, `.pricing-card.featured::before`, `.pricing-card-eyebrow`, `.pricing-card.featured .pricing-card-eyebrow`, `.pricing-card-name`, `.pricing-card-price`, `.pricing-card-divider`, `.pricing-card-features`, `.pricing-card-features li`, `.pricing-check`, `.pricing-card.featured .pricing-check`, `.pricing-card-cta`, `.pricing-card-cta:hover`, `.pricing-card.featured .pricing-card-cta`, and `.pricing-card.featured .pricing-card-cta:hover` rules from the `PRICING` block in `.specify\site-design\curated-services-mockup.html` into camelCase class names (`.pricingCard`, `.pricingCard:hover`, `.pricingCard.featured`, `.pricingCard.featured::before`, `.pricingCardEyebrow`, `.pricingCard.featured .pricingCardEyebrow`, `.pricingCardName`, `.pricingCardPrice`, `.pricingCardDivider`, `.pricingCardFeatures`, `.pricingCardFeatures li`, `.pricingCheck`, `.pricingCard.featured .pricingCheck`, `.pricingCardCta`, `.pricingCardCta:hover`, `.pricingCard.featured .pricingCardCta`, `.pricingCard.featured .pricingCardCta:hover`), reusing the existing `--warm-white`/`--warm-bg`/`--brand-teal`/`--charcoal`/`--charcoal-soft`/`--muted`/`--taupe`/`--taupe-dark`/`--border`/`--cream`/`--serif`/`--sans` tokens from `app/app.css`:
  - `.pricingCard`: `border: 1px solid var(--border)`, `padding: 40px 32px`, `text-align: center`, `background: var(--warm-white)`, `transition: transform 0.3s, box-shadow 0.3s`, `position: relative`
  - `.pricingCard:hover`: `transform: translateY(-4px)`, `box-shadow: 0 12px 40px rgba(44, 44, 42, 0.06)`
  - `.pricingCard.featured`: `border-color: var(--brand-teal)`, `background: var(--warm-bg)`
  - `.pricingCard.featured::before`: `content: ''`, `position: absolute`, `top: 0`, `left: 0`, `right: 0`, `height: 3px`, `background: var(--brand-teal)`
  - `.pricingCardEyebrow`: `font-family: var(--sans)`, `font-size: 10px`, `letter-spacing: 0.15em`, `text-transform: uppercase`, `color: var(--taupe)`, `margin-bottom: 12px`
  - `.pricingCard.featured .pricingCardEyebrow`: `color: var(--brand-teal)`
  - `.pricingCardName` (applied to the card's `<h3>` title): `font-family: var(--serif)`, `font-size: 26px`, `font-weight: 400`, `color: var(--charcoal)`, `margin-bottom: 8px`
  - `.pricingCardPrice`: `font-family: var(--sans)`, `font-size: 14px`, `font-weight: 400`, `color: var(--taupe-dark)`, `margin-bottom: 28px`
  - `.pricingCardDivider`: `height: 1px`, `background: var(--border)`, `margin-bottom: 24px`
  - New (not in mockup, needed for the two organizer cards' prose body — no bullet decomposition per [research.md](./research.md)): `.pricingCardDescription`: `font-family: var(--sans)`, `font-size: 13px`, `font-weight: 300`, `color: var(--taupe-dark)`, `line-height: 1.7`, `text-align: left`, `margin-bottom: 32px`
  - `.pricingCardFeatures`: `list-style: none`, `text-align: left`, `margin-bottom: 32px`
  - `.pricingCardFeatures li`: `font-family: var(--sans)`, `font-size: 13px`, `font-weight: 300`, `color: var(--taupe-dark)`, `padding: 7px 0`, `display: flex`, `align-items: center`, `gap: 10px`
  - `.pricingCheck`: `width: 16px`, `height: 16px`, `border-radius: 50%`, `background: var(--cream)`, `border: 1px solid var(--border)`, `display: flex`, `align-items: center`, `justify-content: center`, `flex-shrink: 0`, `font-size: 9px`, `color: var(--brand-teal)`
  - `.pricingCard.featured .pricingCheck`: `background: rgba(109, 131, 140, 0.12)`, `border-color: rgba(109, 131, 140, 0.25)`
  - `.pricingCardCta`: `display: inline-block`, `font-family: var(--sans)`, `font-size: 11px`, `font-weight: 500`, `letter-spacing: 0.08em`, `text-transform: uppercase`, `padding: 12px 28px`, `text-decoration: none`, `transition: all 0.3s`, `color: var(--taupe-dark)`, `border: 1px solid var(--border)`
  - `.pricingCardCta:hover`: `color: var(--charcoal)`, `border-color: var(--charcoal)`
  - `.pricingCard.featured .pricingCardCta`: `background: var(--charcoal)`, `color: var(--warm-white)`, `border-color: var(--charcoal)`
  - `.pricingCard.featured .pricingCardCta:hover`: `background: var(--charcoal-soft)`
  - Responsive, reusing the breakpoint already established by the sibling `Hero`/`About`/`Service` sections (768px): at ≤768px, reduce `.pricingCard` padding to `32px 24px` so card content stays comfortably inset when the grid (built in T004) stacks to one column
- [ ] T003 Implement `PricingCard` in `app/routes/pages/services/components/pricing/components/PricingCard/PricingCard.tsx` (depends on T001, T002): import `./pricingCard.css`; accept `PricingCardProps`; render `<div className={featured ? 'pricingCard featured' : 'pricingCard'}>` containing `<div className="pricingCardEyebrow">{eyebrow}</div>`, `<h3 className="pricingCardName">{title}</h3>`, `{price && <div className="pricingCardPrice">{price}</div>}`, `<div className="pricingCardDivider" />`, `{description && <p className="pricingCardDescription">{description}</p>}`, `{features && <ul className="pricingCardFeatures">{features.map((f) => <li key={f}><span className="pricingCheck">✓</span>{f}</li>)}</ul>}`, and `{ctaLabel && <a href="#" className="pricingCardCta">{ctaLabel}</a>}`

**Checkpoint**: Foundation ready — `PricingCard` renders any single card correctly given props (rate+description shape or features-list shape, featured or not); the two card-bearing user stories can begin.

---

## Phase 3: User Story 1 - Visitor understands the hourly pricing model (Priority: P1) 🎯 MVP

**Goal**: Render the Pricing section's header and tagline on the Services page, replacing the old package-pricing framing with the new hourly-rate messaging, with the existing eyebrow/heading unchanged.

**Independent Test**: Load the Services page and scroll to the Pricing section. Verify the eyebrow reads "Investment", the heading reads "Transparent pricing" (both unchanged), and the tagline paragraph reads exactly "Every product and space is unique. Services are based on an hourly rate. Your custom quote is built during your free consultation," with no fixed-package language anywhere in the section.

### Implementation for User Story 1

- [ ] T004 [P] [US1] Create `app/routes/pages/services/components/pricing/pricing.css` translating the `.pricing`, `.pricing-header`, `.pricing-header .section-eyebrow`, `.pricing-header .section-heading`, `.pricing-note`, and `.pricing-grid` rules from the `PRICING` block in `.specify\site-design\curated-services-mockup.html` into camelCase class names (`.pricing`, `.pricingHeader`, `.pricingHeader .sectionEyebrow`, `.pricingHeader h2`, `.pricingNote`, `.pricingGrid`), reusing the existing `--warm-white`/`--muted`/`--sans` tokens from `app/app.css`:
  - `.pricing`: `padding: 100px 64px`, `background: var(--warm-white)`
  - `.pricingHeader`: `text-align: center`, `margin-bottom: 16px`
  - `.pricingHeader .sectionEyebrow`: `margin-bottom: 14px`
  - `.pricingHeader h2`: `margin-bottom: 16px`
  - `.pricingNote`: `font-family: var(--sans)`, `font-size: 14px`, `font-weight: 300`, `color: var(--muted)`, `line-height: 1.7`, `max-width: 500px`, `margin: 0 auto 56px`, `text-align: center`
  - `.pricingGrid`: `display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 24px`, `max-width: 1020px`, `margin: 0 auto`
  - Responsive, reusing the breakpoint already established by the sibling `Hero`/`About`/`Service` sections (768px): at ≤768px, `.pricing` padding reduces to `64px 24px` and `.pricingGrid` becomes `grid-template-columns: 1fr` with `gap: 20px`
- [ ] T005 [US1] Implement the `Pricing` container's header/tagline in `app/routes/pages/services/components/pricing/index.tsx` (depends on T004): import `./pricing.css`; render `<section className="pricing"><div className="pricingHeader"><p className="sectionEyebrow">Investment</p><h2>Transparent pricing</h2></div><p className="pricingNote">Every product and space is unique. Services are based on an hourly rate. Your custom quote is built during your free consultation.</p><div className="pricingGrid" /></section>` (the empty `pricingGrid` div is populated with cards in User Story 2)

**Checkpoint**: At this point, the Pricing section's header and tagline render correctly and are independently testable — no package-pricing language remains anywhere in the section.

---

## Phase 4: User Story 2 - Visitor compares the Lead Organizer and Associate Organizer hourly rates (Priority: P1)

**Goal**: Render the Lead Organizer ($100/hour, featured) and Associate Organizer ($75/hour per additional organizer) cards inside the Pricing grid, each with its full role description and a "Book consultation" CTA.

**Independent Test**: Scroll to the Pricing grid and verify the first card is featured (teal border, tinted background) and shows "Lead Organizer" / "$100 / hour" / the Lead Organizer description / a filled "Book consultation" CTA, and the second card (not featured) shows "Associate Organizer" / "$75 / hour per additional organizer" / the Associate Organizer description / an outline "Book consultation" CTA — with no package-tier language on either card.

### Implementation for User Story 2

- [ ] T006 [US2] Add a module-level `cards` data array to `app/routes/pages/services/components/pricing/index.tsx` (depends on T003, T005) with the first two entries per [data-model.md](./data-model.md): `{ eyebrow: 'Lead', title: 'Lead Organizer', price: '$100 / hour', description: 'Strategist that focuses on deep space conceptualization, system architect, consolidation therapy approach (managing the emotional decluttering process) and overall project creative direction.', featured: true, ctaLabel: 'Book consultation' }` and `{ eyebrow: 'Associate', title: 'Associate Organizer', price: '$75 / hour per additional organizer', description: 'Specialist that focuses on independent space execution, high efficiency system implementation, inventory cataloging, labeling, and collaborative team organizing.', ctaLabel: 'Book consultation' }`; replace the empty `<div className="pricingGrid" />` from T005 with `<div className="pricingGrid">{cards.map((c) => <PricingCard key={c.title} {...c} />)}</div>`, importing `PricingCard` from `./components/PricingCard/PricingCard`

**Checkpoint**: At this point, User Stories 1 AND 2 both work — the header, tagline, and both organizer cards render correctly with the featured styling on Lead Organizer only.

---

## Phase 5: User Story 3 - Visitor learns about additional fees that may apply (Priority: P2)

**Goal**: Add a third card to the Pricing grid listing the applicable-fees notes (donation fee, product billing note, travel fee note), visually consistent with the other non-featured card.

**Independent Test**: Scroll to the third pricing card and verify it displays the eyebrow "Fine print", the title "Fees", and lists exactly three fee notes: "Donation fee — $30 per trip", "Products billed separately from organizing time", and "*Travel fees may apply" — with no "Book consultation" CTA on this card.

### Implementation for User Story 3

- [ ] T007 [US3] Add the third entry to the `cards` data array in `app/routes/pages/services/components/pricing/index.tsx` (depends on T006): `{ eyebrow: 'Fine print', title: 'Fees', features: ['Donation fee — $30 per trip', 'Products billed separately from organizing time', '*Travel fees may apply'] }` (no `price`, `description`, `featured`, or `ctaLabel` — `PricingCard` renders the features list and omits the CTA per T003's conditional rendering)

**Checkpoint**: All three pricing cards are now rendered and independently functional — header, tagline, both organizer cards, and the fees card, matching the three-card grid layout from the design screenshot.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec and constitution

- [ ] T008 Run [quickstart.md](./quickstart.md) validation: header/tagline accuracy, featured-card assignment, both organizer cards' copy, the fees card's copy and no-CTA rendering, overall layout match against the design screenshot, and tablet/mobile column stacking with equal-height alignment
- [ ] T009 [P] Confirm no dash-case CSS class names remain in `pricing.css` or `pricingCard.css` (FR-010) and no `any` / `@ts-ignore` was introduced in `PricingCard.tsx` or `pricing/index.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No tasks — nothing blocks Phase 2
- **Foundational (Phase 2)**: T001 and T002 have no dependencies and can run in parallel; T003 depends on both — BLOCKS User Stories 2 and 3 (not User Story 1, which needs no `PricingCard`)
- **User Story 1 (Phase 3)**: T004 has no dependencies and can start immediately; T005 depends on T004
- **User Story 2 (Phase 4)**: Depends on T003 (PricingCard ready) and T005 (Pricing container's header/grid shell must exist)
- **User Story 3 (Phase 5)**: Depends on T006 (the `cards` array must exist before appending to it)
- **Polish (Phase 6)**: Depends on Phases 3–5 completion

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories — fully independent once T004 is done; does not require the Foundational `PricingCard` component
- **User Story 2 (P1)**: Depends on the Foundational `PricingCard` component and on User Story 1's container shell, but is independently verifiable once added — the header/tagline continue to work unchanged
- **User Story 3 (P2)**: Builds on the `cards` array User Story 2 creates (T006), but is independently verifiable once added — the header, tagline, and both organizer cards continue to work unchanged

### Parallel Opportunities

- T001 and T002 have no dependencies on each other and can start immediately in parallel
- T004 (User Story 1's CSS) can start immediately in parallel with T001/T002/T003 (Foundational), since neither depends on the other
- T009 can run in parallel with T008 (different concerns: manual QA vs. code-style check)

---

## Parallel Example: Foundational Phase

```bash
# T001 and T002 touch different files and have no shared dependency:
Task: "Create PricingCard.types.ts with the PricingCardProps contract"
Task: "Create pricingCard.css translating the mockup's pricing-card rules to camelCase"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Skip Phase 1: no setup work required
2. Complete Phase 3: User Story 1 (T004–T005) — header and tagline render correctly (Foundational Phase 2 is not required for this story alone)
3. **STOP and VALIDATE**: Confirm the header/tagline match the spec exactly with no package-pricing language
4. Deploy/demo if ready — this is the smallest possible increment

### Incremental Delivery

1. Complete User Story 1 → header/tagline ready → Test independently → Deploy/Demo
2. Complete Foundational (T001–T003) → `PricingCard` ready
3. Add User Story 2 → Test independently → Deploy/Demo (both organizer cards added)
4. Add User Story 3 → Test independently → Deploy/Demo (fees card added, full feature)
5. Run Phase 6 Polish → Final validation against spec and constitution

### Parallel Team Strategy

With multiple developers:

1. Developer A starts User Story 1 (T004–T005) immediately
2. Developer B starts Foundational (T001–T003) in parallel
3. Once both are done, either developer picks up User Story 2 (T006), then User Story 3 (T007)

---

## Notes

- Three user stories, in priority order: US1 (header/tagline) and US2 (organizer cards) are both P1; US3 (fees card) is P2 — all three are listed here in the order they appear in spec.md
- [P] tasks touch different files with no shared dependency
- Commit after each task or logical group
- Content (eyebrows, titles, rates, descriptions, fee notes, CTA label) for all three cards is fixed, hardcoded copy per spec Assumptions and plan.md Content Layer Decisions — no Sanity schema or query in this pass
- `PricingCard` is always paired with `PricingCard.types.ts` since it takes typed props and is reused three times, per the constitution's architecture rule and [research.md](./research.md); `Pricing`'s own `index.tsx` stays prop-less with no `.types.ts`, matching the precedent already set by the sibling `Hero`/`About`/`Service` components on this route
- Card titles render as `<h3>` (not the mockup's non-semantic `<div>`), per [research.md](./research.md)'s accessibility decision — they nest correctly one level below the section's own `<h2>` ("Transparent pricing")
