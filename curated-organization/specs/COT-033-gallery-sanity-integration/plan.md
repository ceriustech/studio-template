# Implementation Plan: Gallery page and portfolio pieces from the content studio

**Branch**: `COT-033-gallery-sanity-integration` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

## Summary

The Gallery route gets a loader that fetches the `galleryPage` singleton (hero, SEO), every published `portfolioPiece` and the business name in one colocated query. It maps them into the existing component types and makes one fallback decision per section, as on Home (COT-031) and Services (COT-032). Today's hardcoded hero copy and demo projects move into `gallery.fallback.server.ts`, with every backup image switched to the Unsplash URL supplied in the ticket. `utils.ts` helpers become pure functions that take the pieces as an argument, and the components receive pieces via props. See [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript, React Router 8.0.0 (`app/`). No Studio changes.

**Primary Dependencies**: `@sanity/client`, `groq`, `@sanity/image-url`. No new packages.

**Storage**: Sanity `production`. `galleryPage` has hero + SEO filled; 0 `portfolioPiece` documents (R1).

**Testing**: No automated suite. `npm run typecheck`, `npm run build`, and [quickstart.md](quickstart.md).

**Constraints**: `meta` runs in the client bundle, so it can't import `.server` code. Backup copy and query stay server-only.

**Scale/Scope**:
- New: `gallery.query.ts`, `gallery.loader.server.ts`, `gallery.fallback.server.ts`, `components/hero/Hero.types.ts`, `components/projects/Projects.types.ts`.
- Edited: route `index.tsx`, `gallery.types.ts`, `utils.ts`, `hero/index.tsx`, `projects/index.tsx`, `FilteredCategory.tsx` + types, `PortfolioPiece.tsx`, `routes/constants/index.ts`.
- Removed: `public/gallery/photos/*.jpg` (no longer referenced; backup images use the Unsplash URL).

## Constitution Check

- [x] **Architecture.** Route stays flat (`index.tsx`, `gallery.types.ts`, `gallery.query.ts`, `utils.ts`, plus `.server` loader/fallback as on Home/Services). Components without a types file (hero, projects) get one.
- [x] **Content ownership.** Hero copy, portfolio pieces and SEO are editorial and come from existing types. Categories, page size and labels stay in code.
- [x] **Sanity content layer**, with the existing exception: no TypeGen (Complexity Tracking).
- [ ] **Media (Cloudinary).** Exception: the existing `videoMedia` schema stores videos as Sanity files with a separate poster image. `app/` must not edit schemas, so the frontend consumes what the schema provides (Complexity Tracking).
- [x] **TypeScript strict.** No `any`, `@ts-ignore` or `as`. `videos` is `readonly VideoMedia[]` (the old tuple type does not survive loader-data serialization); the loader caps it at one before + one after.
- [x] **Mobile-first / Accessibility.** No CSS changes. CMS alt text with caption/title fallbacks.
- [x] **Performance & SEO.** SSR loader, `meta` export, AVIF/WebP via `auto('format')`, no client fetching; search-param navigations skip revalidation.

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|---|---|---|
| Hand-written `Cms*` types | TypeGen ticket not done (same as COT-031/032) | Running TypeGen is its own ticket |
| Videos via Sanity file CDN, poster as image field | The schema is defined that way; `app/` must not edit schemas | Cloudinary migration is a Studio change outside this ticket |
