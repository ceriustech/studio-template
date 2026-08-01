# Quickstart: Verify NAPO Logos in Footer and Services Page

## Prerequisites

- Dependencies installed (`npm install`, run once).
- Implementation complete: logo markup added to `app/routes/components/Footer/index.tsx`
  and `app/routes/pages/services/components/about/index.tsx`, with matching CSS in
  `footer.css` and `about.css` (see [plan.md](./plan.md) Project Structure).

## Run

```bash
npm run dev
```

## Validation Scenarios

### 1. Services page — About section (User Story 1, FR-001/002/005)

1. Navigate to the Services page (`/services`).
2. Scroll to the About section ("Where order meets elegance").
3. Confirm both the napo-circular-logo and napo-title-logo are visible below the
   "— The Curated Team" signature, circular logo first, matching the reference design.
4. Resize the browser to a mobile width (≤ 480px) and confirm both logos remain visible,
   legible, and don't overlap the signature text or wrap awkwardly.

### 2. Footer — every page (User Story 2, FR-003/004/006)

1. From any page (e.g. Home, Services, Gallery), scroll to the footer.
2. Confirm both logos are visible in the footer's brand column, below
   "Serving the NOVA / DMV area.", circular logo first.
3. Navigate to at least one other page and confirm the same two logos render in the footer
   there too (proves FR-006 — footer logos are not Services-page-specific).
4. Resize to mobile width and confirm both logos remain visible and legible without
   overlapping the stacked footer columns.

### 3. Accessibility (FR-007)

1. Inspect both `<img>` elements (dev tools) in each location and confirm each has a
   non-empty, descriptive `alt` attribute.

### 4. No regressions

1. Run `npm run typecheck` — must pass with no new errors.
2. Run lint — must pass with no new errors.
3. Confirm no existing Footer/About content (links, hours, brand text, About copy) was
   removed or visually broken by the change.

## Expected Outcome

Both `napo-circular-logo` and `napo-title-logo` are visible, in the same order, in the
Services page About section and in the footer on every page, matching SC-001 through SC-004
in [spec.md](./spec.md).
