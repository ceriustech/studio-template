# Implementation Plan: Services Offerings section

**Branch**: `COT-012-services-offerings-section` | **Date**: 2026-07-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-012-services-offerings-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement the `Service` section on the Services page, replacing the existing placeholder stub (`app/routes/pages/services/components/service/index.tsx`), rendered directly below `About` and above `Pricing`. The section renders five static, alternating image/text items: the three existing items from the mockup (Home Organizing, Unpacking + Move-in, Business + Office, taken verbatim from `.specify/site-design/curated-services-mockup.html` under the `<!-- SERVICE 1 -->` / `<!-- SERVICE 2 -->` / `<!-- SERVICE 3 -->` comments) plus two new items (Legacy Transitions, Executive Functioning Coach) built from copy/image/list content supplied in the spec, following the same markup shape as items 1–3. Each item is a two-column row (numbered eyebrow, heading, description, bulleted inclusions list, "Get started" CTA on one side; a background-image panel with gradient overlay on the other), alternating orientation per item (1/3/5 non-reversed, 2/4 reversed). The component follows the same static-section, plain-CSS-file pattern already established by the sibling `Hero` and `About` sections on this route.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`. This feature adds no new dependency — it is a static markup/CSS section using the plain-CSS-file pattern already established by the sibling `Hero` and `About` components on this route.

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. This feature adds no storage — all five items' copy (headings, descriptions, list entries, CTA label) and image URLs are fixed content hardcoded in the component (see Content Layer Decisions below), consistent with how the sibling `Hero` and `About` sections' copy is treated.

**Testing**: No automated test runner (Vitest/Playwright) is configured in this repo. Validation is manual visual QA against the provided design screenshot (items 1–3) and the spec's written content requirements (items 4–5, which have no reference screenshot) at desktop, tablet, and mobile breakpoints — consistent with how `Hero` and `About` were validated.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new goals beyond the constitution's existing Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms). This section introduces five background images; explicit height on each item's image container prevents layout shift.

**Constraints**: Items 1–3 must visually match the provided design screenshot exactly (per spec SC-001); all five items must alternate image/text orientation with no two consecutive items sharing the same orientation (per spec FR-005/SC-003); the two-column layout of every item must reflow (e.g., stacking) at tablet and mobile widths without losing or overlapping content, regardless of each item's differing list length (4–5 entries for items 1–2, 4 for item 3, 4 for item 4, 3 for item 5) or description length (items 4–5 use noticeably longer subtext than items 1–3).

**Scale/Scope**: One existing route-local placeholder component (`service`) replaced with its real implementation, on the existing `services` page (`app/routes/pages/services/index.tsx`), where it is already wired in as the third child, directly after `About` and before `Pricing`. Five service items total (three existing + two new). No new routes, no schema changes, no new Sanity queries in this pass.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — The `services`
      route stays flat (no route-level files added; only the existing `service` sub-component
      placeholder is filled in). Because `Service` renders five repeated, differently-parameterized
      items (heading, description, image, list, orientation), it is broken into a route-local
      container (`service/index.tsx`, no props, no types file needed — same precedent as the
      prop-less `Hero`/`About` containers) plus a route-local sub-component,
      `service/components/ServiceItem/`, always paired as `ServiceItem.tsx` +
      `ServiceItem.types.ts` per the architecture rule, since it takes typed props and is reused
      five times within the same component. No Generic/Domain-adapter split applies —
      `ServiceItem` has exactly one consumer (`Service`) and no behavior that varies per
      consumer beyond the props it's given.
- [x] **Content ownership** — All five items' copy (eyebrow numbers, headings, descriptions,
      list entries, CTA label) and image URLs are fixed marketing content that does not vary
      per instance and is not expected to be edited independently of a broader page-copy pass;
      treated as functional/code content, consistent with how the sibling `Hero`/`About`
      sections' copy and the home page's `Services`/`ServiceCard` copy are hardcoded today. No
      new content type is introduced, and no existing concept (e.g. the home page's separate,
      differently-shaped `ServiceCard` grid) is duplicated — this is a distinct, alternating
      list-item layout unique to the Services page.
- [x] **Sanity content layer** — N/A for this pass. This feature adds no Sanity schema or
      queries.
- [x] **Media (Cloudinary)** — N/A. All five images are static photographs (CSS
      `background-image`), not video, so the Cloudinary video principle does not apply; no
      video asset is introduced.
- [x] **TypeScript strict** — No `any` or `@ts-ignore` planned. `ServiceItem.types.ts` types
      every prop (`eyebrow`, `heading`, `description`, `imageUrl`, `items: string[]`,
      `reversed: boolean`, `ctaLabel`); no route types are affected (the `services` route
      already has none).
- [x] **Mobile-first** — Base (mobile) styles for `.serviceItem` and its children are written
      first, with the two-column grid collapsing to a single column at mobile widths; padding
      and image height scale down at tablet (768px) and mobile (480px) widths, matching the
      breakpoints already used by the sibling `Hero`/`About` sections.
- [x] **Accessibility (WCAG 2.1 AA)** — Each item's photograph is decorative alongside text
      that fully conveys the item's meaning, implemented as a CSS `background-image` on a
      decorative element (no `<img>` needed, so no missing-`alt` risk); each item's heading
      renders as an `<h2>` (`Hero` already owns the page's `<h1>`, `About`'s heading is also an
      `<h2>` — five sequential `<h2>`s at the same outline depth is correct for five parallel,
      equal-weight service items); the "Get started" CTA link and list markers are
      keyboard-navigable with visible focus indicators; color contrast of eyebrow, heading,
      description, list, and CTA against their backgrounds is verified to meet 4.5:1 (text) /
      3:1 (large text) per the constitution.
- [x] **Performance & SEO** — No `loader` change needed (static content, no data fetching). No
      new route, so no new `meta` export required beyond what the `services` route already
      defines. Each item's image container has an explicit `min-height`, consistent with the
      mockup's fixed image height, to protect CLS.

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
| `Service`     | Route-local | N/A                         | Used only by the `services` route today. Container renders a fixed data array of five items — no per-consumer variation, so no `.types.ts` needed, matching the `Hero`/`About` precedent.     |
| `ServiceItem` | Route-local | N/A                         | Route-local sub-component of `Service`, used five times with different props (heading, description, image, list, orientation). Always paired with `ServiceItem.types.ts` per the architecture rule. No Generic/Domain split — single consumer, no per-consumer behavior beyond props. |

## Content Layer Decisions

<!--
  ACTION REQUIRED for any plan introducing new content: classify it per the Content
  Ownership article before writing any schema or query.
-->

| Content item                                                                                          | Classification | Content type (new or existing) | Notes                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------ | --------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Items 1–3 copy (headings, descriptions, lists, images) — Home Organizing, Unpacking + Move-in, Business + Office | Functional      | None                              | Fixed business copy hardcoded in `Service/index.tsx`, taken verbatim from the mockup, matching the sibling `Hero`/`About` precedent.                       |
| Items 4–5 copy (headings, descriptions, lists, images) — Legacy Transitions, Executive Functioning Coach          | Functional      | None                              | Fixed business copy hardcoded in `Service/index.tsx`, taken verbatim from the spec's Functional Requirements (FR-006/FR-007). Not modeled as a Sanity field in this pass. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-012-services-offerings-section/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — no entities; static content only
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No `contracts/` directory — this feature adds no GROQ queries or other external interfaces
(content is static, hardcoded copy and static image URLs).

### Source Code (repository root)

```text
app/
└── routes/
    └── pages/
        └── services/
            ├── index.tsx                     # Existing — already renders <Service /> third, unchanged
            └── components/
                └── service/                       # Existing placeholder — replaced with real implementation
                    ├── index.tsx                     # Container: five-item data array, maps to <ServiceItem />
                    ├── service.css                    # New — camelCase class names, reusing global CSS variables
                    └── components/
                        └── ServiceItem/                  # New — route-local sub-component, always paired
                            ├── ServiceItem.tsx
                            ├── ServiceItem.types.ts
                            └── serviceItem.css
```

No changes to `studio/`, `app/components/`, `app/lib/sanity/`, `app/lib/cloudinary/`, or
`app/routes/constants/` — this feature adds no shared component, no Sanity schema/query, no
video, and no new route.

**Structure Decision**: Fits the existing shape as-is — the already-scaffolded `service`
placeholder is filled in with a container plus one route-local `ServiceItem` sub-component
(needed because the section repeats the same shape five times with different props), following
the same static-section precedent as the sibling `Hero`/`About` components and the paired-types
rule already applied elsewhere in the codebase (e.g. the home page's `Services`/`ServiceCard`
pair). No deviation to justify.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — table intentionally left empty.
