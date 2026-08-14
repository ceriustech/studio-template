# Phase 1 Data Model: Gallery Video Poster & Lightbox

No Sanity schema changes this phase (see plan.md Constitution Check / Complexity
Tracking — Cloudinary/Sanity integration is explicitly deferred). These are the
TypeScript shapes that replace `MediaSource`/`DetailImage` in
`app/routes/pages/gallery/gallery.types.ts`.

## VideoMedia

One Before or After clip. Replaces the old `MediaSource` for videos.

| Field          | Type                | Required | Notes                                                                                 |
| -------------- | ------------------- | -------- | -------------------------------------------------------------------------------------- |
| `src`          | `string`             | yes      | Playable video URL. Local `/public` path for this phase (FR-005).                     |
| `poster`       | `string`             | yes      | Explicit poster still URL. Never derived from the video at render time (FR-006).      |
| `posterOffset` | `number`             | yes      | Seconds into the clip the poster still was captured at. Typed and populated; not read by the UI yet (per spec, explicitly unused for now). |
| `tag`          | `'before' \| 'after'` | yes    | Drives the top-left label (FR-007). No third value is valid.                          |
| `duration`     | `number`             | yes      | Clip length in seconds. Drives the bottom-right duration chip (FR-007).               |
| `captionsSrc`  | `string`             | no       | WebVTT URL for the `<track kind="captions">`. Omitted → no captions control (FR-012).  |
| `alt`          | `string`             | yes      | Accessible label for the clip (carried over from the existing `MediaSource.alt`), used for the play/pause and panel controls' accessible names. |

**Validation rules**:
- `tag` MUST be exactly `'before'` or `'after'` (union type, not a free string).
- `duration` and `posterOffset` MUST be non-negative.
- Every field except `captionsSrc` is required — a video with no poster is not a
  valid `VideoMedia` (this is what makes FR-006 impossible to regress by omission).

## ImageMedia

One supporting/detail photo. Replaces the old `DetailImage`.

| Field     | Type     | Required | Notes                                                                                   |
| --------- | -------- | -------- | ---------------------------------------------------------------------------------------- |
| `src`     | `string`  | yes      | Thumbnail image URL.                                                                    |
| `alt`     | `string`  | yes      | Accessible alt text.                                                                    |
| `caption` | `string`  | yes      | Rendered beneath the image when shown in the lightbox (FR-016).                         |
| `fullSrc` | `string`  | no       | Larger/original image shown in the lightbox. Falls back to `src` when absent (edge case: "a photo lacks a defined larger version"). |

**Validation rules**:
- No `tag` field exists on `ImageMedia` — images are never labeled Before/After
  (FR-004). Adding one would be a type error at every call site expecting `ImageMedia`.

## PortfolioPiece (updated)

| Field          | Type                                                                                     | Required | Notes                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------------- |
| `id`           | `string`                                                                                    | yes      | Unchanged.                                                                                  |
| `title`        | `string`                                                                                    | yes      | Unchanged.                                                                                  |
| `category`     | `Category`                                                                                  | yes      | Unchanged — the existing room-category filter (COT-015) is untouched by this feature.       |
| `location`     | `string`                                                                                    | yes      | Unchanged.                                                                                  |
| `description`  | `string`                                                                                    | yes      | Unchanged.                                                                                  |
| `videos`       | `readonly [] \| readonly [VideoMedia] \| readonly [VideoMedia, VideoMedia]`                 | yes      | Replaces `beforeMedia`/`afterMedia`. Bounded tuple union — a 3rd element is a **compile-time** error, satisfying FR-003 at the type level rather than via a runtime check. Each present element carries its own `tag`, so `[before, after]` and `[after, before]` are both valid orderings — the UI reads `tag`, not array position. |
| `images`       | `ImageMedia[]`                                                                              | yes      | Replaces `detailImages`. No upper bound (none was requested).                              |

**Relationships**: A `PortfolioPiece` owns exactly one `videos` set and one `images`
set; the two sets never mix within the lightbox (FR-018). Nothing outside this
project's own arrays is reachable while cycling.

## LightboxState (client-only UI state — not a persisted entity)

| Field   | Type                                                | Notes                                                                                     |
| ------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `set`   | `'video' \| 'image'`                                 | Which array is currently active for cycling (FR-018).                                       |
| `index` | `number`                                             | Position within the active set's array.                                                     |
| `returnFocusTo` | `HTMLElement`                                 | The panel/thumbnail that opened the lightbox; focus is restored here on close (FR-023).      |

This state lives in component state only (`PortfolioPiece` or `Lightbox`'s own
hook) — it is never written to `localStorage`/`sessionStorage`/cookies, per FR-034,
and it does not survive a page reload.

## Future migration note

When Sanity/Cloudinary integration lands (a separate, future ticket per the
Complexity Tracking exception in `plan.md`), `VideoMedia`/`ImageMedia`'s `src`/
`poster`/`fullSrc` strings are expected to be produced by a query + URL-builder
(mirroring `app/lib/cloudinary/video.ts` per constitution Article IV) instead of by
`utils.ts`'s hand-authored array. `VideoPanel`, `DetailImageCarousel`, and
`Lightbox` accept plain strings today specifically so that swap requires no changes
to any of those three components — only to whatever produces the arrays.
