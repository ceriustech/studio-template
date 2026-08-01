# Feature Specification: Add NAPO Logos to Footer and Services Page

**Feature Branch**: `COT-022-napo-logos`

**Created**: 2026-08-01

**Status**: Draft

**Input**: User description: "COT-021: Add Image Logos to the Footer and Services page

Description:

Add the napo-circular-logo and napo-title-logo to the footer and services page about section so in the exact way shown in the designs.

Acceptance Criteria:

- The user should be able to see both logos on in the footer and services page"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View credential logos on the Services page (Priority: P1)

As a visitor evaluating the organizing studio, I want to see the NAPO circular badge and NAPO title logo in the About section of the Services page, so I can quickly recognize the studio's professional credentials while reading about the team.

**Why this priority**: The Services page About section is where visitors form trust judgments about the business before booking. Showing the credential marks here directly supports conversion.

**Independent Test**: Visit the Services page and confirm both the napo-circular-logo and napo-title-logo render in the About section, positioned below the "— The Curated Team" signature exactly as shown in the design.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the Services page, **When** the page finishes loading, **Then** both the napo-circular-logo and napo-title-logo are visible in the About section, side by side, in that order.
2. **Given** a visitor is viewing the Services page on a mobile-sized screen, **When** the About section renders, **Then** both logos remain visible, legible, and do not overlap surrounding text.

---

### User Story 2 - View credential logos in the site footer (Priority: P2)

As a visitor browsing any page of the site, I want to see the same two NAPO logos in the footer, so I can see the studio's credentials regardless of which page I'm on.

**Why this priority**: The footer is shared across all pages, so this extends trust-building beyond the Services page, but it is secondary to the primary About section placement.

**Independent Test**: Visit any page that renders the shared footer and confirm both logos appear in the footer's brand column, in the same order as the design.

**Acceptance Scenarios**:

1. **Given** a visitor is on any page of the site, **When** they scroll to the footer, **Then** both the napo-circular-logo and napo-title-logo are visible in the footer's brand column, below the "Serving the NOVA / DMV area." text.
2. **Given** a visitor is viewing the footer on a mobile-sized screen, **When** the footer renders, **Then** both logos remain visible and legible without overlapping other footer content.

---

### Edge Cases

- What happens if a logo image fails to load? The image element still reserves its space and exposes descriptive alt text so the credential is not silently missing.
- How does the layout handle very narrow viewports? Logos scale down and stay side by side (or wrap gracefully) without overlapping adjacent text or breaking the surrounding layout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Services page About section MUST display the napo-circular-logo image.
- **FR-002**: The Services page About section MUST display the napo-title-logo image, positioned alongside the napo-circular-logo as shown in the design.
- **FR-003**: The site footer MUST display the napo-circular-logo image.
- **FR-004**: The site footer MUST display the napo-title-logo image, positioned alongside the napo-circular-logo as shown in the design.
- **FR-005**: In both locations, the two logos MUST appear in the same left-to-right order (napo-circular-logo first, napo-title-logo second) and maintain the same relative alignment shown in the approved designs.
- **FR-006**: The footer logos MUST appear on every page that renders the shared footer, not only the Services page.
- **FR-007**: Both logo images MUST include descriptive alternative text for accessibility.
- **FR-008**: The logos MUST remain legible and non-overlapping with surrounding content across common breakpoints (mobile, tablet, desktop).

### Key Entities

- **Credential Logo**: A static brand/trust-mark image (napo-circular-logo or napo-title-logo) shown to visitors; attributes include image source and display location (About section, Footer).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of visits to the Services page show both logos rendered in the About section.
- **SC-002**: 100% of pages that include the footer show both logos rendered in the footer.
- **SC-003**: Both logos display without broken-image indicators or layout overlap across desktop, tablet, and mobile viewport widths.
- **SC-004**: The placement and order of the logos in both locations visually matches the approved reference designs.

## Assumptions

- The napo-circular-logo and napo-title-logo image assets are already final/approved and require no new design work — only placement into the existing About section and Footer layouts.
- The logos are static, non-interactive display elements (not clickable links) since the reference designs show no link affordance.
- The logos are added alongside existing About section and Footer content, without removing or replacing any current elements.
- The same pair of logos, in the same order and relative sizing, is used in both the About section and the Footer, per the reference designs.
