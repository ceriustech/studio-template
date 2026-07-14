# Feature Specification: Home Page Intro Section

**Feature Branch**: `COT-003-intro-section`

**Created**: 2026-07-13

**Status**: Draft

**Input**: User description: "Implement the intro section on the home page. The intro section html markup is located in .specify\site-design\curated-home-mockup.html under the `<!-- INTRO -->` comment. All translated styles should be camel cased. Acceptance Criteria: The intro section should match the design screenshot exactly."

## Summary

Implement the intro section on the Curated Organization home page. This section follows the hero and introduces the brand philosophy through a centered, approachable layout. The section displays the brand approach statement with supporting copy and a call-to-action link that invites deeper engagement. The implementation must match the provided design screenshot exactly across all breakpoints.

## Background

The intro section is the second major visual component on the home page, immediately following the hero. It establishes the brand's core value proposition: "Functional Luxury" — the intersection of beauty and practicality. This section transitions visitors from immediate visual impact (hero) to understanding (our approach) before revealing detailed services and social proof.

## User Scenarios & Testing

### User Story 1 - Visitor Understands Brand Philosophy (Priority: P1)

A visitor lands on the home page and scrolls past the hero. The intro section clearly communicates that Curated Organization combines aesthetic refinement with practical, livable spaces.

**Why this priority**: This is the primary purpose of the intro section — establishing brand positioning and value to every visitor. Without a clear, well-designed intro, visitors cannot understand the differentiation.

**Independent Test**: Can be fully tested by loading the home page, scrolling to the intro section, and verifying the layout, typography, copy hierarchy, and visual design match the screenshot exactly at desktop (1440px) and gracefully resize on tablet/mobile.

**Acceptance Scenarios**:

1. **Given** a visitor on the home page at desktop size (1440px), **When** they view the intro section, **Then** they see the eyebrow label "Our approach", the main heading "Functional luxury" prominently displayed, and body copy that clearly articulates the brand philosophy with consistent typography and spacing.
2. **Given** a visitor on tablet (768px–1199px), **When** they view the intro section, **Then** the layout remains centered, padding adjusts appropriately, and all text remains readable with proper line-height.
3. **Given** a visitor on mobile (≤767px), **When** they view the intro section, **Then** padding and text sizes scale proportionally, content remains legible, and the centered layout is preserved.

### User Story 2 - Visitor Engages with Secondary CTA (Priority: P2)

A visitor wants to learn more about the brand's approach. The "Learn more about us →" link is visible, keyboard-accessible, and invites interaction.

**Why this priority**: Provides an engagement path for interested visitors and contributes to conversion funnel. Secondary to the primary business goal (booking) but supports deeper engagement.

**Independent Test**: Can be fully tested by confirming the text link is keyboard-focusable, has visible focus styles, meets color contrast requirements, and navigates to the appropriate destination.

**Acceptance Scenarios**:

1. **Given** a visitor viewing the intro section, **When** they focus the "Learn more about us →" link using keyboard navigation (Tab key), **Then** the link receives a visible focus indicator (underline/color change) and is keyboard-accessible.
2. **Given** a visitor at any breakpoint, **When** they view the text link, **Then** the link color meets WCAG AA contrast requirements against the background (≥4.5:1 for normal text).

### Edge Cases

- What happens if the eyebrow, heading, or body text changes in length (multiple lines vs. single line)? The layout should remain vertically centered with proper spacing maintained.
- How does the intro section appear if background or text colors change due to light/dark mode? The design must maintain visual hierarchy and contrast in all supported modes.

## Requirements

### Functional Requirements

