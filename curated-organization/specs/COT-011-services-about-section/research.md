# Phase 0 Research: Services About section

No `[NEEDS CLARIFICATION]` markers remained in the spec. This document records the
implementation-approach decisions made during planning for this small, static section.

## Decision: Reuse the existing prop-less `about` component shape rather than the paired `Name.tsx`/`Name.types.ts` convention

**Decision**: The `About` component (`app/routes/pages/services/components/about/index.tsx`)
stays a lowercase-folder, `index.tsx`-only component with no `.types.ts` file, mirroring the
sibling `Hero` component on this same route exactly.

**Rationale**: Both components are the same shape of problem — a single, static, prop-less
section with fixed copy and no per-consumer variation. The sibling `Hero` component already
establishes this precedent on the `services` route; introducing a different shape (PascalCase
folder + paired types file, as `Footer`/`Intro`/`Testimonial` use) for this component alone
would create two competing conventions for the identical case with no behavioral difference to
justify it.

**Alternatives considered**:

- *Rename to `About/About.tsx` + `About.types.ts` per the general component convention* —
  rejected: there are no props to type (static content only), and doing so would diverge from
  the direct precedent already set by the sibling `Hero`, for no functional benefit.

## Decision: Static, no interactive state

**Decision**: The `About` component takes no props and owns no state — it renders the
photograph, eyebrow, headline, paragraph, and signature exactly as shown in the mockup, with no
conditional branches.

**Rationale**: The spec and mockup both describe a single fixed resting state with fixed copy
and a fixed image. There is no multiplicity or variation to manage — introducing props or state
would add a layer, not a benefit.

**Alternatives considered**:

- *Accept eyebrow/headline/paragraph/photo as props for future reuse* — rejected: there is
  exactly one consumer (`services`) and one instance of this section; adding a props surface for
  content that isn't expected to vary would be speculative generality with nothing to validate
  it against.

## Decision: Photograph is a CSS `background-image` on a decorative container, not an `<img>`

**Decision**: The photo column is implemented as a `div` with a CSS `background-image` and a
gradient overlay `div`, matching the mockup's own approach exactly, rather than an `<img>` tag.

**Rationale**: The photograph is presented as a full-bleed decorative panel (with a gradient
overlay layered on top) rather than inline content-carrying imagery, and the section's meaning
is already fully conveyed by the adjacent text column (eyebrow, headline, paragraph,
signature). Matching the mockup's own technique keeps the translation faithful and sidesteps
the need for `alt` text on an image that adds no information beyond what the text already
states, consistent with the constitution's Accessibility article (decorative images use
`alt=""` or are excluded from the accessibility tree entirely).

**Alternatives considered**:

- *Use an `<img>` with `alt=""`* — rejected: functionally equivalent for accessibility, but
  diverges from the mockup's own `background-image` + overlay technique for no benefit, and
  loses the simple gradient-overlay layering the mockup uses.

## Decision: Headline renders as an `<h2>`

**Decision**: The headline ("Where order meets elegance") renders as an `<h2>`, since the
Hero section already owns the page's `<h1>` and the mockup itself uses `<h2>` for this
section's headline.

**Rationale**: The constitution's Accessibility article calls for semantic page structure with
a correct heading hierarchy; using `<h2>` here (rather than a generic `<div>` or `<p>`) keeps
the document outline correct — one `<h1>` per page — and matches the mockup's own tag choice
exactly.

**Alternatives considered**:

- *Use a styled `<p>` or `<div>` instead* — rejected: the mockup already uses `<h2>`, and
  deviating would both break semantics and require extra, unjustified CSS to match the
  mockup's rendered appearance.

## Decision: Responsive behavior mirrors the mockup's existing breakpoints, collapsing to a single column

**Decision**: The two-column grid (photo | text) collapses to a single stacked column at
≤768px, with padding and photo height scaling down further at ≤480px, reusing the same
breakpoints already established by the sibling `Hero` section.

**Rationale**: The constitution requires new breakpoints to be added to
`app/constants/index.ts` before use; since the existing 768px/480px values already cover this
section correctly (the mockup itself defines no different breakpoint for this section), no new
breakpoint is needed. Stacking the columns at tablet/mobile widths is the mockup's own approach
and keeps both the photo and text fully visible and readable per the spec's edge cases.

**Alternatives considered**:

- *Keep the two-column layout at all widths, shrinking each column* — rejected: at narrow
  viewports this would cramp both the photo and the paragraph text, which the spec's edge cases
  explicitly call out as unacceptable; the mockup itself switches to a single column.
