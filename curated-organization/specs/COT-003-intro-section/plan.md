# Implementation Plan: Home Page Intro Section

**Branch**: `COT-003-intro-section` | **Date**: 2026-07-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/COT-003-intro-section/spec.md`

## Summary

Implement a route-local React component for the home page's intro section. This section displays the brand philosophy ("Functional Luxury") with a centered layout, responsive typography, and a secondary call-to-action link. The component accepts no props (content is hardcoded) and must match the provided design mockup pixel-for-pixel at desktop (1440px) while gracefully scaling across tablet and mobile breakpoints. All styling uses camelCase CSS-in-JS with full WCAG AA accessibility and no layout shift.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React, React Router, Tailwind CSS, TypeScript

**Storage**: N/A (this feature does not involve content from Sanity; all text is brand messaging)

**Testing**: Vitest (unit), Playwright (visual/interaction) as per project standard

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: 
- No Cumulative Layout Shift (CLS = 0) from this component
- Intro section content paintable within 2.5s (part of LCP for home page)
- No render-blocking stylesheets for intro section

**Constraints**: 
- Desktop reference breakpoint: 1440px (pixel-perfect accuracy ±2px spacing, ±1px fonts)
- Responsive scaling at tablet (768px–1199px) and mobile (≤767px)
- All CSS properties MUST use camelCase naming (TypeScript object notation)
- WCAG 2.1 AA contrast, keyboard navigation, semantic HTML

**Scale/Scope**: 
- Single route-local component (home page only)
- No new shared components or design system extensions
- No database or CMS changes
- Pure presentational component with no state management

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Architecture — flat routes, components always paired with types** — The Intro component is route-local (home page only), placed in `app/routes/pages/home/components/Intro/` as a folder pairing `Intro.tsx` with `Intro.types.ts` from the start. No Generic/Domain-adapter split needed — this is a simple, single-use presentational component that takes no props. No new shared components required.

- [x] **Content ownership** — All content in this component is functional (hardcoded brand messaging): "Our approach", "Functional luxury", body copy, and link text. These are not editorial content that a user would manage in Sanity — they are site-wide constants. If this messaging becomes editable in the future, it would be migrated to Sanity schema as a separate feature.

- [x] **Sanity content layer** — N/A for this feature. The intro section does not query Sanity; all text is provided in the feature spec.

- [x] **Media (Cloudinary)** — N/A. No video or image assets beyond backgrounds/styling.

- [x] **TypeScript strict** — Component uses strict TypeScript with proper typing for props (even though empty) and any internal state. No `any` or `@ts-ignore`.

- [x] **Mobile-first** — Base styles target mobile (320px+); tablet and desktop breakpoints layer on top using Tailwind responsive modifiers or `app/constants/index.ts` breakpoints. Layout is flex-based and adapts naturally.

- [x] **Accessibility (WCAG 2.1 AA)** — Semantic HTML (`<section>`, `<h2>`, `<p>`, `<a>`), text color contrast verified against backgrounds (≥4.5:1), keyboard focus visible on the "Learn more about us →" link, proper heading hierarchy.

- [x] **Performance & SEO** — Intro component is rendered server-side as part of the home route; no client-side-only data fetching. Home route's `meta` export handles page-level SEO. Component itself uses no external async calls and contributes minimal JavaScript.

**Result**: ✅ All Constitution items pass. No violations or special-case justifications needed.

## Component Design Decisions

| Component       | Placement                                                                  | Generic base (if adapter) | Rationale |
| --------------- | -------------------------------------------------------------------------- | ------------------------- | --------- |
| `Intro`         | Route-local (home page only) — `app/routes/pages/home/components/Intro/`   | N/A                       | Appears only on home page; no behavior variation across consumers; displays fixed brand messaging. Doesn't warrant a shared component. |

## Content Layer Decisions

| Content item                        | Classification | Content type (new or existing) | Notes                                                                       |
| ----------------------------------- | --------------- | ------------------------------ | --------------------------------------------------------------------------- |
| Intro eyebrow ("Our approach")      | Functional      | N/A (hardcoded text)           | Brand messaging, part of home page design system. Not edited post-deploy.   |
| Intro heading ("Functional luxury") | Functional      | N/A (hardcoded text)           | Same as above.                                                              |
| Intro body copy                     | Functional      | N/A (hardcoded text)           | Same as above.                                                              |
| Link text + URL                     | Functional      | N/A (hardcoded/routed)         | "Learn more about us →" links to `/about` route (TBD destination route).    |

## Project Structure

### Documentation (this feature)

```text
specs/COT-003-intro-section/
├── spec.md              # Feature specification
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output — all unknowns resolved (none for this feature)
├── data-model.md        # Phase 1 output (N/A — no data model; all text is hardcoded)
├── quickstart.md        # Phase 1 output — validation scenarios
├── contracts/           # Phase 1 output (N/A — no external interfaces)
└── tasks.md             # Phase 2 output (generated by `/speckit-tasks`)
```

### Source Code (repository root)

```text
app/routes/pages/
└── home/
    ├── index.tsx                    # Home route container (updated to render Intro)
    ├── home.query.ts                # Existing home query (unchanged by this feature)
    └── components/
        └── Intro/                       # NEW — route-local component (this feature)
            ├── Intro.tsx
            └── Intro.types.ts
