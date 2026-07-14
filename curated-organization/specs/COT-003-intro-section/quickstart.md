# Quickstart: Home Page Intro Section

**Feature**: COT-003 Intro Section | **Date**: 2026-07-13 | **Status**: Validation Guide

## Overview

This guide provides runnable validation scenarios to confirm the Intro component implementation meets the feature specification. Each scenario is independently testable and verifies a specific aspect of the success criteria.

## Prerequisites

- Node 18+ installed
- Repository cloned and `npm install` complete in project root
- Dev server running: `npm run dev` (starts on `http://localhost:3000`)
- Playwright installed (for visual/interaction tests) or manual browser testing available

## Scenario 1: Visual Match at Desktop (1440px)

**Validates**: Desktop reference breakpoint accuracy (±2px spacing, ±1px font sizes)

### Setup

1. Start dev server: `npm run dev`
2. Open browser to `http://localhost:3000/` (home page)
3. Open browser DevTools and set viewport to 1440px width × 900px height

### Test Steps

1. Scroll to the intro section (second major section after hero)
2. Compare rendered layout to `.specify/site-design/curated-home-mockup.html`:
   - Eyebrow ("Our approach") visible, uppercase, small font, muted color
   - Heading ("Functional luxury") centered, serif font (Cormorant Garamond), 36px
   - Body copy visible with proper line-height (1.9) and light weight (300)
   - Link ("Learn more about us →") visible in teal, underline present
   - Entire section centered with max-width container (~620px)
   - Outer padding ~100px top/bottom, ~64px left/right

### Expected Outcome

✅ Layout, typography, spacing, and colors match the mockup within tolerance (±2px spacing, ±1px font sizes)

### Tools

- Browser DevTools for measuring distances
- Browser DevTools Inspector to verify computed styles (camelCase CSS properties should resolve correctly)
- Optional: Take screenshot and compare pixel-for-pixel using visual regression tool

---

## Scenario 2: Responsive Layout at Tablet (768px)

**Validates**: Tablet breakpoint (768px–1199px) responsive scaling

### Setup

1. Start dev server: `npm run dev`
2. Open `http://localhost:3000/`
3. Resize browser to 768px width × 1024px height (or use DevTools responsive mode)

### Test Steps

1. Scroll to intro section
2. Verify layout:
   - Section remains centered and readable
   - Padding adjusts (should be smaller than desktop but proportional)
   - Text remains readable with no overflow
   - Heading size scales proportionally (approximately 28px, per spec responsive rules)
   - Body text remains legible (font size ~14–15px depending on breakpoint)
   - Link remains accessible

### Expected Outcome

✅ Layout adapts smoothly without content overflow; visual hierarchy and readability preserved

### Tools

- Browser DevTools responsive mode
- Manual inspection of typography and spacing

---

## Scenario 3: Responsive Layout at Mobile (480px)

**Validates**: Mobile breakpoint (≤480px) responsive scaling

### Setup

1. Start dev server: `npm run dev`
2. Open `http://localhost:3000/`
3. Resize to 480px width × 800px height

### Test Steps

1. Scroll to intro section
2. Verify:
   - Section centered, not cut off
   - Padding reduced (approximately 48px top/bottom, 20px left/right per spec)
   - Heading scales to ~28px, remains readable
   - Body text scales to ~14px, line-height preserved
   - Link remains tappable (44×44px minimum)
   - No horizontal scrolling

### Expected Outcome

✅ Content legible and centered; no layout shift or horizontal scroll

---

## Scenario 4: Keyboard Navigation & Focus Indicator

**Validates**: Accessibility (WCAG AA) — keyboard navigation and visible focus

### Setup

1. Start dev server: `npm run dev`
2. Open `http://localhost:3000/`
3. Using keyboard only (no mouse)

### Test Steps

1. Press Tab key repeatedly to navigate to interactive elements
2. Focus should reach the "Learn more about us →" link
3. When link receives focus, verify:
   - Visible focus indicator appears (outline, underline color change, or box-shadow)
   - Focus indicator has adequate contrast against background (≥3:1 per WCAG AA for graphics)
   - Focus indicator is not obscured by other elements

### Expected Outcome

✅ Link receives keyboard focus and displays visible focus indicator meeting WCAG AA contrast

### Tools

- Keyboard (Tab, Shift+Tab)
- Browser accessibility inspector (DevTools → Accessibility panel)

