# Phase 1 Data Model: Footer section

No Sanity schema changes in this pass, and no runtime data entities — this section's brand
copy, column headings, link labels, hours text, and copyright notice are all fixed values
hardcoded in `Footer.tsx` (see plan.md Content Layer Decisions and research.md). There is no
per-instance configuration, no list of items expected to grow independently of a code change,
and no state that varies over the component's lifetime, so there is no entity to model.

## Fixed content (for reference, not a data entity)

| Field                    | Value                                                                                  | Notes                                                              |
| ------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Brand name                | "CURATED"                                                                                  | Rendered in serif, letter-spaced styling.                          |
| Brand description          | "Professional organizing for the discerning home. Serving the NOVA / DMV area."           | Two-line description beneath the brand name.                      |
| Navigate links             | About (`#`), Services (`/services`), Gallery (`/gallery`), Book (`/booking`)               | Services/Gallery/Book use `PAGE_ROUTES_DATA`; About is a placeholder `#`. |
| Connect links              | Email (`#`), Phone (`#`), Instagram (`#`)                                                 | Placeholder destinations — no existing contact constants.         |
| Hours items                | "Mon – Fri: 9am – 5pm", "Sat: By appointment", "Sun: Closed"                              | Rendered as anchors (`#`) matching the mockup's markup, consistent with FR-004; not meaningful navigation destinations. |
| Copyright notice           | "© 2026 Curated Organization. All rights reserved."                                       | Static text, not dynamically computed.                            |
| Social links (bottom bar)  | Instagram (`#`), Facebook (`#`)                                                            | Placeholder destinations.                                          |

## Future migration note

If this copy (brand description, hours, contact destinations) is later moved into Sanity as
site-wide editorial content, `Footer.tsx` would accept these values as props (typed from
`sanity.types.ts`) sourced from a shared site-settings query, rather than reading module-level
constants. No other part of the component (layout, CSS, link behavior) would need to change.
