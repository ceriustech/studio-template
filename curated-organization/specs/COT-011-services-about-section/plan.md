# Implementation Plan: Services About section

**Branch**: `COT-011-services-about-section` | **Date**: 2026-07-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-011-services-about-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement the About section directly below the Hero on the Services page, replacing the existing `About` placeholder stub (`app/routes/pages/services/components/about/index.tsx`), matching the markup under `<!-- ABOUT BRIEF -->` in `.specify/site-design/curated-services-mockup.html`. The section is a single static, two-column block: a full-bleed lifestyle photograph (with a subtle gradient overlay) on one side, and text content — an uppercase eyebrow ("About Curated"), a serif headline ("Where order meets elegance"), a descriptive paragraph, and a signed closing line ("— The Curated Team") — on the other, over a warm-white background. There is no per-instance content and no interactive state. The component follows the same static-section pattern already established by the sibling `Hero` section on this same route, reusing existing global CSS variables already defined in `app/app.css`.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`. This feature adds no new dependency — it is a static markup/CSS section using the plain-CSS-file pattern already established by the sibling `Hero` component on this route.

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. This feature adds no storage — the eyebrow, headline, paragraph, signature, and photo URL are fixed copy/asset hardcoded in the component (see Content Layer Decisions below), consistent with how the `Hero` section's copy is treated.

**Testing**: No automated test runner (Vitest/Playwright) is configured in this repo. Validation is manual visual QA against the provided design screenshot at desktop, tablet, and mobile breakpoints — consistent with how the `Hero` section was validated.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new goals beyond the constitution's existing Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms). This section introduces one background image; explicit dimensions on its container prevent layout shift.

**Constraints**: Must visually match the provided design screenshot exactly (per spec Acceptance Criteria); the two-column layout must reflow (e.g., stacking) at tablet and mobile widths without losing or overlapping content; the photo must retain its overlay treatment at all widths.

**Scale/Scope**: One existing route-local placeholder component (`about`) replaced with its real implementation, on the existing `services` page (`app/routes/pages/services/index.tsx`), where it is already wired in as the second child, directly after `Hero`. No new routes, no schema changes, no new Sanity queries in this pass.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — The `services`
      route stays flat (no route-level files added; only the existing `about` sub-component is
      filled in). The `About` component is route-local and purely presentational with no props
      (static content, no state, no per-consumer variation), so it keeps the existing
      `about/index.tsx` shape without a `.types.ts` file — the same precedent already
      established by the sibling `Hero` component on this route
      (`app/routes/pages/services/components/hero/index.tsx`), which is the identical case (a
      static, prop-less section). No Generic/Domain-adapter split applies — this component has
      exactly one consumer (the `services` route) and no behavior that varies per consumer.
- [x] **Content ownership** — The eyebrow label, headline, paragraph, signature line, and photo
      are fixed marketing copy/asset that do not vary per instance and are not expected to be
      edited independently of a broader page-copy pass; treated as functional/code content,
      consistent with how the sibling `Hero` section's copy is hardcoded today. No new content
      type is introduced.
- [x] **Sanity content layer** — N/A for this pass. This feature adds no Sanity schema or
      queries.
- [x] **Media (Cloudinary)** — N/A. The photograph is a static image (CSS `background-image`),
      not video, so the Cloudinary video principle does not apply; no video asset is introduced.
- [x] **TypeScript strict** — No `any` or `@ts-ignore` planned. No props exist to type (static
      content), matching the precedent set by the sibling `Hero` component; no route types are
      affected (the `services` route already has none).
- [x] **Mobile-first** — Base (mobile) styles for `.aboutBrief` and its children are written
      first, with the two-column grid collapsing to a single column at mobile widths; padding
      and image height scale down at tablet (768px) and mobile (480px) widths, matching the
      breakpoints already used by the sibling `Hero` section.
- [x] **Accessibility (WCAG 2.1 AA)** — The photograph conveys decorative lifestyle imagery
      alongside text that fully conveys the section's meaning; it is implemented as a CSS
      `background-image` on a purely decorative element (no `<img>` needed, so no missing `alt`
      risk); the headline renders as an `<h2>` (Hero already owns the page's `<h1>`); color
      contrast of the eyebrow, headline, paragraph, and signature against the warm-white
      background is verified to meet 4.5:1 (text) / 3:1 (large text) per the constitution.
- [x] **Performance & SEO** — No `loader` change needed (static content, no data fetching). No
      new route, so no new `meta` export required beyond what the `services` route already
      defines. The photo container has an explicit height to protect CLS, consistent with the
      mockup's fixed/clamped image height.

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

| Component | Placement   | Generic base (if adapter) | Rationale                                                                                                                                         |
| --------- | ----------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `About`   | Route-local | N/A                         | Used only by the `services` route today. Purely presentational, no state, no per-consumer behavior — matches the existing sibling `Hero` precedent, so no `.types.ts` and no Generic/Domain split apply. |

## Content Layer Decisions

<!--
  ACTION REQUIRED for any plan introducing new content: classify it per the Content
  Ownership article before writing any schema or query.
-->

| Content item                                                          | Classification | Content type (new or existing) | Notes                                                                                                                                              |
| ------------------------------------------------------------------------ | --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Eyebrow ("About Curated"), headline, paragraph, signature, photo URL | Functional      | None                              | Fixed business copy/asset hardcoded in `about/index.tsx`, matching the mockup exactly. Not modeled as a Sanity field in this pass, consistent with the sibling `Hero` section. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-011-services-about-section/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — no entities; static content only
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No `contracts/` directory — this feature adds no GROQ queries or other external interfaces
(content is static, hardcoded copy and a static image URL).

### Source Code (repository root)

```text
app/
└── routes/
    └── pages/
        └── services/
            ├── index.tsx                     # Existing — already renders <About /> second, unchanged
            └── components/
                └── about/                         # Existing placeholder — replaced with real markup
                    ├── index.tsx                     # camelCase JSX class names
                    └── about.css                     # New — camelCase class names, reusing global CSS variables
```

No changes to `studio/`, `app/components/`, `app/lib/sanity/`, `app/lib/cloudinary/`, or
`app/routes/constants/` — this feature adds no shared component, no Sanity schema/query, no
video, and no new route.

**Structure Decision**: Fits the existing shape as-is — the already-scaffolded `about`
placeholder is filled in with its real markup and a co-located CSS file, following the exact
precedent of the sibling `Hero` component on this same route. No deviation to justify.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally left empty.
