# Implementation Plan: Process section

**Branch**: `COT-006-process-section` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-006-process-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a static "Process" section (`How it works`) to the home page, placed between the existing Services and Before/After sections. It renders three numbered steps (Consultation, Design + shop, Organizing day) with small connector marks between them, matching the markup under `<!-- PROCESS -->` in `.specify/site-design/curated-home-mockup.html`. The section follows the same pattern already established by the sibling `Intro`, `Services`, and `BeforeAfter` home-page sections: a route-local component folder with a paired `.types.ts` file and a co-located camelCase CSS file, reusing the existing global `sectionEyebrow` / `sectionHeading` classes and CSS variables (`--warm-bg`, `--taupe-light`, `--charcoal`, `--muted`, `--serif`, `--sans`) already defined in `app/app.css`.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the feature. Fields already fixed for this project are pre-filled below —
  only override them if this feature genuinely deviates.
-->

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`. This feature adds no new dependency — it reuses the plain-CSS-file pattern already established by the `Intro`, `Services`, and `BeforeAfter` sibling sections instead of introducing Tailwind utility classes, for consistency with those existing, already-merged sections.

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. This feature adds no storage — step content (numbers, titles, descriptions) is static and hardcoded in the component, matching the existing precedent set by `Services` (hardcoded `services` array) and `BeforeAfter`.

**Testing**: No automated test runner (Vitest/Playwright) is configured in this repo. Validation is manual visual QA against the provided design screenshot at desktop and mobile breakpoints, consistent with how prior sections (Intro, Services, Before/After) were validated.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new goals beyond the constitution's existing Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms) — this section is static text/markup with no images, video, or client-side data fetching, so it carries negligible performance risk.

**Constraints**: Must visually match the provided design screenshot exactly (per spec Acceptance Criteria); must reflow correctly at mobile widths without losing step order or overlapping text.

**Scale/Scope**: One new route-local component (`Process`) added to the existing home page (`app/routes/pages/home/index.tsx`). No new routes, no schema changes, no new queries.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — The `home`
      route stays flat (only `components/` gains a new subfolder; no route-level files
      added). The new `Process` component is route-local, living in
      `app/routes/pages/home/components/Process/` as `Process.tsx` + `Process.types.ts`
      from the start, mirroring `Services` and `BeforeAfter`. No Generic/Domain-adapter
      split — it's used by exactly one route with no per-consumer behavior variation. No
      hook needed (no state/behavior beyond static render).
- [x] **Content ownership** — Step content (numbers, titles, descriptions, eyebrow,
      heading) is static and functional (code), matching the precedent already set by the
      sibling `Services` and `BeforeAfter` sections on this same page — no new content
      type is introduced or duplicated.
- [x] **Sanity content layer** — N/A. This feature adds no Sanity queries or schema
      changes.
- [x] **Media (Cloudinary)** — N/A. This feature adds no video or image assets.
- [x] **TypeScript strict** — No `any` or `@ts-ignore` planned. `Process.types.ts` will
      define the props/step shape; no route types are affected (home route already has
      none).
- [x] **Mobile-first** — Base (mobile) styles for `.process`, `.processGrid`, and
      `.processStep` are written first, with the 3-column grid layered on at a larger
      breakpoint, mirroring the reflow pattern already used in `services.css` /
      `beforeAfter.css`. No new breakpoint constant is needed — existing breakpoint
      handling in sibling CSS files is reused.
- [x] **Accessibility (WCAG 2.1 AA)** — Heading order preserved (eyebrow as `<p>`, then
      `<h2>` section heading, then `<h3>` per step title, matching mockup semantics).
      Connector marks are decorative (`aria-hidden="true"`) and carry no meaning beyond
      visual separation. No video/images in this section, so no `alt`/transcript
      requirements apply.
- [x] **Performance & SEO** — No `loader` change needed (static content, no data
      fetching). No new route, so no new `meta` export required. No images/video in this
      section, so no CLS-related dimension requirements apply.

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

| Component | Placement   | Generic base (if adapter) | Rationale                                                                                                            |
| --------- | ----------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `Process` | Route-local | N/A                         | Used only by the `home` route, static content, no behavior variation across consumers — matches `Services`/`BeforeAfter`. |

## Content Layer Decisions

<!--
  ACTION REQUIRED for any plan introducing new content: classify it per the Content
  Ownership article before writing any schema or query.
-->

| Content item                                     | Classification | Content type (new or existing) | Notes                                                                                                   |
| ------------------------------------------------- | --------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Process steps (number, title, description) + header (eyebrow, heading) | Functional      | N/A — hardcoded in component    | Static, non-editorial for this pass; matches existing hardcoded `Services`/`BeforeAfter` content precedent. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-006-process-section/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — no Sanity schema changes; static in-component types only
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No `contracts/` directory — this feature adds no GROQ queries or other external interfaces.

### Source Code (repository root)

<!--
  ACTION REQUIRED: This project has one fixed shape (React Router app + Sanity Studio),
  not a menu of options. Fill in the concrete paths this feature touches; delete any
  branch below it doesn't need.
-->

```text
app/
└── routes/
    └── pages/
        └── home/
            ├── index.tsx                  # Existing — add <Process /> between <Services /> and <BeforeAfter />
            └── components/
                └── Process/                  # New — route-local, paired with types
                    ├── Process.tsx
                    ├── Process.types.ts
                    └── process.css            # camelCase class names, reusing global sectionEyebrow/sectionHeading
```

No changes to `studio/`, `app/components/`, `app/lib/sanity/`, `app/lib/cloudinary/`, or `app/routes/constants/` — this feature adds no shared component, no Sanity query, no video, and no new route.

**Structure Decision**: Fits the existing shape as-is — a single new route-local component
folder under the `home` route's `components/`, following the exact pattern already used by
`Services` and `BeforeAfter`. No deviation to justify.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — the Constitution Check above passed with no unchecked items. This table is not needed.
