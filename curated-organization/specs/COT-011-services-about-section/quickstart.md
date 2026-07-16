# Quickstart: Validating the Services About section

Manual validation guide — this repo has no automated test runner configured. Validate
against `spec.md`'s Acceptance Scenarios and Success Criteria.

## Prerequisites

- Dependencies installed (`npm install` at repo root, if not already done).
- Dev server runnable via the project's existing `npm run dev` script (React Router v7 dev
  server).

## 1. Visual match against the design screenshot (User Story 1 / SC-001)

1. Start the dev server and open the Services page in a browser at desktop width (≥1280px).
2. Confirm the About section renders directly below the Hero, as a two-column layout: a
   photograph on the left, text content on the right.
3. Compare against the provided design screenshot: the "ABOUT CURATED" eyebrow label, the
   headline "Where order meets elegance," the descriptive paragraph, and the signed closing
   line "— The Curated Team," matching position, spacing, and column proportions.
4. Confirm typography (serif headline/signature, sans eyebrow/paragraph), spacing, image
   treatment (gradient overlay), and colors all match the screenshot exactly.

**Expected**: No discernible layout, spacing, typography, image-treatment, or color
differences from the screenshot.

## 2. Tablet and mobile viewport (SC-002, Edge Cases)

1. Resize the browser (or use device emulation) to a tablet width (e.g., 768px) and confirm
   the two-column layout stacks (photo above text, or per the mockup's reflow), with the
   eyebrow, headline, paragraph, and signature remaining fully readable and non-overlapping.
2. Resize to a mobile width (e.g., 375px) and confirm the same, with padding and photo height
   scaled down per the mockup's mobile rules.

## 3. Image load failure (Edge case)

1. Simulate a failed image load (e.g., block the image URL in devtools network conditions) and
   confirm the text column still renders fully in its designated position without the layout
   collapsing.

## 4. Paragraph reflow (Edge case)

1. At various viewport widths between desktop and mobile, confirm the paragraph's line spacing
   and column width remain visually consistent with the mockup, with no overlapping or cramped
   lines.
