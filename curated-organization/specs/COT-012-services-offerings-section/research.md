# Phase 0 Research: Services Offerings section

No `[NEEDS CLARIFICATION]` markers remained in the spec. This document records the
implementation-approach decisions made during planning for this five-item, alternating,
repeated-structure section.

## Decision: Introduce a `ServiceItem` sub-component instead of inlining five near-identical JSX blocks

**Decision**: `Service/index.tsx` stays a prop-less container (matching the `Hero`/`About`
precedent), but it defines a fixed five-entry data array and maps it to a new route-local
sub-component, `service/components/ServiceItem/ServiceItem.tsx`, paired with
`ServiceItem.types.ts` from the start.

**Rationale**: Unlike `Hero`/`About` (each a single, one-off static block), `Service` renders
the same shape five times with different content and an alternating orientation. Inlining five
near-identical JSX blocks in one file would duplicate ~30 lines of markup five times and make
the alternating-orientation rule (FR-005) easy to get wrong on a future edit. A typed
sub-component with a `reversed` boolean prop keeps each item's shape defined once. This mirrors
the existing precedent set by the home page's `Services`/`ServiceCard` pair
(`app/routes/pages/home/components/Services/`), which faces the identical problem (a
repeated-card list driven by a data array), and satisfies the constitution's current
architecture rule that every component — route-local or shared — is a folder pairing its
`.tsx` with a `.types.ts` file from the start.

**Alternatives considered**:

- *Inline all five items directly in `Service/index.tsx`* — rejected: duplicates structural
  markup five times, increases the risk of the alternating-orientation and numbered-eyebrow
  rules drifting out of sync between items on future edits, and provides no benefit over a
  typed sub-component.
- *Model each service item as a discriminated union of five hardcoded named exports (e.g.
  `<HomeOrganizingItem />`, `<LegacyTransitionsItem />`) instead of one data-driven component*
  — rejected: five near-identical named components would still duplicate the same JSX shape
  five times; a single `ServiceItem` component driven by a data array is simpler and matches
  the `ServiceCard` precedent.

## Decision: Alternating orientation is a boolean prop, not five separate CSS classes

**Decision**: `ServiceItem` accepts a `reversed: boolean` prop. When `true`, the item's root
element gets an additional `reversed` class (mirroring the mockup's own
`class="service-item reverse"` pattern) that flips the image/text column order via CSS
`order`, exactly as the mockup does. The data array simply passes `reversed={index % 2 === 1}`
(items at index 1 and 3 — i.e., the 2nd and 4th items — reversed; items at index 0, 2, 4 not).

**Rationale**: This directly translates the mockup's `.service-item.reverse` CSS rule
(`.service-item.reverse .service-img { order: 2 }` / `.service-item.reverse .service-text {
order: 1 }`) and keeps the alternation rule (spec FR-005) expressed as a single, obviously
correct piece of logic (`index % 2 === 1`) rather than five hand-set booleans that could be
transcribed incorrectly.

**Alternatives considered**:

- *Hardcode `reversed`/non-reversed per item in the data array instead of deriving it from
  index* — rejected: five manually-set booleans are exactly the kind of value that's easy to
  get wrong when a sixth item is added later or items are reordered; deriving from index
  guarantees the alternation invariant (FR-005/SC-003) always holds.

## Decision: Items 4 and 5's content is sourced from the spec's Functional Requirements, not a design screenshot

**Decision**: Items 1–3's copy, images, and structure are taken verbatim from
`.specify/site-design/curated-services-mockup.html` (source of truth, matches the provided
screenshot). Items 4 and 5 have no reference screenshot; their copy, image URLs, and list
entries are taken verbatim from spec.md FR-006/FR-007, and their markup/CSS structure reuses
the same `ServiceItem` shape as items 1–3 (numbered eyebrow, heading, description, bulleted
list, "Get started" CTA, background-image panel with overlay).

**Rationale**: The spec's Acceptance Criteria requires items 1–3 to match the design screenshot
exactly, but explicitly scopes items 4–5 to matching "the alternating pattern for this
section" rather than a screenshot (none was provided for the new items). Reusing the identical
`ServiceItem` component for all five items is the only way to guarantee items 4–5 inherit the
same visual language (typography, spacing, image treatment) as the screenshot-verified items
1–3, satisfying that requirement without a separate screenshot to check against.

