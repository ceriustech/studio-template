# Research: Hamburger Menu for Navigation

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

No `[NEEDS CLARIFICATION]` markers remained in the spec, and the plan's Technical Context introduced no unresolved unknowns. This document records the small set of implementation-approach decisions made while translating the spec's requirements into a concrete design, so they don't need to be re-litigated during `/speckit.tasks` or `/speckit.implement`.

## Decision: Toggle state lives in the existing `Navigation` component

**Rationale**: The mobile menu open/closed state is used by exactly one component and has no cross-route or cross-component consumers. Per the constitution's Architecture article, the generic-engine/domain-adapter split is reserved for behavior "presented differently by more than one consumer" — a single boolean toggle inside one component doesn't meet that bar. A local `useState<boolean>` inside `app/routes/components/navigation/index.tsx` is the simplest structure that satisfies FR-001–FR-004.

**Alternatives considered**:
- A new shared `MobileMenu` component in `app/components/` — rejected as premature abstraction; there is only one consumer (`Navigation`) and no second presentation to adapt to.
- URL/route-based menu state (e.g. a `?menu=open` query param) — rejected as unnecessary complexity for a purely presentational toggle with no deep-linking requirement in the spec.

## Decision: Reuse the existing `tablet` (768px) breakpoint, replace the existing `@media (max-width: 768px)` block

**Rationale**: The spec's Assumptions explicitly call for reusing "the site's existing small-viewport breakpoint used elsewhere in the navigation" rather than introducing a new one. `app/constants/index.ts` already defines `BREAKPOINTS.tablet = '768px'`, which is the exact value the current `.nav` media query in `app.css` already branches on (COT-001's stacking/wrapping behavior). This feature replaces that block's behavior (stack-and-wrap → collapse-behind-hamburger) rather than adding a second breakpoint.

**Alternatives considered**:
- Introducing a dedicated `mobileNav` breakpoint — rejected; the constitution requires breakpoints be added to `app/constants/index.ts` only when actually needed, and no requirement in the spec calls for a different threshold than the one already governing nav layout.

## Decision: Icon via existing `lucide-react` dependency (Menu / X icons)

**Rationale**: `lucide-react` is already a project dependency (`package.json`) and is the icon library declared in `components.json` (`"iconLibrary": "lucide"`). Using its `Menu` and `X` icons for the closed/open toggle states avoids adding a new dependency and matches the project's established icon sourcing convention.

**Alternatives considered**:
- Inline hand-drawn SVG — rejected; duplicates what `lucide-react` already provides and diverges from the project's declared icon library.
- A CSS-only "hamburger lines" element (three `<span>`s) — viable but rejected in favor of `lucide-react` for consistency with the rest of the codebase, and because it still needs an accessible label either way.

## Decision: No new automated tests; manual verification documented in `quickstart.md`

**Rationale**: Consistent with every prior UI feature in this repo (COT-002 through COT-018), there is no test runner in `package.json` (no Vitest, Playwright, or Jest). Introducing one is out of scope for a single-component UI change. Acceptance is verified manually per `quickstart.md`: a breakpoint resize sweep, a keyboard-only pass, and a screen-reader pass, mapped to SC-001–SC-004.

**Alternatives considered**:
- Introducing Playwright for this feature specifically — rejected as disproportionate scope creep for a navigation toggle; if/when the project adopts a test runner, it should be a deliberate, project-wide decision (constitution amendment), not bundled into COT-019.

## Open questions

None remaining. All spec requirements (FR-001–FR-008) and success criteria (SC-001–SC-004) are addressed by the decisions above.
