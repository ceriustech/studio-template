# Phase 0 Research: Services Hero section

No `[NEEDS CLARIFICATION]` markers remained in the spec. This document records the
implementation-approach decisions made during planning for this small, static section.

## Decision: Reuse the existing prop-less `hero` component shape rather than the paired `Name.tsx`/`Name.types.ts` convention

**Decision**: The `Hero` component (`app/routes/pages/services/components/hero/index.tsx`)
stays a lowercase-folder, `index.tsx`-only component with no `.types.ts` file, mirroring the
already-merged home-page `hero` component exactly.

**Rationale**: Both hero components are the same shape of problem — a single, static,
prop-less section with fixed copy and no per-consumer variation. The home-page `hero` already
establishes this precedent in the merged codebase; introducing a different shape (PascalCase
folder + paired types file, as `Footer`/`Intro`/`Testimonial` use) for this component alone
would create two competing conventions for the identical case with no behavioral difference to
justify it.

**Alternatives considered**:

- *Rename to `Hero/Hero.tsx` + `Hero.types.ts` per the general component convention* —
  rejected: there are no props to type (static content only), and doing so would diverge from
  the direct precedent already set by home's `hero`, for no functional benefit.

## Decision: Static, no interactive state

**Decision**: The `Hero` component takes no props and owns no state — it renders the eyebrow,
headline, and paragraph exactly as shown in the mockup, with no conditional branches.

**Rationale**: The spec and mockup both describe a single fixed resting state with fixed copy.
There is no multiplicity or variation to manage — introducing props or state would add a layer,
not a benefit.

**Alternatives considered**:

- *Accept eyebrow/headline/paragraph as props for future reuse* — rejected: there is exactly
  one consumer (`services`) and one instance of this section; adding a props surface for
  content that isn't expected to vary would be speculative generality with nothing to validate
  it against.

## Decision: Decorative circles are CSS-only and hidden from the accessibility tree

**Decision**: The two large circular shapes are implemented as `::before`/`::after`
pseudo-elements (matching the mockup's own approach) with `aria-hidden` semantics implied by
using non-content pseudo-elements — no `<img>`, no extra DOM nodes exposed to assistive tech.

**Rationale**: The circles are purely decorative background flourishes with no informational
content; pseudo-elements are the standard way to draw decoration without polluting the
accessibility tree or adding image assets, consistent with the constitution's Accessibility
article and the Media article's scope (this isn't an image/video asset).

**Alternatives considered**:

- *Render the circles as `<div>` elements with `aria-hidden="true"`* — rejected: functionally
  equivalent but adds two extra DOM nodes for a purely visual effect the mockup itself achieves
  with `::before`/`::after`; matching the mockup's own technique keeps the translation faithful
  with less markup.

## Decision: Headline renders as the page's `<h1>`

**Decision**: The headline ("Bespoke solutions, gracefully executed") renders as an `<h1>`,
since the Hero is the first section on the Services page and the mockup itself uses `<h1>`
for it.

**Rationale**: The constitution's Accessibility article calls for semantic page structure;
using `<h1>` for the primary heading of the page (rather than a generic `<div>` or `<p>`) gives
screen-reader users and search engines the correct document outline, and matches the mockup's
own tag choice exactly.

**Alternatives considered**:

- *Use a styled `<p>` or `<div>` instead* — rejected: the mockup already uses `<h1>`, and
  deviating would both break semantics and require extra, unjustified CSS to match the
  mockup's rendered appearance.

## Decision: Responsive behavior mirrors the mockup's existing breakpoints

**Decision**: Padding and font sizes scale down at ≤768px and ≤480px, reusing the exact
breakpoints (768px, 480px) already established by sibling sections (`Intro`, `Footer`,
`Testimonial`).

**Rationale**: The constitution requires new breakpoints to be added to
`app/constants/index.ts` before use; since the existing 768px/480px values already cover this
section correctly (the mockup itself defines no different breakpoint for the hero), no new
breakpoint is needed.

**Alternatives considered**:

- *Introduce a hero-specific breakpoint* — rejected: unnecessary: the section's layout (a
  single centered text column) degrades gracefully with the same breakpoints already used
  elsewhere on the site.
