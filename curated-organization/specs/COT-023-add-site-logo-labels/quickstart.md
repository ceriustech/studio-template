# Quickstart: Verify Site Logo and Certification Labels

## Prerequisites

- Dependencies installed (`npm install`, run once).
- Implementation complete: logo markup added to
  `app/routes/components/navigation/index.tsx` (with matching CSS in `app/app.css`), and
  certification label markup added to
  `app/routes/pages/services/components/about/index.tsx` (with matching CSS in `about.css`)
  — see [plan.md](./plan.md) Project Structure.

## Run

```bash
npm run dev
```

## Validation Scenarios

### 1. Header logo — every page (User Story 1, FR-001/002/003)

1. From any page (e.g. Home, Services, Gallery, Booking), look at the header.
2. Confirm the Curated logo mark is visible beside the "CURATED" wordmark and
   "PROFESSIONAL ORGANIZING" tagline, matching the reference design's placement.
3. Navigate to at least one other page and confirm the logo mark renders there too (proves
   FR-001 — sitewide, not page-specific).
4. Resize the browser to a mobile width (≤ 480px), open and close the mobile menu, and
   confirm the logo mark stays visible and legible in the header without breaking the
   hamburger toggle layout.

### 2. Services page — About section certification labels (User Story 2, FR-004/005/006)

1. Navigate to the Services page (`/services`).
2. Scroll to the "About Curated" section ("Where order meets elegance").
3. Confirm a "CPO Certified" label is displayed with the circular certification logo, and a
   "NAPO Member" label is displayed with the NAPO title logo, matching the reference design.
4. Resize the browser to a mobile width (≤ 480px) and confirm each label stays visually
   paired with its corresponding logo (not ambiguous which label belongs to which logo).

### 3. Accessibility (FR-003, Constitution Article VII)

1. Inspect the header logo `<img>` (dev tools) and confirm it has `alt=""` (decorative —
   the brand name is already conveyed by the adjacent "CURATED" text and the header link's
   `aria-label`).
2. Confirm the "CPO Certified" / "NAPO Member" labels are real text nodes (not baked into an
   image), so they're read by screen readers with no extra markup.

### 4. No regressions

1. Run `npm run typecheck` — must pass with no new errors (this repo has no separate lint
   script; `typecheck` is the only automated check).
2. Confirm no existing header content (nav links, "Book now" CTA) or About section content
   (heading, body copy, signature, existing logos) was removed or visually broken by the
   change.

## Expected Outcome

The Curated logo mark is visible in the header on every page, and the "CPO Certified" /
"NAPO Member" labels are visible next to their respective logos in the Services page About
section — matching SC-001 through SC-003 in [spec.md](./spec.md).
