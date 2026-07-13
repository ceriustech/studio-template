# COT-002: Home Hero — Implementation Tasks

This document contains a dependency-ordered, actionable task list to implement the home-page hero described in `spec.md`.

Overview
- Goal: Implement a responsive, accessible, pixel-faithful hero on the home page with a primary CTA and progressive image handling.

Tasks (Dependency-ordered)

1) Create `Hero` component scaffold
- Effort: small
- Description: Add a presentational `Hero` React component that accepts props for `strapline`, `headline`, `descriptor`, `ctaLabel`, `ctaUrl`, and `backgroundImage`.
- Acceptance Criteria: Component builds and renders a centered copy block over a background placeholder; props render expected text; no visual styling required yet.
- Files to create:
  - app/routes/components/hero/index.tsx
  - app/routes/components/hero/hero.types.ts
  - app/routes/components/hero/hero.css

2) Integrate `Hero` into home page
- Effort: small
- Description: Import and render `Hero` inside the existing home page module; wire CTA to the discovery flow (e.g., `/services` or configured CTA target).
- Acceptance Criteria: Visiting `/` shows `Hero` markup with props; CTA is present and the `to`/`href` points to the discovery route; client navigation occurs on click.
- Files to modify:
  - app/routes/pages/home/index.tsx

3) Implement base styling and layout (desktop reference)
- Effort: medium
- Description: Implement CSS to match the desktop (>=1200px) design: full-bleed background, centered vertical composition, typographic scale, spacing, and CTA placement. Prefer component-scoped CSS imported by the component; fall back to global tokens in `app/app.css` where appropriate.
- Acceptance Criteria: At 1200px the hero visually matches the design's layout, vertical spacing, and typographic scale to a reasonable web approximation.
- Files to modify/create:
  - app/routes/components/hero/hero.css
  - (optional) app/app.css — update global tokens only if needed

4) Responsive adjustments (tablet and mobile)
- Effort: medium
- Description: Add responsive breakpoints to scale type, spacing, and CTA placement for tablet (768–1199px) and mobile (<=767px). Ensure CTA remains tappable (>=44x44 CSS px) and content stack suitable for narrow widths.
- Acceptance Criteria: Layout adapts cleanly across the three breakpoints; no horizontal overflow; CTA visible and tappable on small viewports.
- Files to modify:
  - app/routes/components/hero/hero.css

5) Accessibility and semantics
- Effort: small
- Description: Ensure semantic markup (`<section>` with an accessible heading hierarchy), proper `aria` usage, keyboard focus styles for the CTA, readable color contrast, and screen-reader ordering.
- Acceptance Criteria: Hero uses semantic markup; CTA is focusable via keyboard with visible focus ring; automated checks (axe or similar) show no critical accessibility violations for the hero region.
- Files to modify:
  - app/routes/components/hero/index.tsx
  - app/routes/components/hero/hero.css

6) Progressive image loading and fallback
- Effort: medium
- Description: Implement progressive/background image loading with a low-quality image placeholder (LQIP) or CSS gradient fallback. Provide a solid-color fallback that preserves contrast if the image fails to load. Use `loading="lazy"` or CSS `background-image` techniques and size/format-appropriate assets.
- Acceptance Criteria: Hero copy and CTA render immediately while background loads; if the background fails, the fallback color keeps text legible; layout does not shift significantly when image finishes loading.
- Files to modify:
  - app/routes/components/hero/index.tsx
  - app/routes/components/hero/hero.css
  - public/static/ (place background assets here if available)

7) Respect reduced-motion & user preferences
- Effort: small
- Description: If any parallax or animated transitions are included, disable them for `prefers-reduced-motion` users and provide a non-animated baseline.
- Acceptance Criteria: With `prefers-reduced-motion` enabled, no non-essential animations run; hero remains fully functional.
- Files to modify:
  - app/routes/components/hero/index.tsx
  - app/routes/components/hero/hero.css

8) Performance & image optimization
- Effort: medium
- Description: Ensure hero does not block FCP: defer or lazy-load large assets, use appropriately sized image variants, and leverage modern formats (WebP/AVIF) if available. Avoid layout shifts by reserving image space.
- Acceptance Criteria: Lighthouse/Perf audits show reasonable FCP and CLS scores for the hero on simulated 3G and desktop; image assets are optimized and lazy-loaded.
- Files to modify/create:
  - app/routes/components/hero/index.tsx
  - public/static/ (optimized images)

