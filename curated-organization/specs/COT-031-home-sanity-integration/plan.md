# Implementation Plan: Home page content from the content studio

**Branch**: `COT-031-home-sanity-integration` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/COT-031-home-sanity-integration/spec.md`

## Summary

The Home route gets a loader that fetches the published `homePage` singleton in one colocated query. The loader maps it into resolved props for the six sections and makes one fallback decision per section, following the COT-028/030 pattern: a missing anchor means the whole section uses backup content, empty optional fields are hidden, and lists and images fall back on their own. Today's hardcoded copy moves into `home.fallback.server.ts`, which uses the new bundled AVIFs for the hero, service and before/after images. The six components become prop-driven.

The generic mapping helpers move from `root.loader.server.ts` into a shared `app/lib/sanity/mappers.server.ts`, which later pages can reuse. Home also exports `meta`, which merges its own search & sharing fields over the root default field by field. See [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript, React Router 8.0.0 (`app/`). No Studio changes.

**Primary Dependencies**: `@sanity/client`, `groq`, `@sanity/image-url`. No new packages.

**Storage**: Sanity Content Lake, `production`. A published `homePage` already has hero, intro, servicesTeaser and process. Before/after, testimonials and seo are empty (R1). No migration.

**Testing**: No automated suite. Checks are `npm run typecheck`, `npm run build`, a scan of the client bundle, and the manual scenarios in [quickstart.md](quickstart.md) (R10).

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web. A single React Router app (`app/`) and a separate Sanity Studio (`studio/`).

**Performance Goals**: One extra CDN request per Home load, running in parallel with root's. Worst case is bounded by the existing 2000 ms client timeout (SC-003). Images are served as AVIF/WebP at about 2× their rendered width (R4).

**Constraints**:
- Every section always renders complete content (SC-002).
- `meta` runs in the client bundle, so it can't import `.server` code. The Home title is suffixed on the server (R6).
- Backup copy and the query stay server-only (FR-014a).
- Published Home content must look the same as today (SC-004, R7).

**Scale/Scope**: App only (final counts after implementation).
- New, 8 files: `home.query.ts`, `home.loader.server.ts`, `home.fallback.server.ts`, `home.types.ts`, `lib/sanity/mappers.server.ts`, and `Hero.types.ts` / `Intro.types.ts` / `BeforeAfter.types.ts`.
- Edited, 17 files:
  - route `index.tsx`
  - 7 component files (`hero/index.tsx`, `Intro.tsx`, `Services.tsx`, `ServiceCard.tsx`, `Process.tsx`, `BeforeAfter.tsx`, `Testimonial.tsx`)
  - 3 existing types files
  - `useTestimonialCarousel.ts`
  - `hero.css`
  - `root.loader.server.ts`
  - `lib/seo.ts`
  - `types/global.ts`
  - `routes/constants/index.ts`

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Architecture.** The route stays flat. `index.tsx` gains `home.types.ts` and `home.query.ts`, both allowed as needed. The loader and fallback are split out as `.server` files, mirroring `root.loader.server.ts` / `root.fallback.server.ts`; see Complexity Tracking. No new components. Existing route-local components that lack a types file (Hero, Intro, BeforeAfter) get one now, as the constitution requires. No Generic/Domain split.
- [x] **Content ownership.** All Home copy, images, links and search & sharing text are editorial and come from the existing `homePage` type. Functional items stay in code: the card link destination (`/services`), the "Before"/"After" tags, slide timing, the decorative arrows and the uppercase styling. No new content types.
- [x] **Sanity content layer**, with one logged exception. `HOME_QUERY` uses `defineQuery`, colocated as `home.query.ts`. No schema edits from `app/`. Exception: no TypeGen (Complexity Tracking).
- [x] **Media (Cloudinary).** N/A. No video on Home.
- [x] **TypeScript strict.** No `any`, `@ts-ignore` or `as` casts. Route types come from `+types/index`, and `meta` reads root data through typed `matches[0].loaderData`. `CmsHome*` types are hand-written under the same exception.
- [x] **Mobile-first.** Existing CSS and breakpoints are unchanged. The only CSS change is `text-transform` on the hero headline.
- [x] **Accessibility (WCAG 2.1 AA).**
  - CMS alt text is used for hero slides (active slide only), service cards and before/after images, with fallbacks to the card title or section heading.
  - Decorative arrows are `aria-hidden`.
  - Landmarks, focus and the carousel's `aria-live` are unchanged (R8).
- [x] **Performance & SEO.**
  - Content is fetched in the SSR `loader` with no client-side fetching.
  - Home now exports its own `meta` with title, description and Open Graph tags.
  - Images use `auto('format')` at sized widths. They stay CSS backgrounds in fixed-height containers, so there's no CLS. The switch to `<img>` + dimensions is deferred (R4).

**Post-design re-check**: still passes. The design adds one shared server lib module and one pure helper (`mergeSeo`). It adds no shared UI components, schemas or content types.

## Component Design Decisions

No new components. Existing route-local components change from hardcoded to prop-driven:

| Component | Placement | Generic base (if adapter) | Rationale |
| --- | --- | --- | --- |
| `Hero` (`components/hero/index.tsx`) | Route-local, + `Hero.types.ts` | N/A | Takes `HeroProps`. Rotation uses `slides.length` and doesn't start with only one slide. Button is hidden without a link |
| `Intro` | Route-local, + `Intro.types.ts` | N/A | Takes `IntroProps` |
| `Services` / `ServiceCard` | Route-local (existing types updated) | N/A | Takes `ServicesProps`. Card image becomes `BackgroundImage` (src, alt, position) |
| `Process` | Route-local (existing types updated) | N/A | Takes `ProcessProps`. Connector between every pair of steps |
| `BeforeAfter` | Route-local, + `BeforeAfter.types.ts` | N/A | Takes `BeforeAfterProps`. Keeps its `onError` placeholder |
| `Testimonial` | Route-local (existing types updated) | N/A | Takes `{ items }`. Optional location. Debug `console.log`s removed (no dead code) |
| `mapHome` and helpers (not UI) | `home.loader.server.ts` | N/A | Route-specific mapping |
| Generic mappers (not UI) | `app/lib/sanity/mappers.server.ts` | N/A | Used by root and Home now, and by later page tickets (R3) |
| `mergeSeo` (not UI) | `app/lib/seo.ts` | N/A | Pure and client-safe, used by `meta`. Reused by later page tickets |

## Content Layer Decisions

| Content item | Classification | Content type (new or existing) | Notes |
| --- | --- | --- | --- |
| Hero, intro, services teaser, process, before/after, testimonials | Editorial | `homePage` + `heroSection`, `serviceCard`, `step`, `imageMedia`, `testimonial` (existing) | Read only by Home |
| Home search & sharing | Editorial | `homePage.seo` (`seo`, existing) | Merged per field over `siteSettings.defaultSeo` |
| Business name (title suffix) | Editorial | `siteSettings.businessName` (existing) | Fetched in `HOME_QUERY` (same request) |
| Backup copy and images | Functional | none | `home.fallback.server.ts` and `app/assets/home_*.avif` |
| Card destination, "Before"/"After" tags, slide interval, `→`, headline casing | Functional | none | Kept in components and CSS |

## Project Structure

### Documentation (this feature)

```text
specs/COT-031-home-sanity-integration/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── home-query.md      # HOME_QUERY, loader outcomes, meta merge
├── checklists/
│   └── requirements.md
└── tasks.md               # /speckit-tasks
```

### Source Code (repository root)

```text
app/
├── assets/home_{hero_slide,services}_img_{1,2,3}.avif, home_beforeandafter_img_{1,2}.avif   # already added (untracked); backup images
├── lib/
│   ├── seo.ts                         # + mergeSeo()
│   └── sanity/mappers.server.ts       # NEW: shared Cms* types + text/link/image/seo helpers (moved from root)
├── types/global.ts                    # + BackgroundImage, PageSeo
├── root.loader.server.ts              # imports helpers from mappers.server.ts; behavior unchanged
└── routes/
    ├── constants/index.ts             # HOME.metaData removed
    └── pages/home/
        ├── index.tsx                  # loader re-export, meta, passes props
        ├── home.types.ts              # NEW: HomeContent
        ├── home.query.ts              # NEW: HOME_QUERY
        ├── home.loader.server.ts      # NEW: fetch + per-section resolution
        ├── home.fallback.server.ts    # NEW: FALLBACK_HOME_CONTENT
        └── components/
            ├── hero/{index.tsx, Hero.types.ts (NEW), hero.css}
            ├── Intro/{Intro.tsx, Intro.types.ts (NEW)}
            ├── Services/{Services.tsx, ServiceCard.tsx, Services.types.ts}
            ├── Process/{Process.tsx, Process.types.ts}
            ├── BeforeAfter/{BeforeAfter.tsx, BeforeAfter.types.ts (NEW)}
            └── Testimonial/{Testimonial.tsx, Testimonial.types.ts, useTestimonialCarousel.ts}
