# Phase 0 Research: What to Expect Section

No items in the plan's Technical Context were marked `NEEDS CLARIFICATION` — this is a small, well-scoped UI change with an authoritative design mockup already present in the repo. Research below confirms the existing patterns this feature should follow rather than resolving open unknowns.

## Decision: Reuse the design mockup's existing `.expect*` markup/CSS as the source of truth

**Decision**: Build `WhatToExpect` from the "WHAT TO EXPECT" section already present in `.specify/site-design/curated-book-mockup.html` (`<section class="expect">`, lines ~1203-1237, styles at lines ~517-569), translating its kebab-case classes to camelCase per this project's established convention.

**Rationale**: The mockup contains the exact copy, structure, and CSS for this section — eyebrow "What to expect", heading "After you book", three `.expect-step` blocks (num/title/desc) with a `.expect-connector` between steps 1→2 and 2→3, a 3-column grid on desktop. This is the same mockup file the screenshot in the spec was generated from, so it is authoritative and removes any ambiguity about exact spacing, font sizes, or colors.

**Alternatives considered**:
- Re-derive styling purely from the screenshot image — rejected, less precise than the mockup's actual CSS values (exact px sizes, color tokens) which are already committed to the repo.

## Decision: Model `WhatToExpect` directly on the existing `Process` component

**Decision**: Structure `WhatToExpect` exactly like `app/routes/pages/home/components/Process/` — a typed `WhatToExpectStep[]` array (`number`, `title`, `description`) mapped into `.expect-step`-equivalent blocks, with an `aria-hidden` connector element between all but the last step.

**Rationale**: `Process` is a near-identical existing pattern in this same codebase (numbered steps, eyebrow + heading, serif step numbers, connector dashes) — it differs only in step count (4 vs. 3) and copy. Reusing its structure (rather than inventing a new pattern) keeps the codebase consistent and de-risks the CSS translation, since `process.css`'s `.processNum`/`.processTitle`/`.processDesc`/`.processConnector` rules are near-verbatim matches for the mockup's `.expect-num`/`.expect-title`/`.expect-desc`/`.expect-connector` rules.

**Alternatives considered**:
- Extract a new shared `NumberedSteps` generic component with `Process` and `WhatToExpect` as domain adapters — rejected as over-engineering per the constitution's Generic/Domain-adapter guidance (reserved for components that need one behavior presented multiple ways); `Process` and `WhatToExpect` render in different parts of the layout (route-local vs. layout-level swap) with no shared state or behavior, only visually similar CSS. Revisit only if a third numbered-steps section appears.

## Decision: Conditionally render `WhatToExpect` vs. `Cta` in `root.tsx` using `useLocation`

**Decision**: In `app/root.tsx`'s `Layout` component, call `useLocation()` from `react-router` (already imported this way in `app/routes/components/navigation/index.tsx`) and render `<WhatToExpect />` when `location.pathname === PAGE_ROUTES_DATA.BOOKING.path`, else `<Cta />`.

**Rationale**: `Layout` is rendered within the router's context (it wraps `<Outlet/>` in framework mode), so `useLocation` is available exactly as it already is in `Navigation`, which is rendered as a sibling in the same `Layout`. This avoids passing route information down as props or duplicating route-matching logic, and reuses the existing `PAGE_ROUTES_DATA.BOOKING.path` constant (`/booking`) instead of hardcoding the string a second time.

**Alternatives considered**:
- Move the `Cta`/`WhatToExpect` choice into each route's own `index.tsx` (i.e., each route renders its own bottom section) — rejected, this would require touching all four existing route files and duplicating the "which section goes at the bottom" decision four times instead of once in the layout, and would diverge from the existing architecture where `Cta` is deliberately layout-level, not route-owned.
- Use `useMatches()`/route `handle` metadata to flag "hide default CTA" per route — rejected as unnecessary indirection for a single route exception; a direct pathname check against the existing `PAGE_ROUTES_DATA` constant is simpler and consistent with how `Navigation`'s `isActive` already compares `location.pathname`.

## Decision: No automated test coverage added

**Decision**: Verify via manual visual check against the design mockup at desktop and mobile widths, on `/booking` and on at least one other route; no new automated tests.

**Rationale**: The repository has no existing Vitest/Playwright test configuration, and this feature is a static markup/CSS change plus a single pathname conditional — no complex branching, state, or data flow to unit test. This matches how prior similarly-scoped visual features in this repo (e.g., COT-023 site logo/labels, COT-006 process section) were verified.

**Alternatives considered**:
- Add a new test framework for this feature — rejected as disproportionate to a small, mostly-static UI change and out of scope for this ticket.