**Alternatives considered**:

- *Design a bespoke layout for items 4–5 since they weren't in the original screenshot* —
  rejected: the spec explicitly asks for pattern consistency, not a new design; reusing
  `ServiceItem` is both correct per the spec and the simplest approach.

## Decision: "Get started" CTA link is included on items 4 and 5

**Decision**: Items 4 and 5 include the same "Get started" `<a>` link (styled identically,
`href="#"`) as items 1–3, since `ServiceItem` is a single shared component and the feature
description didn't call for its removal on the new items.

**Rationale**: Per spec Assumptions, no alternate CTA was specified for items 4–5, and omitting
the CTA would require `ServiceItem` to conditionally hide it — an extra prop and branch with no
stated reason. Matching items 1–3 exactly is both the simplest implementation and consistent
with the spec's "match the alternating pattern for this section" acceptance criterion, read as
covering the whole item structure, not just image/text order.

**Alternatives considered**:

- *Omit the CTA on items 4–5* — rejected: not requested, and would make `ServiceItem` a
  bespoke, conditionally-shaped component instead of a uniform one, contradicting the pattern
  the spec asks for.

## Decision: Photograph is a CSS `background-image` on a decorative container, not an `<img>`, for all five items

**Decision**: Each item's photo column is a `div` with a CSS `background-image` and a gradient
overlay `div`, matching the mockup's own technique for items 1–3, applied identically to the
new items 4–5.

**Rationale**: Consistent with the precedent already established for `About` on this same
route: each photo is decorative and full-bleed, with the item's meaning fully conveyed by the
adjacent text column (eyebrow, heading, description, list, CTA), so no `<img>`/`alt` is needed
per the constitution's Accessibility article.

**Alternatives considered**:

- *Use `<img alt="">` instead* — rejected: diverges from the mockup's own
  `background-image` + overlay technique for no benefit, and from the `About` section's
  established precedent on this route.

## Decision: Each item's heading renders as an `<h2>`

**Decision**: All five item headings ("Home organizing" through "Executive Functioning Coach")
render as `<h2>` elements, matching the mockup's own tag choice and the page's existing
heading hierarchy (`Hero` owns the page `<h1>`; `About`'s headline is also an `<h2>`).

**Rationale**: Five sequential `<h2>`s at the same outline depth is correct here — the items
are five parallel, equal-weight service offerings, not a nested hierarchy under one heading.
This matches the constitution's Accessibility article (semantic landmarks and correct heading
order) and the mockup's own markup.

**Alternatives considered**:

- *Wrap all five items under one `<h2>` "Our services" with each item title as `<h3>`* —
  rejected: not present in the mockup, and not requested by the spec; would also require an
  extra wrapping heading with no corresponding design.

## Decision: Responsive behavior mirrors the mockup's existing breakpoints, collapsing each item to a single column

**Decision**: Each item's two-column grid (image | text) collapses to a single stacked column
at ≤768px, with padding and image `min-height` scaling down further at ≤480px, reusing the
same breakpoints already established by the sibling `Hero`/`About` sections. The
image/text stacking order at narrow widths follows the same `order` values used for the
desktop reversed/non-reversed layout (i.e., no separate mobile-only reordering rule).

**Rationale**: The constitution requires new breakpoints to be added to
`app/constants/index.ts` before use; the existing 768px/480px values already cover this
section correctly (the mockup defines no different breakpoint here). Stacking single-column at
narrow widths is the mockup's own approach for items 1–3 and keeps every item's image, eyebrow,
heading, description, list, and CTA fully visible per the spec's edge cases — including items
4–5, whose longer description text and independently-sized lists (3–5 entries) must still fit
without overlap.

**Alternatives considered**:

- *Keep the two-column layout at all widths, shrinking each column* — rejected: at narrow
  viewports this would cramp both the image and the paragraph/list text, especially for items
  4–5's longer descriptions; the mockup itself switches to a single column for items 1–3.
