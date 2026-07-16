# Feature Specification: Services Offerings section

**Feature Branch**: `COT-012-services-offerings-section`

**Created**: 2026-07-15

**Status**: Draft

**Input**: User description: "COT-012: Implement Services section for Services page

Description:

Implement the Services section on the Services page.

The Services section html markup for this page is located in .specify\site-design\curated-services-mockup.html under the following comments:
`<!-- SERVICE 1: Home Organizing-->`
`<!-- SERVICE 2: Unpacking + Move-in -->`
`<!-- SERVICE 3: Business + Office -->`

Add a fourth and fifth service section with the following:

The fourth section heading should be called 'Legacy Transitions'.

Heading Subtext:
"We guide families through major life transitions with absolute discretion, care and ease. Whether navigating a sensitive downsize or honoring the estate of a loved one, we manage the entire process by transforming overwhelming logistics into a peaceful, respectful transition".

Use the following URL for the image for this section: https://plus.unsplash.com/premium_photo-1733324428864-3450ea2da8bf?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D

The services list for this section:
Compassionate discretionary sorting
Responsible consignment & Donation curation
Seamless Heirloom Logistics- ensuring family pieces reach their next home safely.
Digital decluttering and legacy protection

========================

The fifth section heading should be called 'Executive Functioning Coach'.

Heading Subtext:
"Executive functioning skills are the mental processes that help us plan, organize, manage time, stay focused, and follow through on tasks in everyday life".

Use the following URL for the image for this section: https://plus.unsplash.com/premium_photo-1661754876215-247b4db12e83?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D

The services list for this section:
30-60 minute virtual coaching sessions
Personalized strategies
Compassionate accountability to help you build and maintain sustainable habits.

All translated styles should be camel cased

Acceptance Criteria:

- The implementation should match the design screenshot exactly
- The new fourth section should match the alternating pattern for this section"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor browses the three core service offerings (Priority: P1)

As a visitor on the Services page, I want to see detailed, image-paired descriptions of the Home Organizing, Unpacking + Move-in, and Business + Office services directly below the About section, so that I understand exactly what each service includes before deciding to get started.

**Why this priority**: These three service items are the foundational content block referenced directly by the design mockup and are the minimum viable rendering of the Services section. Without them, the page has no service detail content at all.

**Independent Test**: Load the Services page and scroll to the Service section. Verify three service items render in order — Home Organizing (01), Unpacking + Move-in (02), Business + Office (03) — each with an image, numbered eyebrow, heading, description, bulleted list of inclusions, and a "Get started" link, matching the markup under the corresponding comments in `.specify\site-design\curated-services-mockup.html`.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the Service section, **When** the first item comes into view, **Then** they see "01 / Home organizing" with its image on the left and text content (heading, description, five-item list, "Get started" link) on the right.
2. **Given** the visitor continues scrolling, **When** the second item comes into view, **Then** they see "02 / Unpacking + move-in" with its layout reversed — text content on the left and image on the right.
3. **Given** the visitor continues scrolling, **When** the third item comes into view, **Then** they see "03 / Business + office" with its image on the left and text content on the right (layout returns to the non-reversed orientation).

---

### User Story 2 - Visitor learns about the Legacy Transitions service (Priority: P2)

As a visitor evaluating services for a sensitive life transition (downsizing or estate management), I want a fourth service item describing Legacy Transitions with its own image and list of inclusions, so that I can recognize this specialized offering and understand what support is available.

**Why this priority**: This is new content being added to the page. It depends on the Service section container already existing (User Story 1) but is independently viewable and valuable once added, and can be verified without the fifth item being present.

**Independent Test**: Scroll to the fourth item in the Service section and verify it displays the eyebrow "04", heading "Legacy Transitions", the provided descriptive subtext, the provided background image, and a four-item bulleted list (Compassionate discretionary sorting; Responsible consignment & Donation curation; Seamless Heirloom Logistics — ensuring family pieces reach their next home safely; Digital decluttering and legacy protection).

**Acceptance Scenarios**:

1. **Given** a visitor scrolls past the Business + Office item, **When** the fourth item comes into view, **Then** they see "04 / Legacy Transitions" with the provided heading subtext and four-item services list.
2. **Given** the visitor observes the layout of the fourth item, **When** compared to the alternating pattern established by items 1–3, **Then** the fourth item's layout is reversed (text content on the left, image on the right), continuing the alternation from the non-reversed third item.

---

### User Story 3 - Visitor learns about the Executive Functioning Coach service (Priority: P3)

As a visitor interested in ongoing organizational support, I want a fifth service item describing Executive Functioning Coaching with its own image and list of inclusions, so that I understand this coaching offering is available alongside the hands-on organizing services.

**Why this priority**: This is the final piece of new content for this feature. It is independently viewable once the Service section and prior items exist, and delivers standalone value describing a distinct service.

**Independent Test**: Scroll to the fifth item in the Service section and verify it displays the eyebrow "05", heading "Executive Functioning Coach", the provided descriptive subtext, the provided background image, and a three-item bulleted list (30-60 minute virtual coaching sessions; Personalized strategies; Compassionate accountability to help you build and maintain sustainable habits).

**Acceptance Scenarios**:

1. **Given** a visitor scrolls past the Legacy Transitions item, **When** the fifth item comes into view, **Then** they see "05 / Executive Functioning Coach" with the provided heading subtext and three-item services list.
2. **Given** the visitor observes the layout of the fifth item, **When** compared to the reversed fourth item, **Then** the fifth item's layout continues the alternation (image on the left, text content on the right, matching the non-reversed orientation of items 1 and 3).

