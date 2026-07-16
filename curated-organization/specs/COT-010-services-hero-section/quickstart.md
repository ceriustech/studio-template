# Quickstart: Validating the Services Hero section

Manual validation guide — this repo has no automated test runner configured. Validate
against `spec.md`'s Acceptance Scenarios and Success Criteria.

## Prerequisites

- Dependencies installed (`npm install` at repo root, if not already done).
- Dev server runnable via the project's existing `npm run dev` script (React Router v7 dev
  server).

## 1. Visual match against the design screenshot (User Story 1 / SC-001)

1. Start the dev server and open the Services page in a browser at desktop width (≥1280px).
2. Confirm the Hero renders as the first section at the top of the page.
3. Compare against the provided design screenshot: the "THE SERVICES" eyebrow label, the
   headline "Bespoke solutions, gracefully executed," and the supporting paragraph, all
   center-aligned, over a cream background with two large soft circular shapes in the
   top-left and bottom-right corners.
4. Confirm typography (serif headline, sans eyebrow/paragraph), spacing, centering, and colors
   all match the screenshot exactly.

**Expected**: No discernible layout, spacing, typography, decorative-shape, or color
differences from the screenshot.

## 2. Tablet and mobile viewport (SC-002, Edge Cases)

1. Resize the browser (or use device emulation) to a tablet width (e.g., 768px) and confirm
   the eyebrow, headline, and paragraph remain centered and fully readable, with no
   overlapping text and no decorative circle crowding the copy.
2. Resize to a mobile width (e.g., 375px) and confirm the same, with padding scaled down per
   the mockup's mobile rules.

## 3. Headline wrap (Edge case)

1. At the default desktop width, confirm the headline wraps to two lines ("Bespoke solutions,
   gracefully executed" split as shown in the screenshot) with consistent line spacing and no
   cramped or overlapping lines.

## 4. Decorative shape clipping (Edge case)

1. At any viewport width, confirm both decorative circles stay visually clipped to the
   section's bounds (no shape spilling into an adjacent section above or below the Hero).
