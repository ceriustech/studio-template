# Implementation Plan: Plain-language SEO fields and a site-wide default

**Branch**: `COT-030-seo-schema-integration` | **Date**: 2026-10-05 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/COT-030-seo-schema-integration/spec.md`

## Summary

The shared `seo` object becomes plain language: "Page title", "Page summary" and "Share image", stored as `title`, `description` and `image`, with help text. The keywords field is removed. Length checks become warnings, and a Google-result preview appears above the fields. Only the Site Settings default enforces required fields. A new optional `businessName` in Site Settings supplies the title suffix.

On the live site, the existing global query also fetches `businessName` and `defaultSeo`. The root loader resolves them into a `SeoContent`, falling back per field. A new `buildMeta()` turns that into tags, and it replaces the hardcoded `META_DATA` in `root.tsx`. Per-page wiring is out of scope. See [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript, React Router v8 (`app/`); Sanity Studio v6 (`studio/`)

**Primary Dependencies**: `@sanity/client`, `groq`, `@sanity/image-url` (app); `sanity`, `@sanity/ui` (studio). `@sanity/ui` is already installed as a dependency of `sanity`; it gets declared in `studio/package.json`. No new packages.

**Storage**: Sanity Content Lake, `production`. The only document is `siteSettings`, with `defaultSeo: null`, so no migration is needed (R1).

**Testing**: No automated suite. Checks are `npm run typecheck`, then studio `sanity schema validate`, `tsc --noEmit` and `sanity build`, plus the manual checks in [quickstart.md](quickstart.md).

**Target Platform**: Web (containerized per Dockerfile), plus Sanity Studio

**Project Type**: web. A single React Router app (`app/`) and a separate Sanity Studio (`studio/`).

**Performance Goals**: No extra requests per page load. SEO fields are added to the existing `GLOBAL_QUERY` (FR-016).

**Constraints**: Every indexable page always outputs a non-empty title and description (SC-002). `meta` runs in the client bundle, so it can't import `.server` fallbacks (R5).

**Scale/Scope**: Studio: 6 edited schema files, 2 new files (`components/SeoInput.tsx`, `components/seoTitle.ts`) and `package.json`. App: 6 edited files (`queries/global.ts`, `root.loader.server.ts`, `root.fallback.server.ts`, `root.tsx`, `types/global.ts`, `constants/index.ts`) and 1 new file (`lib/seo.ts`).

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Architecture.** No routes or app UI components are added. `buildMeta` is a pure helper in `app/lib/` because page tickets will reuse it. The Studio preview isn't an `app/` component, so the app component-folder rules don't apply. It sits in `studio/components/`.
- [x] **Content ownership.** Title, summary, share image and business name are editorial, so they live in Sanity. Charset, viewport, `og:type`, `og:url` and `twitter:card` are functional, so they live in code. One shared `seo` type serves both the default and the per-page fields, so the concept isn't duplicated (R3).
- [x] **Sanity content layer**, with one logged exception. The query stays in `defineQuery` inside the shared `queries/global.ts`, and the schema changes only in `studio/`. Exception: no TypeGen (see Complexity Tracking).
- [x] **Media (Cloudinary).** N/A. No video.
- [x] **TypeScript strict.** No `any` or `@ts-ignore`. `meta` is typed with `Route.MetaFunction`. `CmsSeo` is hand-written, following the same logged exception.
- [x] **Mobile-first.** N/A. No app UI. The Studio preview uses `@sanity/ui` and responds to its container.
- [x] **Accessibility (WCAG 2.1 AA).** `og:image:alt` comes from the COT-029 alt text. Removing the duplicate `maximum-scale=1.0` viewport brings back pinch-zoom (WCAG 1.4.4, R7).
- [x] **Performance & SEO.** Root `meta` now provides title, description and Open Graph tags from the CMS for every route that inherits it. No extra request, and data comes from the existing loader.

**Post-design re-check**: still passes. The design adds one shared lib helper and one Studio input; no routes, queries or content types.

## Component Design Decisions

| Component | Placement | Generic base (if adapter) | Rationale |
| --- | --- | --- | --- |
| `SeoInput` (Studio) | `studio/components/SeoInput.tsx` | N/A | A Studio form input set on the `seo` type, not a site component. It wraps `renderDefault`, so the standard fields stay intact (R8). |
| `buildMeta` (helper, not UI) | `app/lib/seo.ts` | N/A | Used by root now and by each page ticket later ("anything used on 2+ routes"). |

## Content Layer Decisions

| Content item | Classification | Content type (new or existing) | Notes |
| --- | --- | --- | --- |
| Page title / summary / share image | Editorial | `seo` (existing, reshaped) | Read now from `siteSettings.defaultSeo` by the root loader; per-page `seo` is read by later page tickets |
| Business name (title suffix) | Editorial | `siteSettings.businessName` (new field) | Optional; backup "Curated Organization" in code (R2) |
| Charset, viewport | Functional | none | Rendered once by `Layout` (R7) |
| `og:url`, `og:type`, `twitter:card`, image dimensions | Functional | none | Built in `buildMeta` |
| Backup title/description | Functional | none | `root.fallback.server.ts` |

## Project Structure

### Documentation (this feature)

```text
specs/COT-030-seo-schema-integration/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── global-seo.md      # GLOBAL_QUERY additions + meta output contract
├── checklists/
│   └── requirements.md
└── tasks.md               # /speckit-tasks
```

### Source Code (repository root)

```text
studio/
├── package.json                    # declare @sanity/ui
├── components/
│   ├── SeoInput.tsx                # NEW: Google-result preview + renderDefault
│   └── seoTitle.ts                 # NEW: suffix/no-duplicate helper (mirrors app logic)
└── schemaTypes/
    ├── objects/seo.ts              # rename fields, drop keywords, warnings, help text, input
    └── documents/
        ├── siteSettings.ts         # businessName; "Default search & sharing"; required-on-default
        ├── homePage.ts             # "SEO" → "Search & sharing"
        ├── servicesPage.ts         # same
        ├── galleryPage.ts          # same
        └── bookingPage.ts          # same

app/
├── constants/index.ts              # SITE_URL
├── lib/
│   ├── seo.ts                      # NEW: buildMeta(seo, pathname)
│   └── sanity/queries/global.ts    # + businessName, defaultSeo
├── types/global.ts                 # SeoContent; GlobalContent.seo
├── root.fallback.server.ts         # FALLBACK seo + backup business name
├── root.loader.server.ts           # CmsSeo type, mapSeo()
└── root.tsx                        # META_DATA removed → meta via buildMeta
```

**Structure Decision**: This fits the existing shape. `studio/components/` is a new folder for Studio-only React inputs. It's kept out of `schemaTypes/` because it holds UI, not schema. `app/routes/constants/index.ts` (`PAGE_ROUTES_DATA.metaData`) is intentionally left alone: it's the starting copy for the per-page tickets (spec, Out of Scope).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --- | --- | --- |
| `sanity schema extract` / `sanity typegen generate` not run; `CmsSeo` hand-written (constitution III, V) | TypeGen isn't set up (`sanity.types.ts` doesn't exist). COT-028 and COT-029 logged the same exception and deferred TypeGen to its own ticket. | Setting up TypeGen here adds unrelated scope. `CmsSeo` sits next to the existing hand-written `Cms*` types and is replaced when that ticket lands. |
| Title-suffix logic exists in both `studio/components/seoTitle.ts` and `root.loader.server.ts` | The Studio preview must match the live title, and `studio/` is a separate package that can't import from `app/`. | A shared workspace package for one 5-line function is more setup than the duplication it removes. Both copies cite each other in a comment. |
