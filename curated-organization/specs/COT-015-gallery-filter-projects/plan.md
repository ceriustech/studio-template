# Implementation Plan: Gallery Filter Bar and Projects section

**Branch**: `COT-015-gallery-filter-projects` | **Date**: 2026-07-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-015-gallery-filter-projects/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement the Gallery page's Filter Bar and Projects section: a default ("All") view showing one section per category, each cycling through up to 5 portfolio pieces via a section-level carousel, plus a filtered/paginated view for a single category reached by clicking a filter pill or a section's "View all" link. Each portfolio piece renders a mutually-exclusive before/after video pair, its own detail-image carousel, and a text block (title, category tag, location, description). Filter and page state live in the URL query string via React Router's `useSearchParams`. Content is a fixed, hardcoded mock dataset (per spec Assumptions) shaped to match the ticket's provided TypeScript type, living in the `gallery` route's own `utils.ts`/`gallery.types.ts` — no Sanity schema or query in this pass. Existing scaffolded stubs (`gallery/components/filter-bar/index.tsx`, `gallery/components/projects/index.tsx`, and `gallery/index.tsx` already wiring `<FilterBar />`/`<Projects />` after `<Hero />`) are filled in rather than created from scratch.

## Technical Context

**Language/Version**: TypeScript, React Router v7 (installed as `react-router@8.0.0`; Technical Context follows the constitution's stated stack)

**Primary Dependencies**: React Router (`useSearchParams`, `Link`), Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`. This feature adds no new npm dependency — carousels, pagination, and video mutual-exclusion are implemented with plain React state (`useState`) and native `<video>`/button elements, matching the plain-CSS-file component pattern already used across the site.

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets — neither is used by this pass. Portfolio piece content is a fixed, hardcoded mock array in `app/routes/pages/gallery/utils.ts`, typed via `app/routes/pages/gallery/gallery.types.ts`, per spec Assumptions. No application database.

**Testing**: No automated test runner (Vitest/Playwright) is configured in this repo. Validation is manual visual/interaction QA against the provided design screenshots and the spec's Acceptance Scenarios, consistent with how prior sections were validated.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new goals beyond the constitution's existing Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms). Detail/BA images specify explicit dimensions via fixed-height CSS cells (matching the mockup's `ba-cell`/`detail-cell` pattern) to avoid layout shift; videos are not autoplayed (click-to-play only), so they do not contend with LCP.

**Constraints**: Must visually match the provided design screenshots exactly (per spec Acceptance Criteria); URL state (`?category=&page=`) must be shareable/refresh-safe/back-button-friendly (FR-010–FR-012); at most one of a piece's before/after videos may play at a time (FR-014); advancing the section carousel must stop the previous piece's video and reset its detail-image carousel (FR-016); all controls must be keyboard-operable (FR-018).

**Scale/Scope**: The `gallery` route already has `<Hero />` (COT-014) wired in, plus scaffolded-but-empty `filter-bar` and `projects` stubs and an empty `gallery.types.ts`/`utils.ts`. This feature fills in `FilterBar` and `Projects` (and new nested sub-components under `projects/components/`), populates `gallery.types.ts`/`utils.ts` with the mock data model, and adds no new route. No Sanity schema changes.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — The `gallery`
      route stays flat at the route level (only its already-scaffolded `gallery.types.ts` and
      `utils.ts` gain content; no new route files). `FilterBar` and `Projects` keep their
      existing prop-less, lowercase-folder, `index.tsx`-only shape (no `.types.ts`), matching
      the precedent set by `hero` (COT-014) — both read URL state directly via
      `useSearchParams` rather than receiving props. Every new sub-component this feature adds
      under `projects/components/` (`CategorySection`, `FilteredCategory`, `PortfolioPiece`,
      and `PortfolioPiece`'s own nested `VideoPair` and `DetailImageCarousel`) takes props and
      is therefore a PascalCase folder paired with its own `.types.ts` from the start, per the
      constitution's default rule. No Generic/Domain-adapter split is used anywhere: all of
      these are route-local sub-components with exactly one route as their consumer, and the
      constitution reserves that split for shared, cross-route components in
      `app/components/` only.
- [x] **Content ownership** — Portfolio piece content (title, category, location, description,
      media) is classified functional/code for this pass: a fixed mock array, not
      Sanity-sourced, per spec Assumptions. No new content type is introduced. When this data
      later moves into Sanity as a `galleryProject`-style document type, only the data source
      changes — see Content Layer Decisions below.
- [x] **Sanity content layer** — N/A for this pass. No Sanity schema or GROQ query is added;
      the mock array in `gallery/utils.ts` is the sole data source.
- [ ] **Media (Cloudinary)** — **Documented exception (see Complexity Tracking).** This feature introduces the
      site's first video content (before/after pairs), but the data backing it is mock/local
      per spec Assumptions — there are no real Cloudinary-hosted assets to build delivery URLs
      for yet, so `app/lib/cloudinary/video.ts` is not used in this pass. See Complexity
      Tracking for the justification and the migration path.
- [x] **TypeScript strict** — No `any`/`@ts-ignore`. `Category`, `MediaSource`, and
      `PortfolioPiece` are defined once in `gallery.types.ts` and imported everywhere they're
      used (component prop types reference them, never redeclare). Route types are unaffected
      (no loader added — see Project Structure).
- [x] **Mobile-first** — Base (mobile) styles are written first for `filterBar`, `projects`,
      the section/portfolio-piece header, and the video/detail grids; the header's mobile wrap
      behavior (title own line, controls/metadata below) is implemented at the same 768px/480px
      breakpoints already used by sibling sections, per spec Assumptions and Edge Cases.
- [x] **Accessibility (WCAG 2.1 AA)** — Filter pills are real `<button>` elements exposing
      pressed/active state; section and detail carousel controls use distinct `aria-label`s
      ("Next project" vs. "Next detail image") per FR-017; disabled boundary controls use the
      native `disabled` attribute (keyboard- and screen-reader-correct, not just visual
      greying); videos get an accessible label identifying which piece/before-or-after they
      show (the description text already conveys the transformation's substance, so a text
      transcript isn't needed on top of it); all `<img>`/background-image content pairs a
      real `<img alt="...">` for accessibility, following the pattern already established by
      the home page's `BeforeAfter` component (visually-hidden `<img>` + `background-image`
      for the visual). Color contrast reuses the existing `--charcoal`/`--taupe`/`--muted`
      tokens already verified for sibling sections.
- [x] **Performance & SEO** — No `loader` is added — the mock data is a static, bundled array,
      not a network fetch, so there is nothing to move server-side for this pass. No new route,
      so the existing `gallery` route's `meta` (already defined via `PAGE_ROUTES_DATA.GALLERY`)
      is unaffected. Images/video cells use fixed-height CSS containers to protect CLS; videos
      are click-to-play (never autoplay), so they don't compete for LCP.

Any unchecked item is a **blocking violation**. Document justified exceptions in the
Complexity Tracking table.

## Component Design Decisions

| Component              | Placement   | Generic base (if adapter) | Rationale                                                                                                                                                                                                                 |
| ----------------------- | ----------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FilterBar`            | Route-local | N/A                         | Existing stub (`filter-bar/index.tsx`). Prop-less like `Hero` — reads the active category from `useSearchParams` and writes `category` (resetting `page`) on pill click.                                              |
| `Projects`             | Route-local | N/A                         | Existing stub (`projects/index.tsx`). Prop-less orchestrator — reads `category`/`page` from `useSearchParams`; renders one `CategorySection` per category when `category` is absent/`all`, otherwise one `FilteredCategory`. |
| `CategorySection`      | Route-local | N/A                         | New, under `projects/components/`. Takes a category + its (up to 5) pieces as props; owns the section-level carousel index; renders the active `PortfolioPiece`.                                                       |
| `FilteredCategory`     | Route-local | N/A                         | New, under `projects/components/`. Takes a category + its full piece list + current page as props; renders up to 5 stacked `PortfolioPiece`s for that page with inline prev/next page controls (no separate `Pagination` component — the control is a few lines used in exactly one place). |
| `PortfolioPiece`       | Route-local | N/A                         | New, under `projects/components/`. Shared by both `CategorySection` and `FilteredCategory` (both within the `gallery` route) — renders `VideoPair`, `DetailImageCarousel`, and the text block for one piece. Not a Generic/Domain-adapter pair: both consumers render it identically with no per-consumer behavior difference, so the constitution's route-local exclusion applies. |
| `VideoPair`            | Route-local | N/A                         | New, nested under `PortfolioPiece/components/`. Owns the before/after mutual-exclusion play state for one piece; keyed by piece id from its parent so switching pieces remounts it (stopping any playback) for free. |
| `DetailImageCarousel`  | Route-local | N/A                         | New, nested under `PortfolioPiece/components/`. Owns a piece's own detail-image index state; keyed by piece id from its parent so it resets to the first image whenever the active piece changes.                     |

**No shared carousel engine**: the section-level carousel (in `CategorySection`) and the
detail-image carousel (in `DetailImageCarousel`) are each a small, independent `useState` index
with their own boundary/suppression rules (see research.md) rather than a shared hook or
component. The two behaviors differ enough — position indicator vs. none, suppress-entirely-at-1
vs. always shown, reset-on-parent-change vs. not — that sharing an engine would mean branching
inside it for each difference. The constitution also reserves the Generic/Domain-adapter split
for cross-route shared components, and both carousels here have exactly one, route-local
consumer each.

## Content Layer Decisions

| Content item                                                          | Classification            | Content type (new or existing)                | Notes                                                                                                                                                             |
| ------------------------------------------------------------------------ | -------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portfolio pieces (title, category, location, description, before/after media, detail images) | Functional (this pass) / Editorial (future) | None — hardcoded mock array in `gallery/utils.ts` | Shaped per the ticket's provided TypeScript type. Not modeled as a Sanity field in this pass; a future `galleryProject` document type (and Cloudinary-backed video) would replace only this data source, per spec Assumptions — components are written against the `PortfolioPiece` type, not the mock array directly, to keep that swap contained to `utils.ts`. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-015-gallery-filter-projects/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — Category/MediaSource/PortfolioPiece shapes
├── contracts/            # Phase 1 output — the gallery's URL query-string contract
│   └── gallery-url-state.md
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
└── routes/
    └── pages/
        └── gallery/
            ├── index.tsx                          # Existing — already renders <Hero /><FilterBar /><Projects />, unchanged
            ├── gallery.types.ts                    # Existing (empty) — Category, MediaSource, PortfolioPiece types added
            ├── utils.ts                            # Existing (empty) — mock PORTFOLIO_PIECES array + getSectionPieces/getFilteredPieces/paginate/clampPage helpers
            └── components/
                ├── hero/                               # Existing — COT-014, unchanged
                ├── filter-bar/                         # Existing stub — filled in
                │   ├── index.tsx
                │   └── filterBar.css                       # New
                └── projects/                           # Existing stub — filled in
                    ├── index.tsx
                    ├── projects.css                        # New — camelCase, section/container-level rules
                    └── components/                         # New — this route's first nested components dir
                        ├── CategorySection/                    # Always paired: .tsx + .types.ts
                        │   ├── CategorySection.tsx
                        │   ├── CategorySection.types.ts
                        │   └── categorySection.css
                        ├── FilteredCategory/                   # Always paired: .tsx + .types.ts
                        │   ├── FilteredCategory.tsx
                        │   ├── FilteredCategory.types.ts
                        │   └── filteredCategory.css
                        └── PortfolioPiece/                     # Always paired: .tsx + .types.ts
                            ├── PortfolioPiece.tsx
                            ├── PortfolioPiece.types.ts
                            ├── portfolioPiece.css
                            └── components/
                                ├── VideoPair/                      # Always paired: .tsx + .types.ts
                                │   ├── VideoPair.tsx
                                │   ├── VideoPair.types.ts
                                │   └── videoPair.css
                                └── DetailImageCarousel/            # Always paired: .tsx + .types.ts
                                    ├── DetailImageCarousel.tsx
                                    ├── DetailImageCarousel.types.ts
                                    └── detailImageCarousel.css
```

No changes to `studio/`, `app/components/`, `app/lib/sanity/`, `app/lib/cloudinary/`, or
`app/routes/constants/` — this feature adds no shared cross-route component, no Sanity
schema/query, no real Cloudinary asset, and no new route.

**Structure Decision**: Fits the existing shape as-is — the already-scaffolded `filter-bar` and
`projects` stubs are filled in, and `projects` grows its first `components/` sub-tree following
the constitution's always-paired-with-types rule for every component that takes props. No
deviation to justify beyond the documented Media/Cloudinary exception below.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                                                                                   | Why Needed                                                                                                                   | Simpler Alternative Rejected Because                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Media article: video delivery doesn't go through `app/lib/cloudinary/video.ts` / `cloudinary.asset` | This pass's portfolio data is a fixed mock dataset (per spec Assumptions — Sanity/Cloudinary wiring is explicitly out of scope for this feature); there is no real Cloudinary public ID to build a delivery URL from. | Waiting to build the Gallery's browsing/filtering/carousel behavior until Sanity+Cloudinary wiring exists would block delivering the experience the spec calls for now; the mock `MediaSource.src`/`poster` fields are plain URLs precisely so this feature is self-contained. When the data source moves to Sanity (a separate, future feature per Content Layer Decisions), video delivery moves through the sanctioned helper at that time — the component layer already reads from `PortfolioPiece.beforeMedia`/`afterMedia`, not a raw string, so that swap stays contained to `utils.ts`. |
