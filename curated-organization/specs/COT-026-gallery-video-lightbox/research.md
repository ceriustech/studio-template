# Phase 0 Research: Gallery Video Poster & Lightbox

All items below were flagged as needing a decision in the Technical Context (no
outstanding `NEEDS CLARIFICATION` markers remain in the spec itself). Each entry
records the decision, why it was made, and what was rejected.

## 1. Enforcing "at most two videos per project" at the type level

- **Decision**: Type the field as a bounded tuple union:
  `videos: readonly [] | readonly [VideoMedia] | readonly [VideoMedia, VideoMedia]`.
- **Rationale**: `PortfolioPiece.videos.length` is checked by the compiler itself —
  assigning a 3rd item is a compile error, not a lint rule or runtime `if` that could
  be skipped. Matches FR-003 ("the type enforces this") literally.
- **Alternatives considered**: A plain `VideoMedia[]` with a runtime assertion/lint
  rule — rejected because the spec explicitly asks for type-level enforcement, and a
  runtime check can still be bypassed by a future author. A fixed 2-tuple
  (`[VideoMedia, VideoMedia]`) — rejected because several current pieces may only need
  1 video (or, per the spec's edge cases, 0), and forcing exactly 2 would make the
  "before" or "after" clip mandatory when the content doesn't have one yet.

## 2. Keeping videos and photos as two separate, non-mixing lightbox sets

- **Decision**: `Lightbox` receives the two sets as separate props
  (`videos: VideoMedia[]`, `images: ImageMedia[]`) plus an `open` value describing
  which set and index to start on (`{ set: 'video' | 'image'; index: number } | null`).
  Prev/next only ever moves the index within the active set's own array.
- **Rationale**: Matches FR-018 directly and keeps the "which set is active" question
  out of the media types themselves — `VideoMedia`/`ImageMedia` don't need to know
  about each other.
- **Alternatives considered**: A single merged array with a `kind: 'video' | 'image'`
  discriminant and set-aware navigation logic — rejected as needless indirection for
  a UI that already has two naturally separate arrays (`piece.videos`, `piece.images`)
  at the point where the lightbox is opened.

## 3. SSR-safe portal mounting

- **Decision**: `Lightbox` renders `null` until a `useEffect`-driven `isMounted` flag
  flips true, then renders its content via `createPortal(..., document.body)`.
- **Rationale**: Directly satisfies FR-027 — `document` doesn't exist during SSR, and
  `useEffect` only runs after hydration on the client, so this is the standard,
  dependency-free way to make a portal SSR-safe in React Router's framework mode.
- **Alternatives considered**: A `typeof document !== 'undefined'` guard evaluated
  during render — rejected because it produces a client/server markup mismatch
  warning (SSR renders one thing, first client render renders another) instead of
  cleanly rendering nothing until hydration.

## 4. Focus trap & Escape/Arrow key handling

- **Decision**: Hand-rolled in a co-located `useLightbox.ts` hook — a single
  `keydown` listener on the portal root handles Escape (close), Left/Right (prev/next
  within the active set), and Tab/Shift+Tab (cycle focus only among the dialog's own
  focusable elements, computed via `querySelectorAll` on open).
- **Rationale**: The project has zero existing modal/dialog/focus-trap dependency,
  and the constitution requires a documented amendment before adding a packaged UI
  library. A single dialog with a small, fixed set of controls (close, prev, next,
  filmstrip thumbnails, native `<video controls>`) is well within what a ~40-line
  hook can handle correctly, matching how `VideoPair`/`DetailImageCarousel` are
  already hand-rolled without a carousel/lightbox library.
- **Alternatives considered**: `focus-trap-react` or a similar package — rejected to
  avoid a new dependency and the constitution amendment it would require for what
  this codebase already does by hand elsewhere.

## 5. Background scroll lock without horizontal page shift

- **Decision**: While the lightbox is open, set `overflow: hidden` on `<body>` and
  rely on `scrollbar-gutter: stable` (already reasonable to add at the root
  stylesheet level, or applied only while open) so the scrollbar's removal doesn't
  shift page content horizontally.
- **Rationale**: Satisfies FR-025 without measuring scrollbar width in JavaScript.
  `scrollbar-gutter` is supported in all evergreen browsers this project targets.
- **Alternatives considered**: Measuring `window.innerWidth - document.documentElement.clientWidth`
  on open and applying it as `padding-right` — rejected as unnecessary JS-side
  layout work when a CSS-only property does the same job for the supported browser
  set.

## 6. Adjacent-image preloading

- **Decision**: When the active image index changes, the hook creates an in-memory
  `new Image()` for the next and previous image's `fullSrc`/`src` and sets its `src`
  (never inserted into the DOM) so the browser cache is warm before the visitor
  navigates there.
- **Rationale**: Directly satisfies FR-026 with no extra markup and no risk of the
  preload images being mistaken for visible content by assistive tech.
- **Alternatives considered**: `<link rel="preload" as="image">` tags — rejected
  because they'd need to be added/removed from `<head>` dynamically as the active
  index changes, which is more moving parts than an imperative `Image()` prefetch
  for a same-page, already-open dialog.

## 7. Touch swipe navigation

- **Decision**: Track `touchstart`/`touchend` clientX on the media container; if the
  horizontal delta exceeds a small fixed threshold (and dominates any vertical
  delta), treat it as prev/next.
- **Rationale**: Satisfies FR-022 with no gesture library; consistent with the
  no-new-dependency direction taken for the focus trap.
- **Alternatives considered**: A swipe-gesture library — rejected for the same
  dependency-avoidance reason as #4.

## 8. Local media asset sourcing

- **Decision**: Existing bundled `vid-1.mp4`/`vid-2.mp4` and remote Unsplash poster/
  detail-image URLs move to `/public/gallery/`; poster stills are authored once per
  distinct video/photo where available and reused across similar entries rather than
  requiring 36 bespoke new photographs, matching the spec's Assumptions.
- **Rationale**: The ticket is explicit that this is a UI-layer fix, not a content
  production effort; the important, testable outcome is that no panel is ever left
  blank or showing placeholder text (FR-006), not that every still is bespoke.
- **Alternatives considered**: Commissioning/sourcing a unique poster per clip and
  unique photography per detail image — rejected as disproportionate content work
  for a ticket scoped to component/type behavior.

## 9. Validation approach (no test framework in repo)

- **Decision**: `npm run typecheck` (proves the video-cap tuple and other type
  contracts hold), lint, and the manual/visual scenarios in `quickstart.md`,
  mirroring the constitution's existing Development Workflow review gates.
- **Rationale**: No Vitest/Playwright/Jest is configured anywhere in this repo today;
  introducing a test framework is a separate, larger decision than this ticket and
  isn't requested by the spec.
- **Alternatives considered**: Adding Playwright for the keyboard/focus/swipe
  scenarios — attractive given how easy this feature is to regress silently, but
  out of scope; flagged here as a good candidate for a future, explicitly-scoped
  testing-infrastructure ticket rather than smuggled into this one.
