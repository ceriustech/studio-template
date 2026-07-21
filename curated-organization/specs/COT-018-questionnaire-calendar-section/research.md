# Phase 0 Research: Questionnaire and Calendar sections

## 1. Form validation approach

**Decision**: Use `zod` (new dependency) for a single schema that validates the raw `FormData`
posted from `Questionnaire`, mirroring the ticket's suggested `InquirySchema`/`parseInquiry`, but
expanded to cover every field shown in the mockup (see `data-model.md`), not just the five fields
in the ticket's illustrative sample.

**Rationale**: The codebase has no existing validation library, and `zod`'s `safeParse` gives a
structured, per-field error result that maps directly onto FR-005's requirement for field-specific
error messages, without hand-rolling parsing/validation logic. It's also exactly what the ticket's
own suggested code already uses, so there's no reason to diverge.

**Alternatives considered**: Hand-written `if`/`else` validation in the `action` — rejected, more
error-prone and harder to keep in sync with the multi-field, multi-select shape described in
`data-model.md`. HTML5 `required`/`pattern` attributes alone — rejected as the sole mechanism
because they don't run server-side (this route's `<Form method="post">` must also be safe against
JS-disabled/bypassed submissions per progressive enhancement), though they're still applied in the
markup as a first line of defense.

## 2. Email delivery

**Decision**: Use `resend` (new dependency) with a server-only `RESEND_API_KEY`, sending a single
HTML email to a server-only `BOOKING_INBOX` address on every successful submission, matching the
ticket's suggested `sendInquiry`.

**Rationale**: Matches the ticket's suggested implementation directly; Resend is a common,
low-setup transactional email API well suited to a single "notify the business" email with no
other transactional email needs elsewhere in this codebase yet.

**Alternatives considered**: SMTP via `nodemailer` — rejected, more configuration for no benefit
here since there's no existing SMTP relay documented anywhere in the repo. A form-to-Slack/webhook
notification instead of email — rejected, the spec (FR-006, User Story 3) and ticket both
explicitly call for an email to the business inbox.

## 3. Scheduling widget integration

**Decision**: Use `react-calendly` (already an installed dependency — no addition needed), via its
`InlineWidget` + `useCalendlyEventListener`, wrapped in the new `Calendar` component, matching the
ticket's suggested `BookingCalendar` implementation.

**Rationale**: The dependency is already present in `package.json`, meaning a prior ticket already
anticipated this integration; using it avoids introducing a second scheduling library. Its
`prefill.customAnswers` option is the direct mechanism for FR-010 (attaching questionnaire answers
to the booking itself, not just the email).

**Alternatives considered**: Calendly's raw embed `<script>`/`<div class="calendly-inline-widget">`
snippet without the React wrapper — rejected, since `react-calendly` already wraps that same
approach with typed props and an event-listener hook, and is already a dependency.

## 4. Form-to-calendar handoff (state management)

**Decision**: Use React Router v7's route `action` + `useActionData()` on the existing `booking`
route, with `Questionnaire` rendering a `<Form method="post">` that posts to that same route (no
`action` prop needed — it targets the current route by default). The route component branches:
render `Questionnaire` while `actionData?.prefill` is absent, render `Calendar` once it's present.

**Rationale**: This is the framework-native, progressive-enhancement-safe pattern already implied
by React Router v7 framework mode (per the constitution's SSR requirement) and matches the ticket's
suggested flow (`action` validates → returns `{ ok: true, prefill }` → component swaps sections).
It requires no new client state library and degrades gracefully (a full-document POST/response)
if JavaScript fails to load, rather than depending on client-only `useState`.

**Alternatives considered**: Client-only `useState` + a `fetch()` call to a resource route —
rejected; it would duplicate the validation/submission plumbing React Router's `action` already
provides for free and loses SSR-safe progressive enhancement for no benefit. A dedicated second
route (e.g. `/booking/schedule`) for the calendar step — rejected; the spec (FR-007) explicitly
requires the swap to happen without navigating to a different URL.

## 5. Environment variables

**Decision**: Add two new server-only env vars — `RESEND_API_KEY` and `BOOKING_INBOX` — to the
local `.env` (already gitignored, currently empty) and document them in a new `.env.example`
(does not currently exist in this repo). The Calendly scheduling URL stays a hardcoded constant in
`Calendar.tsx`, matching the ticket's suggested code, since it isn't a secret and no config-driven
URL pattern exists elsewhere in the codebase yet to justify introducing one just for this value.

**Rationale**: This is the first feature in the repo to introduce server-only secrets outside of
Sanity/Cloudinary (which aren't used by this feature). `.env.example` gives future contributors a
documented list of required vars, consistent with the repo having no other documentation of what
`.env` needs to contain.

**Alternatives considered**: Hardcoding the Resend API key — rejected outright (credential
leak/security risk). Storing the business inbox address as a hardcoded constant instead of an env
var — rejected as inconsistent with treating it as deployment-environment configuration (staging
vs. production inbox), even though it isn't a secret.

## 6. Calendly load-failure fallback

**Decision**: Wrap the `Calendar` section in a React Router `ErrorBoundary` (or a local
component-level error boundary) that renders the mockup's static placeholder visual (icon, "Calendly
scheduling widget" title, description, dashed box) if the live `InlineWidget` throws or fails to
mount, satisfying FR-012 without keeping the placeholder as the default rendered state.

**Rationale**: `react-calendly`'s `InlineWidget` has no built-in error UI of its own; if its script
fails to load (network block, ad-blocker, Calendly outage), the section would otherwise render
empty. Reusing the mockup's already-designed placeholder as the fallback avoids designing a second,
new "something went wrong" state from scratch.

**Alternatives considered**: Rendering nothing / a generic error message on failure — rejected,
since the mockup's placeholder is explicitly called out in the ticket's acceptance criteria as
available "in case it's needed," which is exactly this scenario.
