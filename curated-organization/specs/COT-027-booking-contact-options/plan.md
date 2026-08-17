# Implementation Plan: Booking contact options & shortened intake

**Branch**: `COT-027-booking-contact-options` | **Date**: 2026-08-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-027-booking-contact-options/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Rework the area below the Booking page's existing `TwoPaths` section from an always-visible
questionnaire into an explicit, four-state view (`none | call | questionnaire | calendar`) driven
entirely by which option the visitor picks. "Get started" changes from a single "Start
questionnaire" button into two options — "Call us" (a new, static `CallInfo` view showing the
business phone number as a `tel:` link plus supporting copy, with a link to switch to email) and
"Email us" (the existing `Questionnaire`, trimmed to just name/email/phone and one open-ended
note, now with required-field validation reinstated for that reduced set). "Book again" is
unchanged in behavior — straight to `Calendar` with no intake. All of this stays client-side,
matching the app's actual current implementation (no server `action`, no outbound email — despite
COT-018's original plan proposing one, that was never built and is out of scope here).

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, Sanity client (`@sanity/client`, `groq`), `sanity-plugin-cloudinary`, `react-calendly`, `zod` — all already installed; no new dependencies introduced by this feature.

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. Not used by this feature — the business phone number/hours copy and all questionnaire copy are hardcoded functional constants, per Content Layer Decisions below. The only "storage" this feature touches is the transient, in-memory `Inquiry` and `BookingView` state already local to the `Booking` route component (not persisted anywhere).

**Testing**: No automated test suite exists in this repo for any prior Booking-page feature; visual verification against the three provided screenshots remains the acceptance mechanism for layout (SC-... visual-match note in quickstart.md). `quickstart.md` documents manual functional verification steps (default empty state, email path with validation, call path, book-again bypass, keyboard/focus) as the acceptance mechanism for the spec's Success Criteria.

**Target Platform**: Web (containerized per Dockerfile)

**Project Type**: web — single React Router app (`app/`) + separate Sanity Studio (`studio/`, untouched by this feature)

**Performance Goals**: No new goals beyond the constitution's existing SSR/Core Web Vitals baseline. This feature does not add any new above-the-fold content, images, or video; it changes what renders in an already below-the-fold area in response to user interaction, so it carries no new LCP/CLS risk.

**Constraints**: Must visually match the three design screenshots provided with the ticket (per research.md, `.specify/site-design/curated-book-mockup.html` is stale for this feature — its `<!-- TWO PATHS -->` markup still shows the old single button and has no call-info/shortened-questionnaire markup). Must reuse existing global design tokens and the established per-section `.sectionEyebrow`/`.sectionHeading` scoping convention, matching `Questionnaire`/`Calendar`/`TwoPaths`. Must reuse the existing `768px`/`960px` responsive breakpoints already used by `two-paths.css`/`questionnaire.css` — no new breakpoint values.

**Scale/Scope**: One new route-local component (`CallInfo`, with its own `.types.ts` and CSS); edits to four existing route-local files/components (`booking/index.tsx`, `booking/utils.ts`, `TwoPaths`/`PathCard`, `Questionnaire`, `Calendar`) and their CSS. No schema, query, loader, route registration, or shared/cross-route component changes. No new npm dependencies or env vars.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — `booking/index.tsx`
      and `booking/utils.ts` are edited in place (route already has both; no new route-level
      files needed). The one new component, `CallInfo`, is a folder pairing `CallInfo.tsx` +
      `CallInfo.types.ts` from the start, following the `PathCard`/`Questionnaire`/`Calendar`
      precedent — not `index.tsx`, since it takes a prop (`onPreferEmail`). `PathCard`,
      `TwoPaths`, `Questionnaire`, and `Calendar` keep their existing folder/types pairing;
      only their prop shapes and internals change. No Generic/Domain-adapter split anywhere —
      every component here has exactly one consumer.
- [x] **Content ownership** — The business phone number/hours copy and all questionnaire
      copy are classified functional (hardcoded in code), matching the existing Hero/TwoPaths/
      Questionnaire precedent — no new Sanity content type is introduced (see Content Layer
      Decisions). No content concept is duplicated to serve a second view.
- [x] **Sanity content layer** — N/A. No query, schema, or typegen changes.
- [x] **Media (Cloudinary)** — N/A. No new images or video.
- [x] **TypeScript strict** — `PathCardProps` becomes a discriminated union (`kind: 'cta' |
      'options'`) instead of a looser optional-fields shape, so invalid prop combinations are
      caught at compile time. The revised `Inquiry` type continues to derive from a `zod`
      schema (`z.infer`), never hand-typed or cast. No `any`/`@ts-ignore`.
- [x] **Mobile-first** — `CallInfo` and the new "Get started" options row reuse the existing
      `768px` (tablet stack) and `960px` (iOS zoom-on-focus font bump) breakpoints already
      established in `two-paths.css`/`questionnaire.css`. No new breakpoint values introduced.
- [x] **Accessibility (WCAG 2.1 AA)** — The `tel:` link uses real visible text as its accessible
      name (no icon-only control). Every questionnaire input keeps its paired `<label
      htmlFor>`; new required-field errors render in an `aria-live="polite"` region and are
      associated via `aria-describedby`/`aria-invalid`, per FR-006/FR-012. All new/changed
      interactive controls (`Call us`, `Email us`, the "prefer to write" link, `Schedule now`)
      get a visible `:focus-visible` state, per FR-012/FR-013.
- [x] **Performance & SEO** — No new route, so no new `meta` export required. No client-side-
      only fetching gates above-the-fold content — this feature only changes state-driven
      rendering below the fold. No new images/video to dimension.

All items pass. No Complexity Tracking entries required.

