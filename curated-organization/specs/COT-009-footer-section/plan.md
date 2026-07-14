# Implementation Plan: Footer section

**Branch**: `COT-009-footer-section` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-009-footer-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add the site-wide "Footer" section to the home page, placed after the existing `Cta` section as the final element on the page, matching the markup under `<!-- FOOTER -->` in `.specify/site-design/curated-home-mockup.html`. The section is a single static, dark-background block: a four-column grid (brand name + description, "Navigate" links, "Connect" links, "Hours" list), a divider line, and a bottom bar (copyright notice + social links). There is no per-instance content and no interactive state beyond each link's own hover styling. The component follows the same pattern already established by the sibling `Intro`, `Services`, `Process`, `BeforeAfter`, `Testimonial`, and `Cta` home-page sections: a route-local component folder with a paired `.types.ts` file and a co-located camelCase CSS file, reusing existing global CSS variables already defined in `app/app.css`.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`. This feature adds no new dependency — it is a static markup/CSS section using the plain-CSS-file pattern already established by `Intro`, `Services`, `Process`, `BeforeAfter`, `Testimonial`, and `Cta`, for consistency with those existing, already-merged sections. Internal links reuse React Router's `Link` to navigate to existing routes; external/contact links use plain anchors.

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. This feature adds no storage — the brand description, column headings, link labels, and hours text are fixed copy hardcoded in the component (see Content Layer Decisions below), consistent with how the CTA and Process section copy is treated.

**Testing**: No automated test runner (Vitest/Playwright) is configured in this repo. Validation is manual visual QA against the provided design screenshot at desktop, tablet, and mobile breakpoints, plus a manual click-through of every footer link — consistent with how prior sections (Intro, Services, Process, Before/After, Testimonial, Cta) were validated.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new goals beyond the constitution's existing Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms). This section adds no images, only text and links, so CLS risk is minimal.

**Constraints**: Must visually match the provided design screenshot exactly (per spec Acceptance Criteria); every link must remain reachable and operable at mobile widths; the grid must reflow at tablet (2 columns) and mobile (1 column) widths per the mockup's existing responsive rules.

**Scale/Scope**: One new route-local component (`Footer`) added to the existing home page (`app/routes/pages/home/index.tsx`), positioned after `<Cta />`. No new routes, no schema changes, no new Sanity queries in this pass.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — The `home`
      route stays flat (only `components/` gains a new subfolder; no route-level files
      added). The new `Footer` component is route-local, living in
      `app/routes/pages/home/components/Footer/` as `Footer.tsx` + `Footer.types.ts` from
      the start, mirroring `Cta`/`Process`/`Services`/`Testimonial`. No Generic/Domain-adapter
      split — this component has no state/behavior that varies per consumer, and it has
      exactly one consumer (the home route) today.
- [x] **Content ownership** — The brand description, column headings, link labels, and
      hours text are fixed marketing/business copy that does not vary per instance and is
      not expected to be edited independently of a broader page-copy pass; it is treated as
      functional/code content, consistent with how other static section copy (`Cta`, `Process`
      step copy) is hardcoded today. No new content type is introduced.
- [x] **Sanity content layer** — N/A for this pass. This feature adds no Sanity schema or
      queries.
- [x] **Media (Cloudinary)** — N/A. This section introduces no images or video assets.
- [x] **TypeScript strict** — No `any` or `@ts-ignore` planned. `Footer.types.ts` defines the
      component's props (empty/no-op props, matching the static nature of the section); no
      route types are affected (home route already has none).
- [x] **Mobile-first** — Base (mobile) styles for `.footer` and its children are written
      first; the column grid reflows to 2 columns at tablet width and 1 column at mobile
      width, and the bottom bar stacks vertically and centers at mobile width, matching the
      mockup's existing breakpoints (768px, 480px). All links meet a reasonable tap-target
      size.
- [x] **Accessibility (WCAG 2.1 AA)** — The footer uses a semantic `<footer>` landmark;
      every link is a real anchor/`<Link>` (native keyboard and screen-reader operable, with a
      visible focus indicator); column headings use appropriate heading/label semantics; color
      contrast of headings, links, and copyright text against the dark background is verified
      to meet 4.5:1 (text) / 3:1 (large text) per the constitution.
- [x] **Performance & SEO** — No `loader` change needed (static content, no data fetching).
      No new route, so no new `meta` export required. No images introduced, so no CLS concern
      beyond text reflow.

Any unchecked item is a **blocking violation**. Document justified exceptions in the
Complexity Tracking table.

## Component Design Decisions

| Component | Placement   | Generic base (if adapter) | Rationale                                                                                                                      |
| --------- | ----------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Footer`  | Route-local | N/A                         | Used only by the `home` route today. Purely presentational — no state, no per-consumer behavior — so no Generic/Domain split applies. |

## Content Layer Decisions

| Content item                                                                                          | Classification | Content type (new or existing) | Notes                                                                                                                                                              |
| ------------------------------------------------------------------------------------------------------ | --------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Brand name + description, column headings ("Navigate"/"Connect"/"Hours"), link labels, hours text, copyright | Functional      | None                             | Fixed business copy hardcoded in `Footer.tsx`, matching the mockup exactly. Not modeled as a Sanity field in this pass — no existing content type represents this static, page-fixed copy, and creating one is out of scope here. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-009-footer-section/
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
            ├── index.tsx                     # Existing — add <Footer /> after <Cta />
            └── components/
                └── Footer/                        # New — route-local, paired with types
                    ├── Footer.tsx
                    ├── Footer.types.ts
                    └── footer.css                    # camelCase class names, reusing global CSS variables
```

No changes to `studio/`, `app/components/`, `app/lib/sanity/`, `app/lib/cloudinary/`, or `app/routes/constants/` — this feature adds no shared component, no Sanity schema/query, no video, and no new route. Existing routes (`/services`, `/gallery`, `/booking`) are only referenced from `PAGE_ROUTES_DATA`, not modified; no `/about` route currently exists, so the "About" link uses a placeholder destination (see research.md).

**Structure Decision**: Fits the existing shape as-is — a single new route-local component
folder under the `home` route's `components/`, following the exact pattern already used by
`Cta`, `Process`, `Services`, `BeforeAfter`, and `Testimonial`. No deviation to justify.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                       | Why Needed     | Simpler Alternative Rejected Because     |
| ------------------------------- | -------------- | ---------------------------------------- |

No violations — the Constitution Check above passed with no unchecked items. This table is not needed.
