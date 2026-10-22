# Quickstart: Validate COT-037

## Prerequisites

- Dependencies installed (`npm install`).
- Sanity env vars set, or rely on `services.fallback.server.ts` content (both badges have labels).

## Run

```bash
npm run typecheck
npm run dev
```

Open `http://localhost:5173/services`, scroll to the "About Curated" section, and use browser DevTools device mode.

## Scenarios

| # | Viewport width | Expected |
|---|----------------|----------|
| 1 | 375px (phone) | No credential labels visible. Both logos visible, side by side, directly under the signature, with no blank gap above them. (FR-001, FR-003, FR-004) |
| 2 | 480px (boundary) | Labels hidden. |
| 3 | 481px | Labels visible. |
| 4 | 768px (tablet) | Labels visible, styled as today. (FR-002) |
| 5 | 1280px (desktop) | Labels visible, styled as today. (FR-002) |
| 6 | Resize 1280 → 375 → 1280 without reloading | Labels hide and reappear live. (US1 scenario 3) |
| 7 | 375px, inspect each badge `<img>` | Each has a non-empty, descriptive `alt`. (FR-005) |
| 8 | 375px, other Services sections (hero, offerings, pricing) | Unchanged from `main`. (FR-006) |

## Done when

- All 8 scenarios pass.
- `npm run typecheck` passes.
- `about.css` is the only file under `app/` in `git diff --stat`.
