# Feature Specification: Services About Section Mobile Rework

**Feature Branch**: `COT-025-services-about-rework`

**Created**: 2026-08-11

**Status**: Draft

**Input**: User description: "COT-025: Rework the about section mobile view on the Services page

Description:

Rework the about section on the services page so that it renders the mobile view in accordance with the designs.

Acceptance Criteria:

- The section should look just like the screenshot as illustrated by the design
- The sectionEyebrow and sectionEyebrowDescription should render above the ceo image
- The aboutLogoItems should render below the ceo image"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mobile visitor reads the About section in the correct order (Priority: P1)

A visitor browsing the Services page on a mobile-sized screen scrolls to the About section. Today, the section's photo of the founder appears first, followed by the eyebrow label, heading, body copy, signature, and certification logos all stacked underneath. The visitor instead needs to see the eyebrow label ("About Curated") and heading ("Where order meets elegance") first, then the founder photo, and then the certification logos ("CPO Certified" and "NAPO Member") — matching the provided mobile design.

**Why this priority**: This is the entire scope of the feature — without it, there is no change to ship. It corrects the reading order of the section's most visually prominent elements for the majority of real-world traffic (mobile visitors).

**Independent Test**: Load the Services page on a mobile-sized viewport and confirm the About section renders, top to bottom: the "About Curated" eyebrow and "Where order meets elegance" heading, then the founder photo, then the "CPO Certified" and "NAPO Member" logo items — matching the provided design screenshot.

**Acceptance Scenarios**:

1. **Given** a visitor views the Services page on a mobile-sized screen, **When** they scroll to the About section, **Then** the "About Curated" eyebrow label and "Where order meets elegance" heading appear above the founder photo.
2. **Given** a visitor views the Services page on a mobile-sized screen, **When** they scroll to the About section, **Then** the "CPO Certified" and "NAPO Member" logo items appear below the founder photo.
3. **Given** a visitor views the About section on a mobile-sized screen, **When** they compare it to the provided design screenshot, **Then** the layout, spacing, and visual styling match.

---

### User Story 2 - Desktop and tablet visitors see no regression (Priority: P2)

A visitor browsing the Services page on a desktop or larger tablet screen continues to see the About section exactly as it renders today — founder photo alongside the eyebrow, heading, body copy, signature, and logos in a two-column layout.

**Why this priority**: The requested rework is explicitly scoped to the mobile view; preserving the existing larger-screen layout avoids an unintended regression, but requires no new work beyond correctly scoping the change to mobile widths.

**Independent Test**: Load the Services page at a desktop viewport width and confirm the About section's two-column layout (photo beside text) is visually unchanged from current behavior.

**Acceptance Scenarios**:

1. **Given** a visitor views the Services page on a desktop-sized screen, **When** they scroll to the About section, **Then** the section renders in its existing two-column layout, unchanged from current behavior.

---

### Edge Cases

- What happens on tablet-width screens where the section already stacks into a single column today? The reordering applies wherever the section renders in a stacked, single-column layout, so tablet widths follow the same top-to-bottom order as mobile.
- How do the body copy paragraph and founder signature line render on mobile, since the design screenshot only shows the eyebrow, heading, photo, and logos? They continue to render as part of the section's text content, positioned between the heading and the logo items, since no reordering of that copy was requested.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On mobile-width screens, the Services page About section MUST display the eyebrow label ("About Curated") and heading ("Where order meets elegance") above the founder photo.
- **FR-002**: On mobile-width screens, the Services page About section MUST display the certification logo items ("CPO Certified" and "NAPO Member") below the founder photo.
- **FR-003**: On mobile-width screens, the About section's body copy paragraph and founder signature line MUST continue to render as part of the section's text content, without being removed.
- **FR-004**: The visual layout, spacing, and styling of the About section on mobile-width screens MUST match the provided design screenshot.
- **FR-005**: On desktop and larger tablet-width screens, the About section's existing two-column layout (photo beside text) MUST remain unchanged.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A side-by-side visual comparison of the live Services page About section on a mobile-sized viewport against the design screenshot shows matching content order and layout.
- **SC-002**: 100% of mobile-width page loads of the Services page show the eyebrow and heading above the founder photo, and the certification logos below the founder photo.
- **SC-003**: A side-by-side comparison of the live Services page About section on a desktop-sized viewport against its current (pre-change) appearance shows no visible regression.

## Assumptions

- "Mobile view" refers to the section's existing stacked, single-column layout (the same breakpoint range where the section already collapses from two columns to one), not a newly introduced breakpoint.
- The body copy paragraph and founder signature line are not addressed by the acceptance criteria or design screenshot; they are assumed to remain in the text content flow, between the heading and the certification logos, since only the eyebrow/heading and logos have specified positions.
- No copy, imagery, or content changes are required — this is a layout/ordering change only for mobile-width screens.
- The existing desktop/tablet two-column layout and its visual styling are out of scope and must not change.
