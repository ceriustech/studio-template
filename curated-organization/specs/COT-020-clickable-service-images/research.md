# Research: Clickable Service Images on Home Page

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

No `[NEEDS CLARIFICATION]` markers remained in the spec, and the plan's Technical Context introduced no unresolved unknowns. This document records the small set of implementation-approach decisions made while translating the spec's requirements into a concrete design, so they don't need to be re-litigated during `/speckit.tasks` or `/speckit.implement`.

## Decision: Wrap the existing image element in a react-router `Link`, not the whole card

**Rationale**: The spec (FR-001, FR-002, Edge Cases) scopes the clickable target to the image area specifically — the card's title/description are explicitly not required to be clickable. `app/routes/pages/home/components/Services/ServiceCard.tsx` currently renders the image as a `div.serviceCardImg` with a CSS `backgroundImage`. Wrapping only that element in a `Link` (from `react-router`, matching the pattern already established in `Intro.tsx` and `BeforeAfter.tsx`) satisfies the requirement precisely without changing the click behavior of the rest of the card.

**Alternatives considered**:
- Making the entire `.serviceCard` clickable — rejected; broader than the acceptance criteria ("click an image ... routed to the Services page") and would create a confusing nested-interactive-element pattern once combined with any future in-card links.
- Using a plain `<a href="/services">` instead of react-router's `Link` — rejected; `Link` is the established convention for internal navigation elsewhere in this codebase (`Intro.tsx`, `BeforeAfter.tsx`) and enables client-side navigation without a full page reload.

## Decision: Accessible name via `aria-label` on the `Link`, since the image is a CSS background, not an `<img>`

**Rationale**: `serviceCardImg` is a `div` with `backgroundImage` (decorative from the DOM's perspective; it currently only exposes an optional `role="img"`/`aria-label` pair built from `altText`). A background-image `div` has no native `alt` attribute, so per FR-004 (accessible name describing the destination) and the constitution's Accessibility article, the `Link` itself carries `aria-label={\`View all services — ${title}\`}` (or equivalent), giving assistive technology a clear "this is a link to the Services page" announcement rather than re-exposing the existing decorative `altText`.

**Alternatives considered**:
- Relying solely on the existing `altText`/`role="img"` pair on the inner `div` — rejected; that pair currently describes the image's visual content ("Organized closet with shelving..."), not its function as a link, and screen reader users need the link's purpose (FR-004), not a repeat of the image description already conveyed by adjacent card text.
- Wrapping the image in `<img>` instead of a CSS background — rejected as out of scope; the spec's Assumptions state the change only adds click/navigation behavior, not a rework of how images are rendered (no visual regression permitted per SC-003).

## Decision: No new automated tests; manual verification documented in `quickstart.md`

**Rationale**: Consistent with every prior UI feature in this repo (COT-002 through COT-019), there is no test runner in `package.json` (no Vitest, Playwright, or Jest). Introducing one is out of scope for a single-component UI change. Acceptance is verified manually per `quickstart.md`: clicking each image, a keyboard-only pass, and a screen reader pass, mapped to SC-001–SC-003.

**Alternatives considered**:
- Introducing Playwright for this feature specifically — rejected as disproportionate scope creep for a three-image navigation tweak; if/when the project adopts a test runner, it should be a deliberate, project-wide decision (constitution amendment), not bundled into COT-020.

## Open questions

None remaining. All spec requirements (FR-001–FR-006) and success criteria (SC-001–SC-003) are addressed by the decisions above.
