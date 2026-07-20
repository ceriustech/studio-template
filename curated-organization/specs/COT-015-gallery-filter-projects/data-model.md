# Phase 1 Data Model: Gallery Filter Bar and Projects section

No Sanity schema changes in this pass. All entities below are TypeScript types defined once in
`app/routes/pages/gallery/gallery.types.ts` and a hardcoded mock array in
`app/routes/pages/gallery/utils.ts` (see plan.md Content Layer Decisions and research.md).

## `Category`

A fixed union of the six room/space types used both to group portfolio pieces and to power the
filter bar.

```text
Category = 'kitchen' | 'closet' | 'pantry' | 'office' | 'living-space' | 'garage'
```

| Value          | Filter pill label | Notes                                                             |
| --------------- | ------------------- | ------------------------------------------------------------------- |
| `kitchen`      | Kitchen            |                                                                    |
| `closet`       | Closet             |                                                                    |
| `pantry`       | Pantry             |                                                                    |
| `office`       | Office             |                                                                    |
| `living-space` | Living space       |                                                                    |
| `garage`       | Garage             |                                                                    |

Section order in the default (All) view follows this table's order, matching the filter pill
order in the mockup (spec Assumptions).

## `MediaSource`

A single playable video with its poster and accessible label.

| Field    | Type     | Notes                                                                 |
| --------- | -------- | ------------------------------------------------------------------------ |
| `src`    | `string` | Video file URL. Mock/placeholder for this pass (see plan.md Complexity Tracking). |
| `poster` | `string` | Poster image URL shown before playback begins.                        |
| `alt`    | `string` | Accessible label describing this specific video (e.g. "Master closet transformation — before"). |

## `DetailImage`

One image in a portfolio piece's detail-image row/carousel.

| Field  | Type     | Notes                          |
| ------- | -------- | --------------------------------- |
| `src`  | `string` | Image URL.                      |
| `alt`  | `string` | Accessible description of the image. |

## `PortfolioPiece`

A single before/after transformation project — the core entity this feature displays and
filters.

| Field           | Type              | Notes                                                                                          |
| ---------------- | ------------------ | -------------------------------------------------------------------------------------------------- |
| `id`            | `string`          | Stable identifier; determines default section-carousel order ("indexed by ID" per spec).       |
| `title`         | `string`          | Rendered as the piece's heading; truncates with ellipsis if it would crowd section controls (FR-019). |
| `category`      | `Category`        | The single primary category used for filtering and section grouping (see note below).          |
| `location`      | `string`          | e.g. "Arlington, VA".                                                                          |
| `description`   | `string`          | Prose description; also satisfies the video's accessibility exception (research.md).           |
| `beforeMedia`   | `MediaSource`     | The "before" video.                                                                             |
| `afterMedia`    | `MediaSource`     | The "after" video.                                                                              |
| `detailImages`  | `DetailImage[]`   | Browsable via the piece's own detail-image carousel (FR-015); non-empty for every piece in the mock dataset. |

**Validation rules** (enforced by construction of the mock dataset, not runtime validation,
since there is no user input creating these records in this pass):

- `title`, `location`, `description` are non-empty strings.
- `category` is one of the six `Category` values.
- `detailImages` contains at least one entry (a piece with zero detail images isn't
  represented in this pass's mock dataset).

**Note on multiple category tags**: the static mockup markup shows one example project
("Kitchen + pantry overhaul") with two `.project-tag` badges. The ticket's own provided type
shape models only a single `category: Category` field per piece, which this data model follows
exactly — each mock piece belongs to exactly one category for filtering/section-grouping
purposes. Displaying more than one cosmetic tag per piece is out of scope for this pass.

## Derived/computed (not stored)

- **Section pieces for a category** — a category's pieces, in `id` order, capped to the first 5,
  used by `CategorySection`'s carousel (FR-004).
- **"Has more than 5" for `View all`** — whether a category's total piece count exceeds 5,
  controlling `View all` visibility (FR-007).
- **Filtered page slice** — a category's full piece list, sliced 5-at-a-time by the current page
  (FR-009), with the page number clamped to `[1, ceil(total / 5)]` (FR-012).

## URL state (transient, not a stored entity)

| Query param | Values                                  | Default        | Notes                                                                 |
| ------------- | ------------------------------------------ | ---------------- | ------------------------------------------------------------------------ |
| `category`  | one of the six `Category` values, or absent | absent (= "All") | Changing this resets `page` to `1` (FR-011).                          |
| `page`      | positive integer, or absent                | `1`              | Only meaningful when `category` is set; clamped to the valid range (FR-012). |

See [contracts/gallery-url-state.md](./contracts/gallery-url-state.md) for the full contract.
