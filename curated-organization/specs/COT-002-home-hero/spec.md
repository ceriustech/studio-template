# COT-002: Home Page Hero

Short name: home-hero

Summary
-------
Implement the first public-facing hero section on the home page. The hero should present the brand name, a supporting tagline, and a prominent call-to-action that invites visitors to discover the service. The visual layout and typography must match the provided design screenshot exactly.

Background
----------
The site presents a curated home-organizing service. The hero is the primary visual entry-point and must convey the brand tone of calm, curated simplicity while encouraging the user to take the next step.

User Scenarios & Testing
------------------------
- Visitor arrives on the home page and immediately understands the brand and purpose from the hero.
- Visitor clicks the primary CTA in the hero and is taken to the next step in the conversion flow.

Testing notes:
- Visual QA: compare rendered hero to the design screenshot at the target desktop breakpoint (see Clarifications).
- Interaction QA: CTA is focusable, keyboard accessible, and has visible focus styles.

Target device breakpoints and responsiveness expectations
------------------------------------------------------
The hero must match the design across all common breakpoints: desktop, tablet, and mobile. For acceptance testing use these breakpoints as guidance:

- Desktop: viewport width >= 1200px (primary pixel-perfect reference)
- Tablet: viewport width 768px–1199px (layout and spacing should adapt responsively)
- Mobile: viewport width <= 767px (content should remain legible and CTA accessible)

Acceptance requires the hero visually matches the design at the desktop reference and degrades/resizes appropriately for tablet and mobile while preserving composition and accessibility.

Functional Requirements
-----------------------
1. The hero displays the brand headline centered over a full-bleed background image or media placeholder matching the design.
2. A small supporting strapline appears above the headline.
3. A subheading or descriptor line appears below the headline.
4. A single prominent primary CTA button is centered beneath the copy.
5. Text sizes, spacing, and button placement should match the design at the primary desktop breakpoint.
6. The hero must be accessible: semantic markup, readable contrast, and keyboard focus for interactive elements.

Success Criteria
----------------
- Visual match: At the defined desktop breakpoint, the hero must match the provided design screenshot pixel-for-pixel in layout, spacing, and typography to the degree practical for web rendering (fonts, sizes, letter-spacing, and placement).
- Interaction: Primary CTA is keyboard-accessible and triggers navigation to the discovery flow.
- Accessibility: Hero passes automated accessibility checks for contrast and has semantic structure.
- Performance: Hero does not block first-contentful-paint significantly (must load progressively and not delay page interaction).

Key Entities
------------
- Hero content: headline, strapline, descriptor, CTA label, CTA target URL
- Media asset: background image or decorative media used behind the hero

Assumptions
-----------
- The design screenshot and the curated mockup HTML asset will be used as references for visual and content structure.
- Primary acceptance will be evaluated at desktop widths unless clarified otherwise.

Dependencies
------------
- Design assets (screenshot, mockup HTML, background image files)
- Existing global typography and CSS tokens (colors, fonts, sizing)

Acceptance Criteria
-------------------
- The hero visually matches the design screenshot at the agreed breakpoint.
- The hero content is present and correct: strapline, headline, descriptor, CTA.
- The CTA is accessible and navigates to the discovery flow.

Edge Cases
----------
- Missing background image: If the background image fails to load, use a solid-color layered behind the copy that preserves contrast and legibility; the headline, strapline and CTA must remain visible and centered.
- Slow network / large image: Use a low-quality placeholder or progressive-loading technique so copy and CTA render immediately; ensure layout doesn't shift when the image finishes loading.
- Reduced-motion preference: Respect the user's `prefers-reduced-motion` setting by disabling non-essential parallax or animated transitions in the hero.
- Extremely narrow viewports: At very small widths (<=360px) stack content vertically with reduced typographic scale and ensure CTA remains above the fold and tappable (minimum target size 44x44 CSS pixels recommended).
- Missing fonts: If custom fonts are unavailable, fallback to system fonts while preserving visual hierarchy; verify that letter spacing and line heights remain balanced.
- High-contrast / assistive modes: Ensure the hero maintains readable contrast and that screen readers announce the headline and CTA in a sensible order.

Notes
-----
- Implementation details (framework, file paths) are intentionally omitted here; this spec focuses on user-facing behavior and measurable outcomes.
