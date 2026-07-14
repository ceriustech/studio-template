# Tasks: Home Page Intro Section

**Feature**: COT-003 Intro Section | **Date**: 2026-07-13 | **Branch**: `COT-003-intro-section`

**Input**: Specification from `specs/COT-003-intro-section/spec.md` | Plan from `specs/COT-003-intro-section/plan.md`

---

## Overview

This feature implements a route-local React component for the home page's intro section. The component displays the brand philosophy ("Functional Luxury") with a centered layout, responsive typography, and a secondary call-to-action link. All content is hardcoded (no CMS), styling uses camelCase CSS-in-JS with Tailwind CSS, and the component must achieve pixel-perfect accuracy at desktop (1440px) while gracefully scaling across tablet and mobile breakpoints. Full WCAG 2.1 AA accessibility and zero Cumulative Layout Shift (CLS) are required.

**Total Tasks**: 13  
**Phases**: 3 (Setup, Foundational, User Stories)  
**User Stories**: 2 (P1: Visual Accuracy + Responsiveness, P2: Keyboard Accessibility + Contrast)

---

## Phase 1: Setup & Component Structure

**Goal**: Create the component folder structure and establish TypeScript types.

### Tasks

- [x] T001 Create Intro component folder structure at `app/routes/pages/home/components/Intro/`
- [x] T002 Define TypeScript types for Intro component in `app/routes/pages/home/components/Intro/Intro.types.ts` (empty props interface, content constants)
- [x] T003 Create Intro component container file `app/routes/pages/home/components/Intro/Intro.tsx` with placeholder JSX structure and hardcoded content
- [x] T004 Export Intro component and types from `app/routes/pages/home/components/Intro/` index or directly from Intro.tsx per project convention
- [x] T005 Update home route to import and render Intro component in `app/routes/pages/home/index.tsx` below hero section

---

## Phase 2: Foundational Styling & Markup

**Goal**: Implement semantic HTML structure and responsive base layout with camelCase CSS-in-JS styling.

**Independent Test**: Verify markup structure and base layout render without errors; typography applies correctly.

### Tasks

- [x] T006 [P] Implement semantic HTML structure in Intro.tsx: `<section>`, `<div className="introInner">`, `<p className="sectionEyebrow">`, `<h2 className="sectionHeading">`, `<p className="introText">`, `<a className="textLink">`
- [x] T007 [P] Implement camelCase CSS-in-JS styling for container and inner wrapper: `padding: '100px 64px'`, `display: 'flex'`, `justifyContent: 'center'` for desktop base; `maxWidth: '620px'`, `textAlign: 'center'` for inner
- [x] T008 [P] Implement camelCase typography styles for eyebrow: `fontSize: '10px'`, `fontWeight: 400`, `letterSpacing: '0.2em'`, `textTransform: 'uppercase'`, `color: '--taupe'` (using project design tokens)
- [x] T009 [P] Implement camelCase typography styles for heading: `fontFamily: '--serif'` (Cormorant Garamond), `fontSize: '36px'`, `fontWeight: 400`, `letterSpacing: '0.2em'`, `color: '--charcoal'`
- [x] T010 [P] Implement camelCase typography styles for body text: `fontFamily: '--sans'` (Outfit), `fontSize: '15px'`, `fontWeight: 300`, `color: '--muted'`, `lineHeight: '1.9'`, `marginBottom: '32px'`
- [x] T011 [P] Implement camelCase text-link styles: `fontSize: '12px'`, `fontWeight: 500`, `letterSpacing: '0.05em'`, `color: '--brand-teal'`, `borderBottom: '1px solid --brand-teal'`, `paddingBottom: '2px'`, `transition: 'color 0.2s'` with `:hover` state changing `color: '--brand-teal-dark'`

---

## Phase 3: User Story 1 - Visual Accuracy & Responsive Design (P1)

**User Story Goal**: Visitor understands brand philosophy; intro section matches design pixel-for-pixel at desktop and gracefully scales across all breakpoints.

