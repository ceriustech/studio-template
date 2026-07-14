# Feature Specification: Process section

**Feature Branch**: `COT-006-process-section`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "COT-006: Implement Process section

Description:

Implement the Process section on the home page.

The intro section html markup is located in .specify\site-design\curated-home-mockup.html under the `<!-- PROCESS -->` comment
All translated styles should be camel cased

Acceptance Criteria:

- The before and after section should match the design screenshot exactly"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor understands the service process at a glance (Priority: P1)

As a site visitor browsing the home page, I want to see a clear, ordered breakdown of how the organizing process works, so that I understand what to expect before I decide to book a consultation.

**Why this priority**: The Process section is a core trust-building block on the home page. Without it, visitors have no visibility into what happens after they reach out, which increases hesitation to convert. This is the only story for this feature — it is a static, presentational section.

**Independent Test**: Load the home page and scroll to the Process section. Verify the eyebrow, heading, and three numbered steps (Consultation, Design + shop, Organizing day) render with their descriptions, matching the provided design screenshot.

**Acceptance Scenarios**:

1. **Given** a visitor on the home page at desktop width, **When** the page scrolls to the Process section, **Then** the visitor sees the eyebrow "The process", the heading "How it works", and three steps laid out in a single row, each with a number, title, and description, separated by small connector marks.
2. **Given** a visitor on the home page at mobile width, **When** the page scrolls to the Process section, **Then** the three steps remain legible and readably stacked or reflowed, preserving reading order (01, 02, 03) and all text content.
3. **Given** the Process section has rendered, **When** the visitor visually compares it to the design screenshot, **Then** typography (serif numbers and titles, sans description text), spacing, colors, and the dash connectors between steps match the screenshot.

### Edge Cases

- What happens when the viewport is narrow enough that three columns can no longer fit on one line? The layout must reflow (e.g., stack) without overlapping text, truncating content, or losing the step order.
- What happens if a step's description text is long enough to wrap to multiple lines? Step titles and numbers across all three steps must remain visually aligned (no ragged baseline between steps).
- The connector marks between steps 1→2 and 2→3 must not render after the final (third) step.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page MUST render a standalone Process section positioned after the existing Services section, following the section order established on the home page (Hero, Intro, Services, Process, Before/After).
- **FR-002**: The Process section MUST display a centered header consisting of an eyebrow label "The process" and a heading "How it works", matching the text content and order shown in the design mockup.
- **FR-003**: The Process section MUST display exactly three steps, in order, with the following content taken from the design mockup:
  1. Number "01", title "Consultation", description "Free 30-minute video or in-person assessment of your space and goals"
  2. Number "02", title "Design + shop", description "Custom plan, product sourcing, and everything you need before we arrive"
  3. Number "03", title "Organizing day", description "We sort, declutter, build systems, label, and style your space to perfection"
- **FR-004**: Each step MUST display its number, title, and description in that visual order (number above title above description).
- **FR-005**: A small horizontal connector mark MUST appear between step 1 and step 2, and between step 2 and step 3, but not after step 3, matching the design mockup.
- **FR-006**: The section's visual styling (background color, spacing, typography, and colors) MUST match the design mockup markup found under the `<!-- PROCESS -->` comment in `.specify/site-design/curated-home-mockup.html`.
- **FR-007**: The section MUST reflow appropriately at mobile viewport widths, preserving all text content and step order.
- **FR-008**: All CSS style translated from the mockup into the project's stylesheet MUST use camelCase class names, consistent with the styling convention already used by sibling home page sections (e.g., `Intro`, `Services`, `BeforeAfter`).

### Key Entities

- **Process Step**: A single stage in the organizing process, with attributes: order number (e.g., "01"), title (e.g., "Consultation"), and description text.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The rendered Process section visually matches the provided design screenshot with no discernible differences in layout, spacing, typography, or color at desktop viewport widths (≥1280px).
- **SC-002**: All three process steps and their full text content (numbers, titles, descriptions) are visible and readable at both desktop and mobile viewport widths.
- **SC-003**: A visitor can identify the three steps of the process and their order within 5 seconds of viewing the section, without any overlapping or cut-off content.

## Assumptions

- The HTML/CSS markup under the `<!-- PROCESS -->` comment in `.specify/site-design/curated-home-mockup.html` is the source of truth for structure, spacing, and visual styling.
- Content (step numbers, titles, descriptions, eyebrow, and heading text) is static for this feature; no CMS or data-source integration is required.
- The Process section is placed immediately after the Services section and before the Before/After section, consistent with the section order in the design mockup.
- Global design tokens referenced by the mockup (e.g., warm background, taupe, charcoal, muted colors, serif/sans font stacks) already exist or will be reproduced in the project's global styles, consistent with how prior sections (Intro, Services, Before/After) were implemented.
- No new interactive behavior (hover states, animations, links) is required for this section beyond what is shown in the static mockup.
