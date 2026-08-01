# Implementation Plan: Add Site Logo and Certification Labels

**Branch**: `COT-023-add-site-logo-labels` | **Date**: 2026-08-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-023-add-site-logo-labels/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add the existing `curated-logo.png` mark to the sitewide `Navigation` header (next to the "CURATED" wordmark/tagline), and add two static text labels ("CPO Certified", "NAPO Member") to the Services page "About Curated" section so each credential logo is identified — both purely presentational, CSS/markup-only changes to two existing components, matching the provided design image.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the feature. Fields already fixed for this project are pre-filled below —
  only override them if this feature genuinely deviates.
-->

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. Not touched by this feature — the logo and labels are static UI assets/copy, not editorial content (see Content Layer Decisions).

**Testing**: No automated test suite in this repo (no Vitest/Playwright config present); verification is a manual visual check against the design at desktop and mobile breakpoints, per this project's existing review-gate practice.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new performance goals — one small existing PNG asset (`curated-logo.png`, 319×316px, ~33KB) added to an already-rendered header; negligible impact on LCP/CLS as long as `width`/`height` are set.

**Constraints**: Must not regress existing header/nav responsive behavior (mobile hamburger menu) or the About section's existing two-column/stacked responsive layout.

**Scale/Scope**: Two existing components touched: `app/routes/components/navigation/` (shared, rendered on every route) and `app/routes/pages/services/components/about/` (route-local to the Services page). No new routes, no new shared components, no schema/content changes.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — No new
      components or routes are introduced. `Navigation` (`app/routes/components/navigation/`)
      and `About` (`app/routes/pages/services/components/about/`) are existing, already-paired
      component folders; this feature only edits their `.tsx`/`.css` in place. No new prop
      shapes are needed, so `navigation.types.ts` is unchanged.
- [x] **Content ownership** — The logo image and the two label strings ("CPO Certified",
      "NAPO Member") are functional/static UI, not editorial content: they match the existing
      pattern in `About` where all copy (heading, body text, signature) is already hardcoded
      in the component rather than Sanity-sourced. No new content type is created.
- [x] **Sanity content layer** — N/A. This feature adds no query and touches no schema.
- [x] **Media (Cloudinary)** — N/A. No video content is involved; the logo is a static PNG
      imported as a local asset, consistent with how `napo-circular-logo.png` /
      `napo-title-logo.png` are already handled in `About`.
- [x] **TypeScript strict** — No new `any`/`@ts-ignore`. No new types required beyond what
      JSX/existing prop types already provide.
- [x] **Mobile-first** — Both edits build on existing mobile-first CSS (`.navBrand`,
      `.aboutLogos` and their existing `@media (max-width: 768px)` / `480px` blocks in
      `app/app.css` and `about.css`); no new breakpoint values are introduced, so nothing new
      needs adding to `app/constants/index.ts`.
- [x] **Accessibility (WCAG 2.1 AA)** — The header logo image is decorative (the adjacent
      "CURATED" text and the `Link`'s existing `aria-label="Curated Professional Organizing"`
      already convey the brand name), so it MUST use `alt=""`. The two new certification
      labels are plain visible text (not images), inherently accessible and read by screen
      readers with no extra markup needed.
- [x] **Performance & SEO** — No new routes, so no new `meta` export needed. The added
      `curated-logo.png` (319×316) MUST render with explicit `width`/`height` to protect CLS,
      matching the pattern already used for `napoCircularLogo`/`napoTitleLogo` in `About`.

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
| `Navigation` | Shared — simple (existing) | N/A | Already lives in `app/routes/components/navigation/`, rendered on every route. Only its JSX/CSS change — an `<img>` added to `.navBrand`. No new component created. |
| `About` | Route-local (existing) | N/A | Already lives in `app/routes/pages/services/components/about/`, used only by the Services route. Only its JSX/CSS change — label markup added around `.aboutLogos` images. |

## Content Layer Decisions

<!--
  ACTION REQUIRED for any plan introducing new content: classify it per the Content
  Ownership article before writing any schema or query.
-->

| Content item                 | Classification         | Content type (new or existing) | Notes                             |
| ---------------------------- | ---------------------- | ------------------------------ | --------------------------------- |
| Curated logo image (`curated-logo.png`) | Functional | N/A — static asset, not Sanity | Brand mark, not editable copy; imported directly in `Navigation` like the existing NAPO logos in `About`. |
| "CPO Certified" / "NAPO Member" labels | Functional | N/A — hardcoded string, not Sanity | Matches existing pattern: all other `About` copy (heading, body, signature) is already hardcoded in-component, not Sanity-sourced. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-023-add-site-logo-labels/
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
├── assets/
│   └── curated-logo.png              # Already present (untracked); wired in by this feature
├── routes/
│   ├── components/
│   │   └── navigation/
│   │       ├── index.tsx              # Edit: import + render curated-logo.png in .navBrand
│   │       └── navigation.types.ts    # Unchanged
│   └── pages/
│       └── services/
│           └── components/
│               └── about/
│                   ├── index.tsx      # Edit: add "CPO Certified" / "NAPO Member" labels
│                   └── about.css      # Edit: style label + logo pairing in .aboutLogos
└── app.css                            # Edit: add logo sizing rule(s) inside existing .navBrand block
```

**Structure Decision**: Fits the existing shape as-is — no new routes, components, or content
types. Both `Navigation` and `About` are existing, already-paired component folders; this
feature is confined to editing their `.tsx`/`.css` files in place.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

None — all Constitution Check items pass; no violations to justify.
