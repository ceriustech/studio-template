# Phase 0 Research: Booking Hero section

No `[NEEDS CLARIFICATION]` markers remain in the Technical Context — this feature is a
close structural repeat of two already-shipped sections (Gallery Hero, Services Hero), so
research consisted of confirming those precedents rather than open-ended investigation.

## Decision: Component placement

- **Decision**: `app/routes/pages/booking/components/hero/index.tsx` + `hero.css`, no `.types.ts`.
- **Rationale**: The two closest precedents — `gallery/components/hero/` and
  `services/components/hero/` — both place their Hero inside a route-local `components/`
  folder, both take zero props, and neither has a `.types.ts` file. Matching this exactly
  keeps the Booking page consistent with its siblings and satisfies the constitution's
  "types added only when actually needed" carve-out for prop-less components.
- **Alternatives considered**: Using the pre-existing empty stub at
  `app/routes/pages/booking/hero/index.tsx` (sibling to `index.tsx`, not inside `components/`).
  Rejected because it breaks the pattern every other multi-section page in this codebase
  follows, and the Booking page's own mockup (`curated-book-mockup.html`) shows several more
  sections (two paths, questionnaire, calendly, expect) still to come as separate tickets —
  `components/` is the correct shape for a page that will hold multiple sections.

## Decision: Styling approach

- **Decision**: Plain `.css` file imported directly into the component (`import './hero.css'`),
  camelCase class names (`.bookingHero`, `.sectionEyebrow`), decorative circles as
  `::before`/`::after` pseudo-elements, exactly mirroring `gallery/components/hero/hero.css`
  and `services/components/hero/hero.css`.
- **Rationale**: This is the established pattern for every prior page-section port from the
  static mockups in this repo (Intro, Services, Process, Testimonial, Cta, Footer, Services
  Hero, Gallery Hero) — not Tailwind utility classes, despite Tailwind being listed as the
  project's general styling tool. Following the sibling Hero sections exactly is required by
  spec FR-006 (camelCase) and by SC-001 (must match the screenshot exactly, which those
  sibling implementations already do for their own mockups).
- **Alternatives considered**: Tailwind utility classes. Rejected — would diverge from every
  other ported mockup section in the codebase and offers no benefit for a one-off static
  section with pseudo-element decorative shapes.

## Decision: Design tokens

- **Decision**: Reuse existing global custom properties already declared in `app/app.css`:
  `--cream`, `--charcoal`, `--muted`, `--taupe`, `--serif`, `--sans` (and any others the
  mockup's `.book-hero` rule references). No new tokens are introduced.
- **Rationale**: These tokens already back the Gallery and Services Hero sections and are
  confirmed present in `app/app.css`. The Booking mockup's `.book-hero` block uses the same
  token names as the Gallery/Services mockups' hero blocks.
- **Alternatives considered**: N/A — introducing new tokens would violate the "reuse existing
  global styles" assumption in spec.md and isn't needed since the values already exist.

## Decision: Responsive breakpoints

- **Decision**: `@media (max-width: 768px)` and `@media (max-width: 480px)` overrides, matching
  the exact breakpoint values (and override pattern) already used in
  `gallery/components/hero/hero.css` and `services/components/hero/hero.css`. These align with
  `BREAKPOINTS.tablet` (768px) in `app/constants/index.ts`; 480px sits close to `mobileL`
  (430px) and matches the sibling Hero sections' own mobile cutoff exactly.
- **Rationale**: Consistency with sibling sections takes priority over introducing a new
  breakpoint value, and no new breakpoint is needed — `app/constants/index.ts` already defines
  breakpoints of this shape, satisfying the constitution's mobile-first article without
  requiring a new entry.
- **Alternatives considered**: Importing `BREAKPOINTS`/`QUERIES` from `app/constants/index.ts`
  directly into the CSS file. Not possible — plain `.css` files cannot import TS constants;
  every sibling Hero section hardcodes the pixel values in its `.css` file for the same reason.

## Decision: Copy source of truth

- **Decision**: Eyebrow "Book a consultation", headline "Let's transform your space", and the
  supporting paragraph are hardcoded verbatim from the `<!-- HERO -->` block in
  `.specify/site-design/curated-book-mockup.html` (lines 1038–1046).
- **Rationale**: Spec FR-002 and the Content Layer Decisions table classify this copy as
  functional/hardcoded, matching how the Gallery and Services Hero copy is handled (no Sanity
  field for either).
- **Alternatives considered**: Sourcing copy from Sanity. Rejected — no content type exists or
  is warranted for a single static hero block, consistent with sibling precedent.
