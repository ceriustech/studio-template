# Feature Specification: Services Pricing section

**Feature Branch**: `COT-013-services-pricing-section`

**Created**: 2026-07-15

**Status**: Draft

**Input**: User description: "COT-013: Implement PRICING section for Services page

Description:

Implement the Pricing section on the Services page.

The Pricing section html markup for this page is located in .specify\site-design\curated-services-mockup.html under the `<!-- PRICING -->` comment

Pricing section:  Remove the package pricing while keeping the layout of the boxes and contrasting colors. (I thought about it some more and realistically showing my hourly rate would be best, I can discuss packages during the consultation call).

New Tagline: " Every product and space is unique. Services are based on an hourly rate. Your custom quote is built during your free consultation".

So pricing will be based on hourly rates with Lead Organizer at $100/hr; subsequent organizers aka Associate Organizer at $75/hr.

Lead Organizer - "Strategist that focuses on deep space conceptualization, system architect, consolidation therapy approach (managing the emotional decluttering process) and overall project creative direction".

Associate Organizer - "Specialist that focuses on independent space execution, high efficiency system implementation, inventory cataloging, labeling, and collaborative team organizing".

Make note of potential applicable fees that may be added depending on project.

Donation fees $30 per trip

Products are billed separately from organizing time.

*Travel fees may apply.

All translated styles should be camel cased

Acceptance Criteria:

- The implementation should match the design screenshot with respect to the changes mentioned"

## Clarifications

### Session 2026-07-15

- Q: Which of the three pricing cards should keep the contrasting/featured (teal border + tinted background) styling that the middle card had in the original package-pricing mockup? → A: Lead Organizer (first card).
- Q: The third card (fee notes) has no defined eyebrow/title — what should it display as its heading? → A: Eyebrow "Fine print", title "Fees".
- Q: Where should the note that the Associate Organizer rate applies to each additional/subsequent organizer appear? → A: In the price line itself (e.g., "$75 / hour per additional organizer").

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor understands the hourly pricing model (Priority: P1)

As a visitor on the Services page, I want to see a Pricing section that explains services are billed hourly rather than in fixed packages, so that I understand how cost is determined before booking a consultation.

**Why this priority**: The new tagline is the core message change for this feature — it replaces the old "starting price / package" framing with an hourly-rate framing. Without it, the rest of the section's content (rates, roles) has no context.

**Independent Test**: Load the Services page, scroll to the Pricing section, and verify the heading area displays the eyebrow "Investment", heading "Transparent pricing", and the new tagline text: "Every product and space is unique. Services are based on an hourly rate. Your custom quote is built during your free consultation."

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the Pricing section, **When** the section comes into view, **Then** they see the existing eyebrow ("Investment") and heading ("Transparent pricing") unchanged, with the tagline paragraph replaced by the new hourly-rate messaging.
2. **Given** a visitor reads the tagline, **When** they finish reading, **Then** no reference to fixed-price packages (e.g., "starting points", "$X / session", "$X / project") remains anywhere in the section.

---

### User Story 2 - Visitor compares the Lead Organizer and Associate Organizer hourly rates (Priority: P1)

As a visitor evaluating cost, I want to see the two organizer roles (Lead Organizer and Associate Organizer) with their hourly rates and a description of what each role does, so that I can understand what I'm paying for when a team works on my project.

**Why this priority**: This is the primary content replacing the removed package tiers — it is the direct answer to "what does this cost." It delivers the core value of the section on its own.

**Independent Test**: Scroll to the Pricing grid and verify two of the three cards present the Lead Organizer ($100/hour) and Associate Organizer ($75/hour) roles, each with its full descriptive text and a "Book consultation" call-to-action, reusing the existing card layout and contrasting/featured styling from the mockup.

**Acceptance Scenarios**:

1. **Given** the visitor views the first pricing card, **When** they read it, **Then** they see "Lead Organizer", the rate "$100 / hour", and the description "Strategist that focuses on deep space conceptualization, system architect, consolidation therapy approach (managing the emotional decluttering process) and overall project creative direction," and this card retains the contrasting/featured visual treatment (teal border and tinted background) from the original mockup's featured card.
2. **Given** the visitor views the second pricing card, **When** they read it, **Then** they see "Associate Organizer", the rate "$75 / hour per additional organizer", and the description "Specialist that focuses on independent space execution, high efficiency system implementation, inventory cataloging, labeling, and collaborative team organizing," rendered without the featured styling.
3. **Given** the visitor compares the two cards, **When** they look for package-tier language (e.g., "Essential", "Most popular", "Premium", room counts, "Custom quote"), **Then** none of that language remains — only role names, hourly rates, and role descriptions.

---

### User Story 3 - Visitor learns about additional fees that may apply (Priority: P2)

As a visitor budgeting for a project, I want to see a clear note about additional fees that could apply beyond the hourly rate, so that I am not surprised by extra costs like donations, products, or travel.

**Why this priority**: This is supplementary but important financial-transparency information. It depends on the two rate cards existing (User Story 2) but can be independently verified as its own card.

**Independent Test**: Scroll to the third pricing card and verify it displays the eyebrow "Fine print", the title "Fees", and lists the three fee notes: a $30 per-trip donation fee, that products are billed separately from organizing time, and that travel fees may apply.

**Acceptance Scenarios**:

