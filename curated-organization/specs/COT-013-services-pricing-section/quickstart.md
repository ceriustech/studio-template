# Quickstart: Validating the Services Pricing section

Manual validation guide — this repo has no automated test runner configured. Validate against
`spec.md`'s Acceptance Scenarios and Success Criteria.

## Prerequisites

- Dependencies installed (`npm install` at repo root, if not already done).
- Dev server runnable via the project's existing `npm run dev` script (React Router v7 dev
  server).

## 1. Header and tagline (User Story 1 / FR-001 / FR-002 / SC-002)

1. Start the dev server and open the Services page in a browser at desktop width (≥1280px).
2. Scroll to the Pricing section, directly below Service and above the footer.
3. Confirm the eyebrow reads **"Investment"** and the heading reads **"Transparent pricing"**
   (both unchanged from the mockup).
4. Confirm the tagline paragraph reads exactly: "Every product and space is unique. Services are
   based on an hourly rate. Your custom quote is built during your free consultation."
5. Confirm no fixed-package language ("Starting at $X", "Custom quote", "Essential", "Most
   popular", "Premium", room counts) appears anywhere in the section (FR-003, SC-003).

**Expected**: Header/eyebrow unchanged; tagline replaced exactly; zero package-pricing language
remains.

## 2. Lead Organizer and Associate Organizer cards (User Story 2 / FR-004–FR-006 / SC-002)

1. Confirm the first (leftmost) card is **featured** — teal border, tinted background, top accent
   bar — and displays:
   - Eyebrow **"Lead"**, title **"Lead Organizer"**, rate **"$100 / hour"**.
   - Description: "Strategist that focuses on deep space conceptualization, system architect,
     consolidation therapy approach (managing the emotional decluttering process) and overall
     project creative direction."
   - A "Book consultation" CTA styled as the featured (filled) button.
2. Confirm the second card is **not** featured and displays:
   - Eyebrow **"Associate"**, title **"Associate Organizer"**, rate **"$75 / hour per additional
     organizer"**.
   - Description: "Specialist that focuses on independent space execution, high efficiency
     system implementation, inventory cataloging, labeling, and collaborative team organizing."
   - A "Book consultation" CTA styled as the non-featured (outline) button.

**Expected**: Copy matches exactly with no missing/truncated text; only card 1 carries the
featured/contrasting styling.

## 3. Fees card (User Story 3 / FR-007–FR-008 / SC-002)

1. Confirm the third card displays eyebrow **"Fine print"** and title **"Fees"**.
2. Confirm the card lists exactly three fee notes: "Donation fee — $30 per trip"; "Products
   billed separately from organizing time"; "*Travel fees may apply".
3. Confirm the card has **no** "Book consultation" CTA and uses the same non-featured card layout
   (border, padding, list style) as the Associate Organizer card.

**Expected**: All three fee notes present verbatim; no CTA on this card; visually consistent with
the other non-featured card.

## 4. Overall layout match against the design screenshot (SC-001)

1. Compare the three-card grid's structure — column count, card borders, spacing, featured-card
   accent — against the provided design screenshot.
2. Confirm the grid layout, spacing, and featured-card visual treatment match, even though the
   pricing copy itself has changed per this feature.

**Expected**: No discernible layout/spacing/styling differences from the screenshot's structure.

## 5. Tablet and mobile viewport (SC-004, Edge Cases)

1. Resize the browser (or use device emulation) to a tablet width (e.g., 768px) and confirm the
   three-card grid stacks into a single column, with every card's eyebrow, title, price/description
   or fee list, and CTA (where present) fully readable and non-overlapping.
2. Resize to a mobile width (e.g., 375px) and confirm the same.

**Expected**: All three cards remain fully readable at narrow widths with no overlapping or
cut-off text.

## 6. Variable content length / equal-height alignment (Edge Cases)

1. Confirm the two organizer cards' longer prose descriptions wrap naturally within the card
   without overflowing or overlapping the divider/CTA below them.
2. Confirm all three cards remain visually aligned along the same grid row at desktop width, even
   though the fees card's content (a short list) is shorter than the organizer cards' prose
   descriptions.
