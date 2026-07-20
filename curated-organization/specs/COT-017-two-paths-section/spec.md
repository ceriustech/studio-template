# Feature Specification: Two Paths section

**Feature Branch**: `COT-017-two-paths-section`

**Created**: 2026-07-20

**Status**: Draft

**Input**: User description: "COT-017: Implement TWO PATHS section for Booking page

Description:

Implement the TWO PATHS section on the Booking page.

The Hero section html markup for this page is located in ...specify\site-design\curated-gallery-mockup.html under the `<!-- TWO PATHS -->` comment

All translated styles should be camel cased

Acceptance Criteria:

- The implementation should match the design screenshot exactly"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New client starts the intake questionnaire (Priority: P1)

As a first-time visitor to the Booking page, I want to see a clearly labeled "Get started" option that explains what it involves and how long it takes, so that I can confidently begin the intake process for my first consultation.

**Why this priority**: New-client intake is the primary conversion path for the Booking page — most visitors arriving from marketing or search are new to Curated, so this card must be immediately understandable and actionable. It is independently deliverable and testable as its own card.

**Independent Test**: Load the Booking page below the hero and verify the left card displays a "+" icon, the title "Get started," the description text about telling Curated about your space/goals ("takes about 3 minutes"), and a solid "Start questionnaire" button that links to the questionnaire section.

**Acceptance Scenarios**:

1. **Given** a visitor viewing the Booking page, **When** they reach the Two Paths section, **Then** they see a left-hand card with a circular "+" icon, the heading "Get started," the description "New to Curated? Tell us about your space and goals, then pick a time to meet. Takes about 3 minutes.", and a solid dark "Start questionnaire" button.
2. **Given** the visitor is viewing the "Get started" card, **When** they click "Start questionnaire," **Then** they are taken to the questionnaire section of the page.
3. **Given** the visitor hovers over the "Get started" card, **When** the hover state activates, **Then** the card background and icon styling shift subtly and the button lifts slightly with a shadow, consistent with the mockup.

---

### User Story 2 - Returning client books another session (Priority: P2)

As a returning Curated client, I want a clearly labeled "Book again" option that skips the intake questionnaire, so that I can go straight to scheduling my next session without repeating information I've already provided.

**Why this priority**: Returning clients are a smaller but valuable segment; skipping redundant intake reduces friction and repeat-booking abandonment. This card is visually and functionally independent from the "Get started" card and can be built and verified on its own.

**Independent Test**: Load the Booking page below the hero and verify the right card displays a "↻" icon, the title "Book again," the description text about skipping the intake, and an outlined "Schedule now" button that links to the scheduling section.

**Acceptance Scenarios**:

1. **Given** a visitor viewing the Booking page, **When** they reach the Two Paths section, **Then** they see a right-hand card with a circular "↻" icon, the heading "Book again," the description "Welcome back. Skip the intake and go straight to scheduling your next session.", and an outlined "Schedule now" button.
2. **Given** the visitor is viewing the "Book again" card, **When** they click "Schedule now," **Then** they are taken to the scheduling section of the page.
3. **Given** the visitor hovers over the "Book again" card, **When** the hover state activates, **Then** the card background and icon styling shift subtly and the button inverts to a filled state, consistent with the mockup.

---

### Edge Cases

- What happens at tablet and mobile viewport widths? The two cards must remain fully readable; if the mockup's two-column grid does not have an explicit responsive breakpoint, the cards retain their proportions and text remains legible without overlap or truncation down to the smallest supported viewport.
- What happens when the description text wraps to two lines (as shown in the mockup for both cards)? Line spacing and card height must remain visually consistent with the mockup with no cramped or overlapping lines.
- What happens on the shared vertical divider between the two cards? It must render as a single hairline border, not double or missing, regardless of any differences in each card's content height.
- What happens when a card is focused via keyboard navigation (not just mouse hover)? The button must expose a visible focus state so keyboard users can identify the actionable element.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Booking page MUST render a Two Paths section directly below the Hero section, containing exactly two cards arranged side by side.
- **FR-002**: The left card MUST display, in order, a circular icon containing a "+" symbol, the heading "Get started," the description "New to Curated? Tell us about your space and goals, then pick a time to meet. Takes about 3 minutes.", and a solid/filled button labeled "Start questionnaire" that links to the questionnaire section of the page.
- **FR-003**: The right card MUST display, in order, a circular icon containing a "↻" symbol, the heading "Book again," the description "Welcome back. Skip the intake and go straight to scheduling your next session.", and an outlined button labeled "Schedule now" that links to the scheduling section of the page.
- **FR-004**: Each card's content (icon, heading, description, button) MUST be centered within its card, matching the mockup.
- **FR-005**: The left and right cards MUST use visually distinct background shades (left lighter, right slightly deeper), separated by a single vertical hairline divider, matching the mockup.
- **FR-006**: Each card MUST display a hover state that adjusts the card background and icon styling, and each button MUST display its own hover state (solid button darkens and lifts with a shadow; outlined button fills solid), matching the mockup.
- **FR-007**: The section's visual styling (layout, spacing, colors, typography, icon circles, button treatments) MUST match the design mockup markup found under the `<!-- TWO PATHS -->` comment in `.specify/site-design/curated-book-mockup.html`.
- **FR-008**: All CSS style translated from the mockup into the project's stylesheet MUST use camelCase class names, consistent with the styling convention already used by sibling page sections (e.g., `Intro`, `Services`, `Process`, `Testimonial`, `Cta`, `Footer`, Services `Hero`, Gallery `Hero`, Booking `Hero`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The rendered Two Paths section visually matches the provided design screenshot with no discernible differences in layout, spacing, typography, centering, colors, icons, or button styling at desktop viewport widths (≥1280px).
- **SC-002**: Both cards and their buttons remain fully readable and clickable, with all text visible and non-overlapping, at tablet and mobile viewport widths.
- **SC-003**: Visitors can reach either the questionnaire or the scheduling section from the Two Paths section in a single click, with no dead or mis-targeted links.

## Assumptions

- The HTML/CSS markup under the `<!-- TWO PATHS -->` comment in `.specify/site-design/curated-book-mockup.html` is the source of truth for structure, spacing, and visual styling (the user description referenced the gallery mockup file, but the "TWO PATHS" markup and its `.paths`/`.path-card` styling exist only in `curated-book-mockup.html`, the Booking page's own mockup); the provided screenshot reflects this same markup's resting state.
- This section is static/presentational with fixed copy — no per-instance configuration, dynamic content, or actual questionnaire/scheduling logic is required or in scope; the buttons link to the in-page `#questionnaire` and `#calendly` sections as anchors, consistent with the mockup.
- Global design tokens referenced by the mockup (e.g., warm white/warm background/cream shades, charcoal, taupe, border colors, serif/sans font stacks) already exist or will be reused from the project's global styles, consistent with how the Booking page Hero and prior sections were implemented.
- This feature implements the Two Paths component within the existing Booking route (`app/routes/pages/booking/`), following the same component-per-section pattern used for the Booking Hero and other page sections (e.g., a `TwoPaths` route-local component under `app/routes/pages/booking/components/`).
