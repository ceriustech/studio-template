# Implementation Plan: Remove Form Validation & Fast-Track Booking

**Branch**: `COT-021-remove-form-validation` | **Date**: 2026-07-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/COT-021-remove-form-validation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Returning clients currently have no working way to skip the Booking page's intake questionnaire: the "Book again" card's "Schedule now" link points at an anchor (`#calendly`) that doesn't exist until after the questionnaire is submitted, and the questionnaire itself blocks progression on missing/malformed required fields. This feature (1) removes the blocking validation from the questionnaire so "Continue to scheduling" always succeeds, (2) makes "Schedule now" jump straight to the scheduling calendar without ever showing the questionnaire, (3) updates the First name/Last name/Email placeholders to generic text, and (4) auto-formats the Phone field to `(XXX) XXX-XXXX` as the visitor types. All changes are confined to the existing Booking route's components — no new routes, Sanity content types, or external services.

## Technical Context

**Language/Version**: TypeScript, React Router v7

**Primary Dependencies**: React Router, Tailwind CSS, shadcn/ui, `zod` (relaxed, not removed, for shape/typing), `react-calendly` (existing Calendar integration, untouched apart from null-safe prefill)

**Storage**: Sanity.io (Content Lake) for editorial content; Cloudinary for video assets. Not touched by this feature — no application database, no schema changes.

**Testing**: No automated test suite is configured in this repo (no Vitest/Jest/Playwright in `package.json`, no existing `*.test.*`/`*.spec.*` files). Verification is manual: `npm run typecheck`, `npm run dev`, and a browser walkthrough of the scenarios in `quickstart.md`, per the constitution's "visual check of affected routes before merge" review gate.

**Target Platform**: Web (containerized per Dockerfile) — no change.

**Project Type**: web — single React Router app (`app/`); this feature does not touch `studio/`.

**Performance Goals**: Unaffected. No new assets, no new routes, no additional network requests — existing Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 200ms) carry over unchanged.

**Constraints**: The Calendly `InlineWidget` prefill (name, email, custom answers) must degrade gracefully to empty/absent values when the visitor bypasses the questionnaire via "Schedule now" — it must not throw or render broken when `inquiry` is `null`. Phone formatting must not fight the mobile numeric keyboard (`type="tel"`) or block paste/backspace.

**Scale/Scope**: One route (`app/routes/pages/booking/`). Touches: `index.tsx` (bypass state), `utils.ts` (relaxed schema + phone formatter), `Questionnaire/Questionnaire.tsx` (remove validation-error UI, controlled+formatted phone, 3 placeholder updates), `Calendar/Calendar.tsx` + `Calendar.types.ts` (accept nullable inquiry), `two-paths/index.tsx` + new `TwoPaths.types.ts` (bypass callback), `PathCard/PathCard.tsx` + `PathCard.types.ts` (optional click override). No new routes, no new Sanity content types, no new shared (`app/components/`) components.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify each article from `.specify/memory/constitution.md` before proceeding:

- [x] **Architecture — flat routes, components always paired with types** — The route
      stays flat (only existing `index.tsx` and `utils.ts` are modified, no new route
      files). Every route-local component touched already pairs `.tsx` + `.types.ts`
      (`Questionnaire`, `Calendar`, `PathCard`); the one component gaining a prop for
      the first time (`two-paths/index.tsx`, currently prop-less) gets a new paired
      `TwoPaths.types.ts` rather than an untyped inline prop. No Generic/Domain-adapter
      split is introduced — none of these components are shared across routes or present
      more than one behavior.
- [x] **Content ownership** — No content changes. Placeholders, validation rules, and
      phone formatting are all functional/code concerns (form behavior), not editorial
      content — consistent with how this form already draws its option labels from
      `utils.ts`, not Sanity. No content type is added, duplicated, or touched.
- [x] **Sanity content layer** — Not touched. No new or changed GROQ queries; `studio/`
      is untouched; no `sanity typegen generate` re-run is required.
- [x] **Media (Cloudinary)** — Not touched. No video fields, no delivery URLs.
- [x] **TypeScript strict** — No new `any`/`@ts-ignore`. `CalendarProps.inquiry` becomes
      `Inquiry | null` (an explicit, narrower type) rather than a loosened `any`; the new
      `formatPhoneNumber(value: string): string` utility is fully typed; route/content
      types are unaffected.
