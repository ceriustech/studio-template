# Phase 0 Research: Testimonial section

No `[NEEDS CLARIFICATION]` markers remained in the spec, and the one open implementation
fork (content source: Sanity vs. hardcoded) was resolved directly with the user before
planning began — see plan.md's Constitution Check and Content Layer Decisions. This
document records the remaining implementation-approach decisions made during planning.

## Decision: Carousel state ownership

**Decision**: Carousel state (current index, `next()`, `previous()`, loop-at-bounds logic)
lives in a co-located hook, `useTestimonialCarousel.ts`, next to `Testimonial.tsx`. The hook
takes the testimonial list length and returns the active index plus navigation handlers.

**Rationale**: This is the first component on the home page needing interactive
state/behavior — every sibling section (Intro, Services, Process, BeforeAfter) is purely
presentational. The constitution requires hooks to be co-located with the component they
serve, and reserves the Generic/Domain-adapter split (`app/components/`) for behavior with
2+ real consumers. A carousel is a generically reusable pattern in principle, but this
feature is its only consumer today, so generalizing it now would add indirection with
nothing to validate the abstraction against.

**Alternatives considered**:

- *Inline `useState` directly in `Testimonial.tsx`* — rejected because the navigation/loop
  logic (wrap-around at first/last index) is non-trivial enough to warrant isolating from
  render/markup concerns, and a dedicated hook is trivially testable in isolation later.
- *Shared `app/components/Carousel/` generic component now* — rejected per the constitution's
  explicit rule against forcing the Generic/Domain split before a second consumer exists.
  Revisit if/when a second carousel consumer (e.g., a Gallery page) is built.

## Decision: Navigation controls hidden for a single testimonial

**Decision**: When exactly one testimonial is configured, no previous/next controls render
at all (not just disabled) — the section is visually identical to the static mockup.

**Rationale**: The spec's acceptance criteria requires the section to match the design
screenshot exactly, and the screenshot shows only the single-testimonial resting state with
no visible navigation affordance. Rendering disabled/greyed-out controls would deviate from
that screenshot. Since the placeholder data starts with a small, fixed set of entries, this
path is exercised as soon as more than one placeholder testimonial exists.

**Alternatives considered**:

- *Always render controls, disable them when there's only one testimonial* — rejected: adds
  visible UI not present in the screenshot, and "disabled but visible" arrows aren't in the
  design language of any other section on this page.

## Decision: Looping navigation

**Decision**: Advancing past the last testimonial wraps to the first; going back from the
first wraps to the last.

**Rationale**: Spec FR-006 requires looping explicitly. This also avoids needing to
disable/grey out a "next"/"previous" button at the boundaries, keeping the control markup
simple (plain buttons, no disabled state to style).

**Alternatives considered**:

- *Clamp at bounds (disable next/previous at the ends)* — rejected: spec explicitly calls
  for looping, and clamping would require additional disabled-state styling not present in
  the mockup's visual language.

## Decision: Accessibility pattern for slide changes

**Decision**: The active testimonial's text block is wrapped in an `aria-live="polite"`
region; navigation buttons get explicit `aria-label`s ("Previous testimonial" / "Next
testimonial"); the star rating renders a text-equivalent `aria-label` (e.g., "5 out of 5
stars") in addition to the visual stars; the decorative quote mark stays `aria-hidden="true"`.

**Rationale**: Matches the constitution's WCAG 2.1 AA requirement and the existing pattern
used for decorative marks in `Process` (`aria-hidden="true"` connectors). `aria-live="polite"`
announces the new testimonial to screen reader users without interrupting them mid-sentence,
which is the standard pattern for non-critical, user-triggered content swaps like carousels.

**Alternatives considered**:

- *No live region, rely on focus management* — rejected: navigation buttons don't move focus
  to the new content by default, so screen reader users would get no signal that content
  changed unless a live region announces it.

## Decision: Placeholder content shape mirrors future Sanity schema

**Decision**: The hardcoded placeholder array uses field names `quote`, `clientName`,
`clientLocation`, and `rating` (number 1–5) per testimonial — the same shape a future Sanity
`testimonial` document type is expected to have.

**Rationale**: Explicit user direction: content will eventually live in Sanity, but that
schema isn't being built in this pass. Shaping the placeholder to match the anticipated
schema now means the future migration replaces the data source (a loader + GROQ query) without
changing `Testimonial.tsx`'s rendering contract or `Testimonial.types.ts`.

**Alternatives considered**:

- *Ad-hoc/minimal placeholder shape (e.g., a single string per testimonial)* — rejected:
  would require a rewrite of both the component's prop contract and the render logic when
  Sanity integration lands, defeating the purpose of the placeholder.