```

**Structure Decision**: The home page already exists; this feature adds a single new component folder under `app/routes/pages/home/components/Intro/`. No new routes, no new shared components, no structural deviations. Home route's `index.tsx` will import and render the Intro component.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| (none)    | N/A        | This feature has zero Constitution violations. |

---

## Phase 0: Outline & Research

### Unknowns & Dependencies

**Result**: ✅ **ZERO unknowns**

- Design is complete (`.specify/site-design/curated-home-mockup.html` provides exact CSS values)
- Content is fixed (specified in feature spec)
- Breakpoints are standard (align with project constants)
- Technology choices are predetermined (React, TypeScript, Tailwind CSS)
- Styling approach is clear (camelCase CSS-in-JS with Tailwind)
- No external integrations or API calls required
- Accessibility requirements are standard WCAG 2.1 AA (consistent with project baseline)

**Action**: No research artifacts needed. Proceed directly to Phase 1 Design.

---

## Phase 1: Design & Contracts

### 1. Data Model

**Result**: N/A — This feature does not introduce new data types or entities. All content is hardcoded text and styling constants.

**File to create**: `data-model.md` (will document "N/A - no data model" for clarity)

### 2. Interface Contracts

**Result**: N/A — Intro component is route-local with no external interface. It's a pure React component that accepts no props and returns JSX.

**File to create**: None (no contracts/ directory needed)

### 3. Quickstart Validation Guide

**File to create**: `quickstart.md`

Content will document:
- Prerequisites: Node 18+, npm dependencies installed, dev server running
- Setup: No additional setup beyond project root npm install
- Validation scenarios:
  1. Desktop rendering (1440px): Visual match to mockup screenshot
  2. Tablet rendering (768px): Responsive layout
  3. Mobile rendering (480px): Responsive layout
  4. Link accessibility: Keyboard navigation (Tab key), focus indicator
  5. Contrast: Link color meets WCAG AA (≥4.5:1)
  6. No layout shift: CLS = 0 during component paint

---

## Implementation Overview (Phase 2 — handled by `/speckit-tasks`)

Tasks will cover:

1. **Create component folder structure**: `app/routes/pages/home/components/Intro/` with `Intro.tsx` + `Intro.types.ts`
2. **Define TypeScript types**: `IntroProps` (empty/no props), content text constants
3. **Build Intro component**: 
   - Semantic HTML (`<section>`, `<h2>`, `<p>`, `<a>`)
   - Flexbox layout, camelCase CSS properties
   - Responsive breakpoints (320px, 768px, 1200px+)
   - Hardcoded content (eyebrow, heading, body, link)
4. **Style component**: 
   - Desktop: 100px vertical / 64px horizontal padding, 620px max-width, centered
   - Responsive scaling: tablet 64px → 32px, mobile 32px → 20px (proportional)
   - Typography: serif heading (36px), sans body (15px), link (12px) with hover/focus
   - Colors: use project design tokens (--brand-teal, --muted, --charcoal, etc.)
5. **Integrate into home route**: Import Intro component into `app/routes/pages/home/index.tsx` and render
6. **Verify accessibility**: 
   - Contrast ratios (≥4.5:1 for link)
   - Keyboard focus visible on link
   - Semantic structure correct
   - alt text N/A (no images in component)
7. **Test responsive rendering**: Verify at 1440px, 768px, 480px, 360px viewports
8. **Verify performance**: No layout shift, no render-blocking resources

---

## Artifacts to Generate

**By `/speckit-plan` (this command):**
- ✅ `plan.md` (this file)
- ✅ `research.md` (trivial — "no unknowns")
- ✅ `data-model.md` ("N/A")
- ✅ `quickstart.md` (validation scenarios)

**By `/speckit-tasks` (next step):**
- `tasks.md` (actionable implementation tasks, dependency-ordered)

