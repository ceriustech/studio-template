# Quickstart: Validating Gallery Video Poster & Lightbox

## Prerequisites

- Dependencies installed (`npm install`).
- Local media assets present under `public/gallery/` (posters, videos, detail
  photos) as produced by this feature's implementation — see `data-model.md` and
  `research.md` §8.

## Setup

```bash
npm run dev
```

Navigate to `/gallery`.

## Automated checks

```bash
npm run typecheck   # includes react-router typegen + tsc; proves the video-cap
                     # tuple type and all VideoMedia/ImageMedia contracts hold
```

There is no automated UI test suite in this repo (see `research.md` §9) — the
scenarios below are manual/visual, matching the constitution's existing review
gates (typecheck + lint + visual check).

## Scenario 1 — Video panels rest on a real poster (spec User Story 1)

1. On `/gallery`, find any project's Before/After panels.
2. Confirm: a real photo is visible (not blank, not the first video frame), a
   "Before"/"After" label sits top-left, a duration chip sits bottom-right, a play
   icon overlays the poster.
3. Search the rendered page for the text "paused" or "poster" — it must not appear
   anywhere.
4. Click a video panel. Confirm: a full-screen viewer opens, the clip starts
   playing automatically, and the browser's native playback controls are visible.
   Confirm the panel itself never played the video inline.
5. Right-click (or long-press) the playing video's controls and confirm no
   "Download" option is offered.
6. If that clip has captions authored, confirm a captions/CC control is present in
   the native controls; if it doesn't, confirm there's no broken/empty captions
   control.

## Scenario 2 — Image thumbnails open the lightbox (spec User Story 2)

1. On the same project, click any detail/photo thumbnail.
2. Confirm the viewer opens already showing that exact photo, enlarged, with its
   caption beneath it.
3. Use next/prev to move through the set. Confirm only that project's other photos
   ever appear — never a video.
4. Open a video from the same project, then use next/prev. Confirm only that
   project's other video (if any) ever appears — never a photo.
5. Confirm no photo thumbnail anywhere on the page shows a Before/After label.

## Scenario 3 — Full-screen viewer navigation & accessibility (spec User Story 3)

1. Open the viewer, then press `Tab` repeatedly. Confirm focus cycles only among
   the viewer's own controls and never reaches the page behind it; `Shift+Tab`
   reverses direction correctly.
2. Press `Escape`. Confirm the viewer closes and keyboard focus lands back on the
   exact panel/thumbnail that opened it.
3. Reopen the viewer; press the Left/Right arrow keys and confirm the active item
   changes accordingly within the current set.
4. Click the dimmed backdrop area — confirm the viewer closes. Reopen it and click
   the media itself — confirm it stays open.
5. On a touch device (or a browser's touch emulation), swipe left/right on the
   media and confirm it moves to the next/previous item.
6. Resize the viewport across the tablet breakpoint while the viewer is open.
   Confirm the filmstrip appears at tablet/desktop widths and is replaced by a row
   of dot indicators (one per item, active one distinguished) below mobile width,
   without the viewer closing. Confirm no separate on-screen previous/next buttons
   render at mobile width (swipe/keyboard only).
7. In the filmstrip, confirm the active item is visually distinguished from the
   rest, and clicking any other thumbnail jumps straight to it. For a video set,
   confirm each thumbnail also shows a "Before"/"After" text label beneath it; for
   an image set, confirm no such label appears.
8. Open a video in the viewer and confirm its Before/After tag still renders as an
   overlay on the enlarged video (top-left), matching the resting panel's label.
9. While the viewer is open, confirm the page behind it cannot be scrolled, and
   confirm no horizontal shift/jump occurs in the page layout at the moment the
   viewer opens or closes (compare a fixed reference element's horizontal position
   before/after).
10. Step through several photos in a row quickly; confirm no blank/empty frame is
    ever visible between them.
11. With the OS-level "reduce motion" setting enabled, repeat steps 1–10 and confirm
    every hover/transition effect is suppressed while every control still works.
12. Using a screen reader (or the accessibility tree inspector in devtools),
    confirm the open viewer exposes `role="dialog"`, `aria-modal="true"`, and an
    accessible name that identifies the current item and its position (e.g. "item
    2 of 5").

## Scenario 4 — Data-level video cap (spec FR-003)

1. In `gallery.types.ts`/`utils.ts`, attempt to add a third entry to any project's
   `videos` array.
2. Confirm `npm run typecheck` fails on that line — the cap is enforced by the
   type system, not a runtime check.

## Pass/fail

All 4 scenarios must pass, and `npm run typecheck` must be clean, before this
feature is considered done.
