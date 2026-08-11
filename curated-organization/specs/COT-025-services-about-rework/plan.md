# Implementation Plan: Services About Section Mobile Rework

**Branch**: `COT-025-services-about-rework` | **Date**: 2026-08-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-025-services-about-rework/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

On the Services page About section, reorder the stacked (mobile/tablet) layout so the eyebrow label + heading render above the founder photo and the certification logo items render below it, matching the provided design — without changing the existing two-column desktop layout. The approach restructures the existing `About` component's JSX into four DOM-ordered blocks (header, image, body, logos), matching the desired mobile reading order. The base (unprefixed) CSS — which already represented the desktop two-column layout in this file before this feature — is kept as the visual baseline and updated only to place those four blocks via `grid-template-areas` instead of relying on 2-item DOM auto-placement (a mechanical requirement of the DOM reorder, not a visual change). The actual reorder is expressed entirely inside the file's existing `@media (max-width: 768px)` block, so the diff is scoped to mobile only, per explicit direction to avoid touching desktop behavior. No new components, no content/data changes.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database.

**Testing**: No automated test framework is configured in this repo (no Vitest/Playwright in `package.json`). Validation is manual: `npm run typecheck` plus a visual check of the Services page About section across breakpoints per `quickstart.md`.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No change to existing goals — this is a CSS/markup reorder of already-rendered elements; no new assets, no additional network requests, no CLS impact beyond what already exists (image dimensions unchanged).

**Constraints**: Must not change the existing desktop/tablet two-column visual layout (spec FR-005). Must not change copy, imagery, or content. The reorder must hold at all widths where the section already stacks into one column, not only below one specific pixel value.

**Scale/Scope**: One existing component (`app/routes/pages/services/components/about/index.tsx` and its co-located `about.css`) on the Services page (`/services` route). No other routes touched.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Architecture — flat routes, components always paired with types** — No new component is created; the existing `About` component (route-local, under `services/components/about/`) is restructured internally. It is a plain functional component with no props, so it has never carried a `.types.ts` file — this is a pre-existing state, not a change introduced here, and there is nothing typed to extract. No new files, no new folders.
- [x] **Content ownership** — No new content is introduced. The eyebrow, heading, body copy, signature, and logo labels remain the existing hardcoded strings in `About`'s JSX (this component was not Sanity-driven before this change and remains so — out of scope per the spec's Assumptions).
- [x] **Sanity content layer** — Not applicable; no queries added or changed.
- [x] **Media (Cloudinary)** — Not applicable; the founder photo and logo images are static local assets (`~/assets/...`), unchanged by this feature, and are not video.
- [x] **TypeScript strict** — No new `any`/`@ts-ignore`; the component has no props today and gains none.
- [x] **Mobile-first** — This component's CSS predates this feature as desktop-first (base rules = desktop, `max-width` media queries override for smaller screens) rather than mobile-first from scratch. Per explicit direction to keep this change scoped to the mobile view only, the reorder is implemented entirely inside the existing `@media (max-width: 768px)` block rather than restructuring the whole file to a mobile-first cascade — re-architecting an unrelated, pre-existing pattern was out of scope for this change. No new breakpoint values are introduced; the existing `768px`/`480px` values (aligned with `app/constants/index.ts`'s `tablet: 768px`) are reused as-is.
- [x] **Accessibility (WCAG 2.1 AA)** — Reordering is done via actual DOM order (not just visual `order`), so mobile screen-reader reading order matches the visual order the design specifies. `alt` text on the photo and logo images is preserved unchanged.
- [x] **Performance & SEO** — No new images, no new routes, no loader changes; `meta` export and image `width`/`height` attributes are unaffected by this change.

No violations — Complexity Tracking table is not needed.

## Component Design Decisions

| Component | Placement                                                     | Generic base (if adapter) | Rationale                                                                                                                 |
| --------- | -------------------------------------------------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `About`   | Route-local (existing — `services/components/about/index.tsx`) | N/A                         | Already exists as a route-local, single-consumer component; this feature only restructures its internal JSX/CSS, no new component is warranted for a pure reorder. |

## Content Layer Decisions

Not applicable — this feature makes no content or Sanity schema/query changes. The About section's copy (eyebrow, heading, body paragraph, signature, logo labels) stays hardcoded in the component exactly as it is today.

## Project Structure

### Documentation (this feature)

```text
specs/COT-025-services-about-rework/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — no new entities (layout-only change)
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No `contracts/` directory — this feature adds no GROQ queries or other external interface.

### Source Code (repository root)

```text
app/
└── routes/
    └── pages/
        └── services/
            └── components/
                └── about/
                    ├── index.tsx     # Restructured: header/image/body/logos blocks in mobile-first DOM order
                    └── about.css     # Restructured: mobile-first base rules + grid-template-areas reflow at tablet+
```

**Structure Decision**: Fits the existing shape as-is — no new files, no new directories. Only the two existing files for the `About` route-local component are modified.

## Complexity Tracking

_No violations — this section is intentionally empty._
