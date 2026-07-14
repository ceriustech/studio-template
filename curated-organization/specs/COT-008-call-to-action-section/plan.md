# Implementation Plan: Call To Action section

**Branch**: `COT-008-call-to-action-section` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-008-call-to-action-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a "Call To Action" (CTA) section to the home page, placed after the existing Testimonial section and before the footer, matching the markup under `<!-- CTA -->` in `.specify/site-design/curated-home-mockup.html`. The section is a single static, full-bleed block: a background image with a heavy light-toned overlay, a centered heading, a supporting subtext line, and one button linking to the existing `/booking` route (`PAGE_ROUTES_DATA.BOOKING.path`). There is no per-instance content, no navigation, and no interactive state beyond the button's own hover/focus styling — this is the simplest section built for the home page so far. The component follows the same pattern already established by the sibling `Intro`, `Services`, `Process`, `BeforeAfter`, and `Testimonial` home-page sections: a route-local component folder with a paired `.types.ts` file and a co-located camelCase CSS file, reusing existing global CSS variables already defined in `app/app.css`.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`. This feature adds no new dependency — it is a static markup/CSS section using the plain-CSS-file pattern already established by `Intro`, `Services`, `Process`, `BeforeAfter`, and `Testimonial`, for consistency with those existing, already-merged sections. The button reuses React Router's `Link` to navigate to the existing `/booking` route.

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. This feature adds no storage — the heading, subtext, and button label are fixed copy hardcoded in the component (see Content Layer Decisions below), and the background image is a static asset reference, not an editorial content item, consistent with how the Hero and CTA-style backgrounds are treated elsewhere in the mockup.

**Testing**: No automated test runner (Vitest/Playwright) is configured in this repo. Validation is manual visual QA against the provided design screenshot at desktop and mobile breakpoints, plus a manual click-through of the "Book a consultation" link to the `/booking` route — consistent with how prior sections (Intro, Services, Process, Before/After, Testimonial) were validated.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new goals beyond the constitution's existing Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms). This section adds one background image, so explicit dimensions/modern-format handling apply to avoid CLS, consistent with the Hero section's existing background-image treatment.

**Constraints**: Must visually match the provided design screenshot exactly (per spec Acceptance Criteria); the button must reliably navigate to the booking destination; the section must remain legible and operable at mobile widths.

**Scale/Scope**: One new route-local component (`Cta`) added to the existing home page (`app/routes/pages/home/index.tsx`), positioned after `<Testimonial />`. No new routes, no schema changes, no new Sanity queries in this pass.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — The `home`
      route stays flat (only `components/` gains a new subfolder; no route-level files
      added). The new `Cta` component is route-local, living in
      `app/routes/pages/home/components/Cta/` as `Cta.tsx` + `Cta.types.ts` from the start,
      mirroring `Process`/`Services`/`BeforeAfter`/`Testimonial`. No Generic/Domain-adapter
      split — this component has no state/behavior that varies per consumer, and it has
      exactly one consumer (the home route) today.
- [x] **Content ownership** — The heading, subtext, and button label are fixed marketing
      copy that does not vary per instance and is not expected to be edited independently of
      a broader page-copy pass; it is treated as functional/code content, consistent with how
      other static section headings (`Intro`, `Process` step copy) are hardcoded today. The
      background image is a static design asset, not an editorial content item requiring a
      CMS-editable field in this pass.
- [x] **Sanity content layer** — N/A for this pass. This feature adds no Sanity schema or
      queries.
- [x] **Media (Cloudinary)** — N/A. The background image is a static CSS/asset reference
      matching the mockup, not a Cloudinary-hosted video asset; no video is introduced by
      this feature.
- [x] **TypeScript strict** — No `any` or `@ts-ignore` planned. `Cta.types.ts` defines the
      component's props (empty/no-op props, matching the static nature of the section); no
      route types are affected (home route already has none).
- [x] **Mobile-first** — Base (mobile) styles for `.cta` and its children are written first;
      padding and typography scale down at the existing sibling breakpoint (768px, matching
      `Testimonial`/`Process`), and the button meets the 44×44px minimum touch target.
- [x] **Accessibility (WCAG 2.1 AA)** — The button is a real `<Link>`/anchor element (native
      keyboard and screen-reader operable, with a visible focus indicator); the background
      image is applied via CSS `background-image` (decorative), so no `alt` text is required;
      color contrast of heading/subtext/button label against the overlay is verified to meet
      4.5:1 (text) / 3:1 (large text) per the constitution.
- [x] **Performance & SEO** — No `loader` change needed (static content, no data fetching).
      No new route, so no new `meta` export required. The background image specifies
      dimensions/is applied as a `background-image` sized via CSS to avoid CLS, consistent
      with the Hero section's existing background-image treatment.

Any unchecked item is a **blocking violation**. Document justified exceptions in the
Complexity Tracking table.

## Component Design Decisions

| Component | Placement   | Generic base (if adapter) | Rationale                                                                                                                   |
| --------- | ----------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `Cta`     | Route-local | N/A                         | Used only by the `home` route today. Purely presentational — no state, no per-consumer behavior — so no Generic/Domain split applies. |

## Content Layer Decisions

| Content item                                                   | Classification | Content type (new or existing) | Notes                                                                                                                                                                          |
| ---------------------------------------------------------------- | ------------------ | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CTA heading, subtext, and button label ("Ready to transform your space?", subtext, "Book a consultation") | Functional      | None                                  | Fixed marketing copy hardcoded in `Cta.tsx`, matching the mockup exactly. Not modeled as a Sanity field in this pass — no existing content type represents single, page-fixed section copy, and creating one is out of scope here. |
| CTA background image                                              | Functional      | None                                  | Static design asset (same treatment as the Hero background); not an editorial/CMS-managed field in this pass.                                                              |

## Project Structure

### Documentation (this feature)

```text
specs/COT-008-call-to-action-section/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — no entities; static content only
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No `contracts/` directory — this feature adds no GROQ queries or other external interfaces (content is static, hardcoded copy).

### Source Code (repository root)

```text
app/
└── routes/
    └── pages/
        └── home/
            ├── index.tsx                     # Existing — add <Cta /> after <Testimonial />
            └── components/
                └── Cta/                           # New — route-local, paired with types
                    ├── Cta.tsx
                    ├── Cta.types.ts
                    └── cta.css                       # camelCase class names, reusing global CSS variables
```

No changes to `studio/`, `app/components/`, `app/lib/sanity/`, `app/lib/cloudinary/`, or `app/routes/constants/` — this feature adds no shared component, no Sanity schema/query, no video, and no new route. The `/booking` route already exists in `app/routes/constants/index.ts` (`PAGE_ROUTES_DATA.BOOKING.path`) and is only referenced, not modified.

**Structure Decision**: Fits the existing shape as-is — a single new route-local component
folder under the `home` route's `components/`, following the exact pattern already used by
`Process`, `Services`, `BeforeAfter`, and `Testimonial`. No deviation to justify.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                       | Why Needed     | Simpler Alternative Rejected Because     |
| ------------------------------- | -------------- | ---------------------------------------- |

No violations — the Constitution Check above passed with no unchecked items. This table is not needed.
