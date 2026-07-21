# Feature Specification: Clickable Service Images on Home Page

**Feature Branch**: `COT-020-clickable-service-images`

**Created**: 2026-07-21

**Status**: Draft

**Input**: User description: "COT-020: Implement Clickable Images to the Services page

Description:

Under the "Personalized Services" section, the images should also be clickable to route you to the services page.

Acceptance Criteria:

- The user should be able to click an image on the home page under personalized services and be routed to the Services page"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Click a service image to view all services (Priority: P1)

As a visitor browsing the home page, I want to click on any of the service images in the "Personalized services" section so that I can quickly navigate to the full Services page without having to find the smaller "View all services" text link.

**Why this priority**: This is the entire scope of the requested change. The section already has a text link to the Services page; this story simply extends the same destination to a larger, more discoverable click target (the images), directly satisfying the stated acceptance criteria.

**Independent Test**: Can be fully tested by loading the home page, clicking on any one of the three service images in the "Personalized services" section, and confirming the browser navigates to the Services page. Delivers value on its own regardless of other stories.

**Acceptance Scenarios**:

1. **Given** a visitor is on the home page with the "Personalized services" section visible, **When** they click the "Home organizing" image, **Then** they are navigated to the Services page.
2. **Given** a visitor is on the home page with the "Personalized services" section visible, **When** they click the "Unpacking + move-in" image, **Then** they are navigated to the Services page.
3. **Given** a visitor is on the home page with the "Personalized services" section visible, **When** they click the "Business + office" image, **Then** they are navigated to the Services page.
4. **Given** a visitor is using a keyboard, **When** they tab to a service image and press Enter, **Then** they are navigated to the Services page.

---

### Edge Cases

- What happens when a visitor clicks the title or description text within a service card instead of the image itself? The card's title/description remain part of the card's existing layout and are not required to be clickable by this feature; only the image area must route to the Services page.
- How does the system handle touch devices where hover states aren't available? The image must still be tappable and navigate to the Services page even without a visible hover affordance.
- What happens when a screen reader user encounters the image? It must be announced as a link to the Services page, not just as a decorative or informational image.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page "Personalized services" section MUST render each service image as a clickable element that navigates the visitor to the Services page.
- **FR-002**: Clicking any of the three service images (Home organizing, Unpacking + move-in, Business + office) MUST route to the same Services page destination as the existing "View all services →" link.
- **FR-003**: The clickable image area MUST be reachable and operable via keyboard (focusable, activatable with Enter/Space) in addition to mouse and touch input.
- **FR-004**: Each clickable image MUST expose an accessible name describing its destination (e.g., "View all services") so assistive technology users understand it is a navigation link, not a static image.
- **FR-005**: The visual appearance and layout of the service images and cards MUST remain visually consistent with the existing design; the change only adds click/navigation behavior to the image area.
- **FR-006**: Making the image clickable MUST NOT remove or duplicate-conflict with the existing "View all services →" text link, which continues to route to the same Services page.

### Key Entities

- **Service Card**: Represents one of the three offerings shown in the "Personalized services" section (title, description, image). Gains a navigation destination (the Services page) associated with its image.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the service images in the "Personalized services" section (currently 3) navigate a visitor to the Services page when clicked.
- **SC-002**: Visitors can reach the Services page from the home page's "Personalized services" section using only the keyboard, with no more than one additional tab stop per image compared to the current experience.
- **SC-003**: No visual regression is introduced: the section's layout, spacing, and hover behavior match the pre-change appearance when the images are not being interacted with.

## Assumptions

- The click destination for every service image is the same Services page (`/services`) already used by the "View all services →" link; no per-service routing (e.g., linking each image to a specific service subsection) was requested.
- This change applies only to the home page's "Personalized services" section; the Services page's own imagery is out of scope.
- Existing hover/elevation visual effects on the cards are preserved as-is; only the underlying clickable/navigable behavior of the image is added.
