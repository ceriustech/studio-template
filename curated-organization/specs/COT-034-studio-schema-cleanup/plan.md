# Implementation Plan: Content studio cleanup for page headers and portfolio pieces

**Branch**: `COT-034-studio-schema-cleanup` | **Date**: 2026-10-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/COT-034-studio-schema-cleanup/spec.md`, including the 2026-10-13 follow-up (Duration, Full-resolution override).

## Summary

A Studio cleanup plus a small Gallery follow-through. No content migration.

- **Hero (US1).** The shared `heroSection` object keeps all its fields. Its `images`, `linkLabel` and `linkHref` fields get a `hidden` callback driven by a small allow-list in `heroSection.ts`:
  - `homePage.hero` shows images and the link.
  - `homePage.intro` shows the link.
  - Every other use of the hero shows only eyebrow, heading and body.
  - Two descriptions are reworded to match.
- **Slug (US2).** `portfolioPiece` loses its `slug` field.
- **Videos and photos (US3).**
  - `videoMedia` loses `duration`, `posterOffset` and `captions`, and `imageMedia` loses `fullImage`.
  - The Gallery stops querying both fields.
  - The video panel reads each video's length in the browser with a metadata-only load, through a hook co-located with the panel.
  - The viewer's large image is always built from the photo itself.

See [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript.
- Studio: Sanity 6.19 (`studio/`). Upgraded locally on 2026-10-13 to match the hosted runtime, with `react` and `react-dom` aligned at 19.3.0.
- App: React Router 8 (`app/`), Gallery route only.

**Primary Dependencies**: `sanity`, `@sanity/types` (`ConditionalPropertyCallbackContext`), `@sanity/image-url`, and React for the duration hook. No new packages.

**Storage**: Sanity Content Lake, `production`. No documents are written (R1).

**Testing**: No automated suite.
- `npx tsc --noEmit` and `npx sanity schema validate` in `studio/`.
- `npm run typecheck` and `npm run build` in `app/`.
- The Studio and Gallery checks in [quickstart.md](quickstart.md) (R6).

**Target Platform**: Hosted Sanity Studio (deployed with `sanity deploy`) and the web app.

**Project Type**: web. A React Router app (`app/`) and a separate Sanity Studio (`studio/`).

**Performance Goals**: The video length is read with `preload="metadata"`: a small range request per visible panel, never the whole file (FR-012, R8). That's at most 12 panels on the "All" view (6 sections × 2) and 10 on a filtered page.

**Constraints**:
- No data migration (user decision).
- The stored `_type` of hero values must not change (R2).
- The live site renders identically except for the length badge appearing after metadata loads (FR-007).

**Scale/Scope**:

| Area | Files |
|---|---|
| Studio, edited (5) | `objects/heroSection.ts`, `documents/homePage.ts`, `documents/portfolioPiece.ts`, `objects/videoMedia.ts`, `objects/imageMedia.ts` |
| App, edited (6) | `gallery.types.ts`, `gallery.query.ts`, `gallery.loader.server.ts`, `gallery.fallback.server.ts`, `VideoPanel.tsx`, `Lightbox.tsx` |
| App, added (1) | `VideoPanel/useVideoDuration.ts` |

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Architecture.** No new routes or components. The duration hook is co-located with the only component that uses it (`VideoPanel/useVideoDuration.ts`), as the constitution allows for hooks.
- [x] **Content ownership.** No new content types. Keeping one `heroSection` for every page header follows the "model once, present differently" rule. A video's length is a property of the media file, not editorial content, so it's derived rather than entered (R8).
- [x] **Sanity content layer.** Schema edits stay in `studio/`. `GALLERY_QUERY` keeps `defineQuery` and only loses two projections. TypeGen/schema extract carry the existing project-wide exception (Complexity Tracking).
- [x] **Media (Cloudinary).** No new video fields. Video hosting is unchanged; the existing Cloudinary exception from COT-033 still stands.
- [x] **TypeScript strict.** No `any`, `@ts-ignore` or casts. The callbacks use Sanity's typed context. The hook returns `number | null`.
- [x] **Mobile-first.** No CSS or breakpoint changes. The badge keeps its existing styles.
- [x] **Accessibility.** Removing captions is acceptable because the videos are silent and keep an accessible label from Alt/description text (R11). The duration badge was never announced (the panel's accessible name doesn't include it), so delaying it changes nothing for assistive tech. Alt text on photos is unchanged.
- [x] **Performance & SEO.** Content still comes from the SSR loader. The only client-side work reads media metadata, not CMS content (Complexity Tracking). The badge is an absolutely positioned overlay, so it causes no layout shift (CLS).

**Post-design re-check (after Phase 1)**: unchanged; all gates pass.

## Component Design Decisions

| Component | Placement | Generic base (if adapter) | Rationale |
|---|---|---|---|
| `VideoPanel` (existing) | Route-local, unchanged location | N/A | Only consumer of the length; gains a co-located hook, not a new component |

## Content Layer Decisions

| Content item | Classification | Content type (new or existing) | Notes |
|---|---|---|---|
| Page header (small line, heading, body) | Editorial | `heroSection` (existing) | Used by the Home, Services, Gallery and Booking heroes and the Home intro |
| Hero slide images | Editorial | `heroSection.images` (existing) | Shown only on `homePage.hero` |
| Hero link/button | Editorial | `heroSection.linkLabel`/`linkHref` (existing) | Shown only on `homePage.hero` and `homePage.intro` |
| Portfolio piece web address | — | `portfolioPiece.slug` (**removed**) | No per-project pages. Filtering by `?category=` is functional and stays in code |
| Video length | Derived (functional) | `videoMedia.duration` (**removed**) | Read from the file in the browser (R8) |
| Viewer image | Derived (functional) | `imageMedia.fullImage` (**removed**) | A larger render of the same photo (R9) |

## Project Structure

### Documentation (this feature)

```text
specs/COT-034-studio-schema-cleanup/
├── spec.md
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1: schema changes
├── quickstart.md        # Phase 1: validation guide
├── checklists/requirements.md
└── tasks.md             # Phase 2
```

There's no `contracts/` folder. The only query change is removing two projections from `GALLERY_QUERY`, recorded in [data-model.md](data-model.md).

### Source Code (repository root)

```text
studio/schemaTypes/
├── objects/
│   ├── heroSection.ts        # allow-list + hidden callbacks + description
│   ├── videoMedia.ts         # remove duration, posterOffset, captions
│   └── imageMedia.ts         # remove fullImage
└── documents/
    ├── portfolioPiece.ts     # remove slug
    └── homePage.ts           # intro description

app/routes/pages/gallery/
├── gallery.types.ts          # VideoMedia loses duration
├── gallery.query.ts          # drop duration, fullImage
├── gallery.loader.server.ts  # no duration check; fullSrc from the photo
├── gallery.fallback.server.ts# drop backup durations
└── components/projects/components/PortfolioPiece/components/VideoPanel/
    ├── VideoPanel.tsx        # badge from useVideoDuration
    (…/Lightbox/Lightbox.tsx     # drop the optional captions <track>)
    └── useVideoDuration.ts   # new: metadata-only length read
```

**Structure Decision**: Fits the fixed project shape.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| `sanity schema extract` / `typegen generate` not run | TypeGen isn't set up yet. This is the same project-wide exception as COT-031 to COT-033 | Setting up TypeGen is its own ticket |
| Hidden hero fields keep their stored values and validation | The user ruled out a migration | A separate type or unsetting values would need a migration (R2, R3) |
| Client-side read of video metadata | Sanity doesn't record a plain file's duration, and the user chose browser-side measurement (spec Clarifications) | A Studio auto-fill needs a custom input and leaves older uploads without a length. Measuring on the server would download each video on every request (R8) |
