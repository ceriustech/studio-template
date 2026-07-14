# Quickstart / Validation: COT-004 Services section

## Purpose

Provide simple steps to validate the Services section visually after implementation.

## Steps

1. Run the dev server:

```bash
npm run dev
```

2. Open the home page in a browser at http://localhost:5173 (or configured port).

3. Desktop verification (>= 1280px):
   - Confirm a centered Services section with a warm background band appears between Intro and Before/After sections.
   - Confirm the header eyebrow reads "The Services" and the heading reads "Bespoke solutions, gracefully executed".
   - Confirm three service cards appear in a single row, each with an image area above a title and muted description.
   - Hover a card and verify it translates up slightly and shows a subtle shadow.

4. Mobile verification (<= 768px):
   - Confirm cards stack into a single column and paddings collapse to match the mockup.

5. Accessibility checks:
   - Inspect images for `alt` attributes.
   - Confirm heading order is preserved.

## Expected Outcome

Visual parity with the provided screenshot; responsive behavior and hover interactions working as described.