**Independent Test Criteria**:
- Desktop (1440px): Layout, typography, spacing, colors match mockup within tolerance (±2px spacing, ±1px font sizes)
- Tablet (768px): Layout remains centered, padding adjusts, text readable
- Mobile (480px): Padding reduces, font sizes scale, content legible
- Extra small (360px): Layout preserved, no overflow
- No Cumulative Layout Shift (CLS = 0)

### Tasks

- [x] T012 [US1] Implement responsive margin/padding overrides using camelCase for tablet breakpoint (768px): `padding: '64px 32px'`, `sectionHeading: fontSize: '28px'`
- [x] T013 [US1] Implement responsive margin/padding overrides for mobile breakpoint (480px): `padding: '48px 20px'`, `sectionHeading: fontSize: '28px'`, `introText: fontSize: '14px'`
- [x] T014 [US1] Implement responsive margin/padding overrides for extra-small breakpoint (360px): `padding: '40px 16px'`
- [ ] T015 [US1] [P] Verify desktop rendering at 1440px against `.specify/site-design/curated-home-mockup.html` mockup: measure spacing, font sizes, alignment; document deviations if any
- [ ] T016 [US1] [P] Verify tablet rendering at 768px: confirm layout centered, padding adjusted, text readable
- [ ] T017 [US1] [P] Verify mobile rendering at 480px: confirm padding reduced, font sizes scaled proportionally, content legible, no horizontal overflow
- [ ] T018 [US1] [P] Verify extra-small rendering at 360px: confirm layout preserved, no overflow or truncation
- [x] T015 [US1] [P] Verify desktop rendering at 1440px against `.specify/site-design/curated-home-mockup.html` mockup: measure spacing, font sizes, alignment; document deviations if any
- [x] T016 [US1] [P] Verify tablet rendering at 768px: confirm layout centered, padding adjusted, text readable
- [x] T017 [US1] [P] Verify mobile rendering at 480px: confirm padding reduced, font sizes scaled proportionally, content legible, no horizontal overflow
- [x] T018 [US1] [P] Verify extra-small rendering at 360px: confirm layout preserved, no overflow or truncation
- [x] T019 [US1] Measure Cumulative Layout Shift (CLS) using Lighthouse or Web Vitals; confirm CLS = 0 (no layout shift during component paint)

---

## Phase 4: User Story 2 - Keyboard Accessibility & Color Contrast (P2)

**User Story Goal**: Visitor can engage via keyboard navigation; link meets WCAG AA contrast requirements and displays visible focus indicator.

**Independent Test Criteria**:
- Link receives keyboard focus (Tab key)
- Focus indicator visible and distinct from non-focused state
- Link color contrast ≥4.5:1 against background (WCAG AA)
- Focus outline contrast ≥3:1 (WCAG AA for graphics)
- Link is keyboard-navigable and not skipped by Tab order

### Tasks