- **FR-001**: The intro section container MUST be a full-width section element with centered content, using flexbox or grid layout principles to center a max-width inner container.
- **FR-002**: The section MUST display an eyebrow label ("Our approach") with uppercase styling, small font size, and letter-spacing as specified in the design.
- **FR-003**: The section MUST display a primary heading ("Functional luxury") using serif typography (Cormorant Garamond) at 36px font size with appropriate weight and letter-spacing.
- **FR-004**: The section MUST display body copy describing the brand approach with sans-serif typography (Outfit), 15px font size, light weight (300), and 1.9 line-height for readability.
- **FR-005**: The section MUST display a text-link ("Learn more about us →") with appropriate styling (teal color, underline, hover effects).
- **FR-006**: All layout spacing and padding MUST match the design screenshot at desktop (1440px viewport): outer padding 100px vertical / 64px horizontal, inner max-width 620px, centered alignment.
- **FR-007**: The section MUST be responsive across tablet (768px–1199px) and mobile (≤767px) breakpoints, with proportional scaling of padding and font sizes while maintaining visual hierarchy.
- **FR-008**: All CSS classes and properties MUST use camelCase naming convention (e.g., `.introText` not `.intro-text`, `marginBottom` not `margin-bottom`).
- **FR-009**: The section MUST be accessible: semantic HTML structure, readable text contrast, and keyboard-navigable interactive elements.

### Content Requirements

- **Eyebrow**: "Our approach"
- **Heading**: "Functional luxury"
- **Body Copy**: "We believe an organized home is a form of self-care. Our approach merges refined aesthetics with practical systems — spaces that look beautiful and work effortlessly for the way you actually live."
- **Link**: "Learn more about us →" (linked to `/about` or TBD destination)

## Success Criteria

- **Visual Accuracy**: At the desktop reference breakpoint (1440px), the intro section matches the provided design screenshot pixel-for-pixel in layout, spacing, typography (font family, size, weight, letter-spacing), and alignment. Measurement tolerances: ±2px for spacing, ±1px for font sizes.
- **Responsive Design**: The intro section gracefully adapts to tablet and mobile breakpoints without content overflow, maintains readability, preserves visual hierarchy, and passes responsive design QA at 768px, 480px, and 360px viewport widths.
- **Accessibility**: Hero passes automated accessibility checks (WCAG AA minimum) for color contrast (≥4.5:1 for text links), semantic structure (proper heading hierarchy), and keyboard navigation (all interactive elements focusable with visible focus indicators).
- **Code Quality**: All CSS follows the project's camelCase naming convention, component structure adheres to the Constitution's component-first architecture, and TypeScript types are defined for all props.
- **Performance**: Intro section renders without layout shift and contributes negligibly to Cumulative Layout Shift (CLS).

## Key Entities

- **Intro Container**: section element with flexbox layout, responsive padding
- **Inner Wrapper**: max-width container (620px), centered text alignment
- **Eyebrow Label**: decorative text indicating section theme
- **Heading**: Primary visual hierarchy, serif font, "Functional luxury"
- **Body Copy**: Supporting narrative text establishing brand philosophy
- **Text Link**: Interactive call-to-action with hover/focus states

## Assumptions

1. Typography tokens and color variables are already defined in the project's design system (e.g., `--serif` for Cormorant Garamond, `--sans` for Outfit, `--muted` for text color).
2. The destination URL for the "Learn more about us →" link is `/about` (can be confirmed or adjusted during implementation).
3. The component will be built as a React component following the Constitution's component-first architecture: a folder structure pairing `.tsx` with `.types.ts`.
4. Responsive breakpoints align with the project's existing breakpoint system (desktop ≥1200px, tablet 768–1199px, mobile ≤767px).
5. All styling will be CSS-in-JS or CSS Modules with camelCase property names as per project requirements.
6. The section background is the default warm-white (`--warm-white`) unless otherwise specified.

## Design Reference

The intro section design can be found in: `.specify/site-design/curated-home-mockup.html` under the `<!-- INTRO -->` comment (lines ~1049–1062).

CSS reference styles (to be translated to camelCase):
- Container: `padding: 100px 64px; display: flex; justify-content: center;`
- Inner: `max-width: 620px; text-align: center;`
- Eyebrow: `margin-bottom: 16px`
- Heading: `margin-bottom: 24px`
- Body text: `font-size: 15px; font-weight: 300; color: var(--muted); line-height: 1.9; margin-bottom: 32px`
- Text link: `font-size: 12px; font-weight: 500; letter-spacing: 0.05em; color: var(--brand-teal); border-bottom: 1px solid`