9) Visual QA & pixel-check
- Effort: small
- Description: Capture screenshots at desktop breakpoint for pixel-comparison against the design screenshot; adjust spacing/typography until acceptable.
- Acceptance Criteria: Visual QA confirms the hero matches the design at the desktop breakpoint within reasonable web rendering limits.
- Files to update:
  - specs/COT-002-home-hero/spec.md (add notes or reference mockups)
  - specs/COT-002-home-hero/checklists/requirements.md (QA checklist updates)

10) Accessibility & cross-browser testing
- Effort: small
- Description: Run accessibility checks (axe/Lighthouse), keyboard-only navigation, screen reader spot-checks, and test across Chrome, Firefox, and Safari at target breakpoints.
- Acceptance Criteria: No critical accessibility failures; keyboard + screen reader flows announce headline and CTA in a logical order.
- Files to update:
  - specs/COT-002-home-hero/checklists/requirements.md (test results)

11) Documentation and handoff
- Effort: small
- Description: Add brief implementation notes, component props docs, and usage examples in the repo (README or component-level comment). Link to the design assets used for QA.
- Acceptance Criteria: Developers can reuse `Hero` with documented props and example usage in `app/routes/pages/home/index.tsx`.
- Files to update/create:
  - app/routes/components/hero/README.md (optional)
  - specs/COT-002-home-hero/tasks.md (this file)

Estimates Key
- small: ~1–2 developer hours
- medium: ~3–6 developer hours
- large: >6 hours (none defined above as large; adjust if needed)

Notes & Implementation Suggestions
- Keep styling local to the component (`hero.css`) and import it from the React module to avoid global leakage.
- Use semantic HTML: `<section aria-labelledby="hero-heading">` with a single `h1` or appropriately leveled heading according to page structure.
- Put background assets under `public/static/hero/` and reference via an environment-safe path like `/static/hero/<name>`.
- Prefer `Link` from `react-router` for internal navigation CTAs.

---
_Last updated: generated automatically from `specs/COT-002-home-hero/spec.md`._

Short summary
- Key next step: Implement `Hero` component and import it in [app/routes/pages/home/index.tsx](app/routes/pages/home/index.tsx).
- Main deliverables: component files (index.tsx, hero.types.ts, hero.css), background assets in `public/static/hero/`, and modest updates to global tokens if needed.
- Estimated work: Each task is scoped small→medium; overall implementation should be achievable within a single developer day to two days depending on visual QA iteration.
- Suggested immediate action: I can scaffold the `Hero` component and CSS files now (small tasks 1–2). Want me to implement the scaffold and integration next?# COT-002: Home Hero — Implementation Tasks

This document contains a dependency-ordered, actionable task list to implement the home-page hero described in `spec.md`.

**Overview**
- Goal: Implement a responsive, accessible, pixel-faithful hero on the home page with a primary CTA and progressive image handling.

**Tasks (Dependency-ordered)**

1) Create `Hero` component scaffold
- Effort: small
- Description: Add a presentational `Hero` React component that accepts props for `strapline`, `headline`, `descriptor`, `ctaLabel`, `ctaUrl`, and `backgroundImage`.
- Acceptance Criteria: Component builds and renders a centered copy block over a background placeholder; props render expected text; no visual styling required yet.
- Files to create:
  - app/routes/components/hero/index.tsx
  - app/routes/components/hero/hero.types.ts
  - app/routes/components/hero/hero.css

2) Integrate `Hero` into home page
- Effort: small
- Description: Import and render `Hero` inside the existing home page module; wire CTA to the discovery flow (e.g., `/services` or configured CTA target).
- Acceptance Criteria: Visiting `/` shows `Hero` markup with props; CTA is present and the `to`/`href` points to the discovery route; client navigation occurs on click.
- Files to modify:
  - app/routes/pages/home/index.tsx

3) Implement base styling and layout (desktop reference)
- Effort: medium
- Description: Implement CSS to match the desktop (>=1200px) design: full-bleed background, centered vertical composition, typographic scale, spacing, and CTA placement. Prefer component-scoped CSS imported by the component; fall back to global tokens in `app/app.css` where appropriate.
- Acceptance Criteria: At 1200px the hero visually matches the design's layout, vertical spacing, and typographic scale to a reasonable web approximation.
- Files to modify/create:
  - app/routes/components/hero/hero.css
  - (optional) app/app.css — update global tokens only if needed

