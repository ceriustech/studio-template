# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the feature. Fields already fixed for this project are pre-filled below —
  only override them if this feature genuinely deviates.
-->

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database.

**Testing**: [e.g., Vitest, Playwright or NEEDS CLARIFICATION]

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`curated-organization/`)

**Performance Goals**: [domain-specific, e.g., LCP < 2.5s, or NEEDS CLARIFICATION]

**Constraints**: [domain-specific, e.g., browser support, offline behavior, or NEEDS CLARIFICATION]

**Scale/Scope**: [domain-specific, e.g., routes and content types touched, or NEEDS CLARIFICATION]

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [ ] **Architecture — flat routes, components always paired with types** — This route
      stays flat by default (`index.tsx` + `{route}.types.ts` / `{route}.query.ts` / `utils.ts`
      only as needed). Every component this feature adds — route-local or shared — is a
      folder pairing its `.tsx` file with a `.types.ts` file from the start; a hook,
      `utils.ts`, and `config.ts` are added only when actually needed. The generic-engine/
      domain-adapter split is used only for new components in `app/components/` that
      genuinely need one behavior presented multiple ways — never inside a route, never a
      generic `feature/` directory. Hooks are co-located with the component they serve.
- [ ] **Content ownership** — Every new piece of content has been classified editorial
      (Sanity) vs. functional (code). No new content type duplicates an existing concept to
      serve a different page or layout.
- [ ] **Sanity content layer** — New queries use `defineQuery`, are placed correctly (shared
      in `app/lib/sanity/queries/` vs. colocated with the route), and `sanity schema extract` + `sanity typegen generate` will be re-run before the feature is done. No hand-written
      content types.
- [ ] **Media (Cloudinary)** — Any new video content is a required field (no static-image
      fallback) using `cloudinary.asset`, and all delivery URLs — including poster frames —
      go through `app/lib/cloudinary/video.ts`. No asset URLs constructed by hand.
- [ ] **TypeScript strict** — No new `any` or `@ts-ignore` without a documented exception;
      route types come from `+types/`, content types from `sanity.types.ts`.
- [ ] **Mobile-first** — Base styles target mobile; any new breakpoint is added to
      `app/constants/index.ts` before use, not hardcoded inline.
- [ ] **Accessibility (WCAG 2.1 AA)** — `alt` text, contrast, keyboard nav, semantic
      landmarks, and (if this feature adds video) an accessible label or transcript-equivalent
      are planned.
- [ ] **Performance & SEO** — `loader` used for above-fold data; `meta` export planned for
      each new route; images/video specify dimensions and modern formats to protect CLS.

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

| Component       | Placement                                                                  | Generic base (if adapter) | Rationale |
| --------------- | -------------------------------------------------------------------------- | ------------------------- | --------- |
| [ComponentName] | Route-local / Shared — simple / Shared — Generic / Shared — Domain adapter | [GenericName or N/A]      | [Why]     |

## Content Layer Decisions

<!--
  ACTION REQUIRED for any plan introducing new content: classify it per the Content
  Ownership article before writing any schema or query.
-->

| Content item                 | Classification         | Content type (new or existing) | Notes                             |
| ---------------------------- | ---------------------- | ------------------------------ | --------------------------------- |
| [e.g. Service pricing tiers] | Editorial / Functional | `pricingTier` (existing)       | [Why, and which views consume it] |

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — Sanity schema changes, if any
├── quickstart.md         # Phase 1 output (/speckit.plan command)
├── contracts/            # Phase 1 output — GROQ queries this feature adds
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: This project has one fixed shape (React Router app + Sanity Studio),
  not a menu of options. Fill in the concrete paths this feature touches; delete any
  branch below it doesn't need.
-->

```text
curated-organization/            # Studio project — schema changes for this feature
└── schemaTypes/
    └── [contentType].ts

app/
├── components/                   # Only touched if this feature adds a genuinely shared,
│   │                              # cross-route component (see Component Design Decisions)
│   ├── [Name]/                     # Shared — simple. Always paired: [Name].tsx + [Name].types.ts
│   └── [Generic]/ [DomainX][index]/   # Shared — Generic + Domain adapter, same pairing
├── lib/
│   ├── sanity/                  # Only touched if this feature needs a new shared query
│   │   └── queries/[name].ts
│   └── cloudinary/               # Only touched if this feature adds new video handling
├── routes/
│   ├── constants/
│   │   └── index.ts             # Route path constants — add an entry here for any new route
│   └── pages/
│       └── [route]/
│           ├── index.tsx              # Route container — flat by default
│           ├── [route].types.ts       # Only if this route needs route-specific types
│           ├── [route].query.ts       # Colocated page-specific query, if any
│           ├── utils.ts               # Only if this route needs route-specific utils
│           └── components/            # Only if this route needs more than one sub-component —
│               └── [Name]/              # Always paired: [Name].tsx + [Name].types.ts, no Generic/Domain split
```

**Structure Decision**: [Confirm the feature fits this shape as-is, or note any deviation
and justify it in Complexity Tracking.]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                       | Why Needed     | Simpler Alternative Rejected Because     |
| ------------------------------- | -------------- | ---------------------------------------- |
| [e.g., New top-level directory] | [current need] | [why the existing structure doesn't fit] |
