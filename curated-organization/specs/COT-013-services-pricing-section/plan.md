# Implementation Plan: Services Pricing section

**Branch**: `COT-013-services-pricing-section` | **Date**: 2026-07-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-013-services-pricing-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement the `Pricing` section on the Services page, replacing the existing placeholder stub (`app/routes/pages/services/components/pricing/index.tsx`), rendered directly below `Service` as the page's final content section before the footer. The section keeps the three-card grid layout and the contrasting/featured card treatment from `.specify/site-design/curated-services-mockup.html`'s `<!-- PRICING -->` markup, but replaces the fixed-package tiers with hourly-rate content per the clarified spec: card 1 (featured) is "Lead Organizer" at "$100 / hour"; card 2 is "Associate Organizer" at "$75 / hour per additional organizer"; card 3 is a "Fees" notes card (eyebrow "Fine print") listing the donation fee, product-billing note, and travel-fee note. The header (eyebrow "Investment", heading "Transparent pricing") is unchanged; only the tagline paragraph is replaced. The component follows the same static-section, plain-CSS-file pattern already established by the sibling `Hero`/`About`/`Service` sections on this route, introducing one new route-local sub-component (`PricingCard`) since the three cards share one shape but differ in content type (rate + prose vs. a fee-notes list).

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`. This feature adds no new dependency — it is a static markup/CSS section using the plain-CSS-file pattern already established by the sibling `Hero`, `About`, and `Service` components on this route.

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. This feature adds no storage — all three cards' copy (eyebrow, title, rate, description/fee list, CTA label) is fixed content hardcoded in the component (see Content Layer Decisions below), consistent with how the sibling `Hero`, `About`, and `Service` sections' copy is treated.

**Testing**: No automated test runner (Vitest/Playwright) is configured in this repo. Validation is manual visual QA against the provided design screenshot (layout/structure only, since its pricing copy is being replaced) and the spec's written content requirements at desktop, tablet, and mobile breakpoints — consistent with how `Hero`, `About`, and `Service` were validated.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new goals beyond the constitution's existing Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms). This section adds no images, so no CLS risk beyond standard text/box layout.

**Constraints**: The three-card grid layout and the featured card's contrasting styling (border color, tinted background, top accent bar) from the mockup must be preserved (spec FR-004, SC-001), with the featured treatment reassigned to card 1 (Lead Organizer) per the spec's Clarifications. No fixed-package pricing language may remain anywhere in the section (spec FR-003, SC-003). The two organizer cards' prose descriptions and the fees card's list-style content differ in shape, so the shared card component must support both without becoming two divergent one-off cards. All cards must remain equal-height and fully readable at tablet/mobile widths despite differing content lengths (spec Edge Cases).

**Scale/Scope**: One existing route-local placeholder component (`pricing`) replaced with its real implementation, on the existing `services` page (`app/routes/pages/services/index.tsx`), where it is already wired in as the fourth and final child, directly after `Service`. Three pricing cards total. No new routes, no schema changes, no new Sanity queries in this pass.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — The `services`
      route stays flat (no route-level files added; only the existing `pricing` sub-component
      placeholder is filled in). Because `Pricing` renders three repeated, differently-parameterized
      cards (eyebrow, title, price/description or fee list, featured flag, optional CTA), it is
      broken into a route-local container (`pricing/index.tsx`, no props, no types file needed —
      same precedent as the prop-less `Hero`/`About`/`Service` containers) plus a route-local
      sub-component, `pricing/components/PricingCard/`, always paired as `PricingCard.tsx` +
      `PricingCard.types.ts` per the architecture rule, since it takes typed props and is reused
      three times within the same component. No Generic/Domain-adapter split applies —
      `PricingCard` has exactly one consumer (`Pricing`) and no behavior that varies per
      consumer beyond the props it's given.
- [x] **Content ownership** — All three cards' copy (eyebrows, titles, rates, descriptions, fee
      list entries, CTA label) is fixed marketing/business content that does not vary per
      instance and is not expected to be edited independently of a broader page-copy pass;
      treated as functional/code content, consistent with how the sibling `Hero`/`About`/`Service`
      sections' copy is hardcoded today. No new content type is introduced, and no existing
      concept is duplicated.
- [x] **Sanity content layer** — N/A for this pass. This feature adds no Sanity schema or
      queries.
- [x] **Media (Cloudinary)** — N/A. This section has no images or video.
- [x] **TypeScript strict** — No `any` or `@ts-ignore` planned. `PricingCard.types.ts` types
      every prop (`eyebrow`, `title`, `price?`, `description?`, `features?: string[]`,
      `featured?: boolean`, `ctaLabel?`); no route types are affected (the `services` route
      already has none).
- [x] **Mobile-first** — Base (mobile) styles for `.pricingGrid`/`.pricingCard` and children are
      written first, with the three-column grid collapsing to a single column at mobile widths,
      matching the breakpoints already used by the sibling `Hero`/`About`/`Service` sections.
- [x] **Accessibility (WCAG 2.1 AA)** — The section heading ("Transparent pricing") renders as
      `<h2>` (matching `About`'s and `Hero`'s heading-level precedent on this route); each
      card's title ("Lead Organizer", "Associate Organizer", "Fees") renders as `<h3>`, correctly
      nested one level below the section's `<h2>` rather than the mockup's non-semantic `<div>`.
      The "Book consultation" CTA links and fee-list markers are keyboard-navigable with visible
      focus indicators; color contrast of all text against card backgrounds (including the
      featured card's tinted background) is verified to meet 4.5:1 (text) / 3:1 (large text) per
      the constitution.
- [x] **Performance & SEO** — No `loader` change needed (static content, no data fetching). No
      new route, so no new `meta` export required beyond what the `services` route already
      defines. No images in this section, so no CLS risk to mitigate.

Any unchecked item is a **blocking violation**. Document justified exceptions in the
Complexity Tracking table.

## Component Design Decisions

<!--
  ACTION REQUIRED for any plan introducing new UI: for every new component, decide where
  it lives per the Architecture article. This turns the constitution's structure rule into
  a concrete per-component decision instead of leaving it to be improvised during
  /speckit.implement.

  Placement:
    - "Route-local"     — Used by exactly one route. Lives in that route's own
                           components/ folder as {Name}/{Name}.tsx + {Name}.types.ts
                           (always paired) — or inline in index.tsx if trivial. No
                           Generic/Domain split — this is the default for most new UI.
    - "Shared — simple"  — Used by 2+ routes but takes props with no per-consumer behavior
                            difference (e.g. Button, Nav). app/components/{Name}/{Name}.tsx
                            + {Name}.types.ts — always paired.
    - "Shared — Generic" — Used by 2+ routes AND owns state/behavior that gets presented
                            differently per consumer. app/components/{Generic}/, always
                            paired with {Generic}.types.ts.
    - "Shared — Domain adapter" — Presentation/config for an existing (or newly-created)
                            Shared — Generic component. app/components/{DomainX}{Generic}/,
                            always paired with its own .types.ts.
-->

| Component     | Placement   | Generic base (if adapter) | Rationale                                                                                                                                                                                     |
| ------------- | ----------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Pricing`     | Route-local | N/A                         | Used only by the `services` route today. Container renders the section header/tagline plus a fixed data array of three cards — no per-consumer variation, so no `.types.ts` needed, matching the `Hero`/`About`/`Service` precedent. |
| `PricingCard` | Route-local | N/A                         | Route-local sub-component of `Pricing`, used three times with different props (rate cards use `price` + `description`; the fees card uses `features` instead). Always paired with `PricingCard.types.ts` per the architecture rule. No Generic/Domain split — single consumer, no per-consumer behavior beyond props. |

