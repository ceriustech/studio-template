---

description: "Task list template for feature implementation"
---

# Tasks: Gallery Filter Bar and Projects section

**Input**: Design documents from `/specs/COT-015-gallery-filter-projects/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/gallery-url-state.md](./contracts/gallery-url-state.md), [quickstart.md](./quickstart.md)

**Tests**: Not requested in the feature specification — no test tasks are included. Validation is manual visual/interaction QA via [quickstart.md](./quickstart.md).

**Organization**: Tasks are grouped by user story (P1 default browsing, P2 category filtering, P3 shareable URL state) so each can be implemented and validated independently, per [spec.md](./spec.md).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) — paths follow the structure defined in [plan.md](./plan.md#source-code-repository-root):

```text
app/routes/pages/gallery/
├── index.tsx                          (existing — already wires <Hero/><FilterBar/><Projects/>)
├── gallery.types.ts                    (existing, empty)
├── utils.ts                            (existing, empty)
└── components/
    ├── hero/                              (existing — COT-014)
    ├── filter-bar/index.tsx                (existing stub)
    └── projects/
        ├── index.tsx                       (existing stub)
        └── components/
            ├── CategorySection/
            ├── FilteredCategory/
            └── PortfolioPiece/
                └── components/
                    ├── VideoPair/
                    └── DetailImageCarousel/
