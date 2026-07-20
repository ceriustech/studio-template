# Feature Specification: Gallery Filter Bar and Projects section

**Feature Branch**: `COT-015-gallery-filter-projects`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "COT-015: Implement the Filter Bar and Projects section for Gallery page

Description:

Implement the Filter Bar and Project section on the Gallery page.

The Filter Bar and Projects section html markup for this page is located in ...specify\site-design\curated-gallery-mockup.html under the following comments:
`<!-- FILTER BAR -->`
`<!-- PROJECTS -->`
`<!-- Project 1: Closet -->`
`<!-- Project 2: Closet -->`
`<!-- Project 3: Closet -->`

The markup here is a template for the structure of this section but the mockup is the source of truth for the design of it.

1. Normative (unfiltered) state
Renders as shown: filter pills at top with "All" active, followed by one section per category (Kitchen, Closet, Pantry, Office, Living space, Garage). Each section displays a single portfolio piece — hero before/after pair, detail image row, title, category chip, location, description. Page height is fixed at the number of categories regardless of total portfolio volume.
2. Section carousels (normative state only)
Each section cycles through up to 5 portfolio pieces for its category, indexed by ID.

Position indicators — numeric ("2 / 5") or dots, visible from the first slide, so count and position are known without clicking.
Prev/next — disabled at boundaries: prev greyed at index 0, next greyed at the final slide. Arrows suppressed entirely when a category has one piece.
"View all" — in the section header from initial render, linking to that category's filtered view (equivalent to clicking the filter pill). Shown only when the category holds more than 5 pieces; suppressed when ≤ 5, since the carousel already contains everything.

3. Filtered state
Clicking a filter pill renders up to 5 full sections for that category — same piece layout, stacked, no carousel controls. Paginates at 5 per page when the category holds more than 5 pieces.
4. URL state
Filter and page live in the query string (?category=kitchen&page=2) — shareable, refresh-safe, back-button-friendly. Changing category resets page to 1; out-of-range page values clamp.
5. Shared structure
One portfolio-piece component used in both states. The normative state wraps a category's pieces in a carousel; the filtered state renders them as a paginated stack. Both read from the same mock array, filtered by category — swapping in Sanity later means replacing the data source, not the components.

So each portfolio piece now has three media zones: a before/after video pair up top (click-to-play, poster until then), a carouselled row of detail images below, and the text block.
Worth naming explicitly, because it's the main thing to get right: there are now two nested carousels in the normative state — the section carousel cycling portfolio pieces, and inside the active piece, the detail-image carousel. Two sets of prev/next controls stacked vertically, both live at once.
That's workable but needs deliberate handling:

Visual hierarchy — the two control sets must look clearly different, or users won't know which axis they're moving. Different placement (section arrows in the header near "view all"; detail arrows inline at the row's edges), different weight, different labels (aria-label="Next project" vs aria-label="Next detail image").
Reset on piece change — when the section carousel advances to a new piece, the detail carousel resets to index 0. Falls out naturally if the detail index lives in the piece component and you key it by piece ID.
Video reset too — advancing pieces should pause/unload the previous piece's videos. Same key trick handles it: React unmounts the old <video> entirely.
Keyboard/focus — if someone tabs to the detail arrows and clicks through, focus shouldn't be yanked when the section changes.

In the filtered state there's no section carousel, so each stacked piece just has its own detail carousel — simpler, and the ambiguity disappears.

Mock data shape to build against:
```
type MediaSource = {
  src: string;
  poster: string;
  alt: string;
};

type PortfolioPiece = {
  id: string;
  title: string;
  category: Category;
  location: string;
  description: string;
  beforeMedia: MediaSource;
  afterMedia: MediaSource;
  detailImages: { src: string; alt: string }[];  // carouselled
};
```
Mockup Info:

Project arrows and counter now sit directly beside the title in the header, so the control and the thing it changes are adjacent — advance the project and the title updates right next to your cursor. "View all" moved to the bottom right, baseline-aligned with the description, above the section divider.
The before video is shown mid-play (pause icon, "playing") with the after paused on its poster, illustrating the mutual-exclusion behavior you confirmed.
Two things this layout raises:
Header density. Title, arrows, counter, chip, and location now share one row. At 680px it fits; at your full site width it'll be comfortable. On mobile it will need to wrap — probably title on its own line with arrows and metadata below, or arrows dropping to sit above the video pair.
Long titles. "Kitchen + pantry overhaul" is short, but a longer title will squeeze the arrows. I've set the title to ellipsis rather than let it push the controls around — worth confirming that's the behavior you want, or whether the title should wrap and the header grow taller instead.
The "view all" placement has a nice side effect: it sits at the natural end of reading the description, which is exactly the moment someone decides whether they want more of this category.

All translated styles should be camel cased

Acceptance Criteria:

- The implementation should match the design screenshot exactly"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor browses a snapshot of every category without filtering (Priority: P1)

As a visitor who has just landed on the Gallery page, I want to see one representative project per category right away, and be able to step through a few more examples in any category that catches my eye, so that I can quickly get a sense of the studio's range of work without having to filter or dig for it.

**Why this priority**: This is the default landing experience for the Gallery page and the primary way most visitors will first encounter the studio's portfolio. It must work end-to-end (filter pills, one section per category, the ability to browse a category's top pieces, and the piece itself — before/after video, detail images, description) before anything else matters.

