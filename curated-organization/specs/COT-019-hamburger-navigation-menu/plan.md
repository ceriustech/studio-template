# Implementation Plan: Hamburger Menu for Navigation

**Branch**: `COT-019-hamburger-navigation-menu` | **Date**: 2026-07-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-019-hamburger-navigation-menu/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Replace the existing `Navigation` header's always-visible, wrapping mobile link list with a proper collapsed hamburger pattern: below the `tablet` breakpoint (768px), primary links and the "Book now" CTA hide behind a toggle button; above it, today's inline layout is unchanged. The toggle is added as local state inside the existing `Navigation` component (no new shared component needed — it's a single boolean and a button, not reusable behavior), styled with existing CSS custom properties and a `lucide-react` icon already available in the project.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, `lucide-react` (Menu/X icons — already a dependency, no new package needed)

**Storage**: N/A — this feature is presentation-only, no Sanity or Cloudinary content involved.

**Testing**: No automated test suite exists in this repo for prior sibling sections; visual/manual verification (resize sweep across the mobile/desktop breakpoint, keyboard-only pass, screen reader pass) is the acceptance mechanism for SC-001–SC-004, documented in `quickstart.md`. No test framework is introduced, consistent with no test runner currently existing in `package.json`.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new network requests or render-blocking assets; toggle is pure client-side state, no measurable impact on LCP/CLS/INP.

**Constraints**: Must reuse the existing `tablet` (768px) breakpoint already governing the nav's current mobile reflow in `app.css` (per spec Assumptions — no new breakpoint introduced). Must satisfy WCAG 2.1 AA (constitution Article VII): keyboard operability, `aria-expanded`/`aria-controls` on the toggle, 44×44px minimum tap target.

**Scale/Scope**: Single component (`app/routes/components/navigation/`) and its stylesheet (`app/app.css`). No routes, content types, or schemas touched.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — No route is
      touched; `Navigation` is an existing shared component (`app/routes/components/navigation/`)
      already paired with `navigation.types.ts`. The toggle is a few lines of local state and
      a `<button>` inside the existing component, not a new reusable behavior, so it does not
      warrant a new sub-component or the generic-engine/domain-adapter split (that split solves
      "one engine, several presentations," which doesn't apply to a single boolean toggle).
- [x] **Content ownership** — N/A. No new content is introduced; nav labels/links remain
      sourced from the existing `NAVBAR_DATA` constant.
- [x] **Sanity content layer** — N/A. No query or schema changes.
- [x] **Media (Cloudinary)** — N/A. No video/media assets involved.
- [x] **TypeScript strict** — No `any`/`@ts-ignore` planned; new toggle state is a simple
      `useState<boolean>`, no new shared types beyond what's already in `navigation.types.ts`.
- [x] **Mobile-first** — Reuses the existing `tablet` (768px) breakpoint already defined in
      `app/constants/index.ts` / `app.css`; no new breakpoint is introduced, per spec Assumptions.
- [x] **Accessibility (WCAG 2.1 AA)** — Toggle button will have an accessible name, `aria-expanded`
      and `aria-controls`, visible focus indicator (existing `:focus-visible` pattern), and a
      44×44px minimum tap target (FR-005, SC-003).
- [x] **Performance & SEO** — N/A beyond baseline; no new route, no new above-fold data fetch,
      no images/video added.

Any unchecked item is a **blocking violation**. Document justified exceptions in the
Complexity Tracking table.

## Component Design Decisions

| Component    | Placement                            | Generic base (if adapter) | Rationale |
| ------------ | ------------------------------------- | -------------------------- | --------- |
| `Navigation` | Existing — Shared, modified in place | N/A                        | Already exists at `app/routes/components/navigation/`, consumed globally via `root.tsx`. This feature adds toggle state and a button in place — no new component file, since the toggle isn't reusable behavior. |

## Content Layer Decisions

N/A — this feature introduces no new content; it modifies presentation behavior of existing, already-sourced navigation data (`NAVBAR_DATA`).

## Project Structure

### Documentation (this feature)

```text
specs/COT-019-hamburger-navigation-menu/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — N/A content, documents UI state model instead
├── quickstart.md         # Phase 1 output (/speckit.plan command)
├── contracts/            # Phase 1 output — N/A, no GROQ queries added by this feature
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── routes/
│   └── components/
│       └── navigation/
│           ├── index.tsx              # Modified — adds toggle state, hamburger button, mobile menu markup
│           └── navigation.types.ts    # Modified — adds toggle-related prop/state types if any are needed
└── app.css                            # Modified — hamburger button + open/close menu styles,
                                        # replaces the current @media (max-width: 768px) wrap behavior
```

**Structure Decision**: This feature fits the existing shape as-is — it modifies the already-existing shared `Navigation` component and its stylesheet in place. No new routes, no new `app/components/` entries, and no Sanity or Cloudinary directories are touched.

## Complexity Tracking

> No Constitution Check violations — this table is not needed.
