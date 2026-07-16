# Feature Specification: Services Hero section

**Feature Branch**: `COT-010-services-hero-section`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "COT-010: Implement Hero section for Services page

Description:

Implement the Footer section on the Services page.

The Hero section html markup for this page is located in .specify\site-design\curated-services-mockup.html under the `<!-- HERO -->` comment
All translated styles should be camel cased

Acceptance Criteria:

- The implementation should match the design screenshot exactly"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor immediately understands the Services page's purpose (Priority: P1)

As a visitor who has just navigated to the Services page, I want to see a clear headline, supporting description, and an eyebrow label at the top of the page, so that I immediately understand this page is about the studio's services and what to expect from them.

**Why this priority**: The hero is the first thing a visitor sees on the Services page — it sets expectations and establishes tone before any other content loads into view. It is a single static block with no interactive states, making it the entire scope of this feature and its own MVP.

**Independent Test**: Load the Services page and verify the eyebrow label ("The services"), the headline ("Bespoke solutions, gracefully executed"), and the supporting paragraph render exactly as shown in the design screenshot, centered at the top of the page.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the Services page, **When** the page loads, **Then** the visitor sees the "THE SERVICES" eyebrow label, the headline "Bespoke solutions, gracefully executed," and the supporting paragraph, all center-aligned at the top of the page.
2. **Given** the visitor is viewing the hero, **When** they view the section background, **Then** they see two large, soft circular shapes overlapping the section's top-left and bottom-right corners, consistent with the mockup.
3. **Given** the hero has rendered, **When** the visitor visually compares it to the design screenshot, **Then** typography (serif headline, sans eyebrow/body), spacing, centering, decorative shapes, and colors match the screenshot exactly.

---

### Edge Cases

- What happens at tablet and mobile viewport widths? The headline, eyebrow, and paragraph must remain centered and readable, with padding scaling down and the decorative circles avoiding overlap with the text.
- What happens if the headline text wraps to two lines (as shown in the screenshot)? Line spacing must remain visually consistent with the mockup with no overlapping or cramped lines.
- What happens with the decorative circle shapes at narrow viewports? They must not obscure or crowd the text content, consistent with the mockup's use of `overflow: hidden` to clip them to the section bounds.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Services page MUST render a standalone Hero section as the first element of the page.
- **FR-002**: The Hero MUST display, in order, a small uppercase eyebrow label ("The services"), a headline ("Bespoke solutions, gracefully executed"), and a supporting paragraph describing the studio's approach, matching the content shown in the design mockup.
- **FR-003**: All Hero text content (eyebrow, headline, paragraph) MUST be horizontally centered within the section.
- **FR-004**: The Hero MUST display two large, soft-edged circular decorative shapes positioned at opposing corners of the section, clipped to the section's bounds, matching the mockup.
- **FR-005**: The Hero's visual styling (background color, padding, typography, decorative shapes, and colors) MUST match the design mockup markup found under the `<!-- HERO -->` comment in `.specify/site-design/curated-services-mockup.html`.
- **FR-006**: All CSS style translated from the mockup into the project's stylesheet MUST use camelCase class names, consistent with the styling convention already used by sibling page sections (e.g., `Intro`, `Services`, `Process`, `Testimonial`, `Cta`, `Footer`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The rendered Hero section visually matches the provided design screenshot with no discernible differences in layout, spacing, typography, centering, decorative shapes, or color at desktop viewport widths (≥1280px).
- **SC-002**: The Hero section remains fully readable, with all text visible and non-overlapping, at tablet and mobile viewport widths.

## Assumptions

- The HTML/CSS markup under the `<!-- HERO -->` comment in `.specify/site-design/curated-services-mockup.html` is the source of truth for structure, spacing, and visual styling; the design screenshot reflects this same single, static resting state.
- This section is static/presentational with fixed copy — no per-instance configuration or dynamic content is required, consistent with the mockup providing exactly one static hero.
- Global design tokens referenced by the mockup (e.g., cream, charcoal, muted, serif/sans font stacks) already exist or will be reproduced in the project's global styles, consistent with how prior sections (Intro, Services, Process, Testimonial, Cta, Footer) were implemented.
- The existing placeholder `Hero` component under `app/routes/pages/services/components/hero/` is the intended implementation target for this feature.
