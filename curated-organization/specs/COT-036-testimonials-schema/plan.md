# Implementation Plan: Testimonials as their own content studio section

**Branch**: `COT-036-testimonials-schema` | **Date**: 2026-10-19 | **Spec**: [spec.md](spec.md)

## Summary

`testimonial` becomes a Studio **document** type instead of an object embedded in `homePage`. It gets its own top-level "Testimonials" item, with dividers, after Portfolio pieces. `homePage` loses its Testimonials field and tab.

A Sanity migration copies the 3 published testimonials into documents with deterministic IDs, cleans the stray "— " and "," from the client names, and unsets the old list, all in one transaction.

On the site, `HOME_QUERY` reads `*[_type == "testimonial"]` (newest first, `_id` as tiebreaker) as a top-level key in the same request. `mapTestimonials` keeps its current fallback rules, and the testimonials now survive a missing `homePage` document. The Rating field is removed, so the carousel always renders 5 stars.

See [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript, React Router 8.0.0 (`app/`); Sanity Studio 6.19 (`studio/`).

**Primary Dependencies**: `@sanity/client`, `groq`, `sanity/structure`, `sanity/migrate`, `@sanity/icons`. No new packages.

**Storage**: Sanity `production`. `homePage.testimonials` holds 3 items, and no `testimonial` documents exist yet (R1). **One content migration** (R4).

**Testing**: There is no automated test suite. Verify with `npm run typecheck`, `npm run build`, the Studio's `npm run build`, the migration's dry run, and [quickstart.md](quickstart.md).

**Performance Goals**: Still one Sanity request per Home page load. The new query key adds one small projection.

**Constraints**:
- The backup copy and the query stay server-only (`.server` files).
- The migration has to be run by the owner while logged in to the Sanity CLI.
- Release order: Studio, then migration, then app (R7). Any order is visually safe.

**Scale/Scope**:
- **Studio**:
  - Move `schemaTypes/objects/testimonial.ts` to `schemaTypes/documents/testimonial.ts`, change it to a document and add Client name help text.
  - Edit `schemaTypes/index.ts` (import path and list position), `schemaTypes/documents/homePage.ts` (remove the field and group), and `structure/index.ts` (new item and catch-all exclusion).
  - New: `migrations/testimonials-to-documents/index.ts`.
- **App**: edit `routes/pages/home/home.query.ts`, `home.loader.server.ts`, `home.fallback.server.ts` (drop `rating`), and `components/Testimonial/Testimonial.tsx` + `Testimonial.types.ts` (fixed 5 stars, no `rating` prop). `home.types.ts` is unchanged.

## Constitution Check

- [x] **Architecture.** No new routes or components. The Home route keeps its existing files.
- [x] **Content ownership.** Testimonials are editorial. They are modelled once, as a single `testimonial` type: the object becomes a document rather than being duplicated. The carousel's behaviour stays in code.
- [x] **Sanity content layer**, with the existing TypeGen exception (Complexity Tracking). The query keeps using `defineQuery` and stays colocated with the route. Schema edits are made in `studio/` only.
- [x] **Media.** No images or video.
- [x] **TypeScript strict.** No `any`, `@ts-ignore` or casts. The migration reads `doc.testimonials` through a local type, as `footer-link-columns` does.
- [x] **Mobile-first / Accessibility.** No CSS or markup changes. The carousel's star label, arrows and live region are unchanged (FR-015).
- [x] **Performance & SEO.** Data still comes from the server loader in one request, and `meta` is unchanged.

Re-checked after design: no new violations.

## Component Design Decisions

No new components. `Testimonial` (route-local, `home/components/Testimonial/`) is unchanged, along with its `TestimonialProps` contract.

## Content Layer Decisions

| Content item | Classification | Content type | Notes |
|---|---|---|---|
| Testimonials (quote, client name, location) | Editorial | `testimonial`: existing type, changed from object to **document** | Read by the Home carousel only. Other pages could reuse it later without remodelling. |
| Testimonial order | Functional | — | `_createdAt desc, _id asc` in the query. No manual order field (spec Assumptions). |
| Backup testimonials | Functional | — | `home.fallback.server.ts`, unchanged |

## Project Structure

### Documentation (this feature)

```text
specs/COT-036-testimonials-schema/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/home-query.md
├── checklists/requirements.md
└── tasks.md              # /speckit-tasks
```

### Source Code

```text
studio/
├── schemaTypes/
│   ├── index.ts                         # import testimonial from documents/, list it with documents
│   ├── objects/testimonial.ts           # removed (moved)
│   └── documents/
│       ├── testimonial.ts               # new location; type: 'document'; clientName description
│       └── homePage.ts                  # remove `testimonials` field and group
├── structure/index.ts                   # top-level "Testimonials" item + dividers; exclude from catch-all
└── migrations/testimonials-to-documents/index.ts   # new

app/routes/pages/home/
├── home.query.ts                        # move testimonials to top-level `*[_type == "testimonial"]`
└── home.loader.server.ts                # result type; mapHome reads result.testimonials; page-missing branch keeps CMS testimonials
```

**Structure Decision**: Fits the fixed shape as-is. Migrations already live in `studio/migrations/`.

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|---|---|---|
| Hand-written `Cms*` types | The TypeGen ticket isn't done (same as COT-031 to COT-035) | Running TypeGen is its own ticket |
