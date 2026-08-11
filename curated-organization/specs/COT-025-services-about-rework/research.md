# Research: Services About Section Mobile Rework

No items in the plan's Technical Context were marked `NEEDS CLARIFICATION`. This document records the one real technical decision the plan makes: how to reorder the section for mobile without breaking the existing desktop layout.

## Decision: Restructure DOM order + CSS Grid `grid-template-areas` reflow, scoped to the existing mobile media query

**Decision**: Split the `About` component's markup into four sibling blocks in this DOM order — `header` (eyebrow + heading), `image` (founder photo), `body` (paragraph + signature), `logos` (certification logos). The base (unprefixed) CSS — which was already the desktop two-column layout in this file before this feature — places those four blocks via `grid-template-areas` (`"image header" "image body" "image logos"`) so desktop is pixel-equivalent to before, despite the DOM order change. The existing `@media (max-width: 768px)` block overrides `grid-template-areas` to a single-column stack (`"header" "image" "body" "logos"`), which now matches the DOM order directly. No JavaScript, no duplicated markup, no new breakpoint values.

**Rationale**:
- Reordering through actual DOM order — rather than a CSS-only visual `order` property while leaving the DOM in its current sequence — keeps screen-reader/keyboard reading order on mobile consistent with the visual order the design specifies, satisfying the Accessibility (WCAG 2.1 AA) article.
- Keeping the base rules as the desktop layout (rather than flipping the file to mobile-first) scopes the diff to mobile only, per explicit direction not to touch desktop behavior — this file predates the feature as desktop-first, and re-architecting that unrelated pattern was out of scope.
- `grid-template-areas` lets one set of DOM nodes serve both layouts without duplicating markup (no rendering the photo or logos twice for different breakpoints), and without JavaScript-based conditional rendering.
- No new breakpoint values are introduced — the existing `768px` (tablet) breakpoint already used in `about.css` is reused for the point where the layout flips from two-column to stacked, which matches where it already flips today.

**Alternatives considered**:
- **CSS `order` property on a flex/grid container, DOM unchanged**: Rejected — visually reorders elements without changing DOM/reading order, so mobile screen-reader users would still encounter the photo before the eyebrow/heading, contradicting the design intent and the Accessibility article.
- **Duplicate the eyebrow/heading and logos markup (once above the image for mobile, once in the text block for desktop, toggled with CSS `display`)**: Rejected — duplicates copy in the DOM, which duplicates it for assistive tech and hurts maintainability (two places to update if copy changes) for no benefit over a single reflowed grid.
- **JavaScript/conditional rendering based on viewport width**: Rejected — the layout is achievable with CSS alone; adding a client-side viewport check would introduce a hydration/SSR mismatch risk and unnecessary complexity for what is fundamentally a presentational reflow, and conflicts with the Performance & SEO article's SSR-first stance.
