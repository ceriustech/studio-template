# Tasks: Gallery Video Poster & Lightbox

**Input**: Design documents from `/specs/COT-026-gallery-video-lightbox/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/component-contracts.md, quickstart.md

**Tests**: Not requested in the spec and no test framework is configured in this repo (see `research.md` §9) — validation is `npm run typecheck`, lint, and the manual scenarios in `quickstart.md`, folded into the Polish phase below.

**Organization**: Tasks are grouped by user story (spec.md priorities P1/P2/P3) so each story can be built and demoed independently on top of the shared Foundational types/data.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no unmet dependency)
- **[Story]**: US1 / US2 / US3, per spec.md
- All paths are relative to the repo root (`d:\My Websites\studio-template\curated-organization`)

## Path Conventions

Single React Router app, route-local feature (no shared/cross-route components — see plan.md Structure Decision):

```
public/gallery/
app/routes/pages/gallery/
├── gallery.types.ts
├── utils.ts
└── components/projects/components/PortfolioPiece/
    ├── PortfolioPiece.tsx / PortfolioPiece.types.ts
    └── components/
        ├── VideoPair/            (existing, refactored)
        ├── VideoPanel/           (new)
        ├── DetailImageCarousel/  (existing, extended)
        └── Lightbox/             (new)
```

---

## Phase 1: Setup (local media assets)

**Purpose**: Get real local files in place under `/public` before any code references them, per FR-005 and research.md §8.

- [X] T001 Create `public/gallery/videos/` and `public/gallery/photos/` directories
- [X] T002 [P] Copy `app/assets/vid-1.mp4` → `public/gallery/videos/before.mp4` and `app/assets/vid-2.mp4` → `public/gallery/videos/after.mp4` (the two clips already reused across all 18 existing projects; depends on T001)
- [X] T003 [P] Download the 11 distinct Unsplash photos currently hot-linked in `app/routes/pages/gallery/utils.ts` (poster and detail images) into `public/gallery/photos/`, one file per distinct photo id (e.g. `photo-1600585152220-90363fe7e115.jpg`), fetched from each image's current URL (depends on T001)
- [X] T004 Measure the playable duration, in whole seconds, of `public/gallery/videos/before.mp4` and `public/gallery/videos/after.mp4` — record both values for use as every video's `duration` field in T006 (depends on T002)

**Checkpoint**: Local assets exist and are ready to be referenced from code.

---

## Phase 2: Foundational (blocking prerequisites)

**Purpose**: The media type shapes and re-authored project data every user story's components read from.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Replace `MediaSource`/`DetailImage` in `app/routes/pages/gallery/gallery.types.ts` with `VideoMedia` (`src`, `poster`, `posterOffset: number`, `tag: 'before' | 'after'`, `duration: number`, `captionsSrc?: string`, `alt`) and `ImageMedia` (`src`, `alt`, `caption`, `fullSrc?: string`), and change `PortfolioPiece` to `videos: readonly [] | readonly [VideoMedia] | readonly [VideoMedia, VideoMedia]` and `images: ImageMedia[]`, per `data-model.md`
- [X] T006 Rewrite `PORTFOLIO_PIECES` in `app/routes/pages/gallery/utils.ts`: replace each piece's `beforeMedia`/`afterMedia` with a `videos` array of 1–2 `VideoMedia` entries (`tag` set per before/after, `poster`/`src` pointing at the `public/gallery/photos/`/`public/gallery/videos/` files from Phase 1, `posterOffset: 0`, `duration` from T004, `captionsSrc` omitted, `alt` preserved from today's data), and replace `detailImages` with `images: ImageMedia[]` (`caption` derived from each image's existing `alt` text, `fullSrc` omitted so it falls back to `src`) (depends on T005, T003, T004)

**Checkpoint**: `npm run typecheck` passes against the new types and data before any component work starts.

---

## Phase 3: User Story 1 - Visitor previews a project's Before/After videos at a glance (Priority: P1) 🎯 MVP

**Goal**: Video panels rest on a real poster (tag, duration chip, play affordance, no "paused · poster" text); clicking one opens a full-screen lightbox where the clip plays with native controls, `controlsList="nodownload"`, `playsInline`, and captions when available — never inline in the panel.

**Independent Test**: Load `/gallery`, confirm every video panel shows a poster photo, Before/After tag, duration chip, and play icon with no placeholder text; click one and confirm a full-screen viewer opens, the clip plays with native controls, and the panel itself never played inline.

### Implementation for User Story 1

- [X] T007 [P] [US1] Create `app/routes/pages/gallery/components/projects/components/PortfolioPiece/components/VideoPanel/VideoPanel.types.ts` — `VideoPanelProps = { media: VideoMedia; onOpen: () => void }`
- [X] T008 [US1] Create `.../VideoPanel/VideoPanel.tsx`: renders the poster `<img>`, the Before/After tag top-left (from `media.tag`), a duration chip bottom-right (mm:ss formatted from `media.duration`), a centered play-affordance icon, and a single clickable/keyboard-activatable control (real `<button>`) that calls `onOpen`; accessible label built from `media.tag` + `media.alt`; renders no "paused"/"poster" text anywhere (depends on T007, T005)
- [X] T009 [P] [US1] Create `.../VideoPanel/videoPanel.css`, migrating the `.baCell`/`.baTag`/`.baPlayToggle` rules out of `videoPair.css` and adding a new bottom-right duration-chip rule (reuse the `.baTag` visual language for the chip's pill styling)
- [X] T010 [P] [US1] Update `.../VideoPair/VideoPair.types.ts`: `VideoPairProps = { videos: VideoMedia[]; onOpenVideo: (index: number) => void }` (depends on T005)
- [X] T011 [US1] Rewrite `.../VideoPair/VideoPair.tsx`: remove all `useState`/`useRef`/play-toggle logic, map `videos` (0–2 items) to one `VideoPanel` each, wiring `onOpen={() => onOpenVideo(index)}` (depends on T008, T010)
- [X] T012 [US1] Simplify `.../VideoPair/videoPair.css` to only the `.baPair` grid-layout rule (2-up desktop, 1-up at ≤720px per this subtree's existing breakpoint), removing the now-migrated cell/tag/toggle/status rules — including the `.baStatus` rule that rendered "paused · poster" (depends on T009)
- [X] T013 [P] [US1] Create `.../Lightbox/Lightbox.types.ts` per `contracts/component-contracts.md`: `{ videos: VideoMedia[]; images: ImageMedia[]; open: { set: 'video' | 'image'; index: number } | null; onClose: () => void; onNavigate: (next: { set: 'video' | 'image'; index: number }) => void; returnFocusRef: RefObject<HTMLElement> }`
- [X] T014 [US1] Create `.../Lightbox/useLightbox.ts` (initial version): an `isMounted` flag set via `useEffect` so the component can stay SSR-safe (depends on T013)
- [X] T015 [US1] Create `.../Lightbox/Lightbox.tsx` (initial version): returns `null` until `isMounted`, then `createPortal`s to `document.body`; dimmed backdrop with the active item centered; for a video item, renders `<video poster={media.poster} autoPlay playsInline controlsList="nodownload" controls={hasStartedPlaying} onPlay={() => setHasStartedPlaying(true)} ...>` with a custom poster + play-button overlay shown until `hasStartedPlaying` is true (covers the case where autoplay is blocked by the browser — the visitor can tap the overlay to start playback manually) and a `<track kind="captions" src={media.captionsSrc}>` only when `captionsSrc` is present; a close (`X`) button and a backdrop click both call `onClose`; item counter (`n / total`) and the active item's caption beneath it (depends on T014)
- [X] T016 [P] [US1] Create `.../Lightbox/lightbox.css`: backdrop, centered media container, close button, counter, caption, poster/play-overlay styles for the pre-playback video state
- [X] T017 [US1] Wire `.../PortfolioPiece/PortfolioPiece.tsx`: add `open` state (`{ set: 'video' | 'image'; index } | null`), pass `videos={piece.videos}` and `onOpenVideo={(index) => setOpen({ set: 'video', index })}` to `VideoPair`, and render `<Lightbox videos={piece.videos} images={piece.images} open={open} onClose={() => setOpen(null)} onNavigate={setOpen} returnFocusRef={...} />` (depends on T011, T015)

**Checkpoint**: User Story 1 is fully functional and independently testable — video panels show real posters and open a playable lightbox.

---

## Phase 4: User Story 2 - Visitor enlarges a project's detail photos (Priority: P2)

**Goal**: Every photo thumbnail opens the same lightbox at that exact photo, with the lightbox cycling only within that project's photos (never its videos), and vice versa for videos.

**Independent Test**: Click any detail photo thumbnail and confirm the lightbox opens on that exact photo with its caption; move next/previous and confirm only other photos from that project ever appear; open a video from the same project and confirm next/previous only ever shows its other video.

### Implementation for User Story 2

- [X] T018 [P] [US2] Update `.../DetailImageCarousel/DetailImageCarousel.types.ts`: `DetailImageCarouselProps = { images: ImageMedia[]; onOpenImage: (index: number) => void }` (depends on T005)
- [X] T019 [US2] Rewrite `.../DetailImageCarousel/DetailImageCarousel.tsx`: each visible thumbnail becomes a real `<button>` (replacing the current `<div style={{backgroundImage}}>` + visually-hidden `<img>` pattern) rendering an `<img loading="lazy">`, calling `onOpenImage(absoluteIndex)` on click/Enter/Space, with an accessible label from the image's `alt` (depends on T018)
- [X] T020 [P] [US2] Update `.../DetailImageCarousel/detailImageCarousel.css` for the button-based thumbnail (swap the background-image `div` styling for an `<img>` with `object-fit: cover` inside the button; keep the existing hover treatment and add a visible focus style)
- [X] T021 [US2] Extend `.../Lightbox/Lightbox.tsx`: render the active image (`media.fullSrc ?? media.src`) with its caption when `open.set === 'image'`; add on-screen previous/next buttons that move `index` only within the active set's own array (`videos` or `images`), satisfying FR-018's non-mixing requirement structurally (each button only ever calls `onNavigate` with indices from the currently-active array) (depends on T015, T019)
- [X] T022 [US2] Wire `.../PortfolioPiece/PortfolioPiece.tsx`'s `DetailImageCarousel` with `onOpenImage={(index) => setOpen({ set: 'image', index })}` (depends on T017, T021)

**Checkpoint**: User Stories 1 and 2 both work independently — videos and photos each open and cycle within their own set.

---

## Phase 5: User Story 3 - Visitor navigates and dismisses the full-screen viewer confidently (Priority: P3)

**Goal**: Full keyboard, touch, and screen-reader support for the lightbox built in Stories 1–2: Escape/arrow keys, focus trap and return, touch swipe, tablet/desktop filmstrip vs. mobile dot indicators, scroll lock without layout shift, adjacent-image preloading, and ARIA dialog semantics — matching the provided design screenshots exactly.

**Independent Test**: Open the lightbox and, without a mouse, confirm Escape closes it (returning focus to the origin thumbnail), arrow keys cycle the active set, and Tab/Shift+Tab never leave the dialog. Separately, confirm touch swipe cycles on a touch device, the filmstrip (with Before/After labels on video thumbnails) shows at ≥720px and is replaced by dot indicators with no separate prev/next buttons below that width, and the dialog exposes `role="dialog"`/`aria-modal="true"`/an accessible name with the item's position.

### Implementation for User Story 3

- [X] T023 [US3] Extend `.../Lightbox/useLightbox.ts`: a `keydown` listener (Escape → `onClose`; Left/Right → `onNavigate` prev/next within the active set), a `touchstart`/`touchend` handler (horizontal delta past a small threshold → prev/next), and adjacent-image preloading (on active image index change, create an off-DOM `new Image()` for the next/previous image's `fullSrc ?? src`) (depends on T021)
- [X] T024 [US3] Extend `.../Lightbox/useLightbox.ts` + `Lightbox.tsx`: on open, move focus to the dialog (or its first focusable control); on close, restore focus to `returnFocusRef.current`; while open, a `Tab`/`Shift+Tab` handler computed from `querySelectorAll` on the dialog root cycles focus only among the dialog's own focusable elements (depends on T023)
- [X] T025 [US3] Extend `Lightbox.tsx`/`lightbox.css`: set `overflow: hidden` on `<body>` while open (restored on close) and add `scrollbar-gutter: stable` so removing the scrollbar causes no horizontal page shift (depends on T023)
- [X] T026 [US3] Extend `Lightbox.tsx`/`lightbox.css`: add the tablet/desktop filmstrip — a row of thumbnail buttons for the active set, shown at `≥720px` (this subtree's existing breakpoint), active item visually distinguished, click-to-jump via `onNavigate`; video-set thumbnails additionally render their `tag` ("Before"/"After") as text beneath the thumbnail, image-set thumbnails do not (depends on T021)
- [X] T027 [US3] Extend `Lightbox.tsx`/`lightbox.css`: below `720px`, replace the filmstrip with a row of dot indicators (one per item in the active set, active one visually distinguished) beneath the caption, and hide the on-screen previous/next buttons so navigation relies on swipe/keyboard only, matching the provided design screenshots (depends on T026)
- [X] T028 [US3] Extend `Lightbox.tsx`/`lightbox.css`: render the active video's `tag` as a top-left overlay on the enlarged video itself, matching the label already shown on its resting `VideoPanel` (depends on T021)
- [X] T029 [US3] Extend `Lightbox.tsx`: add `role="dialog"`, `aria-modal="true"`, and an accessible name (e.g. `aria-label`) that identifies the active item and its position — e.g. "Before video, item 1 of 2" / "Photo, item 4 of 5" (depends on T021)
- [X] T030 [US3] Add visible focus states and accessible labels to every remaining interactive control introduced by Stories 1–3 that doesn't already have one: `VideoPanel`'s play affordance, the lightbox close/prev/next/filmstrip/dot controls (depends on T026, T027)
- [X] T031 [US3] Wrap every hover/fade/open-close transition added across `VideoPanel/videoPanel.css`, `VideoPair/videoPair.css`, `DetailImageCarousel/detailImageCarousel.css`, and `Lightbox/lightbox.css` in a `prefers-reduced-motion` guard so they're suppressed (with the underlying interaction still functional) when the visitor has "reduce motion" enabled (depends on T009, T012, T020, T027, T028)

**Checkpoint**: All three user stories are independently functional; the full spec (spec.md) is satisfied end-to-end.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final correctness pass across all three stories.

- [ ] T032 Remove now-dead code left behind by the refactor (e.g. the old `MediaSource`/`DetailImage` types if anything still imports them, the now-unused `Pause` icon import in the old `VideoPair`, any leftover `.baStatus`/background-image detail-cell CSS) across `app/routes/pages/gallery/**`
- [ ] T033 [P] Audit `app/routes/pages/gallery/**` (including the new `Lightbox`) to confirm no `localStorage`/`sessionStorage`/cookie API is used anywhere, per spec FR-034
- [ ] T034 Run `npm run typecheck` from the repo root and fix any errors — including confirming that adding a 3rd entry to any `PortfolioPiece.videos` tuple fails to compile, proving FR-003 (depends on T032)
- [ ] T035 [P] Run the project's lint script and fix any violations across the touched files (depends on T032)
- [ ] T036 Execute every scenario in `specs/COT-026-gallery-video-lightbox/quickstart.md` (mobile, tablet, and desktop widths; keyboard-only pass; touch-swipe pass; `prefers-reduced-motion` pass) against `npm run dev`, and fix any deviation from the provided design screenshots (depends on T034, T035)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (T003, T004 supply values T006 needs) — BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational only.
- **User Story 2 (Phase 4)**: Depends on Foundational; extends the `Lightbox`/`PortfolioPiece` built in Phase 3 (T015, T017), so start after Phase 3's checkpoint.
- **User Story 3 (Phase 5)**: Depends on Foundational; extends the `Lightbox` built across Phases 3–4 (T021), so start after Phase 4's checkpoint.
- **Polish (Phase 6)**: Depends on all three user stories being complete.

Note: Because every story after US1 extends the same shared `Lightbox` component (by design — see plan.md Component Design Decisions), these phases are best executed in priority order (P1 → P2 → P3) rather than fully in parallel by separate people, despite the template's general "stories can proceed in parallel" guidance. Phases 3 and 4's non-Lightbox files (`VideoPanel`, `DetailImageCarousel`) are independent of each other and could be staffed in parallel if desired.

### Within Each Phase

- Types before components that consume them (e.g. T007 before T008; T013 before T014/T015).
- `VideoPanel`/`Lightbox` core before `VideoPair`/`PortfolioPiece` wiring that depends on them.
- Story complete (checkpoint reached) before starting the next priority's `Lightbox` extensions, since they touch the same files.

### Parallel Opportunities

- T002 and T003 (Setup) can run together once T001 completes.
- T007, T009, T010, T013, T016 (US1) touch different new/independent files and can run together once Phase 2 completes.
- T018 and T020 (US2) can run together once Phase 3 completes.
- T033 and T035 (Polish) can run together once T032 completes.

---

## Parallel Example: User Story 1

```bash
# Once Phase 2 (Foundational) is complete, these can run together:
Task: "Create VideoPanel.types.ts in app/routes/pages/gallery/components/projects/components/PortfolioPiece/components/VideoPanel/VideoPanel.types.ts"
Task: "Create videoPanel.css in .../VideoPanel/videoPanel.css"
Task: "Update VideoPair.types.ts in .../VideoPair/VideoPair.types.ts"
Task: "Create Lightbox.types.ts in .../Lightbox/Lightbox.types.ts"
Task: "Create lightbox.css in .../Lightbox/lightbox.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (local assets) and Phase 2 (types + data).
2. Complete Phase 3 (User Story 1).
3. **STOP and VALIDATE**: Load `/gallery`, confirm every video panel rests on a real poster with tag/duration/play-icon and no placeholder text, and confirm clicking one opens a playable full-screen lightbox with native controls.
4. This alone fixes the ticket's most visible defect (the literal "paused · poster" text) and is demoable on its own.

### Incremental Delivery

1. Setup + Foundational → local assets and typed data ready.
2. Add User Story 1 → validate → video posters + basic lightbox playback (MVP).
3. Add User Story 2 → validate → photo thumbnails open the same lightbox, sets stay separate.
4. Add User Story 3 → validate → full keyboard/touch/filmstrip/accessibility layer, screenshot-exact.
5. Polish → typecheck/lint/quickstart clean, dead code removed.

---

## Notes

- [P] tasks touch different files with no unmet dependency at the point they'd run.
- [Story] labels trace every Phase 3–5 task back to spec.md's User Story 1/2/3.
- No test tasks are included — no test framework is configured in this repo and the spec didn't request one (see `research.md` §9); `quickstart.md` (T036) is the validation mechanism instead.
- Commit after each task or logical group, per repo convention (Conventional Commits).
- Stop at any Phase checkpoint to demo that story independently.
