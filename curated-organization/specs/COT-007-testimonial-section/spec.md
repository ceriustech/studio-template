# Feature Specification: Testimonial section

**Feature Branch**: `COT-007-testimonial-section`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: "COT-007: Testimonial section

Description:

Implement the Testimonial section on the home page.

The intro section html markup is located in .specify\site-design\curated-home-mockup.html under the `<!-- TESTIMONIAL -->` comment
All translated styles should be camel cased

Acceptance Criteria:

- The Testimonial section should match the design screenshot exactly
- This should be a carousel that can accommodate as many testimonials as needed"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor reads a client testimonial to build trust (Priority: P1)

As a site visitor browsing the home page, I want to see a genuine client testimonial with a star rating, so that I feel confident the service delivers real results before I book a consultation.

**Why this priority**: Social proof is a key trust-building block ahead of the final call-to-action. Even with only one testimonial configured, the section must render correctly and match the design — this is the MVP slice.

**Independent Test**: Load the home page with a single testimonial configured and scroll to the Testimonial section. Verify the star rating, quote mark, testimonial text, and client attribution (name and location) render centered, matching the provided design screenshot.

**Acceptance Scenarios**:

1. **Given** a visitor on the home page at desktop width, **When** the page scrolls to the Testimonial section, **Then** the visitor sees a 5-star rating, a large decorative quote mark, the testimonial quote text, and the client's attribution line ("— Client name, Location"), centered on the page.
2. **Given** only one testimonial is configured, **When** the Testimonial section renders, **Then** no carousel navigation controls (arrows/dots) are shown, since there is nothing to navigate to.
3. **Given** the Testimonial section has rendered, **When** the visitor visually compares it to the design screenshot, **Then** typography (serif italic quote text, sans attribution), spacing, colors, and the star rating and quote mark styling match the screenshot exactly.

---

### User Story 2 - Visitor browses multiple client testimonials (Priority: P2)

As a site visitor, I want to move between several client testimonials, so that I can see a broader range of positive outcomes before deciding to book.

**Why this priority**: A single fixed testimonial has limited persuasive power; letting visitors browse several strengthens trust. This builds directly on User Story 1's static presentation.

**Independent Test**: Configure three or more testimonials and load the home page. Verify the visitor can navigate forward and backward through all testimonials, with each one rendering the same layout as User Story 1.

**Acceptance Scenarios**:

1. **Given** more than one testimonial is configured, **When** the Testimonial section renders, **Then** navigation controls are visible, allowing the visitor to advance to the next testimonial and return to the previous one.
2. **Given** the visitor is viewing the last testimonial, **When** they navigate forward, **Then** the carousel returns to the first testimonial (and vice versa navigating backward from the first).
3. **Given** the visitor navigates between testimonials, **When** a new testimonial is shown, **Then** its star rating, quote text, and attribution fully replace the previous testimonial's content without overlapping or leaving stale text visible.
4. **Given** the Testimonial section supports any number of entries, **When** additional testimonials are added to the configured list, **Then** the carousel accommodates them without requiring layout or code changes.

### Edge Cases

- What happens when a testimonial's quote text is noticeably longer or shorter than others? The section's height and spacing must remain visually consistent (no layout jump) as the visitor navigates between testimonials.
- What happens when only one testimonial exists? Navigation controls must not appear, and the section must match the design screenshot exactly with no empty/disabled controls shown.
- What happens when the visitor reaches the last testimonial and continues navigating forward, or reaches the first and navigates backward? The carousel must loop rather than dead-end.
- What happens at mobile viewport widths? The active testimonial's star rating, quote mark, text, and attribution must remain legible and centered, and navigation controls must remain reachable (e.g., via touch/swipe or visible tap targets).
- What happens if a testimonial is configured with a star rating other than 5 (e.g., 4 stars)? The section must render the configured number of filled stars accurately.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The home page MUST render a standalone Testimonial section positioned after the Process section and before the closing call-to-action section, following the section order established in the design mockup.
- **FR-002**: The Testimonial section MUST display, for the active testimonial: a star rating, a decorative quote mark, the testimonial quote text, and a client attribution line ("— Client name, Location"), in that visual order, centered on the page — matching the content and layout shown in the design mockup.
- **FR-003**: The Testimonial section MUST support an arbitrary number of testimonial entries (one or many), each with its own star rating, quote text, and client attribution.
- **FR-004**: When more than one testimonial is configured, the section MUST provide navigation controls that let the visitor move to the next and previous testimonial.
- **FR-005**: When exactly one testimonial is configured, the section MUST NOT display any navigation controls, and MUST match the design screenshot exactly.
- **FR-006**: Navigation MUST loop — advancing past the last testimonial returns to the first, and going back from the first testimonial returns to the last.
- **FR-007**: Switching between testimonials MUST fully replace the displayed star rating, quote text, and attribution with no stale content or overlapping text.
- **FR-008**: The section's visual styling (background, spacing, typography, and colors) MUST match the design mockup markup found under the `<!-- TESTIMONIAL -->` comment in `.specify/site-design/curated-home-mockup.html`.
- **FR-009**: The section MUST remain legible and centered at mobile viewport widths, with navigation controls reachable via touch or visible tap targets.
- **FR-010**: All CSS style translated from the mockup into the project's stylesheet MUST use camelCase class names, consistent with the styling convention already used by sibling home page sections (e.g., `Intro`, `Services`, `Process`).

### Key Entities

- **Testimonial**: A single client endorsement, with attributes: star rating (number of stars), quote text, client name, and client location (e.g., city/state).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: With a single testimonial configured, the rendered Testimonial section visually matches the provided design screenshot with no discernible differences in layout, spacing, typography, or color at desktop viewport widths (≥1280px).
- **SC-002**: With multiple testimonials configured, a visitor can view every testimonial in the set by navigating forward from the first, without any testimonial becoming unreachable or the carousel becoming stuck.
- **SC-003**: A visitor can identify the star rating, quote, and attributed client for the currently displayed testimonial within 5 seconds of viewing the section, without overlapping or cut-off content, at both desktop and mobile viewport widths.
- **SC-004**: Adding a new testimonial to the configured set requires no layout rework — the carousel accommodates it using the same navigation and presentation as existing entries.

## Assumptions

- The HTML/CSS markup under the `<!-- TESTIMONIAL -->` comment in `.specify/site-design/curated-home-mockup.html` is the source of truth for the single-testimonial structure, spacing, and visual styling; the design screenshot shows only the single-testimonial resting state, since the mockup itself contains one static testimonial.
- Since the mockup provides no carousel navigation markup, the presence and style of navigation controls (e.g., arrows and/or dots) when multiple testimonials exist is a reasonable extrapolation consistent with the rest of the site's minimal, understated visual language; controls are hidden entirely when only one testimonial exists so the single-testimonial state matches the screenshot exactly.
- Navigation is manual (visitor-initiated); no auto-advance/autoplay behavior is required, consistent with the static, presentational nature of sibling sections (Intro, Services, Process).
- Testimonial content (star rating, quote text, client name and location) is expected to grow over time as new clients are added, distinct from the fixed, rarely-changing content of the Process section; the number of testimonials is not fixed at implementation time.
- Global design tokens referenced by the mockup (e.g., warm background, taupe, charcoal, serif/sans font stacks) already exist or will be reproduced in the project's global styles, consistent with how prior sections (Intro, Services, Process, Before/After) were implemented.
