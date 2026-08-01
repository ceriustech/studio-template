# Phase 0 Research: Add NAPO Logos to Footer and Services Page

No `NEEDS CLARIFICATION` markers remained in the Technical Context after drafting the plan.
This document records the decisions made while confirming the approach against the existing
codebase, so there is nothing left implicit going into Phase 1.

## Decision: Asset import mechanism

- **Decision**: Import `napo-circular-logo.png` and `napo-title-logo.png` directly as ES
  module imports using the `~/` alias (e.g. `import napoCircular from "~/assets/napo-circular-logo.png"`), and render them with plain `<img>` tags.
- **Rationale**: This matches the only existing precedent for a locally-bundled image in
  this codebase — `app/welcome/welcome.tsx` imports `logo-dark.svg` / `logo-light.svg` the
  same way. Vite handles the asset import and typing automatically; no extra tooling needed.
- **Alternatives considered**:
  - *Sanity image assets*: Rejected — the Content Ownership principle classifies these as
    functional (fixed credential marks, not client-editable), so they don't belong in Sanity.
  - *`public/` static folder + plain `<img src="/...">`*: Rejected — the codebase has no
    existing `public/` asset convention for this kind of image, and the Vite-import path
    keeps the asset content-hashed/cache-busted for free, unlike a raw `public/` reference.

## Decision: Component structure (no new component)

- **Decision**: Add the two-logo row as inline markup directly inside the existing `Footer`
  and `About` components — no new shared or route-local component is created.
- **Rationale**: Per the constitution's Architecture principle, a new component folder is
  only warranted when there's independently reusable or stateful behavior. A static pair of
  images with no interaction and no reuse target beyond these two specific spots doesn't meet
  that bar; adding markup directly keeps the change proportional to the feature.
- **Alternatives considered**:
  - *Shared `CredentialLogos` component in `app/components/`*: Rejected — would be used by
    exactly 2 call sites with identical, non-varying presentation, which is exactly the case
    the constitution says should stay inline rather than being forced into a shared component.

## Decision: Layout approach

- **Decision**: A flex row (`display: flex; align-items: center; gap: ...`) added to each
  component's existing CSS file (`footer.css`, `about.css`), reusing each file's existing
  mobile-first breakpoints (`@media (max-width: 768px)` / `(max-width: 480px)`).
- **Rationale**: Matches the established pattern in this codebase — plain component-scoped
  CSS files with mobile-first base styles and two standard breakpoint overrides, rather than
  introducing Tailwind utility classes into components that don't currently use them.
- **Alternatives considered**:
  - *Tailwind utility classes inline*: Rejected — `Footer` and `About` are styled entirely
    through their paired `.css` files today; mixing in Tailwind utilities for just this one
    addition would be inconsistent with the rest of each file.

## Decision: Testing/verification approach

- **Decision**: Verify via `npm run typecheck`, lint, and a manual visual check of the
  Services page and the footer (present on every page) at mobile, tablet, and desktop widths.
- **Rationale**: No automated test framework (Vitest/Playwright/Jest) exists in this repo, so
  automated visual/unit tests are out of scope. This matches the constitution's Review Gates,
  which name typecheck, lint, and a visual check as the merge bar.
