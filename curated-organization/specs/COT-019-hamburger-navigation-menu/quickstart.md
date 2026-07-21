# Quickstart: Validate Hamburger Menu for Navigation

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

No automated test suite exists in this repo (see [research.md](./research.md)). This guide is the acceptance mechanism for SC-001–SC-004.

## Prerequisites

- Local dependencies installed: `npm install`
- Dev server running: `npm run dev`
- A browser with device-toolbar/responsive-design mode (viewport resizing) and, ideally, a screen reader (VoiceOver, NVDA, or the browser's built-in screen reader emulation) for the accessibility pass.

## Setup

```bash
npm run dev
```

Open the printed local URL (any page — the `Navigation` header is global via `root.tsx`).

## Scenario 1 — Hamburger appears and opens on mobile (User Story 1, SC-001)

1. Resize the viewport to below 768px width (the existing `tablet` breakpoint).
2. **Expect**: the header shows a hamburger icon; Home, Services, Gallery, and "Book now" are not visible inline.
3. Tap/click the hamburger icon.
4. **Expect**: the mobile menu opens, revealing Home, Services, Gallery, and "Book now".

## Scenario 2 — Link selection and manual close (User Story 2)

1. With the mobile menu open (from Scenario 1), tap "Services".
2. **Expect**: the Services page loads, and the menu is closed on arrival.
3. Reopen the menu, then tap the hamburger/close control without selecting a link.
4. **Expect**: the menu closes and the page does not navigate.

## Scenario 3 — Responsive boundary behavior (User Story 3, SC-004)

1. Starting below 768px width, slowly widen the browser window past 768px while the mobile menu is open.
2. **Expect**: at the moment the viewport crosses into desktop width, the mobile menu closes/hides and the inline navigation (links + CTA shown directly in the header) appears — never both at once, never neither.
3. Narrow the window back below 768px.
4. **Expect**: the header reverts to the closed hamburger state (not an open menu).

## Scenario 4 — Keyboard and screen reader pass (FR-005, SC-003)

1. At a mobile-width viewport, tab through the page using only the keyboard until focus reaches the hamburger control.
2. **Expect**: a visible focus indicator on the control; pressing Enter/Space toggles the menu open.
3. With a screen reader running, focus the hamburger control.
4. **Expect**: the control announces an accessible name (e.g. "Open menu" / "Close menu") and its expanded/collapsed state.
5. With the menu open, tab through the revealed links.
6. **Expect**: focus order is logical (link 1 → link 2 → ... → CTA), and each link/control is announced meaningfully.

## Scenario 5 — Edge cases

1. Rapidly click/tap the hamburger icon several times in a row.
2. **Expect**: the menu ends in a consistent, correct state (open or closed matching the number of toggles) — no visual glitching or stuck state.
3. Open the mobile menu, then click outside the menu area (e.g. on the page background).
4. **Expect**: the menu closes.
5. Open the mobile menu, navigate to a page, then use the browser's Back button.
6. **Expect**: the menu is closed on the page you land on.

## Success criteria mapping

| Success Criterion | Verified by |
| ------------------ | ------------ |
| SC-001 (links reachable within two taps) | Scenario 1 |
| SC-002 (closed menu is a single row) | Scenario 1, step 1 (visual check) |
| SC-003 (keyboard/screen reader access) | Scenario 4 |
| SC-004 (exactly one nav pattern at every width) | Scenario 3 |
