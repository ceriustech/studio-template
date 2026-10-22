# Research: Hide About Section Logo Labels on Mobile

## R1. Which breakpoint defines "mobile view"?

- **Decision**: `@media (max-width: 480px)`, using the block that already exists at the bottom of `about.css` (commented "Responsive: Mobile (480px and below)").
- **Rationale**: This is the section's own mobile breakpoint. It's used 19 times across `app/` CSS, and it covers the ~440px viewport shown in the ticket screenshot. Tablet widths (481–768px) have enough room for the labels in the stacked layout.
- **Alternatives considered**:
  - `768px` (tablet block): hides labels on tablets too, which goes beyond the ticket's "mobile" wording.
  - `430px` (`BREAKPOINTS.mobileL` / `QUERIES.mobileOnly`): matches the constants file, but labels would still wrap at 431–480px, including the screenshot width.

## R2. How should the label be hidden?

- **Decision**: `display: none` on `.aboutLogoLabel` inside the 480px block.
- **Rationale**: This removes the label from layout entirely, so the `gap: 8px` in the `.aboutLogoItem` flex column no longer reserves space (FR-004). The change stays CSS-only, so there's no hydration mismatch and no flash on load.
- **Alternatives considered**:
  - Visually hidden (sr-only) pattern: unnecessary, because each `<img>` already has a descriptive `alt`. Keeping the label for screen readers would announce each credential twice.
  - Conditional rendering with a `matchMedia` hook: adds client JS and causes an SSR/hydration mismatch or a layout flash. Too much for a presentational change.
  - `visibility: hidden`: still reserves space, which violates FR-004.

## R3. Is the credential still identifiable without the label?

- **Decision**: Yes. No change needed.
- **Rationale**: `mapBadges` in `services.loader.server.ts` sets `alt` to the Sanity image alt, falling back to the label. The fallback content in `services.fallback.server.ts` has descriptive alts ("The Board of Certification for Professional Organizers", "NAPO — National Association of …"). The NAPO logo artwork also includes its own wordmark.

## R4. Will the logos stay aligned once labels are hidden?

- **Decision**: Yes, with no extra rules.
- **Rationale**: `.aboutLogos` uses `display: flex; align-items: flex-start; gap: 24px`. With labels removed, each `.aboutLogoItem` holds only its image, so the logos sit side by side with their top edges aligned. The logos differ in height (40px vs 50px), so top alignment is what you'll see. If the visual check shows this looks off, adding `align-items: center` to `.aboutLogos` in the same block is an acceptable in-scope tweak.
