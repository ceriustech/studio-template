# Implementation Plan: Add NAPO Logos to Footer and Services Page

**Branch**: `COT-022-napo-logos` | **Date**: 2026-08-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-022-napo-logos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Render the two existing NAPO credential logo assets (`napo-circular-logo.png`, `napo-title-logo.png`, already present in `app/assets/`) side by side, circular logo first, in two existing locations: the Services page About section (below the "— The Curated Team" signature) and the shared site Footer (below the "Serving the NOVA / DMV area." text). This is a static-asset placement change to two existing components — no new components, routes, content types, or queries are introduced.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary` — unchanged; this feature uses none of the content/media dependencies, only plain `<img>` + component CSS matching the existing pattern in `footer.css` / `about.css`.

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. Not applicable to this feature — the two logos are static, bundled image assets (`app/assets/*.png`), classified as functional per the Content Ownership principle (fixed brand/credential marks, not client-editable copy), imported via the existing Vite asset-import pattern (`import logo from "~/assets/...png"`, as already used in `app/welcome/welcome.tsx`).

**Testing**: No automated test framework is configured in this repo (no Vitest/Playwright/Jest present). Verification is via `npm run typecheck`, lint, and a manual visual check of the Services page and footer (desktop + mobile), per the constitution's Review Gates.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: LCP < 2.5s, CLS < 0.1 — both logos are small below-the-fold images; explicit `width`/`height` on each `<img>` prevents layout shift.

**Constraints**: Must match the reference design screenshots exactly for order (circular logo, then title logo) and relative placement in both locations; must stay legible and non-overlapping down to 320px viewport width per the Mobile-First principle.

**Scale/Scope**: Two existing files touched (`app/routes/components/Footer/index.tsx`, `app/routes/pages/services/components/about/index.tsx`) plus their paired CSS files (`footer.css`, `about.css`). No new routes, components, schemas, or queries.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — No new
      components are introduced. Both touched files (`Footer/index.tsx`,
      `services/components/about/index.tsx`) are existing route-local files; the logo markup
      is added inline, matching each component's existing structure. No new
      folder/`.types.ts` pairing is needed since no new component is created.
- [x] **Content ownership** — The two logo images are classified **functional** (code):
      fixed brand/credential marks bundled as static assets, not client-editable copy. This
      matches how the other static asset in `app/assets/` (project video files) and the
      `app/welcome/*.svg` logos are already handled — no Sanity content type involved.
- [x] **Sanity content layer** — Not applicable. No queries added or changed.
- [x] **Media (Cloudinary)** — Not applicable. These are static PNG images, not video.
- [x] **TypeScript strict** — No `any`/`@ts-ignore` introduced; asset imports are typed via
      Vite's built-in image-import typing, consistent with existing `welcome.tsx` usage.
- [x] **Mobile-first** — Logo layout CSS is added mobile-first in `footer.css` and
      `about.css`, reusing each file's existing `@media (max-width: 768px)` /
      `(max-width: 480px)` breakpoints; no new breakpoint value is needed.
- [x] **Accessibility (WCAG 2.1 AA)** — Both `<img>` elements will carry descriptive `alt`
      text (e.g. "NAPO member" / "NAPO"); logos are non-interactive so no keyboard/focus
      concerns apply.
- [x] **Performance & SEO** — Both `<img>` elements specify explicit `width`/`height` to
      protect CLS; no route `meta` change needed since no route is added.

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

| Component | Placement | Generic base (if adapter) | Rationale |
| --------- | --------- | -------------------------- | --------- |
| N/A — no new component | — | N/A | The logos are added as inline `<img>` markup directly inside the existing `Footer` and `About` components, matching how each already renders its own static content. Two images with no shared state/behavior don't warrant a new shared component. |

## Content Layer Decisions

<!--
  ACTION REQUIRED for any plan introducing new content: classify it per the Content
  Ownership article before writing any schema or query.
-->

| Content item | Classification | Content type (new or existing) | Notes |
| ------------ | --------------- | ------------------------------- | ----- |
| napo-circular-logo.png | Functional | N/A — static asset in `app/assets/` | Fixed credential badge, not client-editable; consumed by `Footer` and `About`. |
| napo-title-logo.png | Functional | N/A — static asset in `app/assets/` | Fixed credential wordmark, not client-editable; consumed by `Footer` and `About`. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-022-napo-logos/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output — n/a decisions (no unknowns to resolve)
├── quickstart.md         # Phase 1 output — manual visual verification steps
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: This project has one fixed shape (React Router app + Sanity Studio),
  not a menu of options. Fill in the concrete paths this feature touches; delete any
  branch below it doesn't need.
-->

```text
app/
├── assets/
│   ├── napo-circular-logo.png   # Existing asset — no change
│   └── napo-title-logo.png      # Existing asset — no change
└── routes/
    ├── components/
    │   └── Footer/
    │       ├── index.tsx        # Add logo row markup (imports both assets)
    │       └── footer.css       # Add layout rules for the logo row
    └── pages/
        └── services/
            └── components/
                └── about/
                    ├── index.tsx  # Add logo row markup (imports both assets)
                    └── about.css  # Add layout rules for the logo row
```

`studio/` is untouched — no schema changes.

**Structure Decision**: Fits the existing shape as-is — no new routes, components, or
content types. Both touched files are existing route-local `index.tsx`/`.css` pairs; the
logo markup is added inline within each, consistent with how each component already
renders its own static content (brand text in `Footer`, signature line in `About`).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — this section is not applicable.
