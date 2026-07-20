# Quickstart: Two Paths section

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

1. **Section placement** (FR-001) — Confirm the Two Paths section renders immediately below
   the Hero section, as two cards side by side.
2. **"Get started" card content** (FR-002) — Confirm, in order: a circular "+" icon, the
   heading "Get started", the description "New to Curated? Tell us about your space and goals,
   then pick a time to meet. Takes about 3 minutes.", and a solid dark "Start questionnaire"
   button linking to `#questionnaire`.
3. **"Book again" card content** (FR-003) — Confirm, in order: a circular "↻" icon, the heading
   "Book again", the description "Welcome back. Skip the intake and go straight to scheduling
   your next session.", and an outlined "Schedule now" button linking to `#calendly`.
4. **Centering** (FR-004) — All content within each card (icon, title, description, button) is
   horizontally centered.
5. **Card backgrounds and divider** (FR-005) — The left card has a lighter background, the
   right card a slightly deeper background, separated by a single vertical hairline border.
6. **Hover states** (FR-006) — Hovering a card subtly shifts its background and icon styling;
   hovering the solid button darkens it and lifts it with a shadow; hovering the outlined
   button fills it solid.
7. **Keyboard focus** (Edge Cases) — Tab to each CTA button and confirm a visible focus state
   appears (not just a hover-only style).
8. **Visual parity with design mockup** (FR-007, SC-001) — Compare the rendered section
   side-by-side against the design screenshot at ≥1280px width. Layout, spacing, typography,
   colors, icons, and button styling should be visually indistinguishable.
9. **CamelCase styling** (FR-008) — Inspect `two-paths.css` and `pathCard.css` and confirm all
   class names are camelCase (e.g. `.twoPaths`, `.pathCard`, `.pathBtnPrimary`), matching the
   convention in `booking/components/hero/hero.css` and
   `services/components/pricing/components/PricingCard/pricingCard.css`.
10. **Responsive behavior** (SC-002, Edge Cases) — Resize the viewport down to tablet (~768px)
    and mobile (~375px) widths:
    - The two-column layout stacks to a single column.
    - Both cards remain fully readable, with descriptions wrapping without overlap or
      truncation, and both buttons remain clickable.
11. **Link targets** (SC-003) — Click "Start questionnaire" and confirm the page jumps to the
    `#questionnaire` anchor; click "Schedule now" and confirm the page jumps to the `#calendly`
    anchor (both anchors may currently point to not-yet-built sections from later tickets — the
    link `href`s themselves must still be correct).

## Expected outcome

The `/booking` route renders a Two Paths section pixel-close to the provided design screenshot
at desktop width, remains fully readable and usable at tablet/mobile widths, and introduces no
TypeScript, lint, or console errors.
