# Implementation Plan: Connect global components to Sanity

**Branch**: `COT-028-global-sanity-content` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-028-global-sanity-content/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Navigation, Footer and the site CTA will render content from the `siteSettings` and `siteCta` Sanity singletons instead of hardcoded copy. They fall back to today's content section by section whenever Sanity is unreachable, unconfigured, empty or incomplete.

A single root loader:
- fetches both documents in one GROQ request, through a server-only client with a 2-second timeout;
- maps the result onto new prop types, building image URLs server-side with `urlFor` so crop and hotspot apply;
- never throws.

`Layout` keeps rendering the global chrome and reads the data with `useRouteLoaderData('root')`. The root skips revalidation. A route `handle` (`hideSiteCta`) replaces the pathname check for CTA versus What to Expect.

This ticket also lays the shared Sanity foundation (client, image helper, env config) that later page tickets reuse.

Research found one design change. On an unmatched URL, React Router doesn't run the root loader (R5), so a catch-all 404 route is added so that Nav and Footer keep their data on real 404s.

## Technical Context

**Language/Version**: TypeScript (strict), React Router 8.0.0 (framework mode, SSR), Node 24

**Primary Dependencies**:
- New: `@sanity/client@^8.7.0`, `@sanity/image-url@^2.1.1`, `groq@^6.16.0`
- Existing: React Router, `lucide-react`

**Storage**: Sanity Content Lake, read-only, `published` perspective. It reads the existing `siteSettings` and `siteCta` singletons. There are no schema changes.

**Testing**: The repo has no automated test suite. Acceptance is the manual scenarios in [quickstart.md](./quickstart.md): populated, empty dataset, invalid project, missing config, partial content, 404, CTA swap, nav regressions and a bundle check. Also `npm run typecheck` and `npm run build`.

**Target Platform**: Web. SSR on Node; the repo currently has both a Dockerfile and the Netlify Vite plugin. Environment variables come from the host in production and from `.env` in development (R2).

**Project Type**: web. A single React Router app (`app/`) plus Sanity Studio (`studio/`), which this ticket doesn't touch.

**Performance Goals**:
- One Sanity CDN request per document load, and none on client navigation.
- Pages render within 3 seconds even when Sanity is down or slow, because of the 2-second client timeout.
- No new CLS: images carry explicit width and height, and the CTA background is a CSS background as today.

**Constraints**:
- The Sanity settings, the client, the image builder and the fallback content must never reach the browser bundle (FR-005). This is enforced by `*.server.ts` naming and checked by grepping `build/client` (quickstart scenario 9).
- The root loader must never throw (FR-007).

**Scale/Scope**:
- 3 shared components edited: Navigation, Footer and Cta, plus their types.
- `root.tsx` edited.
- A `booking` handle added.
- 1 new route: the catch-all 404.
- 5 new files: 3 under `app/lib/sanity/`, plus the 2 root sibling files.
- 1 new types file (`app/types/global.ts`).
- `NAVBAR_DATA` and the `NAVIGATION` global type removed.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Architecture: flat routes, components paired with types.**
  - The new `not-found/index.tsx` route is a single flat file.
  - No new components are added. Navigation, Footer and Cta keep their existing folders and `.types.ts` files; only their props change.
  - Those three already live in `app/routes/components/` with `index.tsx` rather than `app/components/{Name}/{Name}.tsx`. That is a pre-existing deviation, not introduced here, and the spec explicitly leaves the move out of scope.
- [x] **Content ownership.** All content moved to the CMS is editorial and uses existing types (`siteSettings`, `siteCta`, `navLink`, `contactLink`, `hoursLine`, `credentialBadge`). No concept is duplicated: the header and footer share one `navLinks` list. Fallback copy is a copy of today's content, used only when the CMS is unavailable.
- [x] **Sanity content layer**, with two logged exceptions (see Complexity Tracking).
  - `GLOBAL_QUERY` uses `defineQuery` and lives in `app/lib/sanity/queries/global.ts`, as a shared query.
  - `apiVersion` is pinned in the client.
  - Exception 1: CMS result types are hand-written until the TypeGen ticket.
  - Exception 2: the client and image helper are named `*.server.ts` rather than `client.ts` and `image.ts`.
- [x] **Media (Cloudinary).** N/A; this ticket has no video.
- [x] **TypeScript strict.** There is no `any` or `@ts-ignore`. Route types come from `+types/`, including `Route.ComponentProps` and the `useRouteLoaderData<typeof loader>` generic. The CMS result is typed by hand, which is the same exception as in the Sanity row. Narrowing is done with type guards in the mappers, not `as` casts.
- [x] **Mobile-first.** There are no new styles or breakpoints. The existing nav, footer and CTA CSS is untouched.
- [x] **Accessibility (WCAG 2.1 AA).**
  - Credential logos get alt text from their label (FR-016).
  - The nav logo stays decorative (`alt=""`) inside the link with an `aria-label`, as today.
  - Every existing `aria-*` attribute, focus behavior and landmark is kept (FR-014).
  - Footer hours become text instead of fake links, which improves accessibility.
- [x] **Performance & SEO.**
  - Global content comes from the root `loader`, rendered on the server.
  - Images get explicit width and height, and `auto('format')` serves WebP or AVIF.
  - The new 404 route exports `meta` with a "Page not found" title and `robots: noindex`.

All items pass. The two exceptions are justified below.

## Component Design Decisions