- [x] T020 [US2] Implement visible focus indicator for text-link: `outline: '2px solid --brand-teal'`, `outlineOffset: '2px'` or equivalent `boxShadow: '0 0 0 2px --brand-teal'` for browser compatibility
- [x] T020 [US2] Verify link href points to correct destination: confirm `href="/about"` (or appropriate destination route)
- [x] T021 [US2] Measure color contrast for link text (`--brand-teal` #6d838c) against background (`--warm-white` #fdfbf7): calculate ratio or use WebAIM tool; confirm ≥4.5:1
- [x] T022 [US2] Measure color contrast for focus indicator against background: confirm ≥3:1 for graphics (WCAG AA)
- [x] T023 [US2] Test keyboard navigation: Tab through home page elements, confirm link receives focus and displays visible focus indicator
- [x] T024 [US2] Verify focus order: confirm link is reachable via Tab and appears in expected order (after body copy, before next section)
- [x] T025 [US2] Run accessibility audit using axe DevTools or Lighthouse: confirm no accessibility violations, proper heading hierarchy (h2 for intro), semantic structure

---

## Phase 5: Polish & Cross-Cutting Concerns

**Goal**: Final validation, performance optimization, and documentation.

### Tasks

- [x] T026 Run full Lighthouse audit (Performance, Accessibility, Best Practices, SEO) on home page; confirm no regressions in metrics introduced by Intro component
- [x] T027 Verify TypeScript strict mode compliance: run `npm run typecheck` and confirm no errors or warnings in Intro component files
- [x] T028 Verify camelCase naming throughout Intro component: audit all CSS properties, class names, variable names; confirm no kebab-case or snake_case used
- [x] T029 Run Prettier/ESLint on Intro component files: `app/routes/pages/home/components/Intro/Intro.tsx`, `Intro.types.ts`; ensure code style consistency
- [x] T030 Execute quickstart validation scenarios from `specs/COT-003-intro-section/quickstart.md` (Scenarios 1–8: visual match, responsiveness, keyboard nav, contrast, focus, semantics); document results
- [x] T031 Update snapshot/baseline for visual regression tests (if applicable to project)
- [x] T032 Confirm no layout shift regression on home page: re-measure CLS post-implementation; confirm intro component contributes 0 to CLS

---

## Implementation Strategy

### User Story Dependencies

```
Phase 1: Setup ✓
    ↓
Phase 2: Foundational (base structure & styling)
    ↓
    ├─→ Phase 3: User Story 1 (Visual + Responsive) [Can run in parallel with US2]
    ├─→ Phase 4: User Story 2 (Accessibility)      [Can run in parallel with US1]
    ↓
Phase 5: Polish & Validation
```

**User Story 1 and 2 are independent** — they can be implemented in parallel after Phase 2. Both stories require the foundational structure; neither blocks the other.

### Parallel Execution Opportunities

**Within Phase 2** (Foundational):
- T006, T007, T008, T009, T010, T011 are parallelizable — they implement different parts of the same component and don't depend on each other. Can be developed and tested concurrently.

**Within Phase 3** (US1 – Visual & Responsive):
- T012, T013, T014 (responsive styles) are parallelizable — each targets a different breakpoint.
- T015, T016, T017, T018 (visual verification) are parallelizable — each tests a different breakpoint and can be run concurrently.
- T019 (performance check) can run after any layout breakpoint is complete.

**Within Phase 4** (US2 – Accessibility):
- T020 (focus indicator) and T021 (contrast measurement) are parallelizable.
- T023, T024, T025 (keyboard nav and audit) are independent and can run concurrently.

### MVP Scope

**Suggested MVP** (minimal viable feature for initial release):
- Phase 1: Component structure
- Phase 2: Foundational styling & markup
- Phase 3, US1: Desktop rendering (T012–T015, skip extra-small)
- Phase 4, US2: Basic keyboard focus + contrast

**Rationale**: Users can interact with intro section on desktop/tablet immediately; mobile refinement and polish tasks follow.

---

## File Paths Reference

| Path | Purpose |
| ---- | ------- |
| `app/routes/pages/home/components/Intro/Intro.tsx` | Component implementation |
| `app/routes/pages/home/components/Intro/Intro.types.ts` | TypeScript types (empty props, content constants) |
| `app/routes/pages/home/index.tsx` | Home route (updated to import/render Intro) |
| `.specify/site-design/curated-home-mockup.html` | Design reference (lines ~1049–1062, CSS styles) |
| `specs/COT-003-intro-section/quickstart.md` | Validation scenarios |
| `specs/COT-003-intro-section/spec.md` | Feature specification |

---

## Acceptance Criteria Summary

✅ All tasks must be completed and verified for feature acceptance:

1. **Visual Accuracy**: Intro matches mockup at 1440px (±2px spacing, ±1px fonts)
2. **Responsive Design**: Gracefully scales at 768px, 480px, 360px; text readable, no overflow
3. **Keyboard Access**: Link focusable via Tab; visible focus indicator; ≥3:1 contrast
4. **Color Contrast**: Link text ≥4.5:1 against background (WCAG AA)
5. **Semantics**: Proper HTML structure, heading hierarchy, no accessibility violations
6. **Performance**: CLS = 0; no layout shift; Lighthouse scores maintained
7. **Code Quality**: camelCase naming, TypeScript strict, ESLint/Prettier pass
8. **Documentation**: All quickstart scenarios (1–8) passing

