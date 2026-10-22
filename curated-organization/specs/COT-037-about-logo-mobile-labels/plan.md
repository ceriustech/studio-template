# Implementation Plan: Hide About Section Logo Labels on Mobile

**Branch**: `COT-037-about-logo-mobile-labels` | **Date**: 2026-10-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-037-about-logo-mobile-labels/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Hide the `.aboutLogoLabel` text above each credential logo in the Services page "About Curated" section at viewports 480px and below, so on phones only the logo images show. The change is a single `display: none` rule added to the existing `@media (max-width: 480px)` block in `about.css`. It needs no markup, prop, query, or schema changes. Labels are still server-rendered and stay visible above 480px. Each logo's existing `alt` text continues to name the credential for assistive technology.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. Not touched by this feature: badge labels remain Sanity-editable and unchanged.

**Testing**: No automated test suite in this repo. Verification is `npm run typecheck` plus a manual visual check of `/services` at mobile, tablet, and desktop widths (see [quickstart.md](./quickstart.md)).

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new goals. A CSS-only change with no new assets. The rule ships in the server-rendered stylesheet, so it applies at first paint and adds no layout shift. Removing the wrapped labels makes the section shorter on mobile.

**Constraints**: Must not change label appearance above 480px. Must not affect any other section that uses the 480px breakpoint. Must not remove label text from the content studio.

**Scale/Scope**: One file, `app/routes/pages/services/components/about/about.css`. One selector added inside an existing media query.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Architecture — flat routes, components always paired with types**: No new components or routes. `About` (`app/routes/pages/services/components/about/`) already exists and is paired with `About.types.ts`. Only its stylesheet changes.
- [x] **Content ownership**: No new content. Badge labels stay editorial (Sanity `credentialBadge.label`). This feature only controls their presentation per viewport, which is a component concern.
- [x] **Sanity content layer**: N/A. No query or schema change, so typegen does not need to run.
- [x] **Media (Cloudinary)**: N/A. No video.
- [x] **TypeScript strict**: No TypeScript changes.
- [x] **Mobile-first**: Builds on the section's existing `@media (max-width: 480px)` block. 480px is an established breakpoint, used 19 times across `app/` CSS. It isn't in `app/constants/index.ts`; that gap already existed (see Complexity Tracking). This feature adds no new breakpoint value.
- [x] **Accessibility (WCAG 2.1 AA)**: `display: none` removes the label from the accessibility tree on mobile. Each badge `<img>` keeps a descriptive `alt`, so the credential is still announced (FR-005). The alt comes from Sanity, falling back to the label (`mapBadges` in `services.loader.server.ts`). The fallback content in `services.fallback.server.ts` also has descriptive alts.
- [x] **Performance & SEO**: No new routes, assets, or client-side fetching. Labels are still server-rendered in the HTML.

## Component Design Decisions

| Component | Placement | Generic base (if adapter) | Rationale |
| --------- | --------- | ------------------------- | --------- |
| `About` | Route-local (existing) | N/A | Used only by the Services route. Only `about.css` changes. `index.tsx` and `About.types.ts` are untouched. |

## Content Layer Decisions

| Content item | Classification | Content type (new or existing) | Notes |
| ------------ | -------------- | ------------------------------ | ----- |
| Credential badge label | Editorial | `credentialBadge` (existing) | Unchanged in Sanity. Visibility per viewport is presentation-only, handled in CSS. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-037-about-logo-mobile-labels/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
├── checklists/
│   └── requirements.md  # From /speckit.specify
└── tasks.md             # Phase 2 output (/speckit.tasks; not created by /speckit.plan)
```

`data-model.md` and `contracts/` are intentionally omitted: this feature changes no Sanity schema and adds no GROQ query.

### Source Code (repository root)

```text
app/
└── routes/
    └── pages/
        └── services/
            └── components/
                └── about/
                    └── about.css   # Add `.aboutLogoLabel { display: none; }` to the existing 480px block
```

**Structure Decision**: Fits the existing shape as-is. One route-local stylesheet is edited in place.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| Uses the `480px` media query, which isn't defined in `app/constants/index.ts` | `about.css` already defines its "Mobile" rules at `max-width: 480px`, and 19 other CSS rules in `app/` use the same value. Matching it keeps this section's mobile behavior consistent. | `QUERIES.mobileOnly` (430px) would leave labels visible at 431–480px, including the ~440px viewport in the ticket screenshot, so the acceptance criterion would fail there. Adding a 480px constant is a site-wide cleanup outside this ticket's scope, and plain CSS files can't import TS constants anyway. |
