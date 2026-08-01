# Feature Specification: Add Site Logo and Certification Labels

**Feature Branch**: `COT-023-add-site-logo-labels`

**Created**: 2026-08-01

**Status**: Draft

**Input**: User description: "COT-023: Add Site Logo and Labels to Certification Image Logos

Description:

Add the curated-logo to the navigation and header labels to the napo-circular-logo and napo-title-logo on the services page so that it matches the design.

Acceptance Criteria:

- The user should be able to see the site logo and labels as illustrated by the design"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Brand logo visible in site header (Priority: P1)

A visitor lands on any page of the site and looks at the top navigation bar. Today the header shows only the "CURATED" wordmark and tagline; the design calls for the circular brand mark to appear beside the wordmark so the header reads as a complete, recognizable logo.

**Why this priority**: The header logo is the first brand impression on every single page and is the most visible gap between the current site and the approved design. It affects all visitors on all pages.

**Independent Test**: Load any page of the site and confirm the circular Curated logo mark appears in the header next to the "CURATED" wordmark and tagline, matching the design's layout.

**Acceptance Scenarios**:

1. **Given** a visitor opens the site on a desktop-sized screen, **When** the page loads, **Then** the header displays the Curated logo mark to the left of the "CURATED" wordmark and "PROFESSIONAL ORGANIZING" tagline.
2. **Given** a visitor opens the site on a mobile-sized screen, **When** the page loads, **Then** the header still displays the Curated logo mark alongside the wordmark, sized appropriately for the smaller viewport.
3. **Given** a visitor navigates between pages, **When** each new page loads, **Then** the logo remains visible and consistent in the header.

---

### User Story 2 - Certification labels on the Services page (Priority: P2)

A visitor viewing the "About Curated" section of the Services page sees two credential logos (the certifying-body circular mark and the NAPO title mark) but currently has no text explaining what each logo represents. The design adds a short label above each logo ("CPO Certified" and "NAPO Member") so visitors immediately understand the credentials being shown.

**Why this priority**: This clarifies existing content (the logos are already present) rather than introducing a new page element, so it is valuable but lower impact than the sitewide header logo.

**Independent Test**: Visit the Services page, scroll to the "About Curated" section, and confirm a "CPO Certified" label appears with the circular certification logo and a "NAPO Member" label appears with the NAPO title logo, matching the design.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the "About Curated" section of the Services page, **When** the section is in view, **Then** a "CPO Certified" label is displayed in association with the circular certification logo.
2. **Given** a visitor scrolls to the "About Curated" section of the Services page, **When** the section is in view, **Then** a "NAPO Member" label is displayed in association with the NAPO title logo.
3. **Given** a visitor views the section on a mobile-sized screen, **When** the labels and logos render, **Then** each label stays visually paired with its corresponding logo.

---

### Edge Cases

- What happens if the logo image fails to load? The header must still show the "CURATED" text wordmark so brand identity isn't lost, and the logo image must have descriptive alt text.
- How do the certification labels behave at narrow (mobile) widths where the two logos may stack or shrink? Labels must stay clearly paired with their logo rather than becoming ambiguous.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site navigation header MUST display the Curated logo mark alongside the existing "CURATED" wordmark and "PROFESSIONAL ORGANIZING" tagline on every page.
- **FR-002**: The header logo MUST remain visible and legible in both desktop and mobile navigation layouts.
- **FR-003**: The header logo image MUST include descriptive alt text for accessibility.
- **FR-004**: The Services page "About Curated" section MUST display a "CPO Certified" text label associated with the certifying-body circular logo.
- **FR-005**: The Services page "About Curated" section MUST display a "NAPO Member" text label associated with the NAPO title logo.
- **FR-006**: The labels MUST remain visually paired with their respective logos across supported screen sizes.
- **FR-007**: The visual placement, sizing, and styling of the header logo and the certification labels MUST match the provided design.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On 100% of pages, visitors see the Curated brand logo mark in the header without needing to scroll.
- **SC-002**: Visitors viewing the Services "About Curated" section can identify what each certification logo represents from the visible label alone, without hovering or zooming.
- **SC-003**: A side-by-side visual comparison of the live header and Services page against the design mockup shows matching logo and label placement.

## Assumptions

- The Curated logo image asset is already available in the project and only needs to be wired into the navigation header.
- "CPO Certified" and "NAPO Member" are the exact label text values, taken directly from the provided design image.
- No changes to the underlying certification logo images themselves are required — only the addition of surrounding text labels.
- Header logo behavior (e.g., linking to the homepage) follows the same pattern as the existing "CURATED" wordmark, which already links to `/`.
