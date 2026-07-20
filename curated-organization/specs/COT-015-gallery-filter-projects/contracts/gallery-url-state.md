# Contract: Gallery page URL state

The Gallery page's filter and pagination state is expressed entirely through its own URL query
string (`/gallery`). This is the interface other parts of the site (e.g. a future "View all
{category} projects" link, marketing links, or a visitor's bookmark/shared link) rely on — it
must stay stable and shareable per spec FR-010–FR-012.

## Query parameters

| Param      | Type                                                                      | Required | Default | Effect                                                                                       |
| ------------ | ---------------------------------------------------------------------------- | ---------- | --------- | ------------------------------------------------------------------------------------------------ |
| `category` | one of `kitchen`, `closet`, `pantry`, `office`, `living-space`, `garage`   | No       | absent (default/"All" view) | Selects a single category's filtered, paginated view. Any other value is treated as absent (falls back to the default view). |
| `page`     | positive integer (`1`, `2`, `3`, …)                                        | No       | `1`     | Selects which 5-piece page of the filtered category to show. Ignored when `category` is absent. |

## States

| URL                                  | Rendered view                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| `/gallery`                           | Default view: one `CategorySection` per category, each with its own section carousel. |
| `/gallery?category=kitchen`          | Filtered view: Kitchen category, page 1.                                          |
| `/gallery?category=kitchen&page=2`   | Filtered view: Kitchen category, page 2.                                          |
| `/gallery?category=kitchen&page=999` | Filtered view: Kitchen category, clamped to the last valid page (FR-012).         |
| `/gallery?category=not-a-real-value` | Treated as `/gallery` (default view) — invalid category values do not error.      |

## Transitions

- Selecting a category pill (from either the default or a different filtered view) navigates to
  `/gallery?category=<value>` — `page` is omitted/reset to `1` (FR-011).
- Clicking a `CategorySection`'s "View all" link navigates to `/gallery?category=<that category>`
  (equivalent to clicking that category's filter pill, per spec FR-007).
- Clicking a filtered view's "next page" / "previous page" control updates only `page`, leaving
  `category` unchanged.
- Selecting the "All" pill navigates back to `/gallery` (both params cleared).

## Guarantees

- Every state above is reachable by a direct navigation (fresh load, shared link, or browser
  back/forward) and renders identically to reaching it by clicking through the UI (FR-010).
- The contract never produces an empty or broken render for an out-of-range `page` or an
  unrecognized `category` — both degrade to a valid, defined state (FR-012 and the "invalid
  category" row above).
