# Phase 1 Contracts: Gallery Video Poster & Lightbox

This feature adds no GROQ queries or network endpoints (no Sanity/Cloudinary this
phase — see `plan.md`). The interface that matters here is the **prop contract**
between the data layer (`utils.ts`) and the presentation components, since the
spec's core architectural requirement is that this boundary is the only thing that
changes when media sourcing moves off `/public` later.

## Data → component boundary

```
utils.ts (PORTFOLIO_PIECES: PortfolioPiece[])
        │  plain src/poster/fullSrc strings only — see data-model.md
        ▼
PortfolioPiece.tsx
        │
        ├─▶ VideoPair.tsx ──▶ VideoPanel.tsx × (0–2)
        ├─▶ DetailImageCarousel.tsx ──▶ image buttons × N
        └─▶ Lightbox.tsx  (portaled to document.body)
```

Every component below `PortfolioPiece.tsx` receives only `VideoMedia`/`ImageMedia`
values (or subsets of their fields) — never a document ID, a Sanity reference, or a
Cloudinary public ID. None of them may construct a URL; they only render the
strings they're given. This is what makes the future remote-sourcing swap a
`utils.ts`-only (later: query-only) change.

## `VideoPanel`

**Props**:
- `media: VideoMedia`
- `onOpen: () => void` — invoked on click/Enter/Space; opens the lightbox at this
  clip. `VideoPanel` never plays the video itself (FR-009).

**Renders**: poster `<img>`, Before/After tag (top-left, from `media.tag`),
duration chip (bottom-right, formatted from `media.duration`), a play-affordance
overlay that is only present while at rest (FR-008).

**Contract guarantees**:
- Never renders the literal words "paused" or "poster" as visible text (FR-006).
- The clickable surface has an accessible name derived from `media.alt` and
  `media.tag` (e.g. "Open Before video — <alt>").

## `Lightbox`

**Props**:
- `videos: VideoMedia[]`
- `images: ImageMedia[]`
- `open: { set: 'video' | 'image'; index: number } | null`
- `onClose: () => void`
- `onNavigate: (next: { set: 'video' | 'image'; index: number }) => void`
- `returnFocusRef: RefObject<HTMLElement>` — element to refocus on close (FR-023)

**Renders nothing** (`return null`) until mounted client-side; then portals its
markup to `document.body` (FR-027).

**Contract guarantees**:
- `role="dialog"`, `aria-modal="true"`, and an accessible name that includes the
  active item's position (e.g. "Before video, item 1 of 2") (FR-028).
- Prev/next navigation only ever calls `onNavigate` with indices inside the same
  `set` it was opened with (FR-018) — it has no way to cross into the other array,
  because it is never given a combined/mixed list to begin with.
- A video item is rendered with native `controls`, `autoPlay`, `playsInline`, and
  `controlsList="nodownload"`, plus a `<track kind="captions">` only when that
  clip's `captionsSrc` is present (FR-010–FR-012, FR-019).
- An image item's caption (from `ImageMedia.caption`) renders beneath the media;
  its enlarged `src` is `fullSrc ?? src` (FR-016, data-model.md).
- Filmstrip: rendered only when `open` is non-null and the viewport is at or above
  `720px` — the same cutoff `videoPair.css`/`detailImageCarousel.css`/`portfolioPiece.css`
  already use in this component subtree for their mobile/stacked layout switch; each
  thumbnail is a real button with an accessible label and `aria-current`/equivalent
  styling hook on the active one (FR-017). When the filmstrip is for the video set,
  each thumbnail also renders its `tag` ("Before"/"After") as text beneath it;
  image-set thumbnails render no such label (FR-031).
- Below `720px`, the filmstrip is replaced by a row of dot indicators (one per item
  in the active set, active one visually distinguished) beneath the caption, and no
  separate on-screen previous/next buttons render — only the swipe handler and (if a
  keyboard is attached) the arrow-key handler move the active index (FR-016, FR-030),
  matching the provided design screenshots.
- When the active item is a video, its `tag` also renders as a top-left overlay on
  the enlarged video itself, not just on the resting `VideoPanel` (FR-029).

## `DetailImageCarousel` (extended, not replaced)

**Props** (added to the existing `images: ImageMedia[]`):
- `onOpenImage: (index: number) => void`

**Contract guarantees**:
- Every rendered thumbnail is a real interactive element (`<button>`), not a plain
  `<div>` with a background-image and a visually-hidden `<img>` as today — needed so
  the thumbnail is both clickable and keyboard-activatable (FR-013).
- Thumbnails set `loading="lazy"` (FR-014).

## `VideoPair` (layout wrapper, existing — internals only)

**Props**:
- `videos: VideoMedia[]` (0–2, per `PortfolioPiece.videos`)
- `onOpenVideo: (index: number) => void`

No longer owns play/pause state or a `<video>` element directly — delegates the
resting-state rendering to `VideoPanel` and click-to-open to the shared `Lightbox`
via `onOpenVideo`.
