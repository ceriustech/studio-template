# Implementation Plan: Testimonial section

**Branch**: `COT-007-testimonial-section` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-007-testimonial-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a "Testimonial" section to the home page, placed between the existing Process section and the closing CTA block, matching the markup under `<!-- TESTIMONIAL -->` in `.specify/site-design/curated-home-mockup.html`. The section renders a star rating, decorative quote mark, quote text, and client attribution for the active testimonial, and is built as a carousel capable of holding any number of testimonials — navigation controls only appear when more than one entry exists, and navigation loops at both ends. Content is a hardcoded placeholder array (per user direction), deliberately shaped to match the fields a future `testimonial` Sanity document type will have (quote, client name, client location, rating), so migrating to Sanity later is a data-source swap, not a component rewrite. The component follows the same pattern already established by the sibling `Intro`, `Services`, `Process`, and `BeforeAfter` home-page sections: a route-local component folder with a paired `.types.ts` file and a co-located camelCase CSS file, reusing existing global CSS variables (`--taupe`, `--taupe-light`, `--charcoal-soft`, `--serif`, `--sans`) already defined in `app/app.css`. Carousel state/behavior (current index, next/previous, looping) is owned by a co-located hook, since this is the first component in the codebase needing that behavior.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the feature. Fields already fixed for this project are pre-filled below —
  only override them if this feature genuinely deviates.
-->

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`. This feature adds no new dependency — carousel behavior (current index, next/previous, loop) is implemented with plain React state in a co-located hook, and styling reuses the plain-CSS-file pattern already established by `Intro`, `Services`, `Process`, and `BeforeAfter`, for consistency with those existing, already-merged sections.

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. This feature adds no storage for now — per explicit user direction, testimonial content (quote, client name, client location, rating) is a hardcoded placeholder array in the component, deliberately shaped to match the fields the eventual `testimonial` Sanity document type will have, so the future migration to Sanity is a data-source swap rather than a component rewrite. No schema or query is added in this pass.

**Testing**: No automated test runner (Vitest/Playwright) is configured in this repo. Validation is manual visual QA against the provided design screenshot at desktop and mobile breakpoints, plus manual interaction testing of carousel navigation (forward, backward, looping, keyboard, touch) with a temporarily expanded placeholder array — consistent with how prior sections (Intro, Services, Process, Before/After) were validated.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new goals beyond the constitution's existing Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms) — this section is static text/markup with no images or video, and carousel transitions are CSS/state-only, so it carries negligible performance risk.

**Constraints**: Must visually match the provided design screenshot exactly when a single testimonial is configured (per spec Acceptance Criteria); must support an arbitrary number of testimonials via carousel navigation without layout rework; must remain legible and operable at mobile widths.

**Scale/Scope**: One new route-local component (`Testimonial`) with a co-located carousel hook, added to the existing home page (`app/routes/pages/home/index.tsx`). No new routes, no schema changes, no new Sanity queries in this pass.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — The `home`
      route stays flat (only `components/` gains a new subfolder; no route-level files
      added). The new `Testimonial` component is route-local, living in
      `app/routes/pages/home/components/Testimonial/` as `Testimonial.tsx` +
      `Testimonial.types.ts` from the start, mirroring `Process`/`Services`/`BeforeAfter`.
      No Generic/Domain-adapter split — even though a carousel is generically reusable in
      principle, there is currently exactly one consumer (this section), and the
      constitution reserves that split for behavior genuinely presented differently by 2+
      consumers; forcing it now would add indirection with no second consumer to justify
      it. Carousel state (current index, next/previous, loop) lives in a co-located hook,
      `useTestimonialCarousel.ts`, since this is behavior the static sibling sections don't
      have.
- [x] **Content ownership** — Testimonial content (quote, client name, client location,
      rating) is editorial by nature (the client will add new testimonials continuously as
      she gets new clients) and is intended to live in Sanity. Per explicit user direction,
      the Sanity `testimonial` document type is not being created in this pass — content is
      a hardcoded placeholder array for now, but its shape mirrors the fields the future
      Sanity document type will have, so the eventual migration only swaps the data source,
      not the component contract. This is documented as a known, intentional gap (see
      Content Layer Decisions below), not a silent precedent-copy.
- [x] **Sanity content layer** — N/A for this pass. This feature adds no Sanity schema or
      queries; content is a hardcoded placeholder pending a future Sanity `testimonial`
      document type (out of scope here, per user direction).
- [x] **Media (Cloudinary)** — N/A. This feature adds no video or image assets.
- [x] **TypeScript strict** — No `any` or `@ts-ignore` planned. `Testimonial.types.ts` will
      define the `TestimonialItem` shape and component props; no route types are affected
      (home route already has none).
- [x] **Mobile-first** — Base (mobile) styles for `.testimonial` and its children are
      written first; navigation controls use existing breakpoint handling patterns from
      sibling CSS files (no new breakpoint constant needed) and meet the 44×44px minimum
      touch target.
- [x] **Accessibility (WCAG 2.1 AA)** — Navigation buttons get explicit `aria-label`s
      ("Previous testimonial" / "Next testimonial"); the active testimonial's text region
      uses `aria-live="polite"` so screen reader users are notified when the slide changes;
      the star rating gets a text-equivalent `aria-label` (e.g., "5 out of 5 stars"); the
      decorative quote mark is `aria-hidden="true"`; navigation is operable via keyboard
      (native `<button>` elements, no custom key handling required). No video/images in
      this section, so no `alt`/transcript requirements apply.
- [x] **Performance & SEO** — No `loader` change needed (static/placeholder content, no
      data fetching). No new route, so no new `meta` export required. No images/video in
      this section; a reserved minimum height/consistent padding prevents CLS as testimonial
      text length varies between slides.

Any unchecked item is a **blocking violation**. Document justified exceptions in the
Complexity Tracking table.

## Component Design Decisions

<!--
  ACTION REQUIRED for any plan introducing new UI: for every new component, decide where
  it lives per the Architecture article. This turns the constitution's structure rule into
  a concrete per-component decision instead of leaving it to be improvised during
  /speckit.implement.

  Placement:
    - "Route-local"     — Used by exactly one route. Lives in that route's own
                           components/ folder as {Name}/{Name}.tsx + {Name}.types.ts
                           (always paired) — or inline in index.tsx if trivial. No
                           Generic/Domain split — this is the default for most new UI.
    - "Shared — simple"  — Used by 2+ routes but takes props with no per-consumer behavior
                            difference (e.g. Button, Nav). app/components/{Name}/{Name}.tsx
                            + {Name}.types.ts — always paired.
    - "Shared — Generic" — Used by 2+ routes AND owns state/behavior that gets presented
                            differently per consumer. app/components/{Generic}/, always
                            paired with {Generic}.types.ts.
    - "Shared — Domain adapter" — Presentation/config for an existing (or newly-created)
                            Shared — Generic component. app/components/{DomainX}{Generic}/,
                            always paired with its own .types.ts.
-->

| Component     | Placement   | Generic base (if adapter) | Rationale                                                                                                                                                                              |
| ------------- | ----------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Testimonial` | Route-local | N/A                         | Used only by the `home` route today. Carousel behavior is new to the codebase but has exactly one consumer, so it stays inside `Testimonial` (with a co-located `useTestimonialCarousel` hook) rather than being generalized into `app/components/` ahead of a second real consumer. |

