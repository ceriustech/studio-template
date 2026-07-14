# Feature Specification: Footer section

**Feature Branch**: `COT-009-footer-section`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "COT-009: Implement Footer section

Description:

Implement the Footer section on the home page.

The Footer section html markup is located in .specify\site-design\curated-home-mockup.html under the `<!-- FOOTER -->` comment
All translated styles should be camel cased

Acceptance Criteria:

- The Testimonial section should match the design screenshot exactly"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor finds site-wide navigation and business info at a glance (Priority: P1)

As a site visitor who has reached the bottom of the home page, I want to see the brand, key navigation links, contact channels, and business hours in one place, so that I can quickly find where to go next or how to get in touch without scrolling back up.

**Why this priority**: The footer is the final, persistent piece of every page's chrome — without it, visitors reaching the end of the home page have no site-wide navigation, contact options, or hours. It is a single static block with no interactive states beyond hover and links, making it the entire scope of this feature and its own MVP.

**Independent Test**: Load the home page and scroll to the bottom. Verify the brand name and description, the "Navigate," "Connect," and "Hours" link columns, and the bottom bar (copyright notice and social links) render exactly as shown in the design screenshot.

**Acceptance Scenarios**:

1. **Given** a visitor on the home page at desktop width, **When** the page scrolls to the footer, **Then** the visitor sees the "CURATED" brand name with its tagline description in the leftmost column, and three link columns labeled "Navigate," "Connect," and "Hours," each with their respective items, laid out on a dark background.
2. **Given** the visitor is viewing the footer, **When** they select a link under "Navigate" (About, Services, Gallery, Book), **Then** they are taken to the corresponding destination.
3. **Given** the visitor is viewing the footer, **When** they view the bottom bar below the divider line, **Then** they see the copyright notice on the left and "Instagram" and "Facebook" social links on the right.
4. **Given** the footer has rendered, **When** the visitor visually compares it to the design screenshot, **Then** typography (serif brand name, sans body/links), spacing, column layout, divider line, and colors match the screenshot exactly.

---

### Edge Cases

- What happens at tablet viewport widths? The four-column grid must reflow to two columns while keeping all content readable and correctly grouped.
- What happens at mobile viewport widths? The grid must reflow to a single column, and the bottom bar must stack the copyright notice and social links vertically and centered, consistent with the mockup's mobile behavior.
- What happens when a link label or the brand description text wraps to a second line? Spacing between columns and rows must remain visually consistent with no overlapping text.
- What happens when a visitor hovers over a footer link? The link color must shift to indicate interactivity, consistent with the hover treatment defined in the mockup.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page MUST render a standalone Footer section positioned after the Call To Action section, as the final element of the page.
- **FR-002**: The Footer MUST display a four-column layout containing: a brand column (brand name and description), a "Navigate" column (About, Services, Gallery, Book), a "Connect" column (Email, Phone, Instagram), and an "Hours" column (Mon–Fri, Sat, Sun schedule), matching the content and order shown in the design mockup.
- **FR-003**: Each column heading ("Navigate," "Connect," "Hours") MUST be displayed in uppercase, small, letter-spaced styling distinct from the link items beneath it.
- **FR-004**: Each link/list item under a column MUST be an actionable element (link) pointing to its corresponding destination or contact channel.
- **FR-005**: Footer links MUST present a visible hover state (color shift) consistent with the mockup's link hover treatment.
- **FR-006**: The Footer MUST display a horizontal divider line separating the column grid from a bottom bar.
- **FR-007**: The bottom bar MUST display a copyright notice on one side and social links ("Instagram," "Facebook") on the other, matching the design mockup.
- **FR-008**: The Footer's visual styling (dark background, column grid, spacing, typography, divider, and colors) MUST match the design mockup markup found under the `<!-- FOOTER -->` comment in `.specify/site-design/curated-home-mockup.html`.
- **FR-009**: The Footer's column grid MUST reflow to two columns at tablet widths and a single column at mobile widths, with the bottom bar stacking vertically and centering its content at mobile widths, matching the mockup's responsive behavior.
- **FR-010**: All CSS style translated from the mockup into the project's stylesheet MUST use camelCase class names, consistent with the styling convention already used by sibling home page sections (e.g., `Intro`, `Services`, `Process`, `Testimonial`, `Cta`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The rendered Footer section visually matches the provided design screenshot with no discernible differences in layout, spacing, typography, column grouping, or color at desktop viewport widths (≥1280px).
- **SC-002**: A visitor can locate and select any navigation, contact, or social link in the footer within 5 seconds of the section entering view, at both desktop and mobile viewport widths.
- **SC-003**: All footer links reliably navigate to their intended destination with no dead links or unresponsive taps, at any supported viewport width.

## Assumptions

- The HTML/CSS markup under the `<!-- FOOTER -->` comment in `.specify/site-design/curated-home-mockup.html` is the source of truth for structure, spacing, and visual styling; the design screenshot reflects this same single, static resting state.
- This section is static/presentational with fixed columns and link labels — no per-instance configuration or dynamic content is required, consistent with the mockup providing exactly one static footer.
- Destination URLs for Navigate, Connect (email/phone/Instagram), and social links are existing or forthcoming routes/contact channels elsewhere in the site; wiring reasonable placeholder or existing destinations is acceptable, since building new contact infrastructure is out of scope for this section.
- The current year in the copyright notice ("© 2026 Curated Organization. All rights reserved.") is a static value matching the mockup, not a dynamically computed year, since the mockup hard-codes this text.
- Global design tokens referenced by the mockup (e.g., charcoal, cream, taupe, taupe-dark, serif/sans font stacks) already exist or will be reproduced in the project's global styles, consistent with how prior sections (Intro, Services, Process, Testimonial, Cta) were implemented.
