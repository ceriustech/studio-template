# Phase 0 Research: Add Site Logo and Certification Labels

No items in the plan's Technical Context were marked `NEEDS CLARIFICATION` — this is a small, well-scoped UI change to two existing components, and the design image supplied with the spec is authoritative for copy and layout. Research below confirms the existing patterns this feature should follow rather than resolving open unknowns.

## Decision: Reuse the existing local-asset-import pattern for the header logo

**Decision**: Import `curated-logo.png` from `app/assets/` directly in `app/routes/components/navigation/index.tsx`, the same way `About` already imports `napo-circular-logo.png` and `napo-title-logo.png`.

**Rationale**: `About` (`app/routes/pages/services/components/about/index.tsx`) already establishes this exact pattern for static credential logos:

```tsx
import napoCircularLogo from '~/assets/napo-circular-logo.png';
import napoTitleLogo from '~/assets/napo-title-logo.png';
```

`curated-logo.png` already exists at `app/assets/curated-logo.png` (currently untracked, added ahead of this feature). Following the established pattern keeps asset handling consistent and avoids introducing a second convention (e.g., public folder + `<img src="/...">`) for the same kind of asset.

**Alternatives considered**:
- Serve from `public/` and reference by static path — rejected, inconsistent with the existing `~/assets` import pattern already used for the two NAPO logos on the same page.
- Inline as SVG/background-image via CSS — rejected, the source file is a PNG and the existing logos use `<img>` tags with explicit `width`/`height`, which also satisfies the constitution's CLS requirement more directly than a CSS background image.

## Decision: Render the header logo as a decorative image (`alt=""`) beside the existing text

**Decision**: Add an `<img>` for the logo mark inside `.navBrand`, ahead of the existing `navBrandName`/`navBrandTagline` text block. Mark it `alt=""` since the adjacent "CURATED" text and the `Link`'s existing `aria-label="Curated Professional Organizing"` already convey the brand name — the image is a decorative graphical repetition of that same information, not new content a screen reader user would otherwise miss.

**Rationale**: WCAG 2.1 AA (and this project's Accessibility constitution article) requires meaningful images to carry descriptive `alt` text but explicitly allows `alt=""` for decorative images that don't add information beyond what's already present in adjacent text. This mirrors how the two NAPO logos in `About` do carry descriptive alt text — because in that section the logos are the *only* place the certifying-body names appear (before this feature adds visible labels there too).

**Alternatives considered**:
- Descriptive `alt="Curated Professional Organizing logo"` — rejected as redundant given the adjacent visible text and existing `aria-label`, and it would produce duplicate announcements for screen reader users navigating the header landmark.

## Decision: Certification labels are plain text, not new images or a new component

**Decision**: In `About`, add a small eyebrow-style text label above/beside each existing logo image ("CPO Certified" for the circular logo, "NAPO Member" for the NAPO title logo), styled with existing typography tokens already used elsewhere on the page (e.g., the `.sectionEyebrow` treatment used for "About Curated").

**Rationale**: The design image shows small caps-style labels ("CPO CERTIFIED", "NAPO MEMBER") directly above each logo — this is copy, not a graphical asset, so it should be rendered as text for accessibility (screen readers read it natively) and maintainability (no new image assets to manage). Reusing the existing eyebrow text styling keeps the addition visually consistent with the rest of the page instead of introducing a new type scale.

**Alternatives considered**:
- Bake the labels into the certification logo images themselves — rejected, would require new image assets and lose the accessibility/searchability benefit of real text, and the existing logo images are third-party marks that shouldn't be modified.
- Extract a new shared `LogoWithLabel` component — rejected as over-engineering for two static, route-local logo+label pairs with no reuse elsewhere in the codebase (constitution's Generic/Domain-adapter split is reserved for components that need to be presented differently by multiple consumers).

## Decision: No automated test coverage added

**Decision**: Verify via manual visual check against the design at desktop and mobile widths; no new automated tests.

**Rationale**: The repository has no existing Vitest/Playwright test configuration, and this feature is a static markup/CSS change with no branching logic, state, or data flow to unit test. This matches how prior similarly-scoped visual features in this repo (e.g., COT-020 clickable service images, COT-022 NAPO logos) were verified.

**Alternatives considered**:
- Add a new test framework for this feature — rejected as disproportionate to a two-file visual change and out of scope for this ticket.
