# Quickstart: Validating the Call To Action section

Manual validation guide — this repo has no automated test runner configured. Validate
against `spec.md`'s Acceptance Scenarios and Success Criteria.

## Prerequisites

- Dependencies installed (`npm install` at repo root, if not already done).
- Dev server runnable via the project's existing `npm run dev` script (React Router v7 dev
  server).

## 1. Visual match against the design screenshot (User Story 1 / SC-001)

1. Start the dev server and open the home page in a browser at desktop width (≥1280px).
2. Scroll to the final section before the footer (after Testimonial).
3. Compare against the provided design screenshot: heading ("Ready to transform your
   space?"), subtext ("Your complimentary 30-minute consultation starts here"), and the
   "BOOK A CONSULTATION" button, centered over the background image with its overlay.
4. Confirm typography (serif heading, sans subtext, uppercase sans button label), spacing,
   background imagery, overlay tone, and button styling all match the screenshot exactly.

**Expected**: No discernible layout, spacing, typography, background, or color differences
from the screenshot.

## 2. Button navigation (User Story 1, Scenario 2 / SC-003)

1. From the home page, select the "Book a consultation" button.
2. Confirm the browser navigates to the `/booking` route with no dead link or unresponsive
   click.

**Expected**: Reliable navigation to the booking destination every time.

## 3. Button hover/focus state

1. Hover the mouse over the button and confirm the visible elevation/shadow and background
   shift described in the mockup.
2. Tab to the button using the keyboard only and confirm a visible focus indicator appears.

## 4. Mobile viewport (SC-002)

1. Resize the browser (or use device emulation) to a mobile width (e.g., 375px).
2. Confirm the heading, subtext, and button remain centered, legible, and easily tappable
   (minimum 44×44px tap target), with section padding scaled down appropriately.

## 5. Slow-loading background image (Edge case)

1. Throttle network speed (or temporarily point the background image at a slow/broken URL)
   and reload the page.
2. Confirm the heading, subtext, and button remain legible against the section's base
   background color while the image loads (or if it fails to load).