- [x] **Mobile-first** — No new breakpoints needed; existing responsive CSS for the
      questionnaire, path cards, and calendar section is unmodified. Regression check
      (FR-012 / SC-005) explicitly covers mobile usability of the changed controls.
- [x] **Accessibility (WCAG 2.1 AA)** — `<label htmlFor>` associations on First name,
      Last name, Email, and Phone are unchanged. Removing the now-unreachable
      `aria-live` error announcements is correct (they can never fire once validation no
      longer blocks submission) rather than a regression. The "Schedule now" bypass
      remains a real, keyboard-operable link/button, not a non-semantic `div` handler.
- [x] **Performance & SEO** — No new route, so no new `meta` export is needed. No new
      images/video. No above-the-fold data-fetching change.

Any unchecked item is a **blocking violation**. Document justified exceptions in the
Complexity Tracking table.

_No violations — Complexity Tracking table is not needed._

## Component Design Decisions

| Component                       | Placement    | Generic base (if adapter) | Rationale                                                                                                                                             |
| -------------------------------- | ------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Questionnaire` (existing)        | Route-local  | N/A                         | Already paired with `Questionnaire.types.ts`; modified in place to drop the fieldErrors validation path and add controlled phone formatting.           |
| `Calendar` (existing)              | Route-local  | N/A                         | Already paired with `Calendar.types.ts`; `inquiry` prop widened to `Inquiry \| null` so it can render when reached via the "Schedule now" bypass.       |
| `two-paths` (existing, `index.tsx`) | Route-local  | N/A                         | First time this component needs a prop (`onBookAgain: () => void`); gains a new paired `TwoPaths.types.ts` rather than an inline/untyped prop.          |
| `PathCard` (existing)              | Route-local  | N/A                         | Already paired with `PathCard.types.ts`; gains an optional `onClick?: () => void` so only the "Book again" card can intercept its click without a `Generic/Domain` split (both cards still take the same props shape, no per-consumer behavior split). |

No new components are introduced; no shared (`app/components/`) component is added or modified.

## Content Layer Decisions

Not applicable — this feature adds no content, no Sanity schema, and no GROQ query. Every field, placeholder, and formatting rule touched is functional/code (form behavior), already living in `app/routes/pages/booking/utils.ts` and its components, per the Content Ownership principle.

## Project Structure

### Documentation (this feature)

```text
specs/COT-021-remove-form-validation/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output — no Sanity schema changes; documents the modified Inquiry contract
├── quickstart.md         # Phase 1 output (/speckit.plan command)
└── tasks.md              # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No `contracts/` directory — this feature adds no GROQ query and no new external interface; it only modifies existing internal component props and an existing in-app validation schema.

### Source Code (repository root)

```text
app/
└── routes/
    └── pages/
        └── booking/
            ├── index.tsx                       # Add a bypass "stage" so "Book again" can show
            │                                    # Calendar directly, without an Inquiry.
            ├── utils.ts                         # Relax InquirySchema (drop required/format checks);
            │                                    # add formatPhoneNumber(value: string): string.
            └── components/
                ├── Questionnaire/
                │   ├── Questionnaire.tsx         # Remove fieldErrors validation-blocking UI/logic;
                │   │                             # controlled Phone input using formatPhoneNumber;
                │   │                             # update First name / Last name / Email placeholders.
                │   └── Questionnaire.types.ts     # Unchanged.
                ├── Calendar/
                │   ├── Calendar.tsx              # Accept inquiry: Inquiry | null; prefill fields
                │   │                             # fall back to empty/undefined when inquiry is null.
                │   └── Calendar.types.ts          # inquiry: Inquiry | null
                └── two-paths/
                    ├── index.tsx                  # Accept onBookAgain: () => void; wire only the
                    │                             # "Book again" card's PathCard to it.
                    ├── TwoPaths.types.ts           # NEW — { onBookAgain: () => void }
                    └── components/
                        └── PathCard/
                            ├── PathCard.tsx        # Support optional onClick that intercepts the
                            │                       # default anchor navigation (preventDefault).
                            └── PathCard.types.ts   # Add onClick?: () => void
```

**Structure Decision**: This feature fits the existing route shape as-is — no new route, no new shared component, no new content type. The only structural addition is `TwoPaths.types.ts`, required because `two-paths/index.tsx` is gaining its first prop and the constitution requires every component to pair `.tsx` with `.types.ts` from the moment it has props to type.

## Complexity Tracking

> Not applicable — Constitution Check has no violations to justify.
