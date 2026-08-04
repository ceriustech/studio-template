# Implementation Plan: What to Expect Section

**Branch**: `COT-024-what-to-expect-section` | **Date**: 2026-08-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-024-what-to-expect-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a new `WhatToExpect` section (eyebrow "What to Expect", heading "After you book", three numbered steps — Confirmation email / 30-minute consultation / Custom proposal) that the root layout renders in place of the existing sitewide `Cta` ("Ready to transform your space?") section whenever the current route is `/booking`. Every other route keeps rendering `Cta` unchanged. Purely presentational, route-based conditional rendering at the layout level — no new content types, no new route, no state.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the feature. Fields already fixed for this project are pre-filled below —
  only override them if this feature genuinely deviates.
-->

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. Not touched by this feature — all `WhatToExpect` copy is static/hardcoded, matching the existing `Cta` and `Process` sections (see Content Layer Decisions).

**Testing**: No automated test suite in this repo (no Vitest/Playwright config present); verification is a manual visual check against the design at desktop and mobile breakpoints, per this project's existing review-gate practice.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new performance goals — a small, text-only section (no images/video) swapped in via a route check in the already-rendered root layout; negligible impact on LCP/CLS.

**Constraints**: Must not change `Cta` rendering on any non-`/booking` route, and must not interfere with the Booking page's own content (`Hero`, `TwoPaths`, `Questionnaire`/`Calendar`) or its internal state.

**Scale/Scope**: One new shared component (`WhatToExpect`, rendered from the root layout) and a small edit to `app/root.tsx` to conditionally choose between `Cta` and `WhatToExpect` based on the current pathname. No new routes, no schema/content changes, no changes to the Booking route's own components.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — One new
      component, `WhatToExpect`, is added as a folder pairing `index.tsx` +
      `WhatToExpect.types.ts` (+ `whatToExpect.css`) from the start, mirroring the existing
      `Cta` folder (`app/routes/components/Cta/`). No route changes — `root.tsx` is not a
      route module under `app/routes/pages/`, it's the existing framework-mode root layout,
      and its edit is a small conditional in already-existing JSX, not a new file.
- [x] **Content ownership** — All step copy (eyebrow, heading, three step titles/descriptions)
      is functional/static UI, not editorial content: it matches the existing pattern in `Cta`
      (heading/subtext hardcoded) and `Process` (`app/routes/pages/home/components/Process/`,
      an existing near-identical numbered-steps section with hardcoded `title`/`description`
      per step). No new content type is created.
- [x] **Sanity content layer** — N/A. This feature adds no query and touches no schema.
- [x] **Media (Cloudinary)** — N/A. No image or video content is involved.
- [x] **TypeScript strict** — No new `any`/`@ts-ignore`. `WhatToExpect.types.ts` defines the
      step shape (`{ number, title, description }`) mirroring `Process.types.ts`'s
      `ProcessStep`; `WhatToExpectProps` stays an empty props type like `ProcessProps`/`CtaProps`
      since the component takes no external props.
- [x] **Mobile-first** — Base (mobile) styles stack the three steps in a single column; the
      3-column grid layout is added at the existing `768px` tablet breakpoint, matching the
      pattern already used in `process.css`. No new breakpoint values are introduced, so
      nothing new needs adding to `app/constants/index.ts`.
- [x] **Accessibility (WCAG 2.1 AA)** — The section is text-only (no images), uses a semantic
      `<section>` with an `<h2>` heading and `<h3>` per step title (matching `Process`'s
      heading structure), and the decorative connector dashes between step numbers are marked
      `aria-hidden="true"` (matching `.processConnector` in `Process.tsx`). No interactive
      elements are introduced, so no new focus/keyboard-nav concerns.
- [x] **Performance & SEO** — No new route, so no new `meta` export needed. No images/video,
      so no CLS risk beyond ordinary text layout, consistent with `Cta`/`Process`.

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

| Component       | Placement                                                                  | Generic base (if adapter) | Rationale |
| --------------- | -------------------------------------------------------------------------- | ------------------------- | --------- |
| `WhatToExpect` | Shared — simple (new) | N/A | Rendered once, from the root layout (`app/root.tsx`), alongside — not inside — a specific route, exactly like the existing `Cta`/`Footer`/`Navigation`. It takes no props and has no per-consumer behavior variation, so it follows the same flat `app/routes/components/{Name}/` convention as `Cta`, not `app/components/` — matching this project's established (pre-constitution-wording) location for layout-level sections. |

## Content Layer Decisions

<!--
  ACTION REQUIRED for any plan introducing new content: classify it per the Content
  Ownership article before writing any schema or query.
-->

| Content item                 | Classification         | Content type (new or existing) | Notes                             |
| ---------------------------- | ---------------------- | ------------------------------ | --------------------------------- |
| "What to Expect" eyebrow / "After you book" heading | Functional | N/A — hardcoded string, not Sanity | Matches `Cta`'s hardcoded heading/subtext and `Process`'s hardcoded eyebrow/heading. |
| Three step objects (number, title, description) | Functional | N/A — hardcoded array in-component, not Sanity | Matches `Process.tsx`'s hardcoded `processSteps` array exactly in shape; same rationale — a fixed, small, non-editorial sequence with no prior CMS-backed precedent in this codebase. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-024-what-to-expect-section/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No `data-model.md` or `contracts/` — no Sanity schema or query changes (see Content Layer Decisions).

### Source Code (repository root)

<!--
  ACTION REQUIRED: This project has one fixed shape (React Router app + Sanity Studio),
  not a menu of options. Fill in the concrete paths this feature touches; delete any
  branch below it doesn't need.
-->

```text
app/
├── root.tsx                              # Edit: read current pathname (useLocation, matching
│                                          #   the existing pattern in Navigation) and render
│                                          #   <WhatToExpect /> instead of <Cta /> when the
│                                          #   pathname equals PAGE_ROUTES_DATA.BOOKING.path
└── routes/
    └── components/
        └── WhatToExpect/                 # New — shared, layout-level section
            ├── index.tsx                 # Component: eyebrow, heading, 3 numbered steps
            ├── WhatToExpect.types.ts     # WhatToExpectStep, WhatToExpectProps
            └── whatToExpect.css          # Styles translated from the design mockup
                                          #   (.specify/site-design/curated-book-mockup.html
                                          #   `.expect*` rules), camelCased per project
                                          #   convention (see process.css)
```

**Structure Decision**: Fits the existing shape as-is — no new routes or content types. One
new shared, layout-level component folder (`WhatToExpect`, paired with its types file from the
start) alongside the existing `Cta`/`Footer`/`Navigation`, plus a small conditional-render edit
in `root.tsx`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

None — all Constitution Check items pass; no violations to justify.
