# Phase 0 Research: Two Paths section

No `[NEEDS CLARIFICATION]` markers remain in the Technical Context — this feature is a close
structural repeat of already-shipped sections (Booking Hero, Services Pricing cards), so
research consisted of confirming those precedents rather than open-ended investigation.

## Decision: Correct source mockup file

- **Decision**: Use the `<!-- TWO PATHS -->` block in `.specify/site-design/curated-book-mockup.html`
  (lines 1048–1070, with its styles at lines 205–293) as the sole source of truth, not
  `curated-gallery-mockup.html` as literally named in the raw ticket text.
- **Rationale**: `curated-gallery-mockup.html` has no `TWO PATHS` comment or `.paths`/`.path-card`
  styling anywhere in the file; `curated-book-mockup.html` — the Booking page's own mockup —
  has both, immediately following its `<!-- HERO -->` section. This is also the file the
  already-shipped Booking Hero feature (COT-016) used.
- **Alternatives considered**: None — this is a factual correction, not a design choice.

## Decision: Component placement

- **Decision**: `app/routes/pages/booking/components/two-paths/index.tsx` + `two-paths.css`, no
  `.types.ts` on the section itself; composing a new `PathCard` sub-component at
  `two-paths/components/PathCard/` with `PathCard.tsx` + `PathCard.types.ts` (always paired).
- **Rationale**: The closest placement precedent is `booking/components/hero/`, which lives
  inside the route's `components/` folder as a flat, prop-less section — the Two Paths section
  follows the same shape since it also has zero external configuration. Within it, the two
  cards differ only in data (icon, title, description, CTA label/href, button variant), which
  is exactly the shape the `PricingCard` (`services/components/pricing/components/PricingCard/`)
  and `ServiceItem` (`services/components/service/components/ServiceItem/`) sub-components
  already solve in this codebase: a route-local, data-driven card rendered from a local array,
  always paired with its own `.types.ts` since it takes props.
- **Alternatives considered**: Inlining both cards directly in `two-paths/index.tsx` with no
  sub-component. Rejected — the two cards share identical structure and differ only in content
  and button variant, which is exactly the case the `PricingCard`/`ServiceItem` precedent
  establishes a reusable sub-component for; duplicating the markup twice inline would diverge
  from that established pattern for no benefit.

## Decision: Styling approach

- **Decision**: Plain `.css` files imported directly into each component
  (`import './two-paths.css'`, `import './pathCard.css'`), camelCase class names (e.g.
  `.twoPaths`, `.pathCard`, `.pathIcon`, `.pathTitle`, `.pathDesc`, `.pathBtn`,
  `.pathBtnPrimary`, `.pathBtnSecondary`), mirroring `booking/components/hero/hero.css` and
  `services/components/pricing/components/PricingCard/pricingCard.css`.
- **Rationale**: This is the established pattern for every prior page-section port from the
  static mockups in this repo — not Tailwind utility classes, despite Tailwind being listed as
  the project's general styling tool. Following the sibling sections exactly is required by
  spec FR-008 (camelCase) and SC-001 (must match the screenshot exactly, which those sibling
  implementations already do for their own mockups).
- **Alternatives considered**: Tailwind utility classes. Rejected — would diverge from every
  other ported mockup section in the codebase and offers no benefit here.

## Decision: Design tokens

- **Decision**: Reuse existing global custom properties already declared in `app/app.css`:
  `--warm-white`, `--warm-bg`, `--cream`, `--charcoal`, `--charcoal-soft`, `--taupe`,
  `--taupe-dark`, `--muted`, `--border`, `--serif`, `--sans`. No new tokens are introduced.
- **Rationale**: These tokens already back the Booking Hero and Services Pricing sections and
  are confirmed present in `app/app.css`. The `.paths`/`.path-card` mockup rules use the same
  token names.
- **Alternatives considered**: N/A — introducing new tokens would violate the "reuse existing
  global styles" assumption in spec.md and isn't needed since the values already exist.

## Decision: Responsive breakpoints

- **Decision**: `@media (max-width: 768px)` override that collapses the `1fr 1fr` grid to a
  single column (stacked cards), matching `BREAKPOINTS.tablet` (768px) in
  `app/constants/index.ts` and the same breakpoint value already used by
  `booking/components/hero/hero.css` and `services/components/pricing/pricing.css`.
- **Rationale**: Consistency with sibling sections takes priority over introducing a new
  breakpoint value. The mockup's `.paths` grid has no explicit responsive rule of its own, so
  the standard tablet stacking pattern already used for every other two/three-column grid in
  this codebase (e.g. `.pricingGrid`) is the correct default, per spec Edge Cases.
- **Alternatives considered**: Importing `BREAKPOINTS`/`QUERIES` from `app/constants/index.ts`
  directly into the CSS file. Not possible — plain `.css` files cannot import TS constants;
  every sibling section hardcodes the pixel value in its `.css` file for the same reason.

## Decision: CTA link targets

- **Decision**: Render the CTA buttons as real anchor (`<a>`) elements with `href="#questionnaire"`
  and `href="#calendly"`, exactly as in the mockup, even though the `Questionnaire` and
  `Calendly` sections they target are not yet implemented (separate, later tickets per the
  Booking mockup's remaining sections).
- **Rationale**: Spec FR-002/FR-003 and SC-003 require the links to target those in-page
  sections by anchor; using real anchor tags (not buttons or placeholder `#`) keeps the links
  keyboard-accessible per the Edge Cases focus-state requirement and means no rework is needed
  once the target sections ship.
- **Alternatives considered**: Placeholder `href="#"` until the target sections exist. Rejected
  — the spec's anchor ids are already fixed by the mockup and by FR-002/FR-003; using the real
  ids now avoids a follow-up edit later.

## Decision: Copy source of truth

- **Decision**: Icon glyphs ("+", "↻"), titles ("Get started", "Book again"), descriptions, and
  button labels ("Start questionnaire", "Schedule now") are hardcoded verbatim from the
  `<!-- TWO PATHS -->` block in `.specify/site-design/curated-book-mockup.html` (lines
  1048–1070).
- **Rationale**: Spec FR-002/FR-003 and the Content Layer Decisions table classify this copy as
  functional/hardcoded, matching how the Hero and Pricing card copy is handled (no Sanity field
  for either).
- **Alternatives considered**: Sourcing copy from Sanity. Rejected — no content type exists or
  is warranted for two static path cards, consistent with sibling precedent.