---

### Edge Cases

- What happens at tablet and mobile viewport widths? Each service item's image/text pair must stack vertically (image above or below text, per the existing reversed/non-reversed order) while remaining fully readable, consistent with how items 1–3 and sibling sections on this page reflow at narrower widths.
- What happens if a service item's background image fails to load? The text content (eyebrow, heading, description, list, CTA) must still render fully in its designated column without collapsing the layout.
- What happens when a service item's bulleted list has a different number of entries than its neighbors (e.g., three items vs. five)? The list must render correctly without empty placeholder rows and without disrupting the vertical rhythm of the item.
- How does the section handle the long-form subtext for Legacy Transitions and Executive Functioning Coach compared to the shorter descriptions in items 1–3? Text must wrap naturally within the existing text-column width without overflowing or overlapping adjacent elements.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Services page MUST render a standalone Service section directly below the About section and above the Pricing section.
- **FR-002**: The Service section MUST contain exactly five service items, rendered in this order: (1) Home Organizing, (2) Unpacking + Move-in, (3) Business + Office, (4) Legacy Transitions, (5) Executive Functioning Coach.
- **FR-003**: Each service item MUST display, in order: a numbered eyebrow label (zero-padded: "01" through "05"), a heading, a descriptive paragraph, a bulleted list of included services, and a "Get started" call-to-action link, consistent with the structure used by items 1–3.
- **FR-004**: The first three service items (Home Organizing, Unpacking + Move-in, Business + Office) MUST match the content, structure, and styling defined under the `<!-- SERVICE 1: Home Organizing-->`, `<!-- SERVICE 2: Unpacking + Move-in -->`, and `<!-- SERVICE 3: Business + Office -->` comments in `.specify\site-design\curated-services-mockup.html` exactly.
- **FR-005**: Service items MUST alternate their image/text column layout: items 1, 3, and 5 display the image on the left and text on the right (non-reversed); items 2 and 4 display text on the left and image on the right (reversed).
- **FR-006**: The fourth service item MUST use the heading "Legacy Transitions", the description "We guide families through major life transitions with absolute discretion, care and ease. Whether navigating a sensitive downsize or honoring the estate of a loved one, we manage the entire process by transforming overwhelming logistics into a peaceful, respectful transition", the image at `https://plus.unsplash.com/premium_photo-1733324428864-3450ea2da8bf?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`, and the four-item list: "Compassionate discretionary sorting", "Responsible consignment & Donation curation", "Seamless Heirloom Logistics — ensuring family pieces reach their next home safely", "Digital decluttering and legacy protection".
- **FR-007**: The fifth service item MUST use the heading "Executive Functioning Coach", the description "Executive functioning skills are the mental processes that help us plan, organize, manage time, stay focused, and follow through on tasks in everyday life", the image at `https://plus.unsplash.com/premium_photo-1661754876215-247b4db12e83?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`, and the three-item list: "30-60 minute virtual coaching sessions", "Personalized strategies", "Compassionate accountability to help you build and maintain sustainable habits".
- **FR-008**: All CSS translated from the mockup into the project's stylesheet MUST use camelCase class/property names, consistent with the styling convention already used by sibling page sections (e.g., `Hero`, `About`, `Pricing`).

### Key Entities

- **ServiceItem**: Represents one entry in the Service section. Attributes: order/number (eyebrow, e.g. "01"), heading, description, image URL, list of included services (variable length), CTA label/link, layout orientation (reversed or non-reversed).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The rendered Service section's first three items visually match the provided design screenshot with no discernible differences in layout, spacing, typography, image treatment, or color at desktop viewport widths (≥1280px).
- **SC-002**: All five service items display correctly with zero content errors — every heading, description, image, and list item matches the specified copy exactly, with no missing or truncated text.
- **SC-003**: The alternating image/text layout is visually consistent across all five items with no two consecutive items sharing the same orientation.
- **SC-004**: All five service items remain fully readable, with image, eyebrow, heading, description, list, and CTA all visible and non-overlapping, at tablet and mobile viewport widths.

## Assumptions

- The HTML/CSS markup under the `<!-- SERVICE 1 -->`, `<!-- SERVICE 2 -->`, and `<!-- SERVICE 3 -->` comments in `.specify\site-design\curated-services-mockup.html` is the source of truth for the structure, spacing, and visual styling applied to all five service items, including the new fourth and fifth items.
- Minor stray whitespace in the feature description's provided copy (e.g., a double space before "Whether", a space before a period) is a typo and has been normalized to standard spacing in this specification; the intended wording is unchanged.
- The fourth and fifth service items reuse the "Get started" call-to-action link in the same style as items 1–3, since no alternate CTA was specified.
- The numbered eyebrow for the fourth and fifth items follows the same zero-padded two-digit format ("04", "05") established by items 1–3.
- Global design tokens referenced by the mockup (e.g., colors, serif/sans font stacks, spacing variables) already exist or will be reproduced in the project's global styles, consistent with how prior sections (Hero, About, Pricing) were implemented.
- This section is static/presentational with fixed copy and fixed images for all five items — no per-instance configuration or dynamic/CMS-driven content is required.
- The existing placeholder `Service` component under `app/routes/pages/services/components/service/` is the intended implementation target for this feature.
