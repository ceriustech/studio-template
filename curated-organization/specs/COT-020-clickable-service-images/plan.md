# Implementation Plan: Clickable Service Images on Home Page

**Branch**: `COT-020-clickable-service-images` | **Date**: 2026-07-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-020-clickable-service-images/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Make each of the three service images in the home page's existing "Personalized services" section navigable to the Services page (`/services`), matching the destination of the section's existing "View all services →" text link. The image area of `ServiceCard` (`app/routes/pages/home/components/Services/ServiceCard.tsx`) — currently a non-interactive `div` with a CSS background-image — is wrapped in a React Router `Link`, given an accessible name, and made keyboard-operable, with no change to its visual appearance.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router (`Link` from `react-router`, matching the pattern already used in `Intro.tsx` and `BeforeAfter.tsx`), Tailwind CSS

**Storage**: N/A — this feature is presentation-only, no Sanity or Cloudinary content involved. Service card content (title/description/imageUrl) remains the existing hardcoded array in `Services.tsx`; this feature does not change where that content lives.

**Testing**: No automated test suite exists in this repo for prior sibling sections (`package.json` has no Vitest/Playwright/Jest); visual/manual verification (click each image, keyboard-only pass, screen reader pass) is the acceptance mechanism for SC-001–SC-003, documented in `quickstart.md`. No test framework is introduced.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new network requests or render-blocking assets; wrapping an existing element in a client-side `Link` has no measurable impact on LCP/CLS/INP.

**Constraints**: Must reuse the existing `/services` destination already used by the "View all services →" link (per spec Assumptions — no per-service routing). Must satisfy WCAG 2.1 AA (constitution Article VII): keyboard operability, an accessible name distinguishing the image-link from decorative content, and no loss of the existing hover/elevation visual treatment on `.serviceCard`.

**Scale/Scope**: Single component (`app/routes/pages/home/components/Services/ServiceCard.tsx`) and its stylesheet (`services.css`). No routes, content types, schemas, or the `Services.tsx` parent's data shape are touched.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — No route is
      touched; `ServiceCard` is an existing route-local component
      (`app/routes/pages/home/components/Services/`) already paired with `Services.types.ts`.
      The change is a small markup/behavior edit inside the existing component — not a new
      reusable behavior — so it does not warrant a new sub-component or the
      generic-engine/domain-adapter split.
- [x] **Content ownership** — N/A. No new content is introduced; the service cards' title,
      description, and image URL remain the existing hardcoded array in `Services.tsx`.
- [x] **Sanity content layer** — N/A. No query or schema changes.
- [x] **Media (Cloudinary)** — N/A. Service card images are plain `imageUrl` strings (not
      Cloudinary video assets); this feature does not touch how they are sourced or rendered,
      only adds a navigation affordance around the existing image element.
- [x] **TypeScript strict** — No `any`/`@ts-ignore` planned; no new types are needed beyond
      what already exists in `Services.types.ts` (the destination is a fixed string, not a
      new prop).
- [x] **Mobile-first** — No new breakpoint introduced; the existing `.serviceCard` /
      `.serviceCardImg` responsive rules in `services.css` are unchanged, per spec Assumptions.
- [x] **Accessibility (WCAG 2.1 AA)** — The image link will have an accessible name (e.g. via
      `aria-label` on the link, since the background-image `div` carries no `alt`), full
      keyboard operability (native `<a>`/`Link` semantics — focusable and Enter-activatable by
      default), and a visible focus indicator consistent with the project's existing
      `:focus-visible` pattern (FR-003, FR-004, SC-002).
- [x] **Performance & SEO** — N/A beyond baseline; no new route, no new above-fold data fetch,
      no new images added.

Any unchecked item is a **blocking violation**. Document justified exceptions in the
Complexity Tracking table.

## Component Design Decisions

| Component     | Placement                            | Generic base (if adapter) | Rationale |
| ------------- | ------------------------------------- | -------------------------- | --------- |
| `ServiceCard` | Existing — Route-local, modified in place | N/A                    | Already exists at `app/routes/pages/home/components/Services/`, consumed only by `Services.tsx`. This feature wraps the existing image element in a `Link` in place — no new component file, since the navigation behavior isn't reusable outside this card. |

## Content Layer Decisions

N/A — this feature introduces no new content; it adds navigation behavior around an existing, already-sourced image (`imageUrl`) on the hardcoded `services` array in `Services.tsx`.

## Project Structure

### Documentation (this feature)

```text
specs/COT-020-clickable-service-images/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — N/A content, documents the UI/link model instead
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No `contracts/` directory — this feature adds no GROQ queries or other external interfaces.

### Source Code (repository root)

```text
app/
└── routes/
    └── pages/
        └── home/
            └── components/
                └── Services/
                    ├── ServiceCard.tsx     # Modified — wraps the image element in a react-router
                    │                       # Link to /services with an accessible name
                    ├── Services.types.ts   # Unchanged — no new props needed (destination is fixed)
                    └── services.css        # Modified — only if focus/hover states on the new
                                            # link need adjustment to preserve current visuals
```

**Structure Decision**: This feature fits the existing shape as-is — it modifies the already-existing route-local `ServiceCard` component and its stylesheet in place. No new routes, no new `app/components/` entries, and no Sanity or Cloudinary directories are touched.

## Complexity Tracking

> No Constitution Check violations — this table is not needed.
