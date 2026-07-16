# Implementation Plan: Services Hero section

**Branch**: `COT-010-services-hero-section` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-010-services-hero-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement the Hero section at the top of the Services page, replacing the existing `Hero` placeholder stub (`app/routes/pages/services/components/hero/index.tsx`), matching the markup under `<!-- HERO -->` in `.specify/site-design/curated-services-mockup.html`. The section is a single static, centered block: an uppercase eyebrow label ("The services"), a serif headline ("Bespoke solutions, gracefully executed"), and a supporting paragraph, over a cream background with two large soft-edged decorative circles clipped to the section bounds. There is no per-instance content and no interactive state. The component follows the same static-section pattern already established by sibling sections across the site (`Intro`, `Footer`, home's own `hero`), reusing existing global CSS variables already defined in `app/app.css`.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`. This feature adds no new dependency — it is a static markup/CSS section using the plain-CSS-file pattern already established by `Intro`, `Footer`, and home's `hero`.

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. This feature adds no storage — the eyebrow, headline, and paragraph are fixed copy hardcoded in the component (see Content Layer Decisions below), consistent with how the Footer and home hero copy is treated.

**Testing**: No automated test runner (Vitest/Playwright) is configured in this repo. Validation is manual visual QA against the provided design screenshot at desktop, tablet, and mobile breakpoints — consistent with how prior sections (Intro, Footer, Testimonial, Cta) were validated.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new goals beyond the constitution's existing Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms). This section adds no images, only text and CSS-drawn decorative shapes, so CLS risk is minimal.

**Constraints**: Must visually match the provided design screenshot exactly (per spec Acceptance Criteria); text must remain centered and non-overlapping at tablet and mobile widths; the decorative circles must stay clipped to the section bounds (`overflow: hidden`) at all widths.

**Scale/Scope**: One existing route-local placeholder component (`hero`) replaced with its real implementation, on the existing `services` page (`app/routes/pages/services/index.tsx`), where it is already wired in as the first child. No new routes, no schema changes, no new Sanity queries in this pass.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — The `services`
      route stays flat (no route-level files added; only the existing `hero` sub-component is
      filled in). The `Hero` component is route-local and purely presentational with no props
      (static content, no state, no per-consumer variation), so it keeps the existing
      `hero/index.tsx` shape without a `.types.ts` file — the same precedent already
      established by the merged home-page `hero` component
      (`app/routes/pages/home/components/hero/index.tsx`), which is the identical case (a
      static, prop-less hero). No Generic/Domain-adapter split applies — this component has
      exactly one consumer (the `services` route) and no behavior that varies per consumer.
- [x] **Content ownership** — The eyebrow label, headline, and supporting paragraph are fixed
      marketing copy that does not vary per instance and is not expected to be edited
      independently of a broader page-copy pass; treated as functional/code content, consistent
      with how other static section copy (`Footer`, home `hero`, `Cta`) is hardcoded today. No
      new content type is introduced.
- [x] **Sanity content layer** — N/A for this pass. This feature adds no Sanity schema or
      queries.
- [x] **Media (Cloudinary)** — N/A. This section introduces no images or video assets; the
      decorative circles are CSS-only (`border-radius`/`background`), not image assets.
- [x] **TypeScript strict** — No `any` or `@ts-ignore` planned. No props exist to type (static
      content), matching the precedent set by the merged home `hero` component; no route types
      are affected (the `services` route already has none).
- [x] **Mobile-first** — Base (mobile) styles for `.servicesHero` and its children are written
      first; padding scales down at tablet (768px) and mobile (480px) widths, matching the
      breakpoints already used by sibling sections (`Intro`, `Footer`, `Testimonial`).
- [x] **Accessibility (WCAG 2.1 AA)** — The headline renders as an `<h1>` (this is the primary
      heading for the Services page); the decorative circles are non-informational and excluded
      from the accessibility tree (`aria-hidden="true"`); color contrast of the eyebrow,
      headline, and paragraph against the cream background is verified to meet 4.5:1 (text) /
      3:1 (large text) per the constitution.
- [x] **Performance & SEO** — No `loader` change needed (static content, no data fetching). No
      new route, so no new `meta` export required beyond what the `services` route already
      defines. No images introduced, so no CLS concern.

Any unchecked item is a **blocking violation**. Document justified exceptions in the
Complexity Tracking table.

## Component Design Decisions

| Component | Placement   | Generic base (if adapter) | Rationale                                                                                                                                       |
| --------- | ----------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Hero`    | Route-local | N/A                         | Used only by the `services` route today. Purely presentational, no state, no per-consumer behavior — matches the existing home-page `hero` precedent, so no `.types.ts` and no Generic/Domain split apply. |

## Content Layer Decisions

| Content item                                             | Classification | Content type (new or existing) | Notes                                                                                                                                        |
| ---------------------------------------------------------- | --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Eyebrow ("The services"), headline, supporting paragraph  | Functional      | None                             | Fixed business copy hardcoded in `hero/index.tsx`, matching the mockup exactly. Not modeled as a Sanity field in this pass, consistent with `Footer` and home `hero`. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-010-services-hero-section/
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
            ├── index.tsx                     # Existing — already renders <Hero /> first, unchanged
            └── components/
                └── hero/                          # Existing placeholder — replaced with real markup
                    ├── index.tsx                     # camelCase JSX class names
                    └── hero.css                      # New — camelCase class names, reusing global CSS variables
```

No changes to `studio/`, `app/components/`, `app/lib/sanity/`, `app/lib/cloudinary/`, or
`app/routes/constants/` — this feature adds no shared component, no Sanity schema/query, no
video, and no new route.

**Structure Decision**: Fits the existing shape as-is — the already-scaffolded `hero`
placeholder is filled in with its real markup and a co-located CSS file, following the exact
precedent of the merged home-page `hero` component. No deviation to justify.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally left empty.
