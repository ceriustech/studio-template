# Quickstart: Validate the Services About Section Mobile Rework

## Prerequisites

- Dependencies installed (`npm install`, if not already).
- No environment variables beyond what the repo already requires for `npm run dev` (Sanity project ID/dataset) — this feature reads no new content and adds no new env vars.

## Run

```sh
npm run dev
```

Navigate to `/services` in a browser.

## Validate: mobile / stacked layout

Using browser dev tools' device toolbar (or by narrowing the viewport), check the About section at each of these widths: 320px, 375px, 430px, and 768px (the existing `BREAKPOINTS.mobileS` / `mobileM` / `mobileL` / `tablet` values in `app/constants/index.ts`).

Confirm, top to bottom:

1. The "About Curated" eyebrow label and "Where order meets elegance" heading appear first.
2. The founder photo appears next.
3. The body paragraph and "— Rina, Founder and Lead Curator" signature appear next.
4. The "CPO Certified" and "NAPO Member" logo items appear last.

Compare against the provided design screenshot for spacing/styling — should match.

## Validate: desktop / two-column layout (no regression)

Widen the viewport to 1024px and 1440px (`BREAKPOINTS.laptop` / `desktop`).

Confirm the section renders as it does today: founder photo in one column, eyebrow/heading/paragraph/signature/logos stacked in the other column — no visible change from the pre-feature layout.

## Validate: accessibility / reading order

With the viewport at a mobile width (e.g. 375px), tab through the section or inspect the accessibility tree / DOM order. Confirm the eyebrow, heading, photo, body copy, signature, and logos appear in the DOM in the same order they appear visually (no CSS-only visual reordering that diverges from DOM order).

## Validate: no regressions elsewhere

```sh
npm run typecheck
```

Should pass with no new errors.
