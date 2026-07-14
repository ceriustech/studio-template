# Phase 1 Data Model: Call To Action section

No Sanity schema changes in this pass, and no runtime data entities — this section's
heading, subtext, button label, and destination link are all fixed values hardcoded in
`Cta.tsx` (see plan.md Content Layer Decisions and research.md). There is no per-instance
configuration, no list of items, and no state that varies over the component's lifetime, so
there is no entity to model.

## Fixed content (for reference, not a data entity)

| Field           | Value                                                     | Notes                                                                 |
| --------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| Heading         | "Ready to transform your space?"                          | Rendered as the section's `h2`/`section-heading`-equivalent element. |
| Subtext         | "Your complimentary 30-minute consultation starts here"    | Supporting line beneath the heading.                                  |
| Button label    | "Book a consultation"                                      | Rendered uppercase via CSS, matching the mockup's `.cta-btn` styling. |
| Button destination | `PAGE_ROUTES_DATA.BOOKING.path` (`/booking`)             | Existing route; imported, not duplicated as a string literal.        |
| Background image | Same image reference used in the mockup's `.cta-bg` rule | Static asset; not user- or editor-configurable in this pass.         |

## Future migration note

If this copy is later moved into Sanity as page-level editorial content, `Cta.tsx` would
accept these five values as props (typed from `sanity.types.ts`) sourced from the `home`
route's loader via a new GROQ query, rather than reading module-level constants. No other
part of the component (layout, CSS, button behavior) would need to change.
