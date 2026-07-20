# Implementation Plan: Booking Hero section

**Branch**: `COT-016-booking-hero-section` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-016-booking-hero-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Render a static, presentational Hero section as the first element of the Booking page: an eyebrow label ("Book a consultation"), a serif headline ("Let's transform your space"), and a supporting paragraph, centered over a cream background with two large soft-edged decorative circles clipped to the section bounds. Implemented as a route-local component (`app/routes/pages/booking/components/hero/`) using a plain `.css` file with camelCase class names, mirroring the existing Gallery and Services page Hero sections exactly — no props, no Sanity content, no loader data.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. Not used by this feature — content is static, hardcoded copy per FR-002.

**Testing**: No automated test suite exists in this repo for prior sibling sections (Gallery Hero, Services Hero); visual verification against the design screenshot is the acceptance mechanism, consistent with SC-001/SC-002.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new goals beyond the constitution's existing SSR/Core Web Vitals baseline (LCP < 2.5s, CLS < 0.1, INP < 200ms) — this section is static markup with no images/video, so it does not put those budgets at risk.

**Constraints**: Must visually match the design screenshot and the `<!-- HERO -->` markup in `.specify/site-design/curated-book-mockup.html` exactly; must reuse existing global design tokens (`--cream`, `--charcoal`, `--muted`, `--taupe`, `--serif`, `--sans`) already defined in `app/app.css` rather than redefining them.

**Scale/Scope**: One route-local component (Booking page Hero) and its stylesheet. No schema, query, loader, or shared-component changes.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — `booking/index.tsx`
      stays a flat route container; it gains no `.types.ts`/`.query.ts` since it needs none.
      The Hero is a route-local component at `app/routes/pages/booking/components/hero/`
      (mirroring Gallery's and Services' `components/hero/`), containing `index.tsx` +
      `hero.css`. It takes no props, so no `.types.ts` is added — consistent with the
      existing Gallery/Services Hero siblings, which are also prop-less and have no
      `.types.ts` file. No generic/domain-adapter split — this is a single-consumer,
      route-local component.
- [x] **Content ownership** — No new content. All copy (eyebrow, headline, paragraph) is
      static and hardcoded in the component, matching FR-002 and the existing Gallery/Services
      Hero precedent (also hardcoded, not Sanity-driven).
- [x] **Sanity content layer** — N/A. No query, schema, or typegen changes.
- [x] **Media (Cloudinary)** — N/A. No video or image assets in this section.
- [x] **TypeScript strict** — Component is a typed React FC with no props; no `any`/`@ts-ignore`
      needed.
- [x] **Mobile-first** — Responsive adjustments follow the exact pattern already used by
      `gallery/components/hero/hero.css` and `services/components/hero/hero.css` (base
      desktop styles + `max-width: 768px` / `max-width: 480px` overrides matching the
      `BREAKPOINTS.tablet` / near-`mobileL` values in `app/constants/index.ts`). No new
      breakpoint values are introduced.
- [x] **Accessibility (WCAG 2.1 AA)** — Headline uses a semantic `<h1>`; eyebrow and paragraph
      use `<p>`; the decorative circles are pure CSS pseudo-elements (`::before`/`::after`),
      not images, so no `alt` text is needed. Text/background color pairs are reused verbatim
      from the design tokens already in use elsewhere (contrast already validated by prior
      sibling sections using the same tokens).
- [x] **Performance & SEO** — No loader data needed (static content); this section adds no
      new route, so no new `meta` export is required. No images/video, so no CLS risk from
      this section.

All items pass. No Complexity Tracking entries required.

## Component Design Decisions

| Component | Placement   | Generic base (if adapter) | Rationale                                                                                                                                                                       |
| --------- | ----------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero      | Route-local | N/A                        | Used by exactly one route (Booking); no props, no per-consumer behavior variation. Placed at `booking/components/hero/` matching the Gallery/Services Hero precedent, rather than the mismatched pre-existing empty `booking/hero/` stub. |

## Content Layer Decisions

| Content item                                     | Classification | Content type (new or existing) | Notes                                                                                                             |
| ------------------------------------------------- | --------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Hero eyebrow, headline, paragraph copy             | Functional       | N/A — hardcoded in component    | Fixed marketing copy with no editorial variation planned (per spec Assumptions); matches Gallery/Services Hero precedent, which are also hardcoded rather than Sanity-driven. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-016-booking-hero-section/
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
            ├── index.tsx              # Route container — renders <Hero /> (existing, edited)
            └── components/
                └── hero/
                    ├── index.tsx      # New — Hero component (no props, no .types.ts needed)
                    └── hero.css       # New — camelCase classes, styles ported from mockup
```

No changes to `studio/`, `app/lib/sanity/`, `app/lib/cloudinary/`, or `app/routes/constants/`
(the `/booking` route already exists and is already registered). The pre-existing empty
`app/routes/pages/booking/hero/index.tsx` and `booking.types.ts`/`utils.ts` stubs are removed
in favor of the `components/hero/` placement, since the route needs no route-level types or
utils for this feature.

**Structure Decision**: Fits the fixed shape as-is — a single route-local component with no
shared/generic component, no Sanity schema/query, and no Cloudinary usage. No deviation to
justify.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — this section is not applicable.
