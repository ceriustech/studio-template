# Implementation Plan: Alt text for every CMS image

**Branch**: `COT-029-image-alt-text` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/COT-029-image-alt-text/spec.md`

## Summary

Every meaningful image in the Sanity Studio gets a required alt text field. The field is defined once (`altTextField`) and attached inside each image with the image type's `fields` option, so the site can read it as `<image>.alt` everywhere.

- 5 images get a new field: hero carousel, founder photo, logo, credential badges and social share image.
- 3 objects move their existing sibling `alt` into their image: `imageMedia`, `serviceCard` and `servicesPageItem`.
- The decorative CTA background, the lightbox override and the video poster get nothing.

This ticket changes the schema only; no app code changes. See [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript, React Router v7 (app untouched); Sanity Studio v6 (`studio/`)

**Primary Dependencies**: `sanity` (schema `defineField`, image `fields` option). No new dependencies.

**Storage**: Sanity Content Lake, `production` dataset. It has only `siteSettings` published, with no alt values, so there's no migration.

**Testing**: `sanity schema validate`, `tsc --noEmit` and `sanity build` in `studio/`; `npm run typecheck` in the app; manual Studio checks ([quickstart.md](quickstart.md)). The project has no automated test suite.

**Target Platform**: Sanity Studio (editor-facing)

**Project Type**: web. React Router app (`app/`) plus a separate Sanity Studio (`studio/`). Only `studio/` changes.

**Performance Goals**: N/A. No runtime or query changes.

**Constraints**: No visible change on the live site (SC-005). Existing alt values must be preserved (FR-005).

**Scale/Scope**: 1 new file and 8 edited schema files in `studio/schemaTypes/`. 0 app files.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- [x] **Architecture.** N/A. No UI or routes.
- [x] **Content ownership.** Alt text is editorial: it describes editor-uploaded images, so it lives in Sanity. The CTA's `alt=""` is functional, since it's fixed for a decorative slot, so it lives in code. No new content type; one shared field definition.
- [x] **Sanity content layer**, with one logged exception. Schemas change only in `studio/`. No queries are added. Exception: `sanity typegen generate` can't run because TypeGen isn't set up yet (see Complexity Tracking).
- [x] **Media (Cloudinary).** N/A. `videoMedia` is unchanged. Its uploaded `poster` image predates this ticket and is out of scope, as noted in the spec.
- [x] **TypeScript strict.** The new `altText.ts` is typed through `defineField`. No `any` or `@ts-ignore`.
- [x] **Mobile-first.** N/A.
- [x] **Accessibility (WCAG 2.1 AA).** This is what the ticket exists for: it supplies descriptive alt text for every meaningful image. Decorative images use `alt=""` per the constitution, applied in code by the page tickets.
- [x] **Performance & SEO.** The `ogImage.alt` field gives page tickets a value for `og:image:alt`. No runtime impact.

**Post-design re-check**: still passes. The design adds no queries, components or routes.

## Component Design Decisions

None. The ticket has no UI.

## Content Layer Decisions

| Content item | Classification | Content type (new or existing) | Notes |
| --- | --- | --- | --- |
| Image alt text | Editorial | Shared field `altTextField` on existing image fields | Read later by every page ticket as `<image>.alt`. See [contracts/image-alt.md](contracts/image-alt.md) |
| CTA background `alt=""` | Functional | None (code) | Hardcoded in the CTA component in a later page ticket |

## Project Structure

### Documentation (this feature)

```text
specs/COT-029-image-alt-text/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── image-alt.md      # How page tickets read alt (no queries added here)
└── tasks.md              # /speckit-tasks
```

### Source Code (repository root)

```text
studio/schemaTypes/
├── fields/
│   └── altText.ts                 # NEW: shared altTextField
├── documents/
│   ├── servicesPage.ts            # about.photo + alt
│   └── siteSettings.ts            # logo + alt
└── objects/
    ├── heroSection.ts             # images[] + alt
    ├── credentialBadge.ts         # image + alt
    ├── seo.ts                     # ogImage + alt
    ├── imageMedia.ts              # sibling alt → image.alt; preview subtitle updated
    ├── serviceCard.ts             # sibling alt → image.alt
    └── servicesPageItem.ts        # sibling alt → image.alt
```

**Structure Decision**: Studio-only change. `fields/` is a new folder next to `documents/` and `objects/`. It holds reusable field definitions, which aren't schema types, so they're kept out of `schemaTypes/index.ts`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --- | --- | --- |
| `sanity schema extract` / `sanity typegen generate` not run (constitution III, spec FR-008) | TypeGen isn't set up (`sanity.types.ts` doesn't exist). COT-028 logged the same exception and deferred TypeGen to its own ticket. | Setting up TypeGen here would add unrelated scope to a schema-only ticket. The fields are picked up automatically once the TypeGen ticket runs, and no app code reads them before then. |
