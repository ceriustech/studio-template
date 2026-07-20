# Implementation Plan: Two Paths section

**Branch**: `COT-017-two-paths-section` | **Date**: 2026-07-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-017-two-paths-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Render a static, presentational Two Paths section directly below the Booking page Hero: two
side-by-side cards ("Get started" / "Book again"), each with a circular icon, serif title,
description, and CTA button (solid primary / outlined secondary) linking to the in-page
`#questionnaire` and `#calendly` anchors. Implemented as a route-local `two-paths` section
(mirroring the existing `booking/components/hero/` placement) composing a reusable, data-driven
`PathCard` sub-component — mirroring the `PricingCard`/`ServiceItem` pattern already used
elsewhere in the codebase — with plain `.css` and camelCase class names. No props on the
section itself, no Sanity content, no loader data.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. Not used by this feature — content is static, hardcoded copy per FR-002/FR-003.

**Testing**: No automated test suite exists in this repo for prior sibling sections (Booking Hero, Gallery Hero, Services Hero, Pricing); visual verification against the design screenshot is the acceptance mechanism, consistent with SC-001/SC-002.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new goals beyond the constitution's existing SSR/Core Web Vitals baseline (LCP < 2.5s, CLS < 0.1, INP < 200ms) — this section is static markup with no images/video, so it does not put those budgets at risk.

**Constraints**: Must visually match the design screenshot and the `<!-- TWO PATHS -->` markup in `.specify/site-design/curated-book-mockup.html` exactly (not the gallery mockup named in the raw ticket text — see spec Assumptions); must reuse existing global design tokens (`--warm-white`, `--warm-bg`, `--cream`, `--charcoal`, `--charcoal-soft`, `--taupe`, `--taupe-dark`, `--muted`, `--border`, `--serif`, `--sans`) already defined in `app/app.css` rather than redefining them.

**Scale/Scope**: One route-local section component (`two-paths`) plus one reusable, data-driven `PathCard` sub-component and their stylesheets. Both CTA buttons are in-page anchor links (`#questionnaire`, `#calendly`) targeting sections that ship in later tickets — no schema, query, loader, or shared cross-route component changes.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — `booking/index.tsx`
      stays a flat route container, gaining only the new `<TwoPaths />` render call. The
      section lives at `app/routes/pages/booking/components/two-paths/`, mirroring the
      existing `components/hero/` placement, and takes no props (fixed two-card content), so
      no `.types.ts` on the section itself — consistent with the prop-less Hero precedent.
      It composes a `PathCard` sub-component at
      `two-paths/components/PathCard/PathCard.tsx` + `PathCard.types.ts` (always paired,
      since it takes per-card props), mirroring the `PricingCard`/`ServiceItem` pattern. No
      generic/domain-adapter split — `PathCard` has exactly one consumer.
- [x] **Content ownership** — No new content. All copy (icons, titles, descriptions, button
      labels) is static and hardcoded in a local card-data array, matching FR-002/FR-003 and
      the Hero/Pricing precedent (also hardcoded, not Sanity-driven).
- [x] **Sanity content layer** — N/A. No query, schema, or typegen changes.
- [x] **Media (Cloudinary)** — N/A. Icons are text glyphs ("+", "↻") per the mockup, not
      images or video.
- [x] **TypeScript strict** — `TwoPaths` is a typed React FC with no props; `PathCard` is a
      typed React FC with a `PathCardProps` interface. No `any`/`@ts-ignore` needed.
- [x] **Mobile-first** — Responsive adjustments follow the same pattern already used by
      `booking/components/hero/hero.css` and `services/components/pricing/pricing.css` (base
      desktop styles + `max-width: 768px` override, stacking the two-column grid to one
      column), aligning with `BREAKPOINTS.tablet` (768px) in `app/constants/index.ts`. No new
      breakpoint values are introduced.
- [x] **Accessibility (WCAG 2.1 AA)** — Card titles use a semantic heading element; CTA links
      are real `<a>` elements (not `<div onClick>`) so they are keyboard-focusable and expose
      a visible `:focus-visible` state per Edge Cases; icon glyphs are decorative and paired
      with visible adjacent text, so no separate `alt`/`aria-label` is needed. Text/background
      color pairs are reused verbatim from design tokens already validated by prior sibling
      sections.
- [x] **Performance & SEO** — No loader data needed (static content); this section adds no new
      route, so no new `meta` export is required. No images/video, so no CLS risk.

All items pass. No Complexity Tracking entries required.

## Component Design Decisions

| Component | Placement   | Generic base (if adapter) | Rationale                                                                                                                                                                          |
| --------- | ----------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TwoPaths  | Route-local | N/A                        | Used by exactly one route (Booking); no props, no per-consumer behavior variation. Placed at `booking/components/two-paths/`, matching the `components/hero/` sibling precedent. |
| PathCard  | Route-local | N/A                        | Used only within `TwoPaths` (two instances, data-driven); takes per-card props (icon, title, description, CTA label/href, variant), so it is always paired with `PathCard.types.ts`, matching the `PricingCard`/`ServiceItem` precedent. Not a cross-route shared component — no Generic/Domain split. |

## Content Layer Decisions

| Content item                                              | Classification | Content type (new or existing) | Notes                                                                                                                                   |
| ----------------------------------------------------------- | --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Card icon glyphs, titles, descriptions, CTA labels/hrefs   | Functional       | N/A — hardcoded local data array | Fixed marketing copy with no editorial variation planned (per spec Assumptions); matches Hero/Pricing precedent, which are also hardcoded rather than Sanity-driven. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-017-two-paths-section/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No `data-model.md` or `contracts/` — this feature adds no Sanity schema or query.

### Source Code (repository root)

```text
app/
└── routes/
    └── pages/
        └── booking/
            ├── index.tsx                    # Route container — adds <TwoPaths /> after <Hero /> (existing, edited)
            └── components/
                ├── hero/                     # Existing — unchanged
                └── two-paths/
                    ├── index.tsx             # New — TwoPaths section (no props, no .types.ts needed)
                    ├── two-paths.css         # New — camelCase classes, styles ported from mockup
                    └── components/
                        └── PathCard/
                            ├── PathCard.tsx        # New — reusable card, always paired with types
                            ├── PathCard.types.ts    # New — PathCardProps (icon, title, description, ctaLabel, ctaHref, variant)
                            └── pathCard.css          # New — camelCase classes for card + button variants
```

No changes to `studio/`, `app/lib/sanity/`, `app/lib/cloudinary/`, or `app/routes/constants/`
(the `/booking` route already exists and is already registered).

**Structure Decision**: Fits the fixed shape as-is — a route-local section composing one
route-local, data-driven sub-component, no shared/generic component, no Sanity schema/query,
and no Cloudinary usage. No deviation to justify.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — this section is not applicable.
