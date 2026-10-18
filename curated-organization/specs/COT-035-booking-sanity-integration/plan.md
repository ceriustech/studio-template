# Implementation Plan: Booking page from the content studio

**Branch**: `COT-035-booking-sanity-integration` | **Date**: 2026-10-17 | **Spec**: [spec.md](spec.md)

## Summary

The Booking route's loader fetches the `bookingPage` singleton, plus the business name, phone and hours from `siteSettings`, in one colocated query. It maps them into serializable content for each section, making one fallback decision per section as on Home, Services and Gallery. Today's hardcoded copy moves into `booking.fallback.server.ts`, and each component receives its copy through props.

Three pieces work differently from earlier pages:
- **Questionnaire**: its labels and messages fall back one field at a time.
- **What to expect**: the section is rendered by the root `Layout`, which reads it from the booking route's loader data.
- **Calendly link**: it becomes a new `bookingPage.calendar.calendlyUrl` Studio field. The loader picks the link in this order: a valid studio link, then `CALENDLY_URL`, then `null` (the "can't load" message).

See [research.md](research.md).

## Technical Context

**Language/Version**: TypeScript, React Router 8.0.0 (`app/`). One Studio schema change (`studio/`).

**Primary Dependencies**: `@sanity/client`, `groq`, `zod` 4, `react-calendly`, `react-icons`. No new packages.

**Storage**: Sanity `production`. No `bookingPage` is published. `siteSettings` has the phone and hours but a null `businessName` (R1).

**Testing**: There is no automated test suite. Verify with `npm run typecheck`, `npm run build`, the Studio's `npm run build`, and [quickstart.md](quickstart.md).

**Constraints**:
- `meta` and `Layout` run in the client bundle, so they can only import types from `.server` modules.
- The backup copy, the query and `process.env` stay server-only.

**Scale/Scope**:
- **New**: `booking.query.ts`, `booking.loader.server.ts`, `booking.fallback.server.ts`, `booking.types.ts`, `components/hero/Hero.types.ts`.
- **Edited**:
  - Route: `index.tsx`, `utils.ts`.
  - Components: `hero/index.tsx`, `two-paths/index.tsx` and its types, `PathCard.tsx` and its types, `CallInfo` and its types, `Questionnaire` and its types, `Calendar` and its types, and the shared `routes/components/WhatToExpect` and its types.
  - Root: `root.tsx`.
  - `routes/constants/index.ts`: remove the unused `metaData` seed (R7).
- **Studio**: `studio/schemaTypes/documents/bookingPage.ts` gets the new `calendlyUrl` field and an updated description.

## Constitution Check

- [x] **Architecture.** The route stays flat: `index.tsx`, `booking.types.ts`, `booking.query.ts`, `utils.ts`, plus the `.server` loader and fallback files used on other pages. `hero/` gets the types file it is missing. No new components.
- [x] **Content ownership.** Page copy, the Calendly link and SEO are editorial. The form's fields, what it checks, the widget styling and the prefill stay in code. Phone and hours are reused from `siteSettings`, not duplicated.
- [x] **Sanity content layer**, with the existing TypeGen exception (Complexity Tracking). The query uses `defineQuery` and is colocated with the route. The schema edit is made in `studio/`, not `app/`.
- [x] **Media.** No video or images. The share image goes through `urlFor`.
- [x] **TypeScript strict.** No `any`, `@ts-ignore` or `as`. CMS enums (`kind`, `icon`, `variant`) are narrowed with type guards.
- [x] **Mobile-first / Accessibility.** No CSS changes. Form labels and messages can never be blank (FR-004). Icons stay decorative.
- [x] **Performance & SEO.** The page renders on the server through its loader and exports `meta`, with no client-side fetching. Switching views is local state only, so nothing is refetched (FR-014).

Re-checked after design: no new violations.

## Complexity Tracking

| Violation | Why needed | Simpler alternative rejected because |
|---|---|---|
| Hand-written `Cms*` types | The TypeGen ticket isn't done (same as COT-031 to COT-033) | Running TypeGen is its own ticket |
| `isCalendlyUrl` written twice, once in `studio/` and once in `app/` | Studio and app are separate projects (as with `seoTitle.ts`) | A shared package is out of scope; each copy has a "keep in sync" comment |
