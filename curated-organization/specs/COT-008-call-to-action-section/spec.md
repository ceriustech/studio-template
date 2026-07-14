# Feature Specification: Call To Action section

**Feature Branch**: `COT-008-call-to-action-section`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "COT-008: Call To Action section

Description:

Implement the Call To Action section on the home page.

The intro section html markup is located in .specify\site-design\curated-home-mockup.html under the `<!-- CTA -->` comment
All translated styles should be camel cased

Acceptance Criteria:

- The Testimonial section should match the design screenshot exactly"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor is prompted to book a consultation (Priority: P1)

As a site visitor who has scrolled through the home page (services, before/afters, process, testimonial), I want a clear final prompt to take the next step, so that I know exactly how to move forward and can act on it immediately.

**Why this priority**: This section is the home page's closing conversion moment — without it, an interested visitor has no clear final call to act. It is a single static block with no interactive states, making it the entire scope of this feature and its own MVP.

**Independent Test**: Load the home page and scroll to the final section before the footer. Verify the heading, supporting subtext, and "Book a consultation" button render centered over a background image with an overlay, matching the design screenshot exactly.

**Acceptance Scenarios**:

1. **Given** a visitor on the home page at desktop width, **When** the page scrolls to the Call To Action section, **Then** the visitor sees the heading "Ready to transform your space?", the subtext "Your complimentary 30-minute consultation starts here", and a "Book a consultation" button, centered over a softly overlaid background image.
2. **Given** the visitor is viewing the Call To Action section, **When** they select the "Book a consultation" button, **Then** the visitor is taken to the booking/consultation destination.
3. **Given** the Call To Action section has rendered, **When** the visitor visually compares it to the design screenshot, **Then** typography (serif heading, sans subtext, uppercase sans button label), spacing, background imagery, overlay tone, and button styling match the screenshot exactly.

---

### Edge Cases

- What happens when the background image is slow to load? The heading, subtext, and button must still be legible on the section's base background color while the image loads in.
- What happens at mobile viewport widths? The heading, subtext, and button must remain centered, legible, and easily tappable, with the section padding scaling down appropriately.
- What happens when the button label wraps or the heading text is long? Text must remain centered and legible without overlapping the button or background imagery.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page MUST render a standalone Call To Action section positioned after the Testimonial section and before the footer, following the section order established in the design mockup.
- **FR-002**: The Call To Action section MUST display a heading ("Ready to transform your space?"), a supporting subtext line ("Your complimentary 30-minute consultation starts here"), and a single button/link labeled "Book a consultation", in that visual order, centered on the page.
- **FR-003**: The section MUST display a full-bleed background image with a translucent, light-colored overlay layered above it so the heading, subtext, and button remain clearly legible — matching the layered background treatment in the design mockup.
- **FR-004**: The "Book a consultation" button MUST be a link/actionable element pointing to the site's consultation booking destination.
- **FR-005**: The button MUST present a visible hover state (elevation/shadow and background shift) consistent with other primary buttons on the home page.
- **FR-006**: The section's visual styling (background image and overlay, spacing, typography, and colors) MUST match the design mockup markup found under the `<!-- CTA -->` comment in `.specify/site-design/curated-home-mockup.html`.
- **FR-007**: The section MUST remain legible and centered at mobile viewport widths, with the button remaining easily tappable.
- **FR-008**: All CSS style translated from the mockup into the project's stylesheet MUST use camelCase class names, consistent with the styling convention already used by sibling home page sections (e.g., `Intro`, `Services`, `Process`, `Testimonial`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The rendered Call To Action section visually matches the provided design screenshot with no discernible differences in layout, spacing, typography, background imagery, overlay tone, or color at desktop viewport widths (≥1280px).
- **SC-002**: A visitor can locate and identify the primary action (booking a consultation) within 3 seconds of the section entering view, at both desktop and mobile viewport widths.
- **SC-003**: Selecting the "Book a consultation" button reliably navigates the visitor to the booking destination with no dead links or unresponsive taps.

## Assumptions

- The HTML/CSS markup under the `<!-- CTA -->` comment in `.specify/site-design/curated-home-mockup.html` is the source of truth for structure, spacing, and visual styling; the design screenshot reflects this same single, static resting state.
- This section is static/presentational with a single fixed heading, subtext, and button — no per-instance configuration or repeating content is required, consistent with the mockup providing exactly one CTA block.
- The consultation booking destination (the button's link target) is an existing or forthcoming booking page/route elsewhere in the site; wiring the exact destination URL is a reasonable default (e.g., a placeholder or existing booking route) rather than a new booking system, since building a booking flow is out of scope for this section.
- Global design tokens referenced by the mockup (e.g., warm background, charcoal, cream, serif/sans font stacks) already exist or will be reproduced in the project's global styles, consistent with how prior sections (Intro, Services, Process, Before/After, Testimonial) were implemented.
