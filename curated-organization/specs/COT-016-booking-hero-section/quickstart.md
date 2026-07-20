# Quickstart: Booking Hero section

## Prerequisites

- Dependencies installed (`npm install` at repo root).
- No environment variables, Sanity dataset, or Cloudinary credentials are required — this
  section renders static, hardcoded content with no data fetching.

## Run

```sh
npm run dev
```

Navigate to `/booking` in the browser.

## Validate

1. **Content and copy** (FR-001, FR-002) — Confirm, in order from the top of the page (below
   global nav):
   - Eyebrow label: "BOOK A CONSULTATION" (uppercase, small, letter-spaced)
   - Headline: "Let's transform your space" (serif)
   - Paragraph: "Your complimentary 30-minute consultation starts here. Choose your path
     below."
2. **Centering** (FR-003) — All three text elements are horizontally centered within the
   section at desktop width.
3. **Decorative shapes** (FR-004) — Two large, soft-edged circles are visible, overlapping the
   section's top-left and bottom-right corners, clipped to the section bounds (no scrollbar
   introduced, no overflow outside the section).
4. **Visual parity with design mockup** (FR-005, SC-001) — Compare the rendered section
   side-by-side against the design screenshot at ≥1280px width. Typography, spacing, colors,
   and decorative shape placement should be visually indistinguishable.
5. **CamelCase styling** (FR-006) — Inspect `app/routes/pages/booking/components/hero/hero.css`
   and confirm all class names are camelCase (e.g. `.bookingHero`, `.sectionEyebrow`), matching
   the convention in `gallery/components/hero/hero.css` and `services/components/hero/hero.css`.
6. **Responsive behavior** (SC-002, Edge Cases) — Resize the viewport down to tablet (~768px)
   and mobile (~375px) widths:
   - Text remains centered, readable, and non-overlapping.
   - The paragraph's two-line wrap (as shown in the screenshot) keeps consistent line spacing.
   - The decorative circles shrink/reposition and do not obscure the text.

## Expected outcome

The `/booking` route renders a Hero section pixel-close to the provided design screenshot at
desktop width, remains fully readable at tablet/mobile widths, and introduces no TypeScript,
lint, or console errors.
