# Quickstart: Verify the What to Expect Section

## Prerequisites

- Dependencies installed (`npm install`, run once).
- Implementation complete: `WhatToExpect` component created at
  `app/routes/components/WhatToExpect/` (`index.tsx` + `WhatToExpect.types.ts` +
  `whatToExpect.css`), and `app/root.tsx` edited to conditionally render `<WhatToExpect />`
  instead of `<Cta />` on `/booking` — see [plan.md](./plan.md) Project Structure.

## Run

```bash
npm run dev
```

## Validation Scenarios

### 1. Booking page shows "What to Expect" instead of the CTA (User Story 1, FR-001/003/004/005/006)

1. Navigate to `/booking`.
2. Scroll to the bottom of the page (below the questionnaire/calendar content, above the
   footer).
3. Confirm the "Ready to transform your space?" call-to-action is **not** shown, and instead
   a "What to Expect" section is shown with:
   - Eyebrow label: "What to Expect"
   - Heading: "After you book"
   - Three numbered steps (01, 02, 03): "Confirmation email", "30-minute consultation",
     "Custom proposal", each with its description text.
4. Compare placement, spacing, typography, and step ordering against the reference design
   (`.specify/site-design/curated-book-mockup.html`, `.expect` section) and the screenshot in
   [spec.md](./spec.md).
5. Resize the browser to a mobile width (≤ 480px) and confirm the three steps stack in a
   single column and remain readable, in order.

### 2. Every other route still shows the existing call-to-action (User Story 2, FR-002)

1. Navigate to `/`, `/services`, and `/gallery` in turn.
2. On each, scroll to the bottom of the page and confirm the "Ready to transform your space?"
   call-to-action section still renders exactly as it does today (unchanged).
3. Confirm the "What to Expect" section does **not** appear on any of these routes.
4. From `/booking`, navigate to another route (e.g. click a nav link to `/services`) and
   confirm the section swaps back to the call-to-action on the new page.

### 3. No regressions

1. Run `npm run typecheck` — must pass with no new errors (this repo has no separate lint
   script; `typecheck` is the only automated check).
2. Confirm the Booking page's own content (`Hero`, `TwoPaths`, `Questionnaire`/`Calendar` flow)
   still renders and behaves as before — the section swap must not affect Booking page state.
3. Confirm the `Footer` still renders below the swapped-in section on every route.

## Expected Outcome

`/booking` shows the "What to Expect" section in place of the sitewide call-to-action; every
other route is unaffected — matching SC-001 through SC-003 in [spec.md](./spec.md).
