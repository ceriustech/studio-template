# Phase 1 Data Model: Services Hero section

No Sanity schema changes in this pass, and no runtime data entities — this section's eyebrow
label, headline, and supporting paragraph are all fixed values hardcoded in
`hero/index.tsx` (see plan.md Content Layer Decisions and research.md). There is no
per-instance configuration, no list of items expected to grow independently of a code change,
and no state that varies over the component's lifetime, so there is no entity to model.

## Fixed content (for reference, not a data entity)

| Field               | Value                                                                                                                       | Notes                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Eyebrow              | "The services"                                                                                                              | Rendered uppercase via CSS `text-transform`, not hardcoded uppercase in copy. |
| Headline (`<h1>`)    | "Bespoke solutions, gracefully executed"                                                                                    | Serif, centered, wraps to two lines at the design's default width. |
| Supporting paragraph | "Our all-inclusive organizing services are tailored to your lifestyle, your space, and your goals. Every project begins with listening." | Sans, centered, max-width constrained per the mockup.       |

## Future migration note

If this copy is later moved into Sanity as page-level editorial content, `hero/index.tsx`
would accept these values as props (typed from `sanity.types.ts`) sourced from a `servicesPage`
document query, rather than reading module-level constants. No other part of the component
(layout, CSS, decorative shapes) would need to change.
