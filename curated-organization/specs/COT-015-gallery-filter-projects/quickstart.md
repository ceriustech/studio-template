# Quickstart: Validating the Gallery Filter Bar and Projects section

Manual validation guide — this repo has no automated test runner configured. Validate against
`spec.md`'s Acceptance Scenarios and Success Criteria, using the URL states documented in
[contracts/gallery-url-state.md](./contracts/gallery-url-state.md).

## Prerequisites

- Dependencies installed (`npm install` at repo root, if not already done).
- Dev server runnable via the project's existing `npm run dev` script.

## 1. Default (All) view — User Story 1

1. Open `/gallery` with no query string.
2. Confirm the filter bar shows all 6 category pills plus "All", with "All" active.
3. Confirm one section renders per category (Kitchen, Closet, Pantry, Office, Living space,
   Garage), each showing a single portfolio piece: before/after video pair (paused on poster),
   detail image row, title, category tag, location, description.
4. For a category with more than one piece, click "next" and confirm the title, media, and
   description all change together, and the position indicator updates (e.g. "1 / 5" → "2 / 5").
5. Confirm "previous" is disabled at the first piece and "next" is disabled at the last piece.
6. Find (or temporarily use mock data with) a category with exactly one piece and confirm no
   next/previous controls or position indicator render for it.
7. Confirm "View all" appears only for categories with more than 5 pieces, linking to
   `/gallery?category=<that category>`.

**Expected**: Matches the provided design screenshot exactly at desktop width; matches SC-001,
SC-002, SC-003.

## 2. Video mutual exclusion and detail-image carousel — User Story 1

1. On any piece, click the "before" video and confirm it starts playing while "after" stays
   paused on its poster.
2. Click the "after" video and confirm "before" stops and "after" starts playing instead.
3. Use the piece's detail-image controls and confirm only the detail image changes — the
   section's current piece and video playback state are unaffected.
4. Advance the section carousel to a different piece and confirm: the new piece's detail-image
   carousel starts at the first image, and any video that was playing on the previous piece has
   stopped (matches SC-006, FR-016).

## 3. Filtering to a category — User Story 2

1. From `/gallery`, click a category pill (e.g. "Kitchen").
2. Confirm the URL becomes `/gallery?category=kitchen` and the view shows only Kitchen pieces,
   stacked, with no section-level next/previous controls.
3. If the category has more than 5 pieces, confirm only the first 5 render along with pagination
   controls; click "next page" and confirm the next set renders and the URL's `page` updates.
4. If the category has 5 or fewer pieces, confirm all render with no pagination controls.
5. From a `CategorySection`'s "View all" link, confirm it lands on that same category's filtered
   view.
6. Click "All" and confirm the page returns to the default per-category view.

## 4. URL state — User Story 3

1. Filter to a category, navigate to page 2 (if available), copy the URL, and open it in a new
   tab — confirm the same category and page render identically.
2. Manually edit the URL to a `page` value beyond the last valid page for that category and load
   it — confirm the view clamps to the nearest valid page rather than breaking (FR-012).
3. Switch from one category filter to another and confirm the page resets to 1 (FR-011).
4. Click through a few filter/page changes, then use the browser back button, and confirm the
   previously viewed filter/page is restored.

## 5. Mobile/tablet viewport and edge cases

1. Resize to tablet (≈768px) and mobile (≈375px) widths and confirm the section/piece header
   wraps per spec Edge Cases (title on its own line, controls/metadata below) with no
   overlapping or crowded content.
2. Confirm a long portfolio title truncates with an ellipsis rather than displacing the section's
   controls (FR-019).
3. Tab through the filter pills, a section's carousel controls, a piece's detail-image controls,
   and the video play controls using only the keyboard, and confirm every control is reachable
   and operable, and that advancing the section carousel doesn't unexpectedly move focus away
   from where you were interacting (FR-018, SC-005).
