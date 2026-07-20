# Phase 1 Data Model: Gallery Hero section

No Sanity schema changes in this pass, and no runtime data entities — this section's eyebrow
label, headline, and supporting paragraph are all fixed values hardcoded in
`hero/index.tsx` (see plan.md Content Layer Decisions and research.md). There is no
per-instance configuration, no list of items expected to grow independently of a code change,
and no state that varies over the component's lifetime, so there is no entity to model.

## Fixed content (for reference, not a data entity)

| Field               | Value                                                                                  | Notes                                                        |
| -------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Eyebrow              | "The transformations"                                                                  | Rendered uppercase via CSS `text-transform`, not hardcoded uppercase in copy. |
| Headline (`<h1>`)    | "See the difference"                                                                    | Serif, centered, single line at the design's default width.  |
| Supporting paragraph | "Real spaces, real results. Every project starts with chaos and ends with calm."       | Sans, centered, max-width constrained per the mockup, wraps to two lines. |

## Future migration note

If this copy is later moved into Sanity as page-level editorial content, `hero/index.tsx`
would accept these values as props (typed from `sanity.types.ts`) sourced from a `galleryPage`
document query, rather than reading module-level constants. No other part of the component
(layout, CSS, decorative shapes) would need to change.
