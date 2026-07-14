# Implementation Plan: COT-004: Services section

**Branch**: `COT-004-services-section` | **Date**: 2026-07-13 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/COT-004-services-section/spec.md`

## Summary

Add a presentational `Services` section to the Home page that matches the visual design in `.specify/site-design/curated-home-mockup.html` and the provided screenshot. The implementation is a small, route-local UI component composed of three `ServiceCard` items, static content for now, and responsive styles that reproduce the mockup's spacing, typography, colors, and hover interactions.

## Technical Context

**Language/Version**: TypeScript, React

**Primary Dependencies**: React, project CSS strategy (existing global CSS + small route-local styles)

**Storage**: Static content in component for initial implementation. No CMS changes required.

**Testing**: Visual/manual verification; unit tests for component rendering (Vitest) optional.

**Target Platform**: Web

**Project Type**: Single React Router app (app/)

**Performance Goals**: Minimal; static images should specify dimensions to avoid layout shift.

**Constraints**: Must follow project constitution: route-local components paired with `.types.ts` files, mobile-first styles, and accessibility guidelines.

## Constitution Check

All relevant constitution items are satisfied:

- Architecture: component will be route-local under `app/routes/pages/home/components/Services/` and paired with `Services.types.ts`.
- Content ownership: content remains static editorial copy; no new Sanity schema required.
- TypeScript strict: implementation will avoid `any` and include types for `ServiceCard` props.
- Mobile-first: base styles will target mobile and expand via media queries consistent with the project.
- Accessibility: images include `alt` text; headings use semantic `h2` order.

## Component Design Decisions

| Component     | Placement                                                                 | Generic base | Rationale |
| ------------- | ------------------------------------------------------------------------- | ------------ | --------- |
| `Services`    | Route-local — `app/routes/pages/home/components/Services/Services.tsx`    | N/A          | Used only on the Home route; small, presentation-only.
| `ServiceCard` | Route-local — `app/routes/pages/home/components/Services/ServiceCard.tsx` | N/A          | Simple presentational card used only by `Services` component.

## Content Layer Decisions

No editorial or schema changes required. Content remains static in the component for this task.

## Project Structure

Files to add or modify:

```
app/routes/pages/home/components/Services/
├── Services.tsx
├── Services.types.ts
├── services.module.css (or Services.css depending on project style)
└── ServiceCard.tsx
```

## Phase 0 — Research (summary)

No unresolved technical unknowns found in the feature spec. Implementation is straightforward and does not require integrations.

## Phase 1 — Design & Contracts

- `data-model.md` lists the small `ServiceCard` entity (title, description, imageUrl, altText).
- No external contracts or API endpoints required.

## Quickstart / Validation (see quickstart.md)

Follow `quickstart.md` to visually validate the implemented section after development.

## Complexity Tracking

No constitution violations to justify. Implementation is low complexity and route-local.
