---
title: COT-004: Services section
summary: Implement the Services intro section on the home page using the markup from the design mockup. It should render as its own section between the Intro and Before/After sections and match the provided screenshot exactly.
---

## Purpose

Implement the Services section for the Home page so that it matches the provided visual design and HTML markup in `.specify/site-design/curated-home-mockup.html` (the block under the `<!-- SERVICES -->` comment). The section is a visually important, static content block that introduces the three primary service cards and a footer link.

## Context

This feature places the Services section between the Intro and Before/After sections on the home page. It is strictly a presentation feature — content is static for now and provided via the HTML/CSS in the mockup. Styling must be translated into the project's style conventions and camel-cased CSS-in-JS or CSS module class names where appropriate.

## User Scenarios & Testing

- Scenario 1: As a site visitor, I land on the homepage and visually scan for services. I should see the Services eyebrow, heading, three image-backed service cards with title and description, and a centered "View all services →" link below.
  - Test: Load the homepage at desktop width (>= 1280px). Inspect that three cards are visible in a single row, images scale to fill the card top area, and body copy matches the screenshot.
- Scenario 2: As a mobile visitor, the cards stack vertically and spacing mirrors the mockup.
  - Test: Resize viewport to <= 768px and confirm the grid becomes a single-column stack, with appropriate paddings.
- Scenario 3: Hover interactions give subtle elevation and shadow on each card.
  - Test: Hover each card to confirm transform and box-shadow animate.

## Functional Requirements (testable)

1. The Services section must be a standalone semantic `section` element placed directly after the Intro and before the Before/After sections.
   - Acceptance: Page source shows a `section` with a top-level class `services` between the Intro and Before/After sections.
2. The section must contain a centered header area with an eyebrow (`The Services`) and a heading `Bespoke solutions, gracefully executed` that visually matches the mockup (font sizes, spacing, and weight).
   - Acceptance: Header text content and order match the screenshot.
3. There must be a three-column grid (`services-grid`) on desktop, each column containing:
   - an image area 240px tall (or responsive equivalent) filling the card top
   - a card body with title and description
   - hover state: slight translateY(-4px) and subtle shadow
   - Acceptance: Cards are arranged in 3 columns on desktop and adopt single column on mobile.
4. The section background must use a warm background tone (`--warm-bg` in the mockup) while the cards use a warm-white background with a 1px border.
   - Acceptance: Visual background colors match the mockup.
5. The section must include a centered footer link "View all services →" styled as a small text link with underline and brand teal color.
   - Acceptance: Footer link present and visually centered below grid.
6. All CSS property names translated to camelCase in any JS/CSS-in-JS code or CSS module objects.
   - Acceptance: No dash-cased property names left in JS style objects (project linting/formatting will enforce).

## Success Criteria (measurable)

- Visual parity: 95% match with the provided screenshot when viewed at 1366x768 (manual review). Differences limited to font rendering and minor image cropping.
- Layout: Desktop view shows exactly 3 cards in a centered row within a max width of ~1080px. Mobile view stacks to a single column at <= 768px.
- Interaction: Hover animation applies to all cards with smooth 0.3s transition.

## Key Entities

- ServiceCard: title, description, imageUrl

## Accessibility

- All images must have appropriate `alt` text (used in markup for now). If images are decorative, include empty `alt=""` and mark with `aria-hidden` as needed.
- Heading order preserved: section eyebrow (small text) then main heading as an `h2`.

## Assumptions

- The HTML block in `.specify/site-design/curated-home-mockup.html` is the source of truth for layout and spacing.
- Content is provided statically; no CMS integration required for this task.
- Fonts and global CSS variables in the mockup (e.g., `--warm-bg`) will be available or reproduced in the project's global styles.

## Acceptance Criteria

- The section renders as its own `section` element between Intro and Before/After.
- Visual match to screenshot at desktop and mobile breakpoints.
- Styling variables and class names follow project conventions; when styles are converted into JS style objects they use camelCase.

## Implementation Notes (for devs)

- Use the markup from the mockup under the `<!-- SERVICES -->` comment as a starting point.
- Translate the CSS selectors into the project's styling approach and ensure any inline style objects use camelCase.
- Keep component structure simple: a `Services` section component composed of `ServiceCard` components.
