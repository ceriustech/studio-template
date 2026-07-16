# Quickstart: Validating the Services Offerings section

Manual validation guide — this repo has no automated test runner configured. Validate against
`spec.md`'s Acceptance Scenarios and Success Criteria.

## Prerequisites

- Dependencies installed (`npm install` at repo root, if not already done).
- Dev server runnable via the project's existing `npm run dev` script (React Router v7 dev
  server).

## 1. Visual match against the design screenshot — items 1–3 (User Story 1 / SC-001)

1. Start the dev server and open the Services page in a browser at desktop width (≥1280px).
2. Scroll to the Service section, directly below About and above Pricing.
3. Confirm the first three items render in order and match the provided design screenshot
   exactly:
   - **01 / Home organizing** — image left, text right.
   - **02 / Unpacking + move-in** — layout reversed: text left, image right.
   - **03 / Business + office** — image left, text right (returns to non-reversed).
4. Compare typography (serif heading, sans eyebrow/description/list), spacing, image treatment
   (gradient overlay), colors, and the "Get started" CTA link against the screenshot.

**Expected**: No discernible layout, spacing, typography, image-treatment, or color
differences from the screenshot for items 1–3.

## 2. New item content — Legacy Transitions (User Story 2 / SC-002)

1. Continue scrolling past item 3 and confirm item 4 renders with:
   - Eyebrow **"04"**, heading **"Legacy Transitions"**.
   - Description: "We guide families through major life transitions with absolute discretion,
     care and ease. Whether navigating a sensitive downsize or honoring the estate of a loved
     one, we manage the entire process by transforming overwhelming logistics into a peaceful,
     respectful transition."
   - The specified background image.
   - A four-item list: Compassionate discretionary sorting; Responsible consignment & Donation
     curation; Seamless Heirloom Logistics — ensuring family pieces reach their next home
     safely; Digital decluttering and legacy protection.
2. Confirm the layout is **reversed** (text left, image right), continuing the alternation from
   item 3's non-reversed layout.

**Expected**: All copy matches exactly with no missing/truncated text; layout is reversed.

## 3. New item content — Executive Functioning Coach (User Story 3 / SC-002)

1. Continue scrolling past item 4 and confirm item 5 renders with:
   - Eyebrow **"05"**, heading **"Executive Functioning Coach"**.
   - Description: "Executive functioning skills are the mental processes that help us plan,
     organize, manage time, stay focused, and follow through on tasks in everyday life."
   - The specified background image.
   - A three-item list: 30-60 minute virtual coaching sessions; Personalized strategies;
     Compassionate accountability to help you build and maintain sustainable habits.
2. Confirm the layout is **non-reversed** (image left, text right), continuing the alternation
   from item 4's reversed layout.

**Expected**: All copy matches exactly; layout alternation holds across all five items with no
two consecutive items sharing the same orientation (SC-003).

## 4. Tablet and mobile viewport (SC-004, Edge Cases)

1. Resize the browser (or use device emulation) to a tablet width (e.g., 768px) and confirm
   every item's two-column layout stacks to a single column, with image, eyebrow, heading,
   description, list, and CTA remaining fully readable and non-overlapping — including items 4
   and 5, whose descriptions and list lengths differ from items 1–3.
2. Resize to a mobile width (e.g., 375px) and confirm the same, with padding and image height
   scaled down per the mockup's mobile rules.

## 5. Image load failure (Edge case)

1. Simulate a failed image load for one item (e.g., block the image URL in devtools network
   conditions) and confirm that item's text content still renders fully in its designated
   column without the layout collapsing.

## 6. Variable list length and long-form copy (Edge case)

1. Confirm each item's bulleted list renders exactly its specified number of entries (5, 5, 4,
   4, 3 for items 1–5 respectively) with no empty placeholder rows, and that the vertical
   rhythm/spacing between list rows is consistent across items regardless of count.
2. Confirm items 4 and 5's longer description paragraphs wrap naturally within the text column
   width at all viewport widths without overflowing or overlapping the list or CTA below them.
