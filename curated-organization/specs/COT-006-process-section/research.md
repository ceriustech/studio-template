# Research: Process section

No `NEEDS CLARIFICATION` markers remain in the Technical Context — this feature is a small, static, presentational addition with a direct precedent in three already-implemented sibling sections (`Intro`, `Services`, `BeforeAfter`) on the same route. Research below confirms the pattern to follow rather than exploring open unknowns.

## Decision: Component placement and file layout

- **Decision**: Route-local component at `app/routes/pages/home/components/Process/`, with `Process.tsx` + `Process.types.ts` + `process.css`, imported and rendered in `app/routes/pages/home/index.tsx` between `<Services />` and `<BeforeAfter />`.
- **Rationale**: This exactly mirrors how `Services` and `BeforeAfter` are structured and registered on the same route (confirmed by reading `app/routes/pages/home/index.tsx` and both sibling component folders). The constitution's Architecture principle requires every component — route-local or shared — to be a folder pairing `.tsx` with `.types.ts` from the start; no Generic/Domain-adapter split applies since `Process` has exactly one consumer and no per-consumer behavior variation.
- **Alternatives considered**: Inlining the section directly in `home/index.tsx` — rejected because the route already establishes a one-component-per-section convention (`Intro`, `Services`, `BeforeAfter` are each their own component), and inlining would break that consistency for no benefit (the section is non-trivial: header + 3-item grid + connectors).

## Decision: Styling approach

- **Decision**: A co-located plain CSS file (`process.css`) using camelCase class names (`.process`, `.processHeader`, `.processGrid`, `.processStep`, `.processNum`, `.processTitle`, `.processDesc`, `.processConnector`), imported directly into `Process.tsx`. Reuse the existing global `.sectionEyebrow` / `.sectionHeading` classes (defined once in `intro.css`, already reused as-is by `BeforeAfter` without redefinition) rather than redeclaring them.
- **Rationale**: The constitution's stack section nominally prefers TailwindCSS, but all three already-shipped sibling sections on this exact route use hand-written camelCase-class CSS files instead, and the feature's own acceptance criteria explicitly calls for "translated styles should be camel cased" — matching the mockup's dash-case CSS 1:1 in naming but camelCased. Following the established sibling pattern keeps the route visually and structurally consistent; introducing Tailwind utility classes for just this one section would fragment the styling approach across an otherwise-uniform page.
- **Alternatives considered**: Tailwind utility classes per the constitution's general stack preference — rejected for this feature specifically because it would be the only section on the home page styled differently from its immediate neighbors, increasing maintenance inconsistency for no visual or functional benefit. This mirrors the precedent already set (and implicitly accepted) by `Services` and `BeforeAfter`.

## Decision: Content source

- **Decision**: Step content (numbers, titles, descriptions) and header copy (eyebrow, heading) are hardcoded as a static array inside `Process.tsx`, typed via `Process.types.ts`.
- **Rationale**: Matches the existing precedent set by `Services` (hardcoded `services` array) on the same route. The spec's Assumptions section confirms content is static for this pass with no CMS integration required.
- **Alternatives considered**: Sourcing step content from Sanity — rejected as out of scope per the spec; would also be inconsistent with how the immediately adjacent `Services` section currently sources its content.

## Decision: Accessibility treatment of connector marks

- **Decision**: The small dash/line connectors between steps 1→2 and 2→3 are marked `aria-hidden="true"` since they are purely decorative separators with no semantic meaning.
- **Rationale**: WCAG 2.1 AA requires meaningful content to be exposed to assistive tech and decorative content to be hidden from it, avoiding noise in the accessibility tree.
- **Alternatives considered**: Rendering connectors as visible text (e.g., "–") without `aria-hidden` — rejected because it would be read aloud by screen readers with no informational value.
