# Phase 0 Research: Footer section

No `[NEEDS CLARIFICATION]` markers remained in the spec. This document records the
implementation-approach decisions made during planning for this small, static section.

## Decision: Static, no interactive state

**Decision**: The `Footer` component takes no props (or an empty props type) and owns no
state — it renders the brand block, three link columns, divider, and bottom bar exactly as
shown in the mockup, with no conditional branches.

**Rationale**: The spec and mockup both describe a single fixed resting state with fixed
column content. Unlike `Testimonial` (which needed a carousel hook), there's no multiplicity
or variation to manage here — introducing state or props would add a layer, not a benefit.

**Alternatives considered**:

- *Accept columns/links as props or a config array for future reuse* — rejected: there is
  exactly one consumer (`home`) and one instance of this section; adding a props surface
  for content that isn't expected to vary would be speculative generality with nothing to
  validate it against.

## Decision: Internal links use existing route constants; unbuilt destinations use a placeholder

**Decision**: The "Services," "Gallery," and "Book" links under "Navigate" use React Router
`Link` pointing to `PAGE_ROUTES_DATA.SERVICES.path`, `PAGE_ROUTES_DATA.GALLERY.path`, and
`PAGE_ROUTES_DATA.BOOKING.path` respectively, imported from `app/routes/constants/index.ts`.
The "About" link has no corresponding route in `PAGE_ROUTES_DATA` today, so it renders as a
plain anchor to `#` (a placeholder), matching the mockup's own `href="#"` treatment of every
footer link. "Email," "Phone," and "Instagram" (under Connect) and "Instagram"/"Facebook"
(bottom bar social links) similarly render as plain `#` anchors, since they are external
contact/social destinations with no existing constant in this codebase.

**Rationale**: The project already centralizes internal route paths in `PAGE_ROUTES_DATA`;
reusing it for the three routes that exist keeps those links from drifting out of sync. There
is no `/about` route, and no existing constant for email/phone/social URLs, so a placeholder
`#` anchor is the smallest faithful translation of the mockup (which itself uses `href="#"`
for every footer link) without inventing new routes or contact infrastructure, consistent with
the spec's Assumptions.

**Alternatives considered**:

- *Create a new `/about` route now* — rejected: out of scope for this section; the spec
  explicitly treats new destinations as a reasonable placeholder rather than new
  infrastructure to build.
- *Hardcode `mailto:`/`tel:` links with invented contact details* — rejected: no real email
  address or phone number was provided; inventing one risks shipping incorrect contact info.

## Decision: Footer uses a semantic `<footer>` landmark with heading elements for columns

**Decision**: The section root renders as a native `<footer>` element (matching the mockup's
own `<footer class="footer">`), and each column heading ("Navigate," "Connect," "Hours")
renders as a heading-level element (e.g., `<h3>`) rather than a plain `<div>`, to give screen
reader users a navigable structure.

**Rationale**: The constitution's Accessibility article calls for semantic landmarks; a
`<footer>` landmark and heading elements for each link group are a low-cost, standard
improvement over the mockup's presentational `<div>` (which is not itself a normative source
for semantics — only for visual structure and copy).

**Alternatives considered**:

- *Match the mockup's plain `<div class="footer-heading">` exactly* — rejected: the mockup is
  a static visual reference; using a heading element instead preserves the identical visual
  styling (via the same class) while improving screen-reader navigation, with no visual cost.

## Decision: Column grid and bottom-bar responsive behavior mirrors the mockup's existing breakpoints

**Decision**: The four-column grid (`grid-template-columns: 2fr 1fr 1fr 1fr`) reflows to two
columns at ≤768px and one column at ≤480px; the bottom bar switches from `justify-content:
space-between` to a centered, vertically-stacked column at ≤480px — reusing the exact
breakpoints (768px, 480px) already established by sibling sections (`Testimonial`, `Cta`,
`Process`).

**Rationale**: The mockup itself defines these exact rules under its tablet/mobile media
queries; reusing the same breakpoints keeps the Footer consistent with every other section on
the page rather than introducing a new breakpoint value.

**Alternatives considered**:

- *Introduce a new breakpoint specific to the footer* — rejected: the constitution requires
  new breakpoints to be added to `app/constants/index.ts` before use; since the mockup's
  existing 768px/480px values already cover this section correctly, no new breakpoint is
  needed.
