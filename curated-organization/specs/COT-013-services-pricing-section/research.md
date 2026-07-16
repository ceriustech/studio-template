# Phase 0 Research: Services Pricing section

No `[NEEDS CLARIFICATION]` markers remained in the spec (all resolved in the `/speckit.clarify`
session recorded in spec.md's `## Clarifications`). This document records the
implementation-approach decisions made during planning for this three-card, mixed-content-shape
section.

## Decision: Introduce a `PricingCard` sub-component instead of inlining three divergent JSX blocks

**Decision**: `Pricing/index.tsx` stays a prop-less container (matching the `Hero`/`About`/`Service`
precedent), but it defines the section header/tagline plus a fixed three-entry data array and
maps it to a new route-local sub-component, `pricing/components/PricingCard/PricingCard.tsx`,
paired with `PricingCard.types.ts` from the start.

**Rationale**: The three cards share one visual shape (border, padding, eyebrow, title, divider,
CTA) but two content bodies — the two organizer cards show a rate line plus a prose description,
while the fees card shows a checkmark list with no rate and no CTA. A single typed component with
optional `price`/`description` vs. `features` props expresses this once, rather than duplicating
the card chrome (border, divider, featured-state styling) three times inline. This mirrors the
precedent set by `Service`/`ServiceItem` on the same route (a repeated shape driven by a data
array) and satisfies the constitution's architecture rule that every component — route-local or
shared — is a folder pairing its `.tsx` with a `.types.ts` file from the start.

**Alternatives considered**:

- *Inline all three cards directly in `Pricing/index.tsx`* — rejected: duplicates the card
  chrome (border, padding, divider, featured-state class) three times, and makes it easy for the
  featured styling or CTA presence to drift out of sync between cards on a future copy edit.
- *Two separate components — `OrganizerCard` and `FeesCard`* — rejected: the two would share
  nearly all of their CSS (border, padding, eyebrow, title, divider) and differ only in whether
  they render a price+description or a feature list; one component with optional props avoids
  duplicating that shared chrome across two files for no benefit.

## Decision: `PricingCard` takes a discriminated content shape via optional props, not a `variant` enum

**Decision**: `PricingCard.types.ts` defines one prop shape with `price?: string`,
`description?: string`, `features?: string[]`, and `ctaLabel?: string` all optional; the component
renders the description block when `description` is present and the feature list when `features`
is present (mutually exclusive in practice per the three fixed data entries), and renders the CTA
only when `ctaLabel` is provided.

**Rationale**: There are exactly three fixed card instances, not an open-ended set of card
"types" that would justify a discriminated union (`{ kind: 'rate' } | { kind: 'fees' }`). Optional
props keep the component simple and match the lightweight-prop-object style already used by
`ServiceItem`. The fees card's absence of a CTA (per spec Assumptions) falls out naturally from
`ctaLabel` being omitted rather than requiring a separate boolean.

**Alternatives considered**:

- *Discriminated union prop type (`variant: 'rate' | 'fees'`)* — rejected: adds a layer of
  type-narrowing ceremony for a fixed, small (n=3) data set where optional fields already convey
  intent clearly and match the codebase's existing prop-shape style.

## Decision: Featured styling moves to card 1 (Lead Organizer), reusing the mockup's existing `.featured` CSS technique

**Decision**: `PricingCard` accepts a `featured?: boolean` prop. When `true`, the card's root
element gets an additional `featured` class that applies the mockup's existing `.pricing-card.featured`
treatment (teal border, tinted background, top accent bar, filled CTA) — translated to camelCase
(`pricingCardFeatured` or an appended `featured` class per the codebase's `reversed`-class
precedent in `ServiceItem`). Only the Lead Organizer card sets `featured`, per the spec's
Clarifications (this session moved the featured treatment off the middle card and onto card 1).

**Rationale**: Directly reuses the mockup's proven CSS technique (`.pricing-card.featured` and its
descendant overrides for eyebrow/CTA color) rather than inventing a new visual treatment, while
honoring the clarified requirement that Lead Organizer — not the middle card — carries the
contrasting styling.

**Alternatives considered**:

- *Keep the featured class on the middle grid position regardless of content* — rejected: the
  clarification session explicitly resolved this in favor of content-driven (Lead Organizer),
  not position-driven, featured styling.

## Decision: Fee notes render as the mockup's existing checkmark-list style; organizer descriptions render as plain prose, not a reformatted list

**Decision**: The `features` list (fees card only) reuses the mockup's `.pricing-card-features` /
`.pricing-check` checkmark-list markup and styling, translated to camelCase. The two organizer
cards' `description` renders as a single `<p>` of prose text — the exact sentence supplied in the
spec — with no bullet decomposition.

**Rationale**: Per spec Assumptions, the organizer role descriptions were written and specified as
single prose sentences, not short feature phrases; reformatting them into bullets would introduce
wording not verbatim-verifiable against the spec's Success Criteria (SC-002: "match the specified
copy exactly"). The fee notes, by contrast, are naturally three short discrete items and map
cleanly onto the mockup's existing list style, which is already built for short check-marked
lines.

**Alternatives considered**:

- *Split each organizer description into short bullet phrases to visually match the fees card* —
  rejected: not requested, and would require inventing wording/segmentation not present in the
  spec, risking a mismatch with SC-002's exact-copy requirement.

## Decision: Card titles render as `<h3>`, nested under the section's `<h2>`

**Decision**: The section heading ("Transparent pricing") remains an `<h2>` (unchanged, matching
`About`'s and `Hero`'s heading-level precedent on this route). Each card's title ("Lead
Organizer", "Associate Organizer", "Fees") renders as an `<h3>`, one level below the section
heading — a change from the mockup's own markup, which uses a non-semantic `<div class="pricing-card-name">`.

**Rationale**: Unlike `Service`'s five parallel, equal-weight `<h2>` items (which have no
enclosing section heading of their own), the Pricing section already has one `<h2>` ("Transparent
pricing") that the three cards logically nest under, so `<h3>` is the correct heading depth per
the constitution's Accessibility article (semantic landmarks and correct heading order). The
mockup's `<div>` was not accessibility-reviewed markup and is not treated as authoritative for
semantic structure, only for visual styling (font, size, color, spacing).

**Alternatives considered**:

- *Match the mockup exactly and use a `<div>` for card titles* — rejected: skips a semantic
  heading for what is, in every card, the primary label a screen-reader user would want to
  navigate to; the constitution's Accessibility article takes precedence over matching
  non-semantic mockup markup verbatim.

## Decision: Responsive behavior mirrors the mockup's existing grid, collapsing to a single column

**Decision**: The `.pricingGrid` three-column grid collapses to a single stacked column at
≤768px, reusing the same breakpoints already established by the sibling `Hero`/`About`/`Service`
sections. Cards remain equal-width within the grid; unequal content length (two prose
descriptions vs. one short list) is accommodated by each card's height growing to fit its own
content rather than a fixed card height.

**Rationale**: The constitution requires new breakpoints to be added to `app/constants/index.ts`
before use; the existing 768px value already covers this section correctly (the mockup defines no
different breakpoint here). Letting each card's height grow naturally (rather than forcing a fixed
height) avoids clipping the longer organizer descriptions while keeping the fees card's shorter
content from stretching awkwardly.

**Alternatives considered**:

- *Force all three cards to a fixed equal height* — rejected: would either clip the longer
  organizer descriptions or leave excessive empty space in the shorter fees card; the mockup
  itself does not fix card height, letting `align-items: start` (grid default) and each card's own
  padding determine height.
