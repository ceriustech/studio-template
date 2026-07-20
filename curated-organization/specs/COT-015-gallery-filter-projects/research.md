# Phase 0 Research: Gallery Filter Bar and Projects section

No `[NEEDS CLARIFICATION]` markers remained in the spec. This document records the
implementation-approach decisions made during planning for this feature.

## Decision: URL state via React Router's `useSearchParams`, called independently by `FilterBar` and `Projects`

**Decision**: Both `FilterBar` (writer) and `Projects` (reader) call `useSearchParams()`
directly rather than lifting filter/page state into a parent component or context.

**Rationale**: `useSearchParams` is already the framework's sanctioned way to read/write query
string state in React Router's framework mode, and the URL itself is the single source of
truth (FR-010) — there's nothing for a context or lifted state to add. Two independent callers
stay in sync automatically because they both derive from the same URL; this is the idiomatic
React Router pattern and needs no new dependency.

**Alternatives considered**:

- *Lift `category`/`page` state into `Gallery` (`index.tsx`) and pass down as props* —
  rejected: would require the route to become stateful and re-derive the same information
  `useSearchParams` already gives for free, and would still need to sync that state back to the
  URL for FR-010–FR-012, duplicating the work.
- *React Context for filter state* — rejected: no state needs to cross more than two sibling
  components, and the URL already serves as the shared source of truth; a context would be an
  unnecessary indirection layer.

## Decision: No `loader` — mock data is a static, bundled array

**Decision**: The mock `PORTFOLIO_PIECES` array lives in `gallery/utils.ts` as a module-level
constant, imported directly by components that need it. No route `loader` is added.

**Rationale**: The constitution's Performance & SEO article prohibits client-side-only data
*fetching* for above-fold content — it's concerned with network waterfalls, not with static data
bundled at build time. A hardcoded array has no fetch to move server-side; SSR already renders
it correctly because it's available synchronously on both server and client.

**Alternatives considered**:

- *Add a `loader` that returns the mock array* — rejected: adds a route type
  (`gallery.types.ts` would need a loader-data shape) and a network-shaped code path for data
  that isn't fetched from anywhere, for no behavioral benefit over a direct import.

## Decision: No shared carousel engine — two independent, small `useState` index implementations

**Decision**: `CategorySection`'s section-level carousel and `DetailImageCarousel`'s
detail-image carousel are each their own small piece of index-stepping state and markup, not a
shared hook or component.

