# Implement Before and After Section

Short name: before-after-section

Summary
-------
Implement the "Before / After" comparison section on the home page. The section should match the provided design screenshot exactly and use the HTML markup found in `.specify/site-design/curated-home-mockup.html` under the `<!-- BEFORE / AFTER -->` comment. All translated CSS style names should be camel cased.

Background
----------
The marketing home page includes an intro area with multiple sub-sections. The design includes a visual "Before / After" comparison that highlights the value of the service. This feature ensures the section is implemented in the codebase to visually match the design mock and be content-manageable.

Actors
------
- Visitor: any site visitor who views the home page.
- Content editor: person maintaining copy and images for the section.

Scope & Constraints
-------------------
- Must match the supplied design screenshot pixel-for-pixel for layout, typography, spacing, and imagery.
- Use the HTML markup located at `.specify/site-design/curated-home-mockup.html` under the `<!-- BEFORE / AFTER -->` comment as the source structure.
- Follow the media query breakpoints defined in the mockup file for this section's responsive behavior, including the desktop-to-tablet transition at 768px, the mobile adjustment at 480px, and the small-mobile changes at 360px.
- Do not prescribe implementation technologies (no frameworks or tooling details).
- All CSS class names generated from translated styles must be camelCase.

User Scenarios & Testing
------------------------
Primary scenario — View comparison

1. Visitor navigates to the site home page.
2. The Before / After section appears in the intro area.
3. The left panel shows the "Before" image and caption; the right panel shows the "After" image and caption.
4. The section header is centered, constrained to a fixed width like the mockup, and has 2.5rem of spacing below it.
5. On narrow viewports, the before/after panels stack vertically using the same breakpoint behavior as the mockup.

Acceptance tests (manual or automated):
- Visual diff test comparing rendered section to the reference screenshot.
- DOM structure test: the HTML uses the markup from `.specify/site-design/curated-home-mockup.html` for the section.
- CSS naming test: all translated style tokens are camelCased in class names.
- Fallback test: if a before or after image is unavailable, the section displays a neutral placeholder graphic in the empty panel.

Functional Requirements
-----------------------
FR-1: Markup fidelity
- The section must use the exact HTML structure provided in the mockup file comment region so content editors can update markup-derived content predictably.

FR-2: Visual match
- Rendered section must match the design screenshot for layout, spacing, typography scale, colors, and image cropping.

FR-3: Responsive behavior
- The section must follow the mockup's media query breakpoints and switch from side-by-side panels to a stacked layout on narrow widths.

FR-4: Style token casing
- All CSS class names created from translated style keys must be camelCase (for example `beforeImage`, `afterCaption`).

FR-5: Accessibility
- Images must include meaningful `alt` attributes. Headings must be semantic and in proper order.

FR-6: Missing image fallback
- If a before or after image is unavailable, the corresponding panel must display a neutral placeholder graphic while preserving the overall layout.

FR-7: Header layout
- The section header block above the comparison pair must be centered, constrained in width according to the design, and have 2.5rem of bottom spacing.

Success Criteria
----------------
- Pixel-accurate visual match as verified by a visual diff tool or designer approval.
- 100% of DOM nodes for the section match the structure from the mockup markup.
- All style tokens converted to class names follow camelCase convention.
- Manual accessibility check passes for images and headings in the section.

Key Entities
------------
- BeforeImage: image asset for the "Before" state.
- AfterImage: image asset for the "After" state.
- Caption: short descriptive text for each image.

Assumptions
-----------
- The project build and styling pipeline supports class naming in camelCase; if not, the team will adapt the naming during implementation to preserve intent.
- The HTML markup in `.specify/site-design/curated-home-mockup.html` is the authoritative source for structure and contains the `<!-- BEFORE / AFTER -->` marker.

Notes
-----
- The spec intentionally avoids implementation details. The implementer should follow existing project conventions for CSS placement, component encapsulation, and responsive breakpoints.
- Reference mockup: `.specify/site-design/curated-home-mockup.html`
