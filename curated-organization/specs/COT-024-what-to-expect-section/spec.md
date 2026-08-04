# Feature Specification: What to Expect Section

**Feature Branch**: `COT-024-what-to-expect-section`

**Created**: 2026-08-04

**Status**: Draft

**Input**: User description: "COT-024: Add What to Expect section as a replacement for the booking section for Booking page

Description:

Add What to Expect section as a replacement for the booking section for Booking page. We want to conditionally render the new 'WhatToExpect' section so that it replaces the 'Cta' section when we're on the '/booking' route.

Acceptance Criteria:

- The section should look just like the screenshot as illustrated by the design"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Booking visitor sees what happens after they book (Priority: P1)

A visitor on the Booking page reaches the bottom of the page. Everywhere else on the site, this space shows a generic "Ready to transform your space?" call-to-action prompting the visitor to book a consultation. On the Booking page itself, that prompt is redundant — the visitor is already booking. Instead, the visitor sees a "What to Expect" section that walks them through what happens after they submit their booking, in three steps: confirmation email, 30-minute consultation, and custom proposal.

**Why this priority**: This is the entire scope of the feature — without it, there is no change to ship. It directly addresses visitor uncertainty at the exact moment they are deciding whether to complete a booking, which is the highest-value moment on the page.

**Independent Test**: Navigate to the `/booking` route and confirm the "What to Expect" section appears in place of the "Ready to transform your space?" call-to-action, showing the three-step breakdown (Confirmation email, 30-minute consultation, Custom proposal), matching the provided design.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the `/booking` route, **When** the page loads, **Then** the "What to Expect" section is displayed instead of the "Ready to transform your space?" call-to-action section.
2. **Given** a visitor is on the "What to Expect" section, **When** they view it, **Then** they see the eyebrow label "What to Expect", the heading "After you book", and three numbered steps (01, 02, 03) each with a title and description: "Confirmation email" ("You'll receive a calendar invite with a Zoom or phone link within minutes"), "30-minute consultation" ("We'll discuss your space, goals, timeline, and answer any questions you have"), and "Custom proposal" ("Within 48 hours you'll receive a tailored plan and quote for your project").
3. **Given** a visitor is on the "What to Expect" section, **When** they view it on a mobile-sized screen, **Then** the three steps remain readable and clearly ordered, matching a mobile-appropriate layout consistent with the design.

---

### User Story 2 - Visitors on every other page continue to see the booking call-to-action (Priority: P2)

A visitor browsing any page other than `/booking` (Home, Services, Gallery, etc.) reaches the bottom of the page and still sees the existing "Ready to transform your space?" call-to-action encouraging them to book a consultation, unchanged from today's behavior.

**Why this priority**: Preserving the existing call-to-action everywhere else is necessary so this change doesn't regress the site's primary conversion prompt, but it requires no new work beyond correctly scoping the conditional — hence lower priority than the new section itself.

**Independent Test**: Navigate to any non-booking page (e.g. Home, Services, Gallery) and confirm the "Ready to transform your space?" call-to-action section still appears at the bottom of the page as it does today.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to a page other than `/booking`, **When** the page loads, **Then** the "Ready to transform your space?" call-to-action section is displayed, unchanged from current behavior.
2. **Given** a visitor navigates from `/booking` to another page, **When** the new page loads, **Then** the "What to Expect" section is no longer shown and the call-to-action section is shown instead.

---

### Edge Cases

- What happens on nested or sub-paths under `/booking` (if any exist)? The "What to Expect" section is scoped to the `/booking` route itself; other routes continue to show the call-to-action.
- How does the section behave while the Booking page's own content (e.g. the questionnaire or calendar) is loading or changing state? The "What to Expect" section's visibility depends only on the current route, not on the Booking page's internal state, so it remains visible throughout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST display a "What to Expect" section instead of the "Ready to transform your space?" call-to-action section when the visitor is on the `/booking` route.
- **FR-002**: The site MUST continue to display the existing "Ready to transform your space?" call-to-action section on every route other than `/booking`.
- **FR-003**: The "What to Expect" section MUST display the eyebrow label "What to Expect" and the heading "After you book".
- **FR-004**: The "What to Expect" section MUST display exactly three numbered steps (01, 02, 03), each with a title and supporting description, in the following order and content:
  1. "Confirmation email" — "You'll receive a calendar invite with a Zoom or phone link within minutes"
  2. "30-minute consultation" — "We'll discuss your space, goals, timeline, and answer any questions you have"
  3. "Custom proposal" — "Within 48 hours you'll receive a tailored plan and quote for your project"
- **FR-005**: The visual placement, spacing, typography, and styling of the "What to Expect" section MUST match the provided design.
- **FR-006**: The "What to Expect" section MUST render correctly across desktop and mobile screen sizes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of visits to the `/booking` route show the "What to Expect" section instead of the call-to-action section.
- **SC-002**: 100% of visits to any non-booking route continue to show the existing call-to-action section, with no visible regression.
- **SC-003**: A side-by-side visual comparison of the live "What to Expect" section against the design mockup shows matching content, layout, and step ordering.

## Assumptions

- "What to Expect" is a new, standalone section distinct from the Booking page's existing hero, two-paths, questionnaire, and calendar content — it replaces only the sitewide call-to-action slot at the bottom of the page.
- The section's visibility is determined solely by the current route being `/booking`; no other condition (e.g. booking form completion state) affects whether it is shown.
- The eyebrow label, heading, step numbers, titles, and descriptions shown in the design are the exact final copy for this section.
- No interactive behavior (links, buttons, animations) is required within the "What to Expect" section beyond what is shown in the design — it is a static informational section.
