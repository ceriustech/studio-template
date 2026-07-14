# Quickstart: Validating the Footer section

Manual validation guide — this repo has no automated test runner configured. Validate
against `spec.md`'s Acceptance Scenarios and Success Criteria.

## Prerequisites

- Dependencies installed (`npm install` at repo root, if not already done).
- Dev server runnable via the project's existing `npm run dev` script (React Router v7 dev
  server).

## 1. Visual match against the design screenshot (User Story 1 / SC-001)

1. Start the dev server and open the home page in a browser at desktop width (≥1280px).
2. Scroll to the bottom of the page, past the Call To Action section.
3. Compare against the provided design screenshot: brand name ("CURATED") and description in
   the leftmost column, "Navigate," "Connect," and "Hours" columns with their respective
   items, the divider line, and the bottom bar (copyright notice + "Instagram"/"Facebook").
4. Confirm typography (serif brand name, sans body/links), column spacing, divider, and colors
   all match the screenshot exactly.

**Expected**: No discernible layout, spacing, typography, or color differences from the
screenshot.

## 2. Link navigation (User Story 1, Scenarios 2–3 / SC-003)

1. From the footer, select each "Navigate" link (About, Services, Gallery, Book).
2. Confirm "Services," "Gallery," and "Book" navigate to their existing routes (`/services`,
   `/gallery`, `/booking`) with no dead link or unresponsive click.
3. Select each "Connect" link and each bottom-bar social link and confirm they resolve to a
   destination (placeholder `#` is acceptable per research.md) with no broken/console error.

**Expected**: Reliable navigation for every link, at any supported viewport width.

## 3. Link hover/focus state

1. Hover the mouse over a footer link and confirm the visible color shift described in the
   mockup.
2. Tab through the footer using the keyboard only and confirm a visible focus indicator
   appears on every link in sequence.

## 4. Tablet and mobile viewport (SC-002, Edge Cases)

1. Resize the browser (or use device emulation) to a tablet width (e.g., 768px) and confirm
   the column grid reflows to two columns with no overlapping or cut-off text.
2. Resize to a mobile width (e.g., 375px) and confirm the column grid reflows to a single
   column, and the bottom bar stacks the copyright notice and social links vertically,
   centered.
3. Confirm every link remains legible and easily tappable at both widths.

## 5. Long content wrap (Edge case)

1. Temporarily lengthen a link label or the brand description text (e.g., via browser dev
   tools) and confirm spacing between columns and rows remains visually consistent with no
   overlapping text.
