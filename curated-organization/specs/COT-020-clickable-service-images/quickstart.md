# Quickstart: Validate Clickable Service Images on Home Page

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

No automated test suite exists in this repo (see [research.md](./research.md)). This guide is the acceptance mechanism for SC-001–SC-003.

## Prerequisites

- Local dependencies installed: `npm install`
- Dev server running: `npm run dev`
- A browser with device-toolbar/responsive-design mode and, ideally, a screen reader (VoiceOver, NVDA, or the browser's built-in screen reader emulation) for the accessibility pass.

## Setup

```bash
npm run dev
```

Open the printed local URL and scroll to the "Personalized services" section on the home page.

## Scenario 1 — Each service image navigates to the Services page (User Story 1, SC-001)

1. Click the "Home organizing" image.
2. **Expect**: the browser navigates to the Services page (`/services`).
3. Return to the home page. Click the "Unpacking + move-in" image.
4. **Expect**: navigates to the Services page.
5. Return to the home page. Click the "Business + office" image.
6. **Expect**: navigates to the Services page.

## Scenario 2 — Existing text link still works alongside the new image links (FR-006)

1. On the home page, click the "View all services →" link below the service cards.
2. **Expect**: navigates to the Services page, same as before this feature — unaffected by the image links being added.

## Scenario 3 — Keyboard operability (FR-003, SC-002)

1. Tab through the home page using only the keyboard until focus reaches one of the service images.
2. **Expect**: a visible focus indicator appears on the image, requiring no more than one additional tab stop compared to the current experience.
3. Press Enter.
4. **Expect**: navigates to the Services page.
5. Repeat for the remaining two images.

## Scenario 4 — Screen reader announces the image as a link (FR-004)

1. With a screen reader running, focus each service image in turn.
2. **Expect**: each is announced as a link with a name describing its destination (e.g. "View all services"), not merely as a picture.

## Scenario 5 — No visual regression (FR-005, SC-003)

1. Compare the "Personalized services" section before and after the change, at both desktop (>= 1280px) and mobile (<= 768px) widths, without interacting with any card.
2. **Expect**: identical layout, spacing, and card appearance to the pre-change design; the existing hover elevation/shadow effect on `.serviceCard` still works on mouse hover.

## Success criteria mapping

| Success Criterion | Verified by |
| ------------------ | ------------ |
| SC-001 (100% of images navigate to Services page) | Scenario 1 |
| SC-002 (keyboard reachable, ≤1 extra tab stop) | Scenario 3 |
| SC-003 (no visual regression) | Scenario 5 |
