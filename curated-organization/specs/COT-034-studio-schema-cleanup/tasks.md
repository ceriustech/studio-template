---

description: "Task list for COT-034: Content studio cleanup for page headers and portfolio pieces"
---

# Tasks: Content studio cleanup for page headers and portfolio pieces

**Input**: Design documents from `/specs/COT-034-studio-schema-cleanup/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [quickstart.md](quickstart.md)

**Tests**: The spec doesn't ask for automated tests, so there are none. Checks are static checks plus the manual Studio steps in [quickstart.md](quickstart.md).

**Organization**: Tasks are grouped by user story.

- US1: page headers without irrelevant fields (P1).
- US2: portfolio pieces without a slug (P1).
- US3: videos and photos without Duration or Full-resolution override (P2), added 2026-10-13 after T001–T011 were done.

The two stories touch different files and don't depend on each other.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2)

## Path Conventions

- All paths are relative to `curated-organization/`. `SCH` = `studio/schemaTypes`.
- Studio code style: tabs, single quotes, **no** semicolons, `{unspaced}` braces. Match the surrounding files.
- US1 and US2 MUST NOT touch `app/`. US3 touches only the Gallery route (`GAL` = `app/routes/pages/gallery`, `VP` = `GAL/components/projects/components/PortfolioPiece/components/VideoPanel`).
- App code style: tabs, single quotes, semicolons, `{ spaced }` braces.
- No task writes content or adds a migration (FR-004).
- No `any`, `@ts-ignore` or `as` casts (constitution V).

---

## Phase 1: Setup

**Purpose**: Confirm a clean starting point so any later failure is clearly from this work.

- [X] T001 Confirm the current branch is `COT-034-studio-schema-cleanup` (created from `main` after the COT-033 merge on 2026-10-13). Confirm `npx tsc --noEmit` and `npx sanity schema validate` pass in `studio/` before any changes. Note any warnings already there so they aren't mistaken for new ones.

---

## Phase 2: Foundational

None. Both stories edit independent schema files, and nothing is shared between them.

---

## Phase 3: User Story 1 - Owner edits page headers without irrelevant fields (Priority: P1) 🎯 MVP

**Goal**:
- The Services, Gallery and Booking heroes show only the small line, heading and body.
- The Home hero keeps slide images and the link.
- The Home intro keeps the link but not slide images.

**Independent Test**: In `npx sanity dev`, open each page's Hero tab and the Home Intro tab. The fields shown match the table in [quickstart.md](quickstart.md) "Studio checks".

- [X] T002 [US1] In `SCH/objects/heroSection.ts`, add a module-level allow-list of the optional extras each use of the hero shows. Implement it as a typed lookup keyed by document type, then by field name (`path[0]`), with the values `'images'` and `'link'`:
  - `homePage.hero`: `images` and `link`.
  - `homePage.intro`: `link`.
  - Any key not in the list means no extras.

  Add a helper `showsExtra(context, extra)` that takes Sanity's `ConditionalPropertyCallbackContext` (import the type from `sanity`). It reads `context.document?._type` and `context.path[0]`, and returns `false` when either is missing or isn't a string, so the list fails closed. Narrow with `typeof` checks and `in`/`Object.hasOwn`, not casts. Add a one-line comment that pages are text-only unless listed (research R2).
- [X] T003 [US1] In `SCH/objects/heroSection.ts`, give the `images` field `hidden: (context) => !showsExtra(context, 'images')`. Leave its title, description, `of` and the alt-text field unchanged.
- [X] T004 [US1] In `SCH/objects/heroSection.ts`, give the `linkLabel` field `hidden: (context) => !showsExtra(context, 'link')`. Change the `linkHref` field's existing `hidden: ({parent}) => !parent?.linkLabel` to also hide when `!showsExtra(context, 'link')`. Keep the "hidden until a label is entered" behaviour (data-model.md).
- [X] T005 [US1] In `SCH/objects/heroSection.ts`, replace the type `description` with: "Small line, heading and body for a page header. Slide images and a link/button appear only on pages that use them." (research R5, FR-008).
- [X] T006 [P] [US1] In `SCH/documents/homePage.ts`, replace the `intro` field `description` ("Uses the same eyebrow/heading/body/link shape as a hero; no images needed here.") with "Small line, heading, body and an optional link." (research R5, FR-008).

**Checkpoint**: `npx tsc --noEmit` passes in `studio/`. The Studio forms match the quickstart table for Home Hero, Home Intro, Services Hero, Gallery Hero and Booking Hero. Clearing the Home hero link label still hides its destination.

---

## Phase 4: User Story 2 - Owner adds a portfolio project without a slug (Priority: P1)

**Goal**: Portfolio pieces have no Slug field, and publishing no longer requires one.

**Independent Test**: In `npx sanity dev`, create a portfolio piece. There's no Slug field, and it publishes with title, category, location and one image. Discard it afterwards.

- [X] T007 [P] [US2] In `SCH/documents/portfolioPiece.ts`, delete the whole `slug` `defineField` (name, title, `type: 'slug'`, `options: {source: 'title'}` and its `required()` validation). Leave every other field, the preview and the imports unchanged. `GALLERY_CATEGORIES` is still used by `category`. Run `grep -rn "slug" studio/schemaTypes studio/structure studio/components` and `grep -rn "slug" app` to confirm nothing else references it (research R4).

**Checkpoint**: `npx tsc --noEmit` passes in `studio/`. A new portfolio piece shows no Slug field and can be published.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T008 Run the static checks in [quickstart.md](quickstart.md):
  - `npx tsc --noEmit` and `npx sanity schema validate` in `studio/`. There should be no new errors or warnings compared with T001.
  - `npm run typecheck` in `curated-organization/`.
- [X] T009 Run the "Studio checks" table in [quickstart.md](quickstart.md) in `npx sanity dev`. Discard any document created only for testing; publish nothing. *(Verified by calling the hidden rules directly for every hero location; a visual pass in `sanity dev` is still with the user.)*
- [X] T010 Run the research R1 public CDN query again and confirm the results match 2026-10-13. `git diff --stat` shows changes only under `studio/schemaTypes/` and `specs/COT-034-studio-schema-cleanup/` (FR-004, FR-007, SC-005).
- [X] T011 Spot-check that the live site is unchanged (SC-004): run `npm run dev` from `curated-organization/` and load `/`, `/services`, `/gallery` and `/booking`.

---

## Phase 6: User Story 3 - Owner adds videos and photos without technical details (Priority: P2)

**Goal**: Before/after videos have no Duration field and photos have no Full-resolution override field. The Gallery shows each video's real length, read from the file, and keeps the viewer sharp.

**Independent Test**:
- In `npx sanity dev`, add a video and an image to a portfolio piece. Neither removed field appears.
- On `/gallery`, each video panel shows its length (backup videos: 0:09 / 0:11) via a metadata-only request, and photos open large in the viewer.

- [X] T012 [P] [US3] In `SCH/objects/videoMedia.ts`, delete the `duration` `defineField` (title "Duration (seconds)", `type: 'number'`, `rule.required().positive()`). Leave every other field and the preview unchanged (research R8).
- [X] T013 [P] [US3] In `SCH/objects/imageMedia.ts`, delete the `fullImage` `defineField` ("Full-resolution override"). Leave `image`, `caption` and the preview unchanged (research R9).
- [X] T014 [P] [US3] Create `VP/useVideoDuration.ts` exporting `useVideoDuration(src: string): number | null`, per research R8:
  - In a `useEffect` keyed on `src`: reset to `null`, then create a detached `video` element with `preload = 'metadata'` and `muted = true`.
  - Add a `loadedmetadata` listener that stores `video.duration` only when it's `Number.isFinite` and `> 0`, then set `src`.
  - Cleanup: remove the listener, `removeAttribute('src')` and call `load()` to abandon the request.
  - Add a one-line comment explaining why `preload="metadata"` (no full download).
- [X] T015 [US3] In `VP/VideoPanel.tsx`, call `useVideoDuration(media.src)`. Render `<span className="videoPanelDuration">` with `formatDuration(duration)` only when the value isn't `null`. Keep `formatDuration`, labels, classes and the accessible name unchanged. Depends on T014 and T016.
- [X] T016 [US3] In `GAL/gallery.types.ts`, remove `duration` from `VideoMedia`. Keep `ImageMedia.fullSrc?`.
- [X] T017 [US3] In `GAL/gallery.query.ts`, remove `duration` from `videos[]` and `fullImage{ asset, crop, hotspot }` (with its preceding comma) from `images[]`. Leave COT-033's spec docs unchanged; they're a record of that ticket.
- [X] T018 [US3] In `GAL/gallery.loader.server.ts`:
  - Remove `duration` from `CmsVideo` and `fullImage` from `CmsImageMedia`.
  - `mapVideo` no longer reads or requires a duration; a video still needs `src`, a valid tag and a poster asset.
  - `mapImages` always sets `fullSrc: fullUrl(image)`, and its destructuring drops `fullImage`.
  - Update the size comment if it mentions the override.
- [X] T019 [US3] In `GAL/gallery.fallback.server.ts`, remove `BEFORE_VIDEO_DURATION`, `AFTER_VIDEO_DURATION` and the `duration` keys in `beforeVideo` / `afterVideo`.

**Checkpoint**: `npm run typecheck` passes. `grep -rn "duration\|fullImage" GAL` shows only the hook and the panel (`fullSrc` is still expected). `/gallery` panels show 0:09 / 0:11 for the backup videos.

---

## Phase 7: Polish for US3

- [X] T020 Re-run the static checks: `npx tsc --noEmit` and `npx sanity schema validate` in `studio/`, then `npm run typecheck` and `npm run build` in `curated-organization/`. Confirm `grep -rn "duration\|fullImage" studio/schemaTypes` returns nothing.
- [X] T021 Confirm the backup video lengths are what the panels should show: read the `mvhd` duration of `public/gallery/videos/before.mp4` and `after.mp4`. Then render `/gallery` from a production build and confirm the server HTML has no duration badge (it's client-only) and that the page renders all 6 category sections.
- [X] T022 Re-run the research R1 public CDN query (no content changed). `git diff --stat` shows changes only under `studio/`, `app/routes/pages/gallery/`, `.specify/feature.json` and `specs/COT-034-studio-schema-cleanup/`.

---

## Phase 8: User Story 3 follow-up - Poster focal offset and Captions (added 2026-10-13)

**Goal**: Before/after videos have no Poster focal offset or Captions fields, and the Gallery no longer reads them (FR-014, research R11).

**Independent Test**: In `npx sanity dev`, add a before/after video. The form shows only Video file, Poster image, Before/after and Alt/description text. On `/gallery`, videos still open and play in the viewer with their description as the accessible name.

- [X] T023 [P] [US3] In `SCH/objects/videoMedia.ts`, delete the `posterOffset` ("Poster focal offset") and `captions` ("Captions (.vtt)") `defineField`s. Leave `video`, `poster`, `tag`, `alt` and the preview unchanged.
- [X] T024 [US3] In `GAL/gallery.types.ts`, remove `posterOffset` and `captionsSrc` from `VideoMedia`.
- [X] T025 [US3] In `GAL/gallery.query.ts`, remove `posterOffset,` and `"captionsSrc": captions.asset->url,` from `videos[]`, keeping valid GROQ commas.
- [X] T026 [US3] In `GAL/gallery.loader.server.ts`:
  - Remove `posterOffset` and `captionsSrc` from `CmsVideo`, and from the object `mapVideo` returns.
  - Drop the `text` import only if it becomes unused (it's still used elsewhere).
- [X] T027 [US3] In `GAL/gallery.fallback.server.ts`, remove `posterOffset: 0` from `beforeVideo` and `afterVideo`.
- [X] T028 [US3] In `GAL/components/projects/components/PortfolioPiece/components/Lightbox/Lightbox.tsx`, remove the `{activeVideo.captionsSrc && (<track … />)}` block. Leave the `<source>` and everything else unchanged.
- [X] T029 Re-run the checks:
  - `npx tsc --noEmit` and `npx sanity schema validate` in `studio/`; `npm run typecheck` and `npm run build` in `curated-organization/`.
  - `grep -rn "posterOffset\|captions" studio/schemaTypes app/routes/pages/gallery` returns nothing.
  - Server-render `/gallery` and confirm it renders the published pieces.

---

## Dependencies & Execution Order

- **Setup (T001)** comes before everything.
- **US1 (T002–T006)**: T002 → T003 → T004 → T005 run in order (same file). T006 is a different file and can run any time after T001.
- **US2 (T007)**: independent of US1; can run any time after T001.
- **Polish (T008–T011)**: after both stories. Done.
- **US3 (T012–T019)**: T012, T013 and T014 are independent [P]. T016 → T017 → T018 → T019 (shared type, then its consumers). T015 needs T014 and T016.
- **Polish for US3 (T020–T022)**: after T012–T019.
- **US3 follow-up (T023–T029)**: T023 is independent [P]. T024 → T025 → T026 → T027 → T028 (type first, then its consumers), then T029.

```text
T001 ─┬─ T002 → T003 → T004 → T005 ─┐
      ├─ T006 ──────────────────────┼─ T008 → T009 → T010 → T011
      └─ T007 ──────────────────────┘

T012 ─────────────────────────────────┐
T013 ─────────────────────────────────┤
T014 ──────────────────┐              ├─ T020 → T021 → T022
T016 → T017 → T018 → T019 ─┬─ T015 ───┘
                           (T015 needs T014 + T016)
```

## Parallel Opportunities

- T006 (`homePage.ts`) and T007 (`portfolioPiece.ts`) can run alongside the `heroSection.ts` chain (T002–T005).
- Within US1, T002–T005 share one file, so they stay sequential.
- In US3, the two Studio removals (T012, T013) and the new hook (T014) can run alongside the app type chain (T016–T019).

## Implementation Strategy

- **MVP**: US1 (T001–T006). It fixes the confusion editors hit most often, and can ship on its own.
- **Increment 2**: US2 (T007), which is a single-field removal.
- **Increment 3**: US3 (T012–T022). Studio fields and Gallery code ship together, so the site never asks for a removed field.
- **Release**: merge, deploy the app as usual, then run `npx sanity deploy` from `studio/` ([quickstart.md](quickstart.md) "Release").
