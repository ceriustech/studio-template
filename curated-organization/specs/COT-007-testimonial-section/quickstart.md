# Quickstart: Validating the Testimonial section

Manual validation guide — this repo has no automated test runner configured. Validate
against `spec.md`'s Acceptance Scenarios and Success Criteria.

## Prerequisites

- Dependencies installed (`npm install` at repo root, if not already done).
- Dev server runnable via the project's existing `npm run dev` script (React Router v7 dev
  server).

## 1. Single-testimonial visual match (User Story 1 / SC-001)

1. Start the dev server and open the home page in a browser at desktop width (≥1280px).
2. With the placeholder array left at its default single entry (or temporarily trimmed to
   one), scroll to the Testimonial section (between Process and the CTA block).
3. Compare against the provided design screenshot: star rating, decorative quote mark,
   quote text, and "— Client name, Location" attribution, all centered.
4. Confirm no navigation controls (arrows/dots) are visible.

**Expected**: Pixel-level visual match to the screenshot; no discernible layout, spacing,
typography, or color differences.

## 2. Multi-testimonial carousel navigation (User Story 2 / SC-002)

1. Temporarily add 2–3 more entries to the placeholder array in `Testimonial.tsx` (or use
   the shipped placeholder set if it already has more than one).
2. Reload the home page. Confirm previous/next navigation controls are now visible.
3. Click/tap "next" repeatedly and confirm every testimonial in the set is reachable, in
   order, with the rating, quote, and attribution fully swapping (no stale text, no overlap)
   on each change.
4. From the last testimonial, click "next" once more and confirm it loops back to the first.
5. From the first testimonial, click "previous" and confirm it loops back to the last.

**Expected**: All configured testimonials are reachable; navigation loops at both ends;
adding another entry to the array requires no other code change to remain reachable.

## 3. Mobile viewport (SC-003)

1. Resize the browser (or use device emulation) to a mobile width (e.g., 375px).
2. Confirm the star rating, quote mark, quote text, and attribution remain legible and
   centered, with no overlapping or cut-off content.
3. Confirm navigation controls remain reachable via touch/tap and meet a minimum 44×44px
   tap target.

## 4. Accessibility spot-check

1. Using a keyboard only (Tab/Enter), confirm the previous/next controls are focusable and
   activatable, with a visible focus indicator.
2. Using a screen reader (or browser accessibility tree inspector), confirm:
   - The star rating exposes a text equivalent (e.g., "5 out of 5 stars").
   - Navigating slides announces the new content (via the `aria-live="polite"` region).
   - The decorative quote mark is not announced (`aria-hidden="true"`).

## 5. Long/short quote text (Edge case)

1. Temporarily set one placeholder entry's `quote` noticeably longer than the others.
2. Navigate to it and confirm the section does not visibly jump in height/spacing in a way
   that shifts surrounding sections jarringly, and text does not overflow its container.
