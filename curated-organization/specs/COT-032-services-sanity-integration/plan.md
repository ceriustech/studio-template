# Implementation Plan: Services page content from the content studio

**Branch**: `COT-032-services-sanity-integration` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/COT-032-services-sanity-integration/spec.md`

## Summary

The Services route gets a loader that fetches the published `servicesPage` singleton, the Site Settings credential badges and the business name in one colocated query. It maps them into resolved props for the four sections and makes one fallback decision per section, using the same pattern as COT-031 Home: a missing anchor means the whole section uses backup content, empty optional fields are hidden, and lists and images fall back on their own. Today's hardcoded copy moves into `services.fallback.server.ts` unchanged, and the backup service images stay today's Unsplash URLs. The four section components become prop-driven.

Per-page SEO mapping (`mapPageSeo`) and `nonNull` move from the Home loader into the shared `app/lib/sanity/mappers.server.ts`, since Services is the second route that needs them. Services exports the same `meta` as Home. See [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript, React Router 8.0.0 (`app/`). No Studio changes.

**Primary Dependencies**: `@sanity/client`, `groq`, `@sanity/image-url`. No new packages.

**Storage**: Sanity Content Lake, `production`. A published `servicesPage` has every section filled in, and `siteSettings` has two credential badges (R1). No migration.

**Testing**: No automated suite. Checks are `npm run typecheck`, `npm run build`, a scan of the client bundle, and the manual scenarios in [quickstart.md](quickstart.md) (R10).

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web. A single React Router app (`app/`) and a separate Sanity Studio (`studio/`).

**Performance Goals**: One extra CDN request per Services load, running in parallel with root's. Worst case is bounded by the existing 2000 ms client timeout (SC-003). Images are served as AVIF/WebP at about 2× their rendered size (R4).

**Constraints**:
- Every section always renders complete content (SC-002).
- With the content service down, the page is identical to today (SC-004), so backup copy, prices, highlight, images and badge sizes are moved unchanged (R5).
- `meta` runs in the client bundle, so it can't import `.server` code. The title is suffixed on the server (COT-031 R6).
- Backup copy and the query stay server-only (FR-014a).

**Scale/Scope**: App only.
- New, 8 files: `services.query.ts`, `services.loader.server.ts`, `services.fallback.server.ts`, `services.types.ts`, and `Hero.types.ts` / `About.types.ts` / `Service.types.ts` / `Pricing.types.ts`.
- Edited, 12 files:
  - route `index.tsx`
  - 6 component files (`hero/index.tsx`, `about/index.tsx`, `service/index.tsx`, `ServiceItem.tsx`, `pricing/index.tsx`, `PricingCard.tsx`)
  - 2 existing types files (`ServiceItem.types.ts`, `PricingCard.types.ts`)
  - `lib/sanity/mappers.server.ts`
  - `routes/pages/home/home.loader.server.ts` (imports the moved helpers; behavior unchanged)
  - `routes/constants/index.ts`

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Architecture.** The route stays flat. `index.tsx` gains `services.types.ts` and `services.query.ts`, both allowed as needed. The loader and fallback are `.server` files, as on Home and root (Complexity Tracking). No new components. The four section components that lack a types file (hero, about, service, pricing) get one now, as the constitution requires. No Generic/Domain split.
- [x] **Content ownership.** All Services copy, images, prices, the highlight flag, the badges and search & sharing text are editorial and come from the existing `servicesPage` and `siteSettings` types. Functional items stay in code: the `/booking` button destinations, the alternating layout, the `✓` and dash markers, and the image overlay. No new content types.
- [x] **Sanity content layer**, with one logged exception. `SERVICES_QUERY` uses `defineQuery`, colocated as `services.query.ts`. No schema edits from `app/`. Exception: no TypeGen (Complexity Tracking).
- [x] **Media (Cloudinary).** N/A. No video on Services.
- [x] **TypeScript strict.** No `any`, `@ts-ignore` or `as` casts. Route types come from `+types/index`. `CmsServices*` types are hand-written under the same exception.
- [x] **Mobile-first.** No CSS changes. The existing mobile/desktop About header split is kept.
- [x] **Accessibility (WCAG 2.1 AA).**
  - CMS alt text is used for the founder photo, service images and badges, with fallbacks to the signature, heading or label (R8).
  - Service images gain `role="img"` and an accessible name, which they lack today.
  - Landmarks and focus are unchanged.
- [x] **Performance & SEO.**
  - Content is fetched in the SSR `loader` with no client-side fetching.
  - Services exports its own `meta`.
  - Images use `auto('format')` at sized widths. The founder photo and logos carry `width`/`height`. Service images stay CSS backgrounds in min-height containers, so there's no CLS.

**Post-design re-check**: still passes. The design moves two helpers into the existing shared module. It adds no shared UI components, schemas or content types.

## Component Design Decisions

No new components. Existing route-local components change from hardcoded to prop-driven:

| Component | Placement | Generic base (if adapter) | Rationale |
| --- | --- | --- | --- |
| `Hero` (`components/hero/index.tsx`) | Route-local, + `Hero.types.ts` | N/A | Takes `HeroProps`. Small line and body hidden when empty |
| `About` (`components/about/index.tsx`) | Route-local, + `About.types.ts` | N/A | Takes `AboutProps`. Header rendered in both mobile and desktop slots from the same props. Badges map over `badges`; a badge without a label shows the logo only. Keeps `fetchPriority="high"` |
| `Service` (`components/service/index.tsx`) | Route-local, + `Service.types.ts` | N/A | Takes `{ items }`. `reversed = index % 2 === 1`, as today. Index keys (R12) |
| `ServiceItem` | Route-local (existing types updated) | N/A | `image: BackgroundImage` with `backgroundPosition` from hotspot, `role="img"` + `aria-label`. Optional eyebrow, description, bullet list and button are hidden when empty |
| `Pricing` (`components/pricing/index.tsx`) | Route-local, + `Pricing.types.ts` | N/A | Takes `PricingProps`. Note hidden when empty |
| `PricingCard` | Route-local (existing types updated) | N/A | Eyebrow becomes optional. Index keys for features |
| `mapServices` and helpers (not UI) | `services.loader.server.ts` | N/A | Route-specific mapping |
| `nonNull`, `toPageSeo` (not UI) | `app/lib/sanity/mappers.server.ts` | N/A | Moved from Home; used by Home and Services now, Gallery and Booking later (R3) |

## Content Layer Decisions

| Content item | Classification | Content type (new or existing) | Notes |
| --- | --- | --- | --- |
| Hero, about, services, pricing | Editorial | `servicesPage` + `heroSection`, `servicesPageItem`, `pricingTier` (existing) | Read only by Services |
| Credential badges | Editorial | `siteSettings.credentialBadges` (`credentialBadge`, existing) | Fetched in `SERVICES_QUERY` (same request) |
| Services search & sharing | Editorial | `servicesPage.seo` (`seo`, existing) | Merged per field over `siteSettings.defaultSeo` |
| Business name (title suffix) | Editorial | `siteSettings.businessName` (existing) | Same request |
| Backup copy and images | Functional | none | `services.fallback.server.ts`. Unsplash URLs for services; bundled `ceo_img_3.png` and NAPO logos |
| Button destinations, alternating layout, markers | Functional | none | Kept in components and CSS |

## Project Structure

### Documentation (this feature)

```text
specs/COT-032-services-sanity-integration/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── services-query.md   # SERVICES_QUERY, loader outcomes, meta merge
├── checklists/
│   └── requirements.md
└── tasks.md                # /speckit-tasks
```

### Source Code (repository root)

```text
app/
├── lib/sanity/mappers.server.ts        # + nonNull, toPageSeo (moved from home loader)
└── routes/
    ├── constants/index.ts              # SERVICES.metaData removed
    └── pages/
        ├── home/home.loader.server.ts  # imports nonNull, toPageSeo; behavior unchanged
        └── services/
            ├── index.tsx               # loader re-export, meta, passes props
            ├── services.types.ts       # NEW: ServicesContent
            ├── services.query.ts       # NEW: SERVICES_QUERY
            ├── services.loader.server.ts    # NEW: fetch + per-section resolution
            ├── services.fallback.server.ts  # NEW: FALLBACK_SERVICES_CONTENT
            └── components/
                ├── hero/{index.tsx, Hero.types.ts (NEW), hero.css}
                ├── about/{index.tsx, About.types.ts (NEW), about.css}
                ├── service/{index.tsx, Service.types.ts (NEW)}
                │   └── components/ServiceItem/{ServiceItem.tsx, ServiceItem.types.ts, serviceItem.css}
                └── pricing/{index.tsx, Pricing.types.ts (NEW), pricing.css}
                    └── components/PricingCard/{PricingCard.tsx, PricingCard.types.ts, pricingCard.css}
```

**Structure Decision**: Same shape as Home. The existing lowercase section folders with `index.tsx` aren't renamed, to keep the diff focused. The untracked `app/assets/services_img_1–4.avif` files aren't used (spec Clarifications).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --- | --- | --- |
| `sanity typegen` not run; `CmsServices*` hand-written (constitution III, V) | TypeGen still isn't set up. COT-028 to COT-031 logged the same exception. | Setting up TypeGen here adds unrelated scope. |
| Route has `services.loader.server.ts` and `services.fallback.server.ts`, which aren't in the constitution's route file list | The `.server` suffix keeps the client, mapping and backup copy out of the browser bundle (FR-014a). Same as Home and root. | Putting the loader in `index.tsx` would ship the backup copy to the client. |
| Helpers moved out of `home.loader.server.ts` (touches Home) | Two routes now need per-page SEO mapping (R3). | Duplicating it would let the title rules drift between pages (FR-016). |
