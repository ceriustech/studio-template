# Research: Home Page Intro Section

**Feature**: COT-003 Intro Section | **Date**: 2026-07-13 | **Status**: Complete

## Summary

This feature has **zero unknowns**. All design specifications, content, technical requirements, and implementation guidance are provided in the feature spec and design mockup. No research tasks were required.

## Unknowns Identified

**Result**: None.

- ✅ Design reference: Complete CSS styles provided (`.specify/site-design/curated-home-mockup.html`, lines 1049–1062 and style definitions)
- ✅ Content: Fixed brand messaging (eyebrow, heading, body copy, link text all specified)
- ✅ Breakpoints: Standard project breakpoints (align with `app/constants/index.ts`)
- ✅ Technical approach: React component, TypeScript, camelCase CSS, Tailwind CSS — all predetermined by project standards
- ✅ Accessibility: WCAG 2.1 AA is the project baseline; no feature-specific requirements beyond standard
- ✅ Styling methodology: CSS-in-JS with camelCase naming — established project pattern
- ✅ Component architecture: Route-local component (home page only) — clear from Constitution

## Decisions Made

| Topic | Decision | Rationale |
| ----- | -------- | --------- |
| Component placement | Route-local (`app/routes/pages/home/components/Intro/`) | Appears only on home page; no cross-route reuse. Single-use components don't warrant shared component overhead. |
| Props model | No props; hardcoded content | All content is fixed brand messaging. Future migration to Sanity (if needed) would be a separate feature. |
| Styling approach | Tailwind CSS + camelCase CSS-in-JS | Aligns with project setup; Tailwind responsive prefixes handle mobile-first breakpoints. |
| Link destination | `/about` | Inferred from design pattern; confirmed in spec assumptions. Can be adjusted if route name changes. |
| Breakpoints | 320px (mobile), 480px (small mobile), 768px (tablet), 1200px+ (desktop) | Matches `app/constants/index.ts` and spec success criteria. |
| Content source | Hardcoded in component | Not editorial; no CMS needed. Accessible to developers only. |

## Dependencies

**External**: None. This feature is self-contained.

**Internal**: 
- Home route (`app/routes/pages/home/index.tsx`) must import and render Intro component
- Project design tokens must be available (`--brand-teal`, `--muted`, `--charcoal`, etc.) — already defined in project

## Alternatives Considered

| Option | Rejected Because | |
| ------ | ------- | -------- |
| Make intro section a shared component | Not reused across routes; shared component pattern adds unnecessary indirection. Route-local component simpler and appropriate. |
| Source content from Sanity | Content is brand messaging, not editorial. Hardcoding in code is sufficient for this feature. (Future: editorial content migration would be a separate feature.) |
| Use inline styles instead of Tailwind + CSS-in-JS | Tailwind consistent with project; camelCase CSS-in-JS matches TypeScript-first approach. |
| Split intro into sub-components (Eyebrow, Heading, Body, Link) | Feature is simple; single-component approach clearer than unnecessary component hierarchy. Sub-components only when complexity justifies them. |

## Conclusion

**All prerequisites for Phase 1 Design are satisfied.** Proceed to design artifacts (data-model.md, quickstart.md).

