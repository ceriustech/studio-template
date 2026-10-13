---

description: "Task list for COT-033: Gallery page and portfolio pieces from the content studio"
---

# Tasks: Gallery page and portfolio pieces from the content studio

**Input**: Design documents from `/specs/COT-033-gallery-sanity-integration/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/gallery-query.md](contracts/gallery-query.md), [quickstart.md](quickstart.md)

**Tests**: None requested. Checks are static checks plus [quickstart.md](quickstart.md).

US2 (fallback) runs before US1, as in COT-031/032: wiring the backup content first gives a shippable page.

## Path Conventions

`GAL` = `app/routes/pages/gallery`. Tabs, single quotes, semicolons. Template: `app/routes/pages/services/services.loader.server.ts`. MUST NOT touch `studio/`. No `any`, `@ts-ignore` or `as`.

---

## Phase 1: Setup

- [X] T001 Create branch `COT-033-gallery-sanity-integration` from `main`, point `.specify/feature.json` at the new spec dir, and restore a complete `node_modules` (`npm ci`) so `npm run typecheck` runs.

## Phase 2: Foundational

- [X] T002 Update `GAL/gallery.types.ts`: `location?`, `description?` on `PortfolioPiece`; `caption?` on `ImageMedia`; add `GalleryContent { hero, pieces, seo }`.
- [X] T003 [P] Add `GAL/components/hero/Hero.types.ts` (`eyebrow?`, `heading`, `body?`).
- [X] T004 Make `GAL/utils.ts` pure: remove `PORTFOLIO_PIECES` and the video helpers; `getCategoryPieces(pieces, category)`, `getSectionPieces(pieces, category)`, `getTotalPages(pieceCount)`; remove unused `categoryHasMoreThanFive`.

## Phase 3: US2 — Complete page when the content service is down (P1)

- [X] T005 [US2] Create `GAL/gallery.fallback.server.ts` with today's hero copy and the demo pieces moved from `utils.ts`, every photo and poster using `FALLBACK_IMAGE_URL` (the ticket's Unsplash URL); backup videos unchanged.
- [X] T006 [US2] Make `GAL/components/hero/index.tsx` prop-driven, hiding empty eyebrow/body.
- [X] T007 [US2] Add `GAL/components/projects/Projects.types.ts`; `Projects` takes `pieces` and passes category pieces to `CategorySection`/`FilteredCategory`.
- [X] T008 [US2] `FilteredCategory` takes `pieces` (already filtered to its category) instead of reading module data.
- [X] T009 [US2] `PortfolioPiece.tsx` hides empty location and description.
- [X] T010 [US2] Route `GAL/index.tsx` renders from `loaderData`.

## Phase 4: US1 — Published content renders (P1)

- [X] T011 [US1] Create `GAL/gallery.query.ts` per [contracts/gallery-query.md](contracts/gallery-query.md).
- [X] T012 [US1] Create `GAL/gallery.loader.server.ts`: fetch, map hero and pieces, `orFallback` for pieces, `[gallery]` logging, full backup on missing client/failed fetch.
- [X] T013 [US1] Sanity image URLs via `urlFor` (sizes per research R3); lightbox `fullSrc` from `fullImage` or the photo.

## Phase 5: US3 — Partially filled content (P2)

- [X] T014 [US3] Piece rules: skip without title, known category, or any usable image/video; video needs src, poster, tag and positive duration; one before + one after, before first; alt fallbacks.
- [X] T015 [US3] Missing `galleryPage` → hero backup + `{}` SEO while pieces still map.

## Phase 6: SEO & navigation

- [X] T016 Export `meta` from `GAL/index.tsx` (same as Services) and remove the unused `GALLERY.metaData` seed from `app/routes/constants/index.ts`.
- [X] T017 Export `shouldRevalidate` from `GAL/index.tsx` skipping GET navigations on the same pathname.

## Phase 7: Polish

- [X] T018 Remove the no-longer-referenced `public/gallery/photos/*.jpg`.
- [X] T019 `npm run typecheck` and `npm run build` pass; client bundle contains no backup copy or query.
- [X] T020 Fallback smoke test: run the server with no Sanity project ID and confirm `/gallery` renders backup hero + pieces with the Unsplash image; run with the real project and confirm the published hero.
