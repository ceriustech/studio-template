# Implementation Plan: Questionnaire and Calendar sections

**Branch**: `COT-018-questionnaire-calendar-section` | **Date**: 2026-07-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-018-questionnaire-calendar-section/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add two route-local sections to the Booking page, rendered directly below the existing `TwoPaths`
section: a `Questionnaire` intake form (name, contact details, project details) and a `Calendar`
scheduling section. The route's `action` validates the submission (zod), emails the business a
formatted inquiry (Resend), and returns the parsed answers as `prefill` data. While no successful
submission exists yet, the route renders `Questionnaire`; once `prefill` exists, it renders
`Calendar` in the same position instead — a same-page swap via React Router's `action`/
`useActionData`, not a client-state modal or a second route. `Calendar` wraps `react-calendly`'s
`InlineWidget` (already a dependency), pre-filling name/email and pushing the intake answers in as
`customAnswers` so they're attached to the booking itself, not just the notification email. The
mockup's static "Calendly scheduling widget" placeholder card is kept as an `ErrorBoundary`
fallback for when the live widget fails to load.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`, `react-calendly` (already installed) — plus two new dependencies this feature introduces: `zod` (form/action validation) and `resend` (transactional email).

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. No application database. Not used by this feature — all field labels/options are static, hardcoded copy per Content Layer Decisions below, matching the Hero/TwoPaths precedent. The only "storage" this feature touches is a transient in-memory `Inquiry` produced per form submission (not persisted anywhere) and an outbound email/Calendly booking.

**Testing**: No automated test suite exists in this repo for prior sibling sections; visual verification against the design screenshot remains the acceptance mechanism for layout (SC-006). This is the first feature to introduce real server-side logic (validation + email), so `quickstart.md` documents manual functional verification steps (submit flow, validation errors, email receipt, Calendly prefill) as the acceptance mechanism for SC-001–SC-005. No test framework is introduced, consistent with no test runner currently existing in `package.json`.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`)

**Performance Goals**: No new goals beyond the constitution's existing SSR/Core Web Vitals baseline (LCP < 2.5s, CLS < 0.1, INP < 200ms). The Calendly `InlineWidget` loads a third-party script and iframe below the fold (after Hero/TwoPaths/Questionnaire), so it is not an LCP risk; it reserves its `height: 700px` box so it does not shift layout in (CLS-safe) once mounted.

**Constraints**: Must visually match the design screenshot and the `<!-- QUESTIONNAIRE -->` / `<!-- CALENDLY EMBED -->` markup in `.specify/site-design/curated-book-mockup.html` (not the gallery mockup named in the raw ticket text — see spec Assumptions), except for the live scheduling widget's own internal content per FR-012. Must reuse existing global design tokens (`--warm-white`, `--warm-bg`, `--cream`, `--charcoal`, `--charcoal-soft`, `--taupe`, `--taupe-dark`, `--muted`, `--border`, `--brand-teal`, `--serif`, `--sans`) already defined in `app/app.css`. Must follow the project's established per-section `.sectionEyebrow`/`.sectionHeading` scoping convention (each section re-declares these classes scoped under its own root class, e.g. `.questionnaire .sectionEyebrow`), matching every prior section (Hero, TwoPaths, Intro, Services, Process, etc.) rather than a shared global class. A failed business-notification email must never block the visitor from reaching or using `Calendar` (FR-011).

**Scale/Scope**: Two new route-local components (`Questionnaire`, `Calendar`) plus their stylesheets; one new route-level `action` and supporting `utils.ts`/`booking.types.ts` in the existing `booking` route; two new npm dependencies (`zod`, `resend`); two new server-only env vars (`RESEND_API_KEY`, `BOOKING_INBOX`). No schema, query, loader, or shared cross-route component changes.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — `booking/index.tsx`
      stays the route container but gains an `action` export and the render-branch between
      `Questionnaire`/`Calendar`; it grows a colocated `booking.types.ts` (route needs its own
      `Inquiry`/action-result types) and `utils.ts` (`parseInquiry`, `sendInquiry`, label maps) —
      both added because the route genuinely needs them now, consistent with the "grow only as
      needed" rule for routes. `Questionnaire` and `Calendar` are new route-local sub-components
      at `booking/components/Questionnaire/` and `booking/components/Calendar/`, each a folder
      pairing `{Name}.tsx` + `{Name}.types.ts` from the start (both take props), matching the
      `PathCard` precedent — not `index.tsx`, since (unlike prop-less `Hero`/`TwoPaths`) both take
      props. No Generic/Domain-adapter split — each has exactly one consumer.
- [x] **Content ownership** — All questionnaire field labels, option lists, and section copy are
      static and hardcoded (functional, not editorial), matching the Hero/TwoPaths precedent — no
      new Sanity content type. The `Inquiry` produced by a submission is transient request data,
      not a content type; it is never persisted.
- [x] **Sanity content layer** — N/A. No query, schema, or typegen changes.
- [x] **Media (Cloudinary)** — N/A. No new images or video; the Calendly icon is a text/emoji
      glyph in the fallback visual, matching the mockup.
- [x] **TypeScript strict** — `Questionnaire` and `Calendar` are typed React FCs with their own
      `*.types.ts`; the action's parsed data is derived from a `zod` schema (`z.infer`), never
      hand-typed or cast; no `any`/`@ts-ignore`.