| Component | Placement | Generic base (if adapter) | Rationale |
| --------- | --------- | ------------------------- | --------- |
| Navigation | Shared, simple (existing, modified) | N/A | Props become `{ brand, links, bookNowLabel }`. It takes content only and has no per-consumer behavior. Its location is unchanged (a pre-existing deviation, out of scope). |
| Footer | Shared, simple (existing, modified) | N/A | Props become `{ brandName, content, navLinks }`. It renders the Connect and social columns only when they are non-empty (FR-018a), and splits the description on `\n`. |
| Cta | Shared, simple (existing, modified) | N/A | Props become `CtaContent`. It applies the hotspot as `background-position` (R6). |
| not-found route | Route (new, flat `index.tsx`) | N/A | Its loader throws 404, so the root loader runs and Nav and Footer render on real 404s (R5). It renders nothing itself; the root `ErrorBoundary` shows the 404 message. |

## Content Layer Decisions

| Content item | Classification | Content type (new or existing) | Notes |
| ------------ | -------------- | ------------------------------ | ----- |
| Brand name, tagline, logo, "Book now" label | Editorial | `siteSettings` (existing) | Used by the header, and by the brand name in the footer. |
| Nav links | Editorial | `siteSettings.navLinks` → `navLink` (existing) | One list feeds the header (minus Booking) and the footer "Navigate" column. |
| Footer description, credential logos, connect and social links, hours, copyright | Editorial | `siteSettings` → `credentialBadge`, `contactLink`, `hoursLine` (existing) | |
| CTA background, heading, subheading, button label and link | Editorial | `siteCta` (existing) | |
| Whether a page hides the CTA | Functional | Route `handle` in code | This is behavior, not copy. |
| Fallback copy and images | Functional | `app/root.fallback.server.ts` | Resilience default, not editable content. |
| Business phone and hours (`siteSettings.business*`) | — | — | Not read here; the Booking ticket uses them. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-028-global-sanity-content/
├── spec.md
├── plan.md              # This file
├── research.md          # Phase 0: decisions R1–R13
├── data-model.md        # Phase 1: CMS result → GlobalContent → props, fallback table
├── quickstart.md        # Phase 1: manual validation scenarios 1–9
├── contracts/
│   └── global-query.md  # GLOBAL_QUERY, root loader and route-handle contracts
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (/speckit.tasks), not yet created
```

### Source Code (repository root)

```text
.env.example                                   # New: SANITY_PROJECT_ID, SANITY_DATASET (.env already gitignored)
package.json                                   # Edited: + @sanity/client, @sanity/image-url, groq

app/
├── lib/sanity/
│   ├── client.server.ts                       # New: getSanityClient() → client | null; dev .env load; published, CDN, 2s timeout, pinned apiVersion
│   ├── image.server.ts                        # New: urlFor() via createImageUrlBuilder
│   └── queries/global.ts                      # New: GLOBAL_QUERY (defineQuery)
├── types/global.ts                            # New: LinkItem, ImageItem, BrandContent, FooterContent, CtaContent, GlobalContent, RouteHandle
├── root.loader.server.ts                      # New: fetch → map per section → fallback; hand-written Cms* types
├── root.fallback.server.ts                    # New: today's content as GlobalContent (# links dropped)
├── root.tsx                                   # Edited: re-export loader; shouldRevalidate → false; Layout reads useRouteLoaderData('root') + useMatches() handle
├── routes.ts                                  # Edited: + route('*', 'routes/pages/not-found/index.tsx')
├── index.d.ts                                 # Edited: remove the NAVIGATION interface
├── constants/index.ts                         # Edited: remove NAVBAR_DATA
└── routes/
    ├── components/
    │   ├── navigation/{index.tsx, navigation.types.ts}   # Edited: props, Link vs <a>, header Booking filter
    │   ├── Footer/{index.tsx, Footer.types.ts}           # Edited: props, conditional columns, hours as text
    │   └── Cta/{index.tsx, Cta.types.ts}                 # Edited: props, hotspot background-position
    └── pages/
        ├── booking/index.tsx                  # Edited: export handle = { hideSiteCta: true }
        └── not-found/index.tsx                # New: loader throws 404; meta (noindex)
```

**Structure Decision**: The feature fits the fixed shape with no new directories beyond `app/lib/sanity/`, which the constitution already specifies. The root's loader and fallback sit next to `root.tsx` as sibling files, because the root is a single file rather than a route folder (R11). The only structural addition is the catch-all 404 route (R5). `studio/` is untouched.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| Hand-written CMS result types (constitution III and V require generated `sanity.types.ts`) | The owner scoped TypeGen into its own ticket. The hand-written `Cms*` types stay private to `root.loader.server.ts`, and every field is optional, so the mappers must handle blanks. | Running TypeGen now would pull its setup (schema extract in `studio/`, typegen config, the generated file, and a workflow for regenerating) into a ticket that is already the shared foundation. It is deferred on purpose, not skipped: the TypeGen ticket replaces these types. |
| `client.server.ts` and `image.server.ts` instead of the constitution's `client.ts` and `image.ts` | The `.server` suffix makes the build refuse any client-side import, which enforces FR-005 structurally. Nothing in the app fetches from the browser: all content loads through server loaders. | A public-safe `client.ts` has no consumer today, and a plain name gives no build-time guarantee against leaking the project settings or fallback content. A constitution amendment to rename the files should follow if this pattern is adopted for every page. |