**Rationale**: The two behaviors diverge in several rules simultaneously: the section carousel
shows a position indicator and suppresses itself entirely at 1 item; the detail carousel has
neither rule the same way, and additionally must reset to index 0 whenever its parent piece
changes (a concern the section carousel doesn't have). A shared implementation would need
branching for each of these differences, which adds indirection without removing any actual
duplication — the only genuinely shared logic is "clamp an index between 0 and length − 1,"
a couple of lines. The constitution also explicitly reserves the Generic/Domain-adapter split
for shared, cross-route components in `app/components/`, and both carousels here have exactly
one route-local consumer each, so that pattern doesn't apply regardless.

**Alternatives considered**:

- *Extract a shared `useCarouselIndex(length)` hook* — rejected: saves only the index-clamping
  math (a few lines) while still requiring each caller to independently implement its own
  position-indicator visibility, suppression-at-1, and reset-on-key-change rules — the
  duplication that actually matters wouldn't be removed.
- *A single configurable `Carousel` component used by both* — rejected: would need props for
  "show position indicator," "suppress at 1 item," "reset key," and two different arrow label
  sets, converging on exactly the constitution's Generic/Domain-adapter shape — but that split
  is reserved for cross-route shared components, and there's no second route that needs either
  carousel.

## Decision: Reset piece state (video + detail carousel) by keying `PortfolioPiece` on the piece's `id`

**Decision**: `CategorySection` renders `<PortfolioPiece key={activePiece.id} piece={activePiece} />`.
Advancing the section carousel changes `activePiece`, which changes the `key`, which makes React
unmount the old `PortfolioPiece` (and everything under it, including `VideoPair`'s `<video>`
elements and `DetailImageCarousel`'s index state) and mount a fresh one.

**Rationale**: This satisfies FR-016 (detail carousel resets to the first image; any playing
video stops) without any manual reset code — a genuinely playing `<video>` element is destroyed
along with the DOM node, which stops playback as a side effect of unmounting, and a freshly
mounted `DetailImageCarousel` always starts at index 0 by definition. It's the same technique
already implied by the ticket's own description ("Falls out naturally if the detail index lives
in the piece component and you key it by piece ID... React unmounts the old `<video>` entirely").

**Alternatives considered**:

- *Manually call `.pause()` on video refs and reset detail-carousel state via `useEffect` when
  `activePiece.id` changes* — rejected: does the same job as the `key` change with strictly more
  code (refs, an effect, explicit reset calls) and more ways to get out of sync (e.g. forgetting
  to reset one piece of state).

## Decision: Filtered view uses inline pagination controls, not a separate `Pagination` component

**Decision**: `FilteredCategory` renders its own "previous page"/"next page" buttons directly
(plain `useState`-free — page comes from the URL) rather than extracting a `Pagination`
sub-component.

**Rationale**: The control is small (two buttons plus a "page X of Y" label) and has exactly one
consumer. Extracting a component for it would add a file and a props boundary without removing
any duplication, going against the project's simplification/no-premature-abstraction guidance.

**Alternatives considered**:

- *Extract `Pagination` as its own paired component* — rejected until a second consumer exists;
  nothing else in this feature paginates.

## Decision: Accessible media follows the home page `BeforeAfter` pattern — background-image cell + visually-hidden `<img>`

**Decision**: The before/after hero images and detail-image cells use the same technique already
established by `app/routes/pages/home/components/BeforeAfter/BeforeAfter.tsx`: a `background-image`
div for the visual treatment, paired with a visually-hidden `<img src alt>` inside it for
accessibility and broken-image semantics.

**Rationale**: This is direct, already-merged precedent in the same codebase for the exact same
"cropped background-image tile with alt text" pattern the Gallery's `ba-cell`/`detail-cell`
mockup markup uses. Reusing it keeps the translation consistent with how the site already
solves this, rather than introducing a second technique (e.g. `<img>` with `object-fit: cover`)
for the same visual result.

**Alternatives considered**:

- *Plain `<img style="object-fit: cover">`* — rejected: works too, but diverges from the
  existing site convention for no benefit, and loses the graceful `onError` fallback behavior
  `BeforeAfter` already established.

## Decision: Video accessibility — accessible label per video, no separate transcript

**Decision**: Each `<video>` gets an `aria-label` identifying the piece and which side it is
(e.g. "Master closet transformation — before"), and rendering is paused-on-poster until clicked.
No transcript or captions track is added.

**Rationale**: The constitution's Accessibility article requires an accessible label for video,
and a transcript-equivalent only "where the video conveys information not otherwise available on
the page." Here, the adjacent `description` text already conveys the substance of the
transformation in prose; the video is a supplementary visual, not the sole carrier of
information, so a label (not a full transcript) satisfies the requirement.

**Alternatives considered**:

- *Add a text transcript per video* — rejected as unnecessary scope: the description field
  already fulfills the "information available elsewhere" condition the constitution's exception
  is built around.

## Decision: Video/media source shape logged as a documented constitution exception (Complexity Tracking), not silently ignored

**Decision**: Rather than routing mock video URLs through `app/lib/cloudinary/video.ts` (which
expects a real Cloudinary public ID) or skipping the Media article's checklist item silently,
plan.md's Constitution Check marks it `[~]` (partial) and logs the justification and migration
path in Complexity Tracking.

**Rationale**: The constitution's Governance section explicitly allows "a documented, approved
exception logged in the plan's Complexity Tracking table" — this is exactly that case: real
video content is being introduced, but the data source is intentionally mock/local for this
pass per spec Assumptions, so the Cloudinary helper has nothing real to operate on yet.

**Alternatives considered**:

- *Mark Media as N/A* — rejected: N/A was used correctly by COT-010/COT-014 because those
  features introduced no video/image assets at all; this feature does introduce video, so
  silently marking it N/A would misrepresent the gap rather than document it.