```

**Structure Decision**: This fits the existing shape. The `{route}.loader.server.ts` / `{route}.fallback.server.ts` split is the one COT-028 set for root and the agreed page template. It's logged below because the constitution's route tree lists only `index.tsx`, `types`, `query` and `utils`. The existing lowercase `hero/index.tsx` folder isn't renamed, to keep the diff focused.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --- | --- | --- |
| `sanity schema extract` / `sanity typegen generate` not run; `CmsHome*` hand-written (constitution III, V) | TypeGen still isn't set up (`sanity.types.ts` doesn't exist). COT-028/029/030 logged the same exception and deferred TypeGen to its own ticket. | Setting up TypeGen here adds unrelated scope. The types sit next to the existing hand-written `Cms*` types and are replaced when that ticket lands. |
| Route has `home.loader.server.ts` and `home.fallback.server.ts`, which aren't in the constitution's route file list | The `.server` suffix is what keeps the client, query mapping and backup copy out of the browser bundle (FR-014a). It mirrors root and the agreed page template. | Putting the loader in `index.tsx` would pull the backup copy into the client bundle. A `utils.ts` without the `.server` suffix has the same problem. |
| Helpers moved out of `root.loader.server.ts` into `app/lib/sanity/mappers.server.ts` (touches root) | Two routes now need them, and three more will (R3). | Duplicating them in Home would let link validation and the title suffix drift between pages. |