## Component Design Decisions

| Component  | Placement   | Generic base (if adapter) | Rationale                                                                                                                                                                                                                                       |
| ---------- | ----------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PathCard   | Route-local (existing, modified) | N/A | Single consumer (`TwoPaths`). Extended to a `kind: 'cta' \| 'options'` discriminated union (see data-model.md) so "Book again" keeps its single-button CTA and "Get started" renders the new Call/Email option pair, without duplicating the shared icon/title/description chrome. |
| CallInfo   | Route-local (new)   | N/A                        | Single consumer (`Booking` route container). Takes one prop (`onPreferEmail`), so it's always paired with `CallInfo.types.ts` from the start, matching the `Questionnaire`/`Calendar` precedent.                                              |
| Questionnaire | Route-local (existing, modified) | N/A | Field set reduced to About You (firstName, lastName, email, phone) + one open note; adds inline required-field validation/error state (`aria-live`), still single consumer, `Questionnaire.types.ts` unchanged in shape (`onSubmit`). |
| Calendar   | Route-local (existing, modified) | N/A | `customAnswers` prefill mapping updated to the reduced `Inquiry` shape (phone + notes only); `CalendarProps` unchanged.                                                                                                                       |
| TwoPaths   | Route-local (existing, modified) | N/A | Props change from a single `onBookAgain` to `onSelectCall`/`onSelectEmail`/`onBookAgain`, to drive the new `BookingView` state model in `booking/index.tsx`.                                                                                    |

## Content Layer Decisions

| Content item                                                        | Classification | Content type (new or existing)               | Notes                                                                                                                                                                              |
| --------------------------------------------------------------------- | --------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Business phone number + call hours copy                              | Functional      | N/A — hardcoded constants in `CallInfo`         | No Sanity content type or pattern for business contact info exists anywhere in this codebase (Footer's "Phone" link is itself an unimplemented `href="#"` placeholder); see research.md. |
| Shortened questionnaire field labels/placeholders/copy                | Functional      | N/A — hardcoded local constants (`Questionnaire.tsx`) | Matches the existing Hero/TwoPaths/Questionnaire precedent (already hardcoded, not Sanity-driven). No editorial variation planned.                                               |
| "Get started" two-option labels/copy ("Call us", "Email us")          | Functional      | N/A — hardcoded local constants (`TwoPaths.tsx`)      | Same precedent as existing card copy.                                                                                                                                              |

## Project Structure

### Documentation (this feature)

```text
specs/COT-027-booking-contact-options/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — revised Inquiry, new BookingView/PathCardProps/CallInfoProps
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No Sanity `data-model.md` schema and no GROQ `contracts/` — this feature has no server action,
API, or Sanity query surface; its only "contracts" are the local component prop types captured in
data-model.md.

### Source Code (repository root)

```text
app/
└── routes/
    └── pages/
        └── booking/
            ├── index.tsx                        # Edited — BookingView state ('none'|'call'|'questionnaire'|'calendar') replaces inquiry/showCalendar booleans
            ├── utils.ts                          # Edited — Inquiry schema reduced (firstName, lastName, email, phone, notes); removed SERVICE/INVESTMENT/DECISION/REFERRAL values+labels; firstName/lastName/email required
            └── components/
                ├── hero/                          # Existing — unchanged
                ├── two-paths/
                │   ├── index.tsx                    # Edited — TwoPathsProps (onSelectCall/onSelectEmail/onBookAgain), renders PathCard with kind: 'options' | 'cta'
                │   ├── TwoPaths.types.ts             # Edited — new prop shape
                │   ├── two-paths.css                  # Edited — only if new spacing is needed for the taller "Get started" card
                │   └── components/
                │       └── PathCard/
                │           ├── PathCard.tsx           # Edited — branches on kind: 'cta' (existing single button) vs 'options' (new Call us/Email us row)
                │           ├── PathCard.types.ts       # Edited — discriminated union (see data-model.md)
                │           └── pathCard.css             # Edited — adds .pathOptions/.pathOption styles + focus-visible states
                ├── CallInfo/
                │   ├── CallInfo.tsx                   # New — eyebrow/heading/copy, tel: link, hours copy, "prefer to write" switch link
                │   ├── CallInfo.types.ts               # New — CallInfoProps (onPreferEmail)
                │   └── callInfo.css                     # New — camelCase classes, scoped .sectionEyebrow/.sectionHeading per convention
                ├── Questionnaire/
                │   ├── Questionnaire.tsx              # Edited — removes About-your-project fields; adds required-field validation + accessible error state
                │   ├── Questionnaire.types.ts          # Unchanged shape (still just onSubmit)
                │   └── questionnaire.css                # Edited — removes now-unused select styles only if nothing else references them; adds error-state styling
                └── Calendar/
                    ├── Calendar.tsx                   # Edited — customAnswers mapping reduced to phone + notes
                    ├── Calendar.types.ts               # Unchanged
                    └── calendar.css                     # Unchanged
```

No changes to `studio/`, `app/lib/sanity/`, `app/lib/cloudinary/`, `app/routes/constants/`, or
`app/root.tsx` (the `/booking` route and its `WhatToExpect` placement already exist and are
unaffected — `WhatToExpect` renders unconditionally after `Booking`'s children regardless of
`BookingView`, satisfying FR-011's "What to Expect still shows on first render" requirement with
no changes needed there).

**Structure Decision**: Fits the fixed shape as-is — one new route-local, props-taking
sub-component (`CallInfo`) plus in-place edits to four existing route-local components and the
route's own `utils.ts`/`index.tsx`. No shared/generic component, no Sanity schema/query, no
Cloudinary usage, no new dependencies or env vars.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — this section is not applicable.