## Content Layer Decisions

<!--
  ACTION REQUIRED for any plan introducing new content: classify it per the Content
  Ownership article before writing any schema or query.
-->

| Content item                                                      | Classification                          | Content type (new or existing)       | Notes                                                                                                                                                                                                            |
| --------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Testimonials (quote, client name, client location, star rating) | Editorial in principle; Functional for now | None yet — future `testimonial` type | Per explicit user direction: hardcoded placeholder array in `Testimonial.tsx` for this pass. Field names/shape mirror the anticipated Sanity `testimonial` document type (`quote`, `clientName`, `clientLocation`, `rating`) so a future migration swaps the data source without changing the component contract. Creating the Sanity schema/query is out of scope for this feature. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-007-testimonial-section/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — placeholder data shape; no Sanity schema this pass
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No `contracts/` directory — this feature adds no GROQ queries or other external interfaces (content is a hardcoded placeholder for this pass).

### Source Code (repository root)

<!--
  ACTION REQUIRED: This project has one fixed shape (React Router app + Sanity Studio),
  not a menu of options. Fill in the concrete paths this feature touches; delete any
  branch below it doesn't need.
-->

```text
app/
└── routes/
    └── pages/
        └── home/
            ├── index.tsx                     # Existing — add <Testimonial /> between <Process /> and the closing CTA
            └── components/
                └── Testimonial/                  # New — route-local, paired with types
                    ├── Testimonial.tsx
                    ├── Testimonial.types.ts
                    ├── useTestimonialCarousel.ts     # Co-located hook — current index, next/previous, loop
                    └── testimonial.css                # camelCase class names, reusing global CSS variables
```

No changes to `studio/`, `app/components/`, `app/lib/sanity/`, `app/lib/cloudinary/`, or `app/routes/constants/` — this feature adds no shared component, no Sanity schema/query, no video, and no new route.

**Structure Decision**: Fits the existing shape as-is — a single new route-local component
folder under the `home` route's `components/`, following the exact pattern already used by
`Process`, `Services`, and `BeforeAfter`, plus one co-located hook for carousel state (a
first for this route, since no prior section needed interactive behavior). No deviation to
justify.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                       | Why Needed     | Simpler Alternative Rejected Because     |
| ------------------------------- | -------------- | ---------------------------------------- |

No violations — the Constitution Check above passed with no unchecked items. This table is not needed.
