# Implementation Plan: Gallery Video Poster & Lightbox

**Branch**: `COT-026-gallery-video-lightbox` | **Date**: 2026-08-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-026-gallery-video-lightbox/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Rework the Gallery page's per-project media panels so each video rests on a real poster image (Before/After tag, duration chip, play affordance, no more "paused · poster" placeholder text) and every panel — video or photo — opens a shared, accessible full-screen lightbox instead of playing/expanding inline. The lightbox cycles videos and photos as two separate, non-mixing sets, shows a filmstrip on tablet/desktop, and is fully keyboard-, touch-, and screen-reader-operable. Per the ticket, Sanity/Cloudinary are out of scope: media stays in the existing local static-data array (`utils.ts`), moved to reference files under `/public`, with the new `VideoMedia`/`ImageMedia` types shaped so a future swap to remote (Sanity/Cloudinary) sourcing only changes how the `src`/`poster` strings are produced — never the components that render them.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React (`createPortal`), React Router, Tailwind CSS, `lucide-react` (icons — already used by `VideoPair`/`DetailImageCarousel`). No new npm dependency is introduced: the lightbox's focus trap, touch-swipe, and scroll-lock are hand-rolled to match this project's existing no-lightbox-library baseline and to avoid triggering the constitution's "packaged UI library requires an amendment" gate for what is a single, fully custom component.

**Storage**: None added by this feature. Gallery content stays a local, hand-authored TypeScript array (`app/routes/pages/gallery/utils.ts`), with video/poster/detail-image files served from `/public`. Sanity (Content Lake) and Cloudinary are explicitly deferred — see Constitution Check and Complexity Tracking.

**Testing**: No automated test framework is configured in this repo (`package.json` has no Vitest/Playwright/Jest). Validation is `npm run typecheck` (strict TS, including the video-cap tuple type) plus lint and manual/visual QA against `quickstart.md`, per the constitution's Development Workflow review gates.

**Target Platform**: Web (SSR via React Router framework mode; containerized per Dockerfile) — desktop, tablet, and mobile browsers, including touch devices for swipe.

**Project Type**: Web — single React Router app (`app/`); no changes to `studio/` (no schema exists or is added for gallery media in this ticket).

**Performance Goals**: No regression to the Gallery route's Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms per constitution Article VIII). Poster images must ship with explicit dimensions to protect CLS; the lightbox must not block the main thread noticeably when opening or cycling.

**Constraints**: Evergreen desktop + mobile browsers; no browser storage APIs (no `localStorage`/`sessionStorage`/cookies) per spec FR-034; `prefers-reduced-motion` must be respected for every new hover/transition per spec FR-032; the lightbox must render nothing during SSR and only portal to `document.body` after hydration (spec FR-027). On mobile, the viewer shows dot indicators in place of the thumbnail row and no separate on-screen prev/next buttons (spec FR-016, FR-030); an active video's Before/After label persists as an overlay in the viewer, and video thumbnails in the tablet/desktop filmstrip carry a text label (spec FR-029, FR-031) — per the provided design screenshots.

**Scale/Scope**: One route (`app/routes/pages/gallery/`). Touches `gallery.types.ts`, `utils.ts` (18 existing portfolio pieces re-shaped to the new media types), and the `PortfolioPiece` component subtree (`VideoPair` → new `VideoPanel`, extended `DetailImageCarousel`, new `Lightbox`). No changes to `filter-bar`, `hero`, routing, or any other page.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — The route stays
      flat (`index.tsx`, `gallery.types.ts`, `utils.ts` — all already present, none newly
      added). Every new/changed component (`VideoPanel`, `Lightbox`) is route-local, lives
      under `PortfolioPiece/components/`, and pairs its `.tsx` with a `.types.ts` from the
      start. `Lightbox` gets exactly one presentation across all 18 project instances (no
      per-consumer behavior difference), so it stays a single route-local component — no
      Generic/Domain-adapter split. Hooks (focus trap, keyboard nav, swipe, scroll-lock) are
      co-located with `Lightbox`.
- [x] **Content ownership** — No new content type is introduced. Gallery media remains
      functional (in-code) data, continuing the pre-existing pattern for this route rather
      than newly deviating from it — see the Media (Cloudinary) exception below for why this
      ticket does not move it to Sanity.
- [x] **Sanity content layer** — N/A. This feature adds no GROQ queries and touches no
      Sanity schema; `studio/` is untouched.
- [ ] **Media (Cloudinary)** — **Violation, justified.** The spec requires an explicit
      `poster` field (with a `posterOffset` the UI doesn't yet use) sourced from `/public`,
      not a `cloudinary.asset` field with a URL-transformed poster. The ticket explicitly
      scopes Sanity/Cloudinary integration out of this phase. See Complexity Tracking.
- [x] **TypeScript strict** — No new `any`/`@ts-ignore`. The two-video cap (FR-003) is
      enforced at the type level with a bounded tuple union rather than a runtime check.
- [x] **Mobile-first** — Base styles target mobile; the filmstrip's tablet/desktop-only
      visibility is a CSS-only `display` toggle at the same `720px` cutoff this component
      subtree's existing stylesheets already use (`videoPair.css`, `detailImageCarousel.css`,
      `portfolioPiece.css` all switch to their stacked/mobile layout at `max-width: 720px`)
      — no new breakpoint token needed, and this route does not otherwise consume the
      `app/constants/index.ts` `BREAKPOINTS`/`QUERIES` tokens (those are used for
      JS-driven `matchMedia` cases elsewhere, e.g. navigation), so introducing them here
      would be inconsistent with this route's own established pattern.