- [x] **Mobile-first** — Responsive rules follow the mockup's existing `clamp()`-based padding and
      the established `max-width: 768px` stacking pattern already used by `two-paths.css`
      (aligning with `BREAKPOINTS.tablet`), including the mockup's 960px form-input font-size bump
      (prevents iOS zoom-on-focus) and the two-column-to-one-column collapse of `form-row-double`.
      No new breakpoint values introduced.
- [x] **Accessibility (WCAG 2.1 AA)** — Every input pairs with a real `<label htmlFor>`; validation
      errors render in an `aria-live="polite"` region and are associated to their field via
      `aria-describedby`/`aria-invalid`; the multi-select spaces control is a native, keyboard-
      operable multi-select (not a div-based custom widget) per FR-003; color/contrast pairs are
      reused verbatim from already-validated design tokens.
- [x] **Performance & SEO** — No new route, so no new `meta` export required. The route's `action`
      runs server-side only; no client-side-only fetching gates above-the-fold content. Calendly's
      iframe is deferred, below-the-fold, and dimensioned up front to avoid CLS.

All items pass. No Complexity Tracking entries required for the constitution's UI/content
articles. New dependencies (`zod`, `resend`) are a Technology Stack addition, not a constitution
violation — the stack section only gates *UI component libraries* (MUI/Chakra/etc.); a validation
library and a transactional-email SDK are ordinary application dependencies.

## Component Design Decisions

| Component     | Placement   | Generic base (if adapter) | Rationale                                                                                                                                                                                                 |
| -------------- | ----------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Questionnaire | Route-local | N/A                        | Used by exactly one route (Booking). Takes props (`errors`/`defaultValues` derived from `useActionData()`), so it is always paired with `Questionnaire.types.ts`, matching the `PathCard` precedent. Renders the `<Form method="post">`, which posts to the `booking` route's own `action` by default. |
| Calendar      | Route-local | N/A                        | Used by exactly one route (Booking), rendered only once `prefill` exists. Takes `inquiry`/`onScheduled` props (matching the ticket's suggested `BookingCalendar`), so it is always paired with `Calendar.types.ts`. Wraps `react-calendly`'s `InlineWidget`, not a new engine — no Generic/Domain split needed since there is exactly one consumer and one presentation. |

## Content Layer Decisions

| Content item                                                                 | Classification | Content type (new or existing) | Notes                                                                                                                                                    |
| ----------------------------------------------------------------------------- | --------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Field labels, placeholders, and dropdown option text (service, spaces, timeframe, referral source) | Functional       | N/A — hardcoded local constants (`utils.ts`) | Fixed copy sourced from the mockup, matching the Hero/TwoPaths precedent (also hardcoded, not Sanity-driven). No editorial variation planned. |
| Business notification inbox address, Resend API key                          | Functional       | N/A — server-only env vars (`.env`)   | Credential/config data, not content — never exposed to the client bundle.                                                                        |
| Calendly scheduling URL                                                       | Functional       | N/A — hardcoded constant in `Calendar.tsx` | Matches the ticket's suggested implementation; not a secret, and no existing config-driven-URL pattern exists elsewhere in this codebase to justify a new one. |

## Project Structure

### Documentation (this feature)

```text
specs/COT-018-questionnaire-calendar-section/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — the Inquiry entity (fields, validation, option lists)
├── contracts/
│   └── booking-action.md # Phase 1 output — the booking route's action request/response contract
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No Sanity `data-model.md` schema or GROQ `contracts/` — this feature's "data model" and "contract"
are the transient `Inquiry` shape and the route action's request/response shape, not Sanity content.

### Source Code (repository root)

```text
app/
├── .env                              # Edited — adds RESEND_API_KEY, BOOKING_INBOX (gitignored, local only)
├── .env.example                      # New — documents the two new required env vars
└── routes/
    └── pages/
        └── booking/
            ├── index.tsx                    # Edited — adds `action`, renders Questionnaire or Calendar based on actionData.prefill
            ├── booking.types.ts              # New — Inquiry type, ActionData/action-result types
            ├── utils.ts                       # New — zod schema, parseInquiry, sendInquiry, escape/renderInquiry email template, option label maps
            └── components/
                ├── hero/                      # Existing — unchanged
                ├── two-paths/                  # Existing — unchanged
                ├── Questionnaire/
                │   ├── Questionnaire.tsx        # New — intake form, <Form method="post">
                │   ├── Questionnaire.types.ts    # New — QuestionnaireProps (errors, defaultValues)
                │   └── questionnaire.css          # New — camelCase classes, styles ported from mockup
                └── Calendar/
                    ├── Calendar.tsx              # New — wraps react-calendly InlineWidget, ErrorBoundary fallback to mockup placeholder
                    ├── Calendar.types.ts          # New — CalendarProps (inquiry, onScheduled)
                    └── calendar.css                # New — camelCase classes for the fallback placeholder visual
```

No changes to `studio/`, `app/lib/sanity/`, `app/lib/cloudinary/`, or `app/routes/constants/`
(the `/booking` route already exists and is already registered).

**Structure Decision**: Fits the fixed shape as-is — two new route-local, props-taking
sub-components plus route-level `action`/`utils`/`types` growth on an already-existing route. No
shared/generic component, no Sanity schema/query, no Cloudinary usage. The two new npm
dependencies (`zod`, `resend`) and two new env vars are the only additions outside the established
per-route folder shape, and are documented above rather than hidden inside it.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — this section is not applicable.