**Independent Test**: Load the Gallery page with no filter applied and confirm: the filter bar shows all category pills with "All" active; one section renders per category (Kitchen, Closet, Pantry, Office, Living space, Garage) showing a single portfolio piece each; clicking a section's next/previous control advances/reverses through that category's pieces, updating the title, media, and description together; the control is disabled at the first/last piece and hidden entirely for a category with only one piece.

**Acceptance Scenarios**:

1. **Given** a visitor loads the Gallery page, **When** the page renders, **Then** they see the filter bar with "All" active and one section per category, each showing a single portfolio piece with its before/after video pair, detail image row, title, category tag(s), location, and description.
2. **Given** a category section showing its first piece, **When** the visitor clicks that section's "next" control, **Then** the section updates to the category's next piece (title, media, description all change together) and the position indicator updates (e.g. "2 / 5").
3. **Given** a category section showing its first piece, **When** the visitor looks at the "previous" control, **Then** it is visibly disabled and does nothing if clicked; **When** the visitor advances to the category's last piece, **Then** the "next" control becomes disabled the same way.
4. **Given** a category with only one portfolio piece, **When** that section renders, **Then** no next/previous controls or position indicator appear for it.
5. **Given** a category with more than 5 portfolio pieces, **When** that section renders, **Then** a "View all" link is visible in the section header; **Given** a category with 5 or fewer pieces, **When** that section renders, **Then** no "View all" link appears.
6. **Given** a portfolio piece showing paused before/after videos on their poster images, **When** the visitor clicks the before video, **Then** it begins playing while the after video (or vice versa) remains paused; **When** the visitor then clicks the after video, **Then** the before video stops and the after video plays instead, so only one plays at a time.
7. **Given** a portfolio piece with more than one detail image, **When** the visitor uses that piece's detail-image controls, **Then** only the detail image shown advances — the section's current piece and video state are unaffected.
8. **Given** the visitor advances a section's carousel to a new piece, **When** the new piece renders, **Then** its detail-image carousel starts at the first image and any video that was playing on the previous piece has stopped.

---

### User Story 2 - Visitor filters to one category to see more of that work (Priority: P2)

As a visitor interested in one type of space (e.g. kitchens), I want to filter the gallery down to just that category and page through all of the studio's work in it, so that I can evaluate depth of experience in the specific area I care about.

**Why this priority**: Filtering is the natural next step after the default browse (User Story 1) for a visitor who wants more than the curated snapshot — it's how someone seriously considering booking evaluates a category in depth. It depends on the same portfolio-piece display already built for User Story 1.