```

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

No setup tasks are required. `app/routes/pages/gallery/index.tsx` already renders `<Hero /><FilterBar /><Projects />` (Hero from COT-014; `FilterBar`/`Projects` stubs from this feature's scaffolding), and the `filter-bar`/`projects` component folders and empty `gallery.types.ts`/`utils.ts` already exist. This feature fills them in.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and mock data every user story depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T001 [P] Define `Category`, `MediaSource`, `DetailImage`, and `PortfolioPiece` types in `app/routes/pages/gallery/gallery.types.ts` per [data-model.md](./data-model.md): `Category` as the union `'kitchen' | 'closet' | 'pantry' | 'office' | 'living-space' | 'garage'`; `MediaSource` (`src`, `poster`, `alt`); `DetailImage` (`src`, `alt`); `PortfolioPiece` (`id`, `title`, `category`, `location`, `description`, `beforeMedia`, `afterMedia`, `detailImages`)
- [X] T002 Build the mock dataset and helpers in `app/routes/pages/gallery/utils.ts` (depends on T001): a `PORTFOLIO_PIECES: PortfolioPiece[]` constant covering all 6 categories, including at least one category with exactly 1 piece (to exercise suppressed section-carousel controls) and at least one category with more than 5 pieces (to exercise "View all" and pagination); `CATEGORIES` ordered list (Kitchen, Closet, Pantry, Office, Living space, Garage) pairing each `Category` value with its filter-pill label, per [data-model.md](./data-model.md); `isValidCategory(value: string | null): value is Category` guard; `getSectionPieces(category)` returning that category's first 5 pieces by `id` order; `categoryHasMoreThanFive(category)` boolean; `getCategoryPieces(category)` returning all of a category's pieces; `paginate(pieces, page)` returning a 5-item page slice; `clampPage(page, totalPages)` clamping to `[1, totalPages]`

**Checkpoint**: Foundation ready — User Story 1 implementation can begin.

---

## Phase 3: User Story 1 - Visitor browses a snapshot of every category without filtering (Priority: P1) 🎯 MVP

**Goal**: Render the default (All) Gallery view — filter bar with "All" active, one section per category each showing a single portfolio piece with a working section-level carousel, and a fully interactive portfolio piece (mutually-exclusive before/after video, its own detail-image carousel).

**Independent Test**: Load `/gallery` and confirm the filter bar, one section per category with working next/previous (disabled at boundaries, hidden for single-piece categories, "View all" only for >5-piece categories), and that a piece's videos and detail images behave per spec Acceptance Scenarios 1–8.

### Implementation for User Story 1

- [X] T003 [P] [US1] Implement `FilterBar` in `app/routes/pages/gallery/components/filter-bar/index.tsx` + `app/routes/pages/gallery/components/filter-bar/filterBar.css` (depends on T001): read the active `category` from `useSearchParams` (from `react-router`); render an "All" pill plus one pill per `CATEGORIES` entry (from `utils.ts`, once T002 lands — until then reference `gallery.types.ts`'s `Category` union directly); the active pill (matching the current `category` param, or "All" when absent) gets the `.active` styling; clicking a pill navigates to `/gallery?category=<value>` via `setSearchParams` using standard push navigation (no `{ replace: true }`), clearing any `page` param; clicking "All" clears `category` entirely; translate `.filter-bar`/`.filter-pill`/`.filter-pill:hover`/`.filter-pill.active` from the mockup into camelCase (`.filterBar`, `.filterPill`, `.filterPill:hover`, `.filterPill.active`), including the 768px/480px responsive rules (horizontal scroll, no wrap, on narrow widths per the mockup)
- [X] T004 [P] [US1] Implement `VideoPair` in `app/routes/pages/gallery/components/projects/components/PortfolioPiece/components/VideoPair/VideoPair.tsx` + `VideoPair.types.ts` + `videoPair.css` (depends on T001): props `{ before: MediaSource; after: MediaSource }`; owns `playing: 'before' | 'after' | null` state; each video renders paused on its `poster` until clicked, at which point it plays and the other pauses (mutual exclusion, FR-014); each `<video>` has `aria-label={media.alt}`; translate `.ba-pair`/`.ba-cell`/`.ba-tag` into camelCase (`.baPair`, `.baCell`, `.baTag`)
- [X] T005 [P] [US1] Implement `DetailImageCarousel` in `app/routes/pages/gallery/components/projects/components/PortfolioPiece/components/DetailImageCarousel/DetailImageCarousel.tsx` + `DetailImageCarousel.types.ts` + `detailImageCarousel.css` (depends on T001): props `{ images: DetailImage[] }`; owns its own current-index `useState` starting at 0; "previous"/"next" controls labeled `aria-label="Previous detail image"`/`aria-label="Next detail image"`, disabled at the first/last image, omitted entirely when there is only one image; renders each detail image as a `background-image` cell paired with a visually-hidden `<img alt>` (same accessible-image pattern as `app/routes/pages/home/components/BeforeAfter/BeforeAfter.tsx`); translate `.detail-grid`/`.detail-cell` into camelCase (`.detailGrid`, `.detailCell`)
- [X] T006 [US1] Implement `PortfolioPiece` in `app/routes/pages/gallery/components/projects/components/PortfolioPiece/PortfolioPiece.tsx` + `PortfolioPiece.types.ts` + `portfolioPiece.css` (depends on T004, T005): props `{ piece: PortfolioPiece }`; renders `<VideoPair before={piece.beforeMedia} after={piece.afterMedia} />`, `<DetailImageCarousel images={piece.detailImages} />`, and the text block (title, category tag(s), location, description); title truncates with `text-overflow: ellipsis` rather than wrapping or displacing header content (FR-019); translate `.project`/`.project-header`/`.project-title`/`.project-meta`/`.project-tag`/`.project-location`/`.project-caption` into camelCase (`.project`, `.projectHeader`, `.projectTitle`, `.projectMeta`, `.projectTag`, `.projectLocation`, `.projectCaption`)
- [X] T007 [US1] Implement `CategorySection` in `app/routes/pages/gallery/components/projects/components/CategorySection/CategorySection.tsx` + `CategorySection.types.ts` + `categorySection.css` (depends on T006): props `{ category: Category; label: string; pieces: PortfolioPiece[]; totalCount: number }` (up to 5 `pieces`, `totalCount` for the "View all" check); owns the active-piece index `useState` starting at 0; header shows the active piece's title with adjacent "previous"/"next" controls (`aria-label="Previous project"`/`aria-label="Next project"`) and a position indicator (e.g. "2 / 5") visible on first render; controls disabled at the first/last piece and omitted entirely when `pieces.length === 1`; renders a "View all {totalCount} {label} projects →" link (`react-router` `Link` to `/gallery?category=<category>`) only when `totalCount > 5`, positioned bottom-right per the mockup's "View all" placement; renders `<PortfolioPiece key={activePiece.id} piece={activePiece} />` (keying by id is what resets the nested detail carousel and stops any playing video when the active piece changes, per research.md); translate the section-header layout rules from the mockup into camelCase, including the 768px/480px header-wrap rules (title on its own line, controls/metadata below, per spec Edge Cases)
- [X] T008 [US1] Implement the default-view branch of `Projects` in `app/routes/pages/gallery/components/projects/index.tsx` + `app/routes/pages/gallery/components/projects/projects.css` (depends on T007, T002): read `category` via `useSearchParams`; when `category` is absent or fails `isValidCategory`, render one `<CategorySection />` per `CATEGORIES` entry in fixed order, passing that category's `getSectionPieces(category)` and `getCategoryPieces(category).length` as `totalCount`; categories with zero pieces are skipped entirely (no empty section rendered, per spec Edge Cases); translate `.projects` container padding rules into camelCase (`.projects`), including the 768px/480px responsive padding already used by sibling sections

**Checkpoint**: At this point, the default Gallery view (filter bar, per-category sections, section carousels, and fully interactive portfolio pieces) is functional and independently testable end-to-end. This is the MVP.

---

## Phase 4: User Story 2 - Visitor filters to one category to see more of that work (Priority: P2)

**Goal**: Clicking a category pill or a section's "View all" link shows that category's full, paginated list of pieces (stacked, no section-carousel controls), per spec Acceptance Scenarios 1–5.

**Independent Test**: From `/gallery`, click a category pill (or a section's "View all" link) and confirm only that category's pieces render, stacked, up to 5 per page with pagination controls when there are more than 5, and that "All" returns to the default view.

### Implementation for User Story 2

- [X] T009 [US2] Implement `FilteredCategory` in `app/routes/pages/gallery/components/projects/components/FilteredCategory/FilteredCategory.tsx` + `FilteredCategory.types.ts` + `filteredCategory.css` (depends on T006, T002): props `{ category: Category; page: number }`; uses `getCategoryPieces(category)` + `paginate(...)` + `clampPage(...)` from `utils.ts` to compute the current page's up-to-5 pieces; renders each as `<PortfolioPiece key={piece.id} piece={piece} />` stacked vertically with no section-carousel controls (FR-008); when the category has more than 5 pieces total, renders inline "previous page"/"next page" buttons plus a "page X of Y" label (no separate `Pagination` component, per research.md) that update only the `page` search param via standard push navigation; when 5 or fewer pieces, no pagination controls render (FR-009)
- [X] T010 [US2] Extend `Projects` in `app/routes/pages/gallery/components/projects/index.tsx` (depends on T008, T009): when `category` is present and passes `isValidCategory`, render a single `<FilteredCategory category={category} page={clampPage(parsedPage, totalPagesFor(category))} />` instead of the per-category default loop

**Checkpoint**: At this point, User Stories 1 AND 2 both work independently — default browsing and category filtering with pagination.

---

## Phase 5: User Story 3 - Visitor shares or revisits a specific filtered view (Priority: P3)

**Goal**: The category/page state already lives in the URL by construction (per research.md's `useSearchParams`-first architecture from US1/US2) — this phase closes the remaining gaps needed for full shareability/back-button support and validates the complete contract in [contracts/gallery-url-state.md](./contracts/gallery-url-state.md).

**Independent Test**: Filter to a category, go to page 2 (if available), copy the URL, open it fresh, and confirm identical rendering; use the browser back button and confirm the previous filter/page is restored; open a URL with an out-of-range page or an invalid category and confirm it clamps/falls back instead of breaking.

### Implementation for User Story 3

- [X] T011 [US3] Confirm `FilterBar` (T003) and `FilteredCategory`'s pagination controls (T009) update the URL via standard push navigation, never `{ replace: true }`, so each category/page change is its own browser-history entry and the back button restores the prior state (spec Acceptance Scenario 5) — confirmed: `FilterBar` calls `setSearchParams(...)` with no `replace` option (defaults to push), and `FilteredCategory`'s pagination controls are plain `<Link to=...>` elements (also push by default)
- [X] T012 [US3] Confirm `Projects` (T008/T010) and `utils.ts` (T002) already fall back to the default view for any `category` value that fails `isValidCategory`, and clamp any `page` value outside `[1, totalPages]` via `clampPage` rather than rendering an empty or broken state, per [contracts/gallery-url-state.md](./contracts/gallery-url-state.md) and spec Acceptance Scenario 4 — confirmed: `Projects` gates the filtered branch behind `isValidCategory(categoryParam)`, and `FilteredCategory` always computes `currentPage = clampPage(page, totalPages)` before slicing
- [ ] T013 [US3] Run [quickstart.md](./quickstart.md) Section 4 (URL state): reload/copy-paste a filtered + paged URL, an out-of-range page, an invalid `category` value, and the browser back button, confirming each matches [contracts/gallery-url-state.md](./contracts/gallery-url-state.md) (depends on T011, T012)

**Checkpoint**: All three user stories are independently functional; the Gallery's filter/pagination state is fully shareable and durable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation against the spec and constitution

- [ ] T014 Run the full [quickstart.md](./quickstart.md) (Sections 1–5): default view, video/detail-carousel behavior, filtering/pagination, URL state, and mobile/tablet/keyboard edge cases, confirming the result matches the provided design screenshots exactly (spec Acceptance Criteria)
- [ ] T015 [P] Confirm no dash-case CSS class names remain in any new `.css` file (FR-020) and no `any` / `@ts-ignore` was introduced in any new `.tsx`/`.types.ts` file

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No tasks — nothing blocks Phase 2
- **Foundational (Phase 2)**: T002 depends on T001 — BLOCKS all user stories
- **User Story 1 (Phase 3)**: T003, T004, T005 depend only on T001 and can start in parallel once Phase 2 completes; T006 depends on T004 + T005; T007 depends on T006; T008 depends on T007 + T002
- **User Story 2 (Phase 4)**: T009 depends on T006 + T002; T010 depends on T008 + T009 (same file as T008)
- **User Story 3 (Phase 5)**: T011 depends on T003 + T009; T012 depends on T008 + T010 + T002; T013 depends on T011 + T012
- **Polish (Phase 6)**: Depends on all prior phases

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories — this is the MVP
- **User Story 2 (P2)**: Reuses `PortfolioPiece` from US1 (T006) and extends `Projects` (T008) from US1; independently testable once its own tasks land
- **User Story 3 (P3)**: Builds on the URL-state plumbing already present in US1 (T003) and US2 (T008–T010); closes remaining gaps rather than adding new rendering

### Parallel Opportunities

- T001 has no dependencies and can start immediately
- T003, T004, T005 all depend only on T001 and touch different files — can run in parallel
- T015 can run in parallel with T014 (different concerns: manual QA vs. code-style check)

---

## Parallel Example: User Story 1

```bash
# After T001 (types) and T002 (mock data) land, these three touch different files
# and have no dependency on one another:
Task: "Implement FilterBar in app/routes/pages/gallery/components/filter-bar/"
Task: "Implement VideoPair in .../PortfolioPiece/components/VideoPair/"
Task: "Implement DetailImageCarousel in .../PortfolioPiece/components/DetailImageCarousel/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (no tasks) and Phase 2: Foundational (T001–T002)
2. Complete Phase 3: User Story 1 (T003–T008)
3. **STOP and VALIDATE**: Confirm the default Gallery view matches the design screenshot and spec Acceptance Scenarios 1–8 independently
4. Deploy/demo if ready — the default browsing experience is a complete, valuable increment on its own

### Incremental Delivery

1. Complete Setup + Foundational → shared types/mock data ready
2. Add User Story 1 → validate independently → Deploy/Demo (MVP)
3. Add User Story 2 → validate independently → Deploy/Demo (category filtering + pagination)
4. Add User Story 3 → validate independently → Deploy/Demo (shareable/durable URL state)
5. Run Phase 6 Polish → final validation against spec and constitution

---

## Notes

- [P] tasks touch different files with no shared dependency
- Commit after each task or logical group
- Content (the mock `PORTFOLIO_PIECES` dataset) is fixed, hardcoded data per spec Assumptions and plan.md Content Layer Decisions — no Sanity schema or query in this pass; see plan.md's Complexity Tracking for the documented Media/Cloudinary exception this implies
- `FilterBar` and `Projects` stay prop-less (reading `useSearchParams` directly) with no `.types.ts`, matching the `Hero` precedent from COT-014; every new sub-component under `projects/components/` takes props and is paired with its own `.types.ts` from the start, per the constitution
- No shared carousel hook/component is extracted between `CategorySection`'s section carousel and `DetailImageCarousel` — each owns its own small `useState` index, per research.md
