# Feature Specification: Hide About Section Logo Labels on Mobile

**Feature Branch**: `COT-037-about-logo-mobile-labels`

**Created**: 2026-10-22

**Status**: Draft

**Input**: User description: "COT-037: Update About Section Logo Items Mobile View

Description:

Update the aboutLogoItem on the Services page so that the about logo label is hidden when viewed on mobile.

Acceptance Criteria:

- The aboutLogoLabel will be hidden when the viewport is on mobile view"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Uncluttered credential logos on mobile (Priority: P1)

A visitor on a phone scrolls to the "About Curated" section of the Services page. Today, each credential logo (NAPO and the Board of Certification for Professional Organizers) has a long uppercase, widely letter-spaced label above it. On a narrow screen these labels wrap onto five or six lines each, pushing the logos down and making the section feel cluttered. On mobile the visitor should see only the logos themselves, sitting neatly under the founder's signature.

**Why this priority**: This is the entire scope of the ticket. The wrapped labels are the most visible layout problem in this section on phones.

**Independent Test**: Open the Services page at a mobile viewport width, scroll to the "About Curated" section, and confirm the credential logos appear with no text labels above them. Then widen the viewport past the mobile breakpoint and confirm the labels reappear.

**Acceptance Scenarios**:

1. **Given** a visitor views the Services page at a mobile viewport width, **When** the "About Curated" section is in view, **Then** no credential logo labels are visible and only the logo images are shown.
2. **Given** a visitor views the Services page at a tablet or desktop viewport width, **When** the "About Curated" section is in view, **Then** each credential logo still shows its label exactly as it does today.
3. **Given** a visitor resizes the browser or rotates a device across the mobile breakpoint, **When** the width crosses the threshold, **Then** the labels hide or reappear to match the new width without a page reload.
4. **Given** a visitor views the section at a mobile viewport width, **When** the labels are hidden, **Then** the logos stay side by side and evenly spaced, without blank space left where the labels used to be.

---

### Edge Cases

- **Badge without a label**: A credential added in the content studio with no label already renders without one. Its appearance must not change on any viewport.
- **Screen readers on mobile**: With the visible label hidden, the logo's alternative text still describes the credential, so assistive-technology users don't lose any information.
- **Viewports just above the mobile threshold** (small tablets, landscape phones): labels remain visible. Only widths at or below the mobile breakpoint hide them.
- **Content editors**: Labels stay editable in the content studio and continue to appear on larger screens. Hiding them on mobile changes no stored content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On the Services page "About Curated" section, credential logo labels MUST NOT be visible when the viewport is at or below the site's mobile breakpoint.
- **FR-002**: Credential logo labels MUST remain visible, with unchanged styling and placement, at viewport widths above the mobile breakpoint.
- **FR-003**: Credential logo images MUST remain visible at every viewport width.
- **FR-004**: When labels are hidden, the logo row MUST NOT reserve empty space for them, and logos MUST remain aligned with one another.
- **FR-005**: Each credential logo MUST keep its descriptive alternative text so its meaning stays available to assistive technologies when the label is hidden.
- **FR-006**: The change MUST be limited to the Services page "About Curated" credential logos. No other page, section, or content field may be affected.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At a mobile viewport width, 0 credential labels are visible in the "About Curated" section, and 100% of credential logos are visible.
- **SC-002**: At tablet and desktop widths, 100% of credential labels that have content are visible, matching the current appearance.
- **SC-003**: On mobile, the vertical space taken up by the credential logo area shrinks by at least half compared with the current wrapped-label layout.
- **SC-004**: An automated accessibility check of the section on mobile reports no new issues, and each logo still announces a meaningful name.

## Assumptions

- "Mobile view" means the site's existing mobile breakpoint, viewport widths of 480px and below, which other Services page sections already use. Tablet widths (481px–768px) keep the labels.
- Labels are hidden visually only. Their text stays in the content studio and continues to show on larger screens. No content or schema changes are needed.
- The existing logo alt text, managed through the content studio, describes each credential well enough to stand in for the hidden label on mobile.
- No change to logo image size or the section's other content (bio, signature, photo) is in scope.
