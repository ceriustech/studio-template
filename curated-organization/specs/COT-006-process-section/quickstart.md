# Quickstart: Validate the Process section

## Prerequisites

- Dependencies installed (`npm install`, if not already done).
- The design screenshot referenced in the spec (`.specify/site-design/curated-home-mockup.html`, `<!-- PROCESS -->` block) available for visual comparison.

## Run

```sh
npm run dev
```

Navigate to the home page (`/`) in a browser.

## Validate

1. **Presence & order**: Scroll to the section directly below "Services" and above the "Before/After" ("See the difference") section. Confirm it shows:
   - Eyebrow: "The process"
   - Heading: "How it works"
   - Three steps in order: `01 Consultation`, `02 Design + shop`, `03 Organizing day`, each with its description text from [data-model.md](./data-model.md).
2. **Visual parity (desktop, ≥1280px width)**: Compare side-by-side with the design screenshot. Confirm layout (3-column row), typography (serif numbers/titles, sans description), spacing, colors, and the small dash connectors between steps 1→2 and 2→3 (none after step 3) match.
3. **Mobile reflow (≤768px width)**: Resize the viewport (or use browser device emulation). Confirm all three steps remain visible, readable, and in order (01, 02, 03) with no overlapping or cut-off text.
4. **Accessibility spot-check**: Inspect the DOM — confirm the section heading is an `<h2>`, each step title is an `<h3>` (or equivalent), and connector elements are `aria-hidden="true"`.
5. **Code style check**: Inspect `process.css` — confirm all class names are camelCase (no dash-case leftover from the mockup).

## Expected outcome

The Process section renders statically between Services and Before/After, matches the provided screenshot at desktop width, and reflows cleanly at mobile width, per spec [SC-001–SC-003](./spec.md#success-criteria-mandatory).
