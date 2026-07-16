# Feature Specification: Services About section

**Feature Branch**: `COT-011-services-about-section`

**Created**: 2026-07-15

**Status**: Draft

**Input**: User description: "COT-011: Implement About section for Services page

Description:

Implement the About section on the Services page.

The About section html markup for this page is located in .specify\site-design\curated-services-mockup.html under the `<!-- ABOUT BRIEF -->` comment
All translated styles should be camel cased

Acceptance Criteria:

- The implementation should match the design screenshot exactly"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor learns who Curated is and what they do (Priority: P1)

As a visitor browsing the Services page, I want to see a brief, warm introduction to the studio directly below the hero, so that I understand who Curated is, what area they serve, and the philosophy behind their work before I read about individual services.

**Why this priority**: This is the first substantive content block after the hero and establishes trust and context before the visitor evaluates specific service offerings. It is a single static block with no interactive states, making it the entire scope of this feature and its own MVP.

**Independent Test**: Load the Services page and verify the About section renders directly below the hero with a lifestyle photo on one side, and an eyebrow label ("About Curated"), headline ("Where order meets elegance"), descriptive paragraph, and signature line on the other, matching the design screenshot exactly.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls past the Services page hero, **When** the About section comes into view, **Then** the visitor sees a two-column layout with a photograph on the left and text content on the right, matching the design screenshot.
2. **Given** the visitor is viewing the About section text content, **When** they read it, **Then** they see, in order, the "About Curated" eyebrow label, the headline "Where order meets elegance," a paragraph describing Curated as a professional organizing studio serving the NOVA and DMV area, and a signed closing line "— The Curated Team."
3. **Given** the About section has rendered, **When** the visitor visually compares it to the design screenshot, **Then** the image treatment, typography (serif headline, sans eyebrow/body/signature), spacing, column proportions, and colors match the screenshot exactly.

---

### Edge Cases

- What happens at tablet and mobile viewport widths? The two-column layout must adapt (e.g., stacking the image above the text) while keeping the image, eyebrow, headline, paragraph, and signature fully visible and readable, consistent with how sibling sections on this page reflow at narrower widths.
- What happens if the photograph fails to load? The section must still render the text content in its designated column without collapsing the layout.
- What happens if the paragraph text wraps differently due to viewport width? Line spacing and paragraph width must remain visually consistent with the mockup with no overlapping or cramped lines.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Services page MUST render a standalone About section directly below the Hero section.
- **FR-002**: The About section MUST display a two-column layout consisting of a photograph on one side and text content on the other, matching the arrangement shown in the design mockup.
- **FR-003**: The About section's text content MUST display, in order, a small uppercase eyebrow label ("About Curated"), a headline ("Where order meets elegance"), a descriptive paragraph about the studio, and a signed closing line ("— The Curated Team"), matching the content shown in the design mockup.
- **FR-004**: The About section's photograph MUST fill its column with a full-bleed image treatment consistent with the mockup's use of a background image and overlay.
- **FR-005**: The About section's visual styling (layout proportions, background color, padding, typography, image treatment, and colors) MUST match the design mockup markup found under the `<!-- ABOUT BRIEF -->` comment in `.specify/site-design/curated-services-mockup.html`.
- **FR-006**: All CSS style translated from the mockup into the project's stylesheet MUST use camelCase class names, consistent with the styling convention already used by sibling page sections (e.g., `Hero`, `Intro`, `Services`, `Process`, `Testimonial`, `Cta`, `Footer`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The rendered About section visually matches the provided design screenshot with no discernible differences in layout, spacing, typography, image treatment, or color at desktop viewport widths (≥1280px).
- **SC-002**: The About section remains fully readable, with the photograph, eyebrow, headline, paragraph, and signature all visible and non-overlapping, at tablet and mobile viewport widths.

## Assumptions

- The HTML/CSS markup under the `<!-- ABOUT BRIEF -->` comment in `.specify/site-design/curated-services-mockup.html` is the source of truth for structure, spacing, and visual styling; the design screenshot reflects this same single, static resting state.
- This section is static/presentational with fixed copy and a fixed image — no per-instance configuration or dynamic content is required, consistent with the mockup providing exactly one static About block.
- Global design tokens referenced by the mockup (e.g., cream, charcoal, muted, serif/sans font stacks) already exist or will be reproduced in the project's global styles, consistent with how prior sections (Hero, Intro, Services, Process, Testimonial, Cta, Footer) were implemented.
- The existing placeholder `About` component under `app/routes/pages/services/components/about/` is the intended implementation target for this feature.