**Independent Test**: From the Gallery page, click a category pill (or a section's "View all" link) and confirm the page shows only that category's pieces, stacked (no section-carousel controls), up to 5 per page, with pagination controls when the category has more than 5 pieces, and that clicking "All" returns to the default per-category view.

**Acceptance Scenarios**:

1. **Given** a visitor is viewing the default (All) gallery, **When** they click a category pill, **Then** the page shows only that category's pieces, each rendered with its full display (video pair, detail images, title, tag, location, description) stacked vertically, with no section-level next/previous controls.
2. **Given** a category has more than 5 pieces, **When** the filtered view renders, **Then** only the first 5 appear along with pagination controls; **When** the visitor navigates to the next page, **Then** the next set of up to 5 pieces renders.
3. **Given** a category has 5 or fewer pieces, **When** the filtered view renders, **Then** all of them appear and no pagination controls are shown.
4. **Given** a visitor clicks a section's "View all" link from the default view, **When** the filtered view loads, **Then** it shows the same category that link belonged to.
5. **Given** a visitor is viewing a filtered category, **When** they click the "All" pill, **Then** the page returns to the default per-category view.

---

### User Story 3 - Visitor shares or revisits a specific filtered view (Priority: P3)

As a visitor who has filtered to a category and page of interest, I want that exact view to be reflected in the page's address, so that I can share it, bookmark it, refresh the page, or use my browser's back button without losing my place.

**Why this priority**: This is a quality-of-life enhancement on top of filtering (User Story 2) — filtering already delivers the core value; making that state shareable and durable is valuable but not required for the feature to be usable.

**Independent Test**: Filter to a category, navigate to page 2 (if available), copy the resulting address, open it in a fresh page load, and confirm the same category and page render; then use the browser back button and confirm the previous filter/page state is restored.

**Acceptance Scenarios**:

1. **Given** a visitor filters to a category, **When** the filtered view renders, **Then** the page's address reflects that category.
2. **Given** a visitor is on page 2 or later of a filtered category, **When** the address is copied and opened fresh, **Then** the same category and page render identically.
3. **Given** a visitor switches from one category to another, **When** the new category's view renders, **Then** the page resets to page 1.
4. **Given** an address requests a page number beyond the last available page for a category, **When** that address is opened, **Then** the view clamps to the nearest valid page instead of showing an empty or broken state.
5. **Given** a visitor has moved through several filter/page changes, **When** they click the browser's back button, **Then** the previously viewed filter and page are restored.

---

### Edge Cases

- What happens when a category currently has zero portfolio pieces? The category's section is omitted from the default view, and its filter pill (if selected directly or via a shared URL) shows an empty state rather than a broken layout.
- What happens with a long portfolio title that would otherwise crowd the section's next/previous controls and position indicator? The title truncates (ellipsis) rather than wrapping or displacing the controls.
- What happens at mobile widths where the title, controls, category tag, and location can no longer fit on one row? The title moves to its own line, with the next/previous controls, position indicator, category tag, and location wrapping to a row beneath it.
- What happens if a visitor rapidly clicks a section's "next" control several times while a video is playing? Each advance stops any in-progress playback from the piece being left and resets the newly shown piece's detail-image carousel to its first image.
- What happens when a visitor tabs to a piece's detail-image controls and keeps navigating? Keyboard focus stays on the control being used and is not unexpectedly moved elsewhere by unrelated changes (such as the section carousel advancing on its own).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Gallery page MUST render a filter bar with a pill for "All" and one pill per category (Kitchen, Closet, Pantry, Office, Living space, Garage), with "All" active by default.
- **FR-002**: Selecting a category pill MUST filter the page's content to that category; selecting "All" MUST return to the default, unfiltered view.
- **FR-003**: The default (All) view MUST render exactly one section per category, in a fixed order, regardless of how many total portfolio pieces exist — the page's overall length does not grow with portfolio volume.
- **FR-004**: Each category section in the default view MUST display exactly one portfolio piece at a time, drawn from that category's first 5 pieces, with a section-level control to step through them.
- **FR-005**: The section-level control MUST show a position indicator (e.g., "2 / 5") visible as soon as the section renders, without requiring any interaction.
- **FR-006**: The section-level "previous" control MUST be disabled at the first piece and the "next" control MUST be disabled at the last piece; both controls MUST be omitted entirely for a category with only one piece.
- **FR-007**: A "View all" link MUST appear in a category section's header only when that category has more than 5 pieces total, and MUST navigate to that category's filtered view; it MUST be omitted when the category has 5 or fewer pieces.
- **FR-008**: Selecting a category (via pill or "View all" link) MUST render that category's pieces stacked vertically, in full, with no section-level next/previous controls.
- **FR-009**: When a filtered category has more than 5 pieces, the filtered view MUST paginate at 5 pieces per page, with controls to move between pages.
- **FR-010**: The active category filter and current page MUST be reflected in the page's address in a way that reproduces the same view when the address is reloaded, shared, or reached via the browser's back/forward buttons.
- **FR-011**: Switching to a different category filter MUST reset the current page back to the first page.
- **FR-012**: If an address requests a page outside the valid range for the current category, the view MUST clamp to the nearest valid page rather than showing an empty or broken state.
- **FR-013**: Every portfolio piece MUST display a before video and an after video side-by-side, a row of detail images, a title, one or more category tags, a location, and a description.
- **FR-014**: Both the before and after videos MUST render paused on a poster image until clicked; playing one MUST pause the other, so at most one plays at a time.
- **FR-015**: Each piece's detail images MUST be browsable via their own control, independent of any section-level control.
- **FR-016**: When the section-level control advances to a different piece, that piece's detail-image control MUST start at the first image, and any video left playing on the previous piece MUST stop.
- **FR-017**: Section-level and detail-level navigation controls MUST be distinguishable from one another, both visually (placement/weight) and via their accessible labeling (e.g., "Next project" vs. "Next detail image"), so a visitor always knows which browsing axis they are using.
- **FR-018**: All controls (filter pills, section and detail navigation, video playback, pagination) MUST be operable via keyboard, and advancing the section-level control MUST NOT unexpectedly move keyboard focus away from where the visitor is interacting.
- **FR-019**: A portfolio title that would otherwise crowd its section header's controls MUST be truncated rather than displacing those controls.
- **FR-020**: All CSS translated from the mockup into the project's stylesheet MUST use camelCase class names, consistent with the styling convention already used by sibling page sections.

### Key Entities

- **Portfolio Piece**: A single before/after transformation project. Has a title, one category (plus any additional tags shown), a location, a description, a before video, an after video, and a set of detail images.
- **Category**: A room/space type used both to group portfolio pieces and to power the filter bar (Kitchen, Closet, Pantry, Office, Living space, Garage).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On first load, visitors see a representative example of every category with zero clicks or filtering required.
- **SC-002**: From the default view, a visitor can browse up to 5 pieces of any single category without navigating away from the page.
- **SC-003**: The rendered Filter Bar and Projects sections visually match the provided design screenshots exactly, with no discernible differences in layout, spacing, typography, or color, at desktop, tablet, and mobile widths.
- **SC-004**: Every combination of category filter and page produces an address that reproduces the identical view when opened directly, 100% of the time.
- **SC-005**: All filter, carousel, video, and pagination controls are reachable and fully operable using only the keyboard.
- **SC-006**: Switching between a section's pieces, or between a piece's detail images, never leaves a previous piece's video audibly or visibly still playing.

## Assumptions

- The `<!-- FILTER BAR -->` and `<!-- PROJECTS -->` markup in `.specify/site-design/curated-gallery-mockup.html` is a structural starting point only; the numbered behavioral description (carousels, video, pagination, URL state) in this ticket — not the static 3-project markup — is the source of truth for what this feature must do, consistent with the ticket's own note that "the mockup is the source of truth for the design" while the provided screenshots show the carousel/video/pagination behavior the static markup doesn't yet include.
- Portfolio content for this feature is a fixed, hardcoded mock dataset shaped per the ticket's provided data shape (id, title, category, location, description, before/after media, detail images); wiring this to Sanity as an editorial content type is out of scope for this feature and will later replace only the data source, not the display components.
- Category order is fixed as: Kitchen, Closet, Pantry, Office, Living space, Garage, matching the filter pill order shown in the mockup.
- Each category's default-view section carousel is capped to that category's first 5 pieces (by id/order); any pieces beyond the first 5 are reachable only through that category's filtered/paginated view via "View all."
- Video mutual-exclusion (playing one of a piece's before/after videos pauses the other) and click-to-play-from-poster behavior are treated as already-decided requirements per the ticket's description, not open questions.
- On mobile widths, the section header wraps with the title on its own line, followed by the section's navigation controls and metadata (category tag, location) on a line beneath it — the first of the two layout options the ticket raised.
- A category with zero portfolio pieces is omitted from the default view; if reached directly by filter or URL, it shows an empty state rather than a broken or blank layout.