## Content Layer Decisions

<!--
  ACTION REQUIRED for any plan introducing new content: classify it per the Content
  Ownership article before writing any schema or query.
-->

| Content item                                                                     | Classification | Content type (new or existing) | Notes                                                                                                                        |
| ---------------------------------------------------------------------------------- | --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Section header/tagline ("Investment" / "Transparent pricing" / new hourly tagline) | Functional      | None                              | Fixed copy hardcoded in `Pricing/index.tsx`; header/eyebrow unchanged from mockup, tagline replaced per spec FR-002.          |
| Lead Organizer & Associate Organizer cards (title, rate, description)              | Functional      | None                              | Fixed business copy hardcoded in `Pricing/index.tsx`, taken verbatim from spec FR-005/FR-006. Not modeled as a Sanity field in this pass. |
| Fees card (eyebrow, title, fee-note list)                                          | Functional      | None                              | Fixed business copy hardcoded in `Pricing/index.tsx`, taken verbatim from spec FR-007/FR-008.                                |

## Project Structure

### Documentation (this feature)

```text
specs/COT-013-services-pricing-section/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — no entities; static content only
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No `contracts/` directory — this feature adds no GROQ queries or other external interfaces
(content is static, hardcoded copy).

### Source Code (repository root)

```text
app/
└── routes/
    └── pages/
        └── services/
            ├── index.tsx                     # Existing — already renders <Pricing /> fourth, unchanged
            └── components/
                └── pricing/                       # Existing placeholder — replaced with real implementation
                    ├── index.tsx                     # Container: header, tagline, three-card data array, maps to <PricingCard />
                    ├── pricing.css                    # New — camelCase class names, reusing global CSS variables
                    └── components/
                        └── PricingCard/                  # New — route-local sub-component, always paired
                            ├── PricingCard.tsx
                            ├── PricingCard.types.ts
                            └── pricingCard.css
```

No changes to `studio/`, `app/components/`, `app/lib/sanity/`, `app/lib/cloudinary/`, or
`app/routes/constants/` — this feature adds no shared component, no Sanity schema/query, no
media, and no new route.

**Structure Decision**: Fits the existing shape as-is — the already-scaffolded `pricing`
placeholder is filled in with a container plus one route-local `PricingCard` sub-component
(needed because the section repeats the same card shape three times with two different content
types — rate+description vs. a fee list), following the same static-section precedent as the
sibling `Hero`/`About`/`Service` components and the paired-types rule already applied elsewhere
in the codebase. No deviation to justify.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally left empty.