- [x] **Accessibility (WCAG 2.1 AA)** — Focus management, keyboard trap, `role="dialog"` +
      `aria-modal`, visible focus states, and accessible labels are first-class requirements
      in the spec (User Story 3, FR-023–FR-025, FR-028, FR-033) and are planned in Phase 1.
- [x] **Performance & SEO** — No new route, so no new `meta` export needed. Poster images
      carry explicit dimensions; lazy-loading is required for thumbnails (FR-014); adjacent-
      image preloading in the lightbox (FR-026) is designed in Phase 1.

Any unchecked item is a **blocking violation**. Document justified exceptions in the
Complexity Tracking table.

## Component Design Decisions

| Component             | Placement    | Generic base (if adapter) | Rationale                                                                                                                                                                       |
| ---------------------- | ------------ | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VideoPanel`            | Route-local  | N/A                         | Renders exactly one video's resting state (poster, tag, duration chip, play affordance) and click-to-open behavior. Used twice per project by `VideoPair`; identical behavior every time — no adapter needed. |
| `VideoPair`             | Route-local  | N/A                         | Existing component, kept as the before/after layout wrapper; internals changed to render two `VideoPanel`s and delegate opening to the shared `Lightbox` instead of toggling inline playback. |
| `DetailImageCarousel`   | Route-local  | N/A                         | Existing component, extended (not replaced): each visible detail image becomes a clickable/keyboard-activatable control that opens `Lightbox` at that image's index; `loading="lazy"` added. |
| `Lightbox`              | Route-local  | N/A                         | One full-screen viewer per `PortfolioPiece`, portaled to `document.body`. Single presentation (no per-project behavior variance), so it does not qualify for the Generic/Domain-adapter split reserved for shared, cross-route components. |

## Content Layer Decisions

| Content item                        | Classification | Content type (new or existing)          | Notes                                                                                                                                                     |
| ------------------------------------ | --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gallery project videos & photos      | Functional (for now) | None — local TS array (`utils.ts`) | Ticket explicitly scopes this as UI-layer only ("Sanity and Cloudinary integration are not yet set up"). Media types are shaped so only the future data-source layer changes when this becomes editorial content in Sanity — see `data-model.md`. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-026-gallery-video-lightbox/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — media type shapes (no Sanity schema this phase)
├── quickstart.md         # Phase 1 output (/speckit.plan command)
├── contracts/            # Phase 1 output — media-type & component prop contracts
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
└── routes/
    └── pages/
        └── gallery/
            ├── index.tsx                        # Unchanged
            ├── gallery.types.ts                  # CHANGED — VideoMedia, ImageMedia, video-cap
            │                                      # tuple union, replaces MediaSource/DetailImage
            ├── utils.ts                          # CHANGED — PORTFOLIO_PIECES re-shaped to new
            │                                      # media types; local /public paths
            └── components/
                └── projects/
                    └── components/
                        └── PortfolioPiece/
                            ├── PortfolioPiece.tsx        # CHANGED — wires shared open/close state
                            ├── PortfolioPiece.types.ts   # CHANGED if new props needed
                            └── components/
                                ├── VideoPair/
                                │   ├── VideoPair.tsx           # CHANGED — renders 2x VideoPanel
                                │   └── VideoPair.types.ts      # CHANGED
                                ├── VideoPanel/                 # NEW
                                │   ├── VideoPanel.tsx
                                │   └── VideoPanel.types.ts
                                ├── DetailImageCarousel/
                                │   ├── DetailImageCarousel.tsx       # CHANGED — clickable, lazy
                                │   └── DetailImageCarousel.types.ts  # CHANGED
                                └── Lightbox/                   # NEW
                                    ├── Lightbox.tsx
                                    ├── Lightbox.types.ts
                                    ├── useLightbox.ts           # NEW — focus trap, keyboard,
                                    │                             #       swipe, scroll-lock, preload
                                    └── lightbox.css

public/
└── gallery/                          # NEW — local poster/video/detail-image assets for
                                       # this ticket's static data, per FR-005 / spec Assumptions
```

**Structure Decision**: Fits the existing route-local shape as-is. No shared (`app/components/`) component is introduced — every new or changed component is used by exactly this one route, so nothing crosses the "used by 2+ routes" threshold that would justify promoting it out of `PortfolioPiece/components/`.

## Complexity Tracking

| Violation                                                                 | Why Needed                                                                                                                                                                                                                | Simpler Alternative Rejected Because                                                                                                                                                                   |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Video media uses an explicit `poster`/`posterOffset` field on local `/public` files instead of a `cloudinary.asset` field with a URL-transformed poster (constitution Article IV). | The ticket explicitly states Sanity/Cloudinary integration "are not yet set up" for this ticket and scopes the work to the UI layer only, using local static files. Blocking on the CMS/CDN integration would stall the UI-correctness fixes (poster frames, controls, lightbox) this ticket exists to deliver. | Standing up `sanity-plugin-cloudinary` and a `galleryProject` schema first was rejected as out of scope — it is real work belonging to its own ticket, and doing it here would silently expand this ticket's scope beyond what was requested. |
| Gallery content stays functional (in-code), not migrated to a Sanity content type, continuing the route's pre-existing state.               | Same root cause as above — moving this content to Sanity requires the Cloudinary video field decision to be settled first, and is explicitly deferred by the ticket.                                                    | Same as above; additionally, the local media types are deliberately shaped (plain `src`/`poster` strings, no component awareness of their origin) so that migrating to Sanity later changes only the data-producing layer (`utils.ts` → a query), not `VideoPanel`/`Lightbox`/`DetailImageCarousel`. |