4) Responsive adjustments (tablet and mobile)
- Effort: medium
- Description: Add responsive breakpoints to scale type, spacing, and CTA placement for tablet (768–1199px) and mobile (<=767px). Ensure CTA remains tappable (>=44x44 CSS px) and content stack suitable for narrow widths.
- Acceptance Criteria: Layout adapts cleanly across the three breakpoints; no horizontal overflow; CTA visible and tappable on small viewports.
- Files to modify:
  - app/routes/components/hero/hero.css

5) Accessibility and semantics
- Effort: small
- Description: Ensure semantic markup (`<section>` with an accessible heading hierarchy), proper `aria` usage, keyboard focus styles for the CTA, readable color contrast, and screen-reader ordering.
- Acceptance Criteria: Hero uses semantic markup; CTA is focusable via keyboard with visible focus ring; automated checks (axe or similar) show no critical accessibility violations for the hero region.
- Files to modify:
  - app/routes/components/hero/index.tsx
  - app/routes/components/hero/hero.css

6) Progressive image loading and fallback
- Effort: medium
- Description: Implement progressive/background image loading with a low-quality image placeholder (LQIP) or CSS gradient fallback. Provide a solid-color fallback that preserves contrast if the image fails to load. Use `loading="lazy"` or CSS `background-image` techniques and size/format-appropriate assets.
- Acceptance Criteria: Hero copy and CTA render immediately while background loads; if the background fails, the fallback color keeps text legible; layout does not shift significantly when image finishes loading.
- Files to modify:
  - app/routes/components/hero/index.tsx
  - app/routes/components/hero/hero.css
  - public/static/ (place background assets here if available)

7) Respect reduced-motion & user preferences
- Effort: small
- Description: If any parallax or animated transitions are included, disable them for `prefers-reduced-motion` users and provide a non-animated baseline.
- Acceptance Criteria: With `prefers-reduced-motion` enabled, no non-essential animations run; hero remains fully functional.
- Files to modify:
  - app/routes/components/hero/index.tsx
  - app/routes/components/hero/hero.css

8) Performance & image optimization
- Effort: medium
- Description: Ensure hero does not block FCP: defer or lazy-load large assets, use appropriately sized image variants, and leverage modern formats (WebP/AVIF) if available. Avoid layout shifts by reserving image space.
- Acceptance Criteria: Lighthouse/Perf audits show reasonable FCP and CLS scores for the hero on simulated 3G and desktop; image assets are optimized and lazy-loaded.
- Files to modify/create:
  - app/routes/components/hero/index.tsx
  - public/static/ (optimized images)

9) Visual QA & pixel-check
- Effort: small
- Description: Capture screenshots at desktop breakpoint for pixel-comparison against the design screenshot; adjust spacing/typography until acceptable.
- Acceptance Criteria: Visual QA confirms the hero matches the design at the desktop breakpoint within reasonable web rendering limits.
- Files to update:
  - specs/COT-002-home-hero/spec.md (add notes or reference mockups)
  - specs/COT-002-home-hero/checklists/requirements.md (QA checklist updates)

10) Accessibility & cross-browser testing
- Effort: small
- Description: Run accessibility checks (axe/Lighthouse), keyboard-only navigation, screen reader spot-checks, and test across Chrome, Firefox, and Safari at target breakpoints.
- Acceptance Criteria: No critical accessibility failures; keyboard + screen reader flows announce headline and CTA in a logical order.
- Files to update:
  - specs/COT-002-home-hero/checklists/requirements.md (test results)

11) Documentation and handoff
- Effort: small
- Description: Add brief implementation notes, component props docs, and usage examples in the repo (README or component-level comment). Link to the design assets used for QA.
- Acceptance Criteria: Developers can reuse `Hero` with documented props and example usage in `app/routes/pages/home/index.tsx`.
- Files to update/create:
  - app/routes/components/hero/README.md (optional)
  - specs/COT-002-home-hero/tasks.md (this file)

**Estimates Key**
- small: ~1–2 developer hours
- medium: ~3–6 developer hours
- large: >6 hours (none defined above as large; adjust if needed)

**Notes & Implementation Suggestions**
- Keep styling local to the component (`hero.css`) and import it from the React module to avoid global leakage.
- Use semantic HTML: `<section aria-labelledby="hero-heading">` with a single `h1` or appropriately leveled heading according to page structure.
- Put background assets under `public/static/hero/` and reference via an environment-safe path like `/static/hero/<name>`.
- Prefer `Link` from `react-router` for internal navigation CTAs.

---

_Last updated: generated automatically from `specs/COT-002-home-hero/spec.md`._