1. **Given** the visitor views the third pricing card, **When** they read it, **Then** they see the eyebrow "Fine print", the title "Fees", and a list containing: "Donation fee — $30 per trip", "Products billed separately from organizing time", and "*Travel fees may apply."
2. **Given** the visitor reads the fee list, **When** they compare it to the two rate cards, **Then** the third card visually matches the same card layout (border, padding, list style) used by the Associate Organizer card, so it reads as part of the same set of three boxes.

---

### Edge Cases

- What happens at tablet and mobile viewport widths? The three pricing cards must stack into a single column while remaining fully readable, consistent with how the rest of the Pricing section and sibling sections on this page reflow at narrower widths.
- What happens if the role description text wraps to multiple lines within a card? The card must expand vertically to fit the full text without truncation or overlap with adjacent elements (divider, list, CTA).
- What happens to the fee list's asterisk note ("*Travel fees may apply")? It must render as visible body text within the card (not a separate footnote reference requiring a lookup elsewhere on the page).
- What happens to the three cards' equal-height alignment now that content lengths differ (two prose descriptions vs. one short fee list)? Cards must remain visually aligned along the same grid row per the original mockup's grid layout, even though their content lengths differ.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Services page MUST render a Pricing section using the existing eyebrow ("Investment") and heading ("Transparent pricing") from the mockup, unchanged.
- **FR-002**: The Pricing section's tagline paragraph MUST be replaced with: "Every product and space is unique. Services are based on an hourly rate. Your custom quote is built during your free consultation."
- **FR-003**: The Pricing section MUST NOT display any fixed-package pricing content (tier names such as "Essential"/"Most popular"/"Premium", room-count based tiers, "Starting at $X", or "Custom quote").
- **FR-004**: The Pricing section MUST retain the three-card grid layout and the contrasting/featured visual treatment (border color, tinted background, top accent bar) from the original mockup, applied to the first card (Lead Organizer).
- **FR-005**: The first (featured) pricing card MUST display the role name "Lead Organizer", the rate "$100 / hour", and the description "Strategist that focuses on deep space conceptualization, system architect, consolidation therapy approach (managing the emotional decluttering process) and overall project creative direction."
- **FR-006**: The second pricing card (not featured) MUST display the role name "Associate Organizer", the rate "$75 / hour per additional organizer" — communicating that this rate applies to each additional/subsequent organizer added to a project alongside the Lead Organizer — and the description "Specialist that focuses on independent space execution, high efficiency system implementation, inventory cataloging, labeling, and collaborative team organizing."
- **FR-007**: The third pricing card MUST display the eyebrow "Fine print" and the title "Fees" above its list of fee notes.
- **FR-008**: The third pricing card MUST list the applicable-fees notes: a donation fee of $30 per trip, that products are billed separately from organizing time, and that travel fees may apply.
- **FR-009**: Each of the two organizer cards MUST retain a "Book consultation" call-to-action, consistent with the original mockup's cards.
- **FR-010**: All CSS translated from the mockup into the project's stylesheet MUST use camelCase class/property names, consistent with the styling convention already used by sibling page sections (e.g., `Hero`, `About`, `Service`).

### Key Entities

- **PricingCard**: Represents one of the three boxes in the Pricing grid. Attributes: eyebrow/label, title (role name or card name), price/rate text, descriptive body content (prose or list), featured flag (whether it uses the contrasting/teal styling), call-to-action (optional).
- **FeeNote**: Represents one applicable-fee line item shown in the third pricing card (e.g., donation fee, product billing note, travel fee note).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The rendered Pricing section's three-box grid layout and contrasting/featured card styling visually match the structure of the provided design screenshot (box borders, spacing, featured card accent) at desktop viewport widths (≥1280px), with pricing content replaced per this spec.
- **SC-002**: All pricing content is accurate with zero errors — the tagline, both hourly rates, both role descriptions, and all three fee notes match the specified copy exactly, with no missing or truncated text.
- **SC-003**: No fixed-package pricing language (tier names, "Starting at $X", "Custom quote") remains anywhere in the section.
- **SC-004**: All three pricing cards remain fully readable, with no overlapping or cut-off text, at tablet and mobile viewport widths.

## Assumptions

- The three-card grid structure and the "featured" (contrasting/teal) card styling, as defined under the `<!-- PRICING -->` comment in `.specify\site-design\curated-services-mockup.html`, is the layout source of truth; only the textual content of the cards — and which card carries the featured styling — changes per this spec.
- Card order/position is: card 1 (featured) = Lead Organizer, card 2 = Associate Organizer, card 3 = applicable fees, following the order in which the roles and fees were introduced in the feature request.
- The third card reuses the existing bulleted "features list" style (checkmark list items) for the three fee notes, since fee notes are short discrete items rather than prose, consistent with how the original mockup's cards presented list content.
- The two organizer cards present their role description as the existing prose sentence provided in the request (not reformatted into a bulleted list), since the source content was written as a single descriptive sentence per role rather than a set of short feature phrases.
- The "Book consultation" call-to-action on the two organizer cards links to the same consultation booking destination used elsewhere on the Services page (e.g., the CTA section), consistent with the original mockup's cards.
- The third (fees) card does not include a "Book consultation" call-to-action, since it presents informational fee notes rather than a bookable service tier.
- Global design tokens referenced by the mockup (e.g., colors, serif/sans font stacks, spacing variables) already exist in the project's global styles, consistent with how prior sections (Hero, About, Service) were implemented.
- This section is static/presentational with fixed copy — no per-instance configuration or dynamic/CMS-driven content is required.