---

## Scenario 5: Color Contrast Verification

**Validates**: WCAG 2.1 AA contrast ratio (≥4.5:1 for normal text)

### Setup

1. Open `http://localhost:3000/`
2. Use browser accessibility tools or online contrast checker

### Test Steps

1. Identify link color (should be `--brand-teal` = `#6d838c`)
2. Identify background color (should be `--warm-white` = `#fdfbf7`)
3. Calculate or measure contrast ratio
4. Verify all text elements:
   - Link text (12px, weight 500) vs. background: ≥4.5:1
   - Body copy (15px, weight 300) vs. background: ≥4.5:1
   - Eyebrow (10px) vs. background: ≥4.5:1

### Expected Outcome

✅ All text elements meet WCAG AA contrast requirement (≥4.5:1)

### Tools

- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Browser DevTools (Lighthouse, Accessibility panel)
- axe DevTools browser extension
- Online tools: https://www.tpgi.com/color-contrast-checker/

---

## Scenario 6: No Layout Shift (Cumulative Layout Shift = 0)

**Validates**: Performance — zero CLS from intro component

### Setup

1. Open `http://localhost:3000/` in Chrome/Chromium-based browser
2. Open DevTools → Performance tab

### Test Steps

1. Record a performance profile (click Record, scroll to intro section, stop recording)
2. In the profile, review the Cumulative Layout Shift metric
3. Alternatively, use Lighthouse:
   - DevTools → Lighthouse → Run audit
   - Check CLS score (target: 0 from this component)

### Expected Outcome

✅ Intro component contributes 0 to CLS (no shifted layout during paint/render)

### Tools

- Chrome DevTools Performance tab
- Lighthouse audit
- Web Vitals library: https://github.com/GoogleChromeLabs/web-vitals

---

## Scenario 7: Semantic HTML & Accessibility Structure

**Validates**: WCAG AA — semantic landmarks and heading hierarchy

### Setup

1. Open `http://localhost:3000/`
2. Use browser DevTools Inspector or accessibility tools

### Test Steps

1. Inspect intro section HTML:
   - Verify `<section>` tag (or semantic landmark like `<article>`)
   - Verify heading is `<h2>` (proper hierarchy after `<h1>` hero title)
   - Verify paragraphs use `<p>` tags
   - Verify link is `<a>` with `href` attribute
2. Use axe DevTools or similar to scan for accessibility issues
3. Run lighthouse accessibility audit

### Expected Outcome

✅ Semantic HTML structure correct; no heading hierarchy violations; no accessibility errors reported

### Tools

- Browser DevTools Inspector
- axe DevTools: https://www.deque.com/axe/devtools/
- WAVE: https://wave.webaim.org/
- Lighthouse accessibility audit

---

## Scenario 8: Heading Hierarchy (Home Page Context)

**Validates**: Proper `<h1>`, `<h2>` order across home page sections

### Setup

1. Open `http://localhost:3000/`
2. Use DevTools or accessibility scanner

### Test Steps

1. Identify all headings on home page:
   - Hero section: `<h1>` (should be "CURATED")
   - Intro section: `<h2>` (should be "Functional luxury")
   - Services section: `<h2>` (should be "Bespoke solutions...")
   - Other sections: appropriate h2/h3 levels
2. Verify no `<h1>` after intro; no skipped levels (e.g., no h2 → h4)

### Expected Outcome

✅ Heading hierarchy is correct: `<h1>` in hero, `<h2>` for intro, services, etc.; no skipped levels

---

## Full-Page Validation Script (Optional Automated Check)

If Playwright is set up:

```bash
# Run intro component-specific tests
npm run test:component -- intro

# Run visual regression (if baseline exists)
npm run test:visual -- intro

# Run accessibility audit
npm run test:a11y -- intro
```

---

## Sign-Off

Once all scenarios pass:

1. ✅ Scenario 1: Desktop visual accuracy
2. ✅ Scenario 2: Tablet responsiveness
3. ✅ Scenario 3: Mobile responsiveness
4. ✅ Scenario 4: Keyboard navigation & focus
5. ✅ Scenario 5: Color contrast
6. ✅ Scenario 6: No layout shift
7. ✅ Scenario 7: Semantic HTML
8. ✅ Scenario 8: Heading hierarchy

**Implementation is complete and ready for review.**

