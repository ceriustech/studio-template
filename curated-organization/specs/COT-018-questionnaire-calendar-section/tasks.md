---

description: "Task list template for feature implementation"
---

# Tasks: Questionnaire and Calendar sections

**Input**: Design documents from `/specs/COT-018-questionnaire-calendar-section/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/booking-action.md, quickstart.md

**Tests**: Not requested in the feature specification — no automated test tasks are included. Validation is manual, via quickstart.md.

**Organization**: This feature has three user stories (US1: questionnaire submission/validation/transition, P1; US2: Calendar pre-fill + custom answers, P2; US3: email-failure resilience, P3). The shared validation/email "engine" (`utils.ts`) and the action-result type both stories 1 depends on are built once as Foundational work. US1 builds `Questionnaire` and a base (unprefilled) `Calendar`, wires the route's `action`, and makes the swap happen. US2 extends the same `Calendar.tsx` created in US1 to add pre-fill and custom answers. US3 extends the same `action` created in US1 to make the email send failure-tolerant.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) per plan.md — all paths are relative to `app/routes/pages/booking/`, except `.env`/`.env.example` which are at the repository root.

---

## Phase 1: Setup

**Purpose**: Add the two new dependencies and document the two new required env vars this feature introduces (per research.md Decisions 1, 2, 5).

- [ ] T001 [P] Install `zod` and `resend` as dependencies (`npm install zod resend`), updating `package.json`/`package-lock.json`
- [ ] T002 [P] Create `.env.example` at the repo root documenting `RESEND_API_KEY` (Resend API key used to send inquiry notification emails) and `BOOKING_INBOX` (the business email address that receives them), and add both keys (with your own values, e.g. a Resend sandbox key for local testing) to the local `.env` (already gitignored — do not commit real secrets)

**Checkpoint**: Dependencies installed, env vars documented and available locally.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the validation/email "engine" — the zod schema, option value/label maps, the email template, and the `Inquiry`/`ActionData` types — that every later phase depends on, before any UI or route wiring exists.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Create `app/routes/pages/booking/utils.ts` per `data-model.md`: `SPACE_VALUES`, `TIMEFRAME_VALUES`, `SERVICE_VALUES`, `REFERRAL_VALUES` as `as const` string-literal arrays (values from the Enumerated option values tables); a zod `InquirySchema` object with `firstName`/`lastName` (`string().trim().min(1).max(100)`), `email` (`string().trim().email()`), `phone` (`string().trim().max(30).optional().default('')`), `location` (`string().trim().max(200).optional().default('')`), `service` (`z.enum(SERVICE_VALUES).optional()`), `spaces` (`z.array(z.enum(SPACE_VALUES)).min(1, 'Select at least one space')`), `timeframe` (`z.enum(TIMEFRAME_VALUES)`), `referral` (`z.enum(REFERRAL_VALUES).optional()`), `notes` (`string().trim().max(2000).optional().default('')`); `export type Inquiry = z.infer<typeof InquirySchema>`; `parseInquiry(form: FormData)` returning `InquirySchema.safeParse({...})` reading `firstName`/`lastName`/`email`/`phone`/`location`/`service`/`referral`/`notes` via `form.get()` and `spaces` via `form.getAll('spaces').map(String)`; `SPACE_LABELS`, `TIMEFRAME_LABELS`, `SERVICE_LABELS`, `REFERRAL_LABELS` as `Record<..., string>` maps from the data-model.md option tables; an `escape(s: string)` HTML-escaping helper; a `renderInquiry(data: Inquiry)` function returning an HTML string with a labeled row per submitted field (Name = `${firstName} ${lastName}`, Email, Phone if present, Location if present, Service if present — via `SERVICE_LABELS`, Spaces — joined `SPACE_LABELS`, Timeframe — via `TIMEFRAME_LABELS`, Referral if present — via `REFERRAL_LABELS`, Notes if present), matching the styling/structure of the ticket's suggested `renderInquiry`; and `sendInquiry(data: Inquiry)` using `new Resend(process.env.RESEND_API_KEY)` to send from `'Booking <booking@curatedorganization.com>'` to `process.env.BOOKING_INBOX!`, `replyTo: data.email`, `subject: \`New inquiry — ${data.firstName} ${data.lastName}\``, `html: renderInquiry(data)` (depends on T001)
- [ ] T004 Create `app/routes/pages/booking/booking.types.ts` exporting an `ActionData` discriminated union type: `{ ok: false; fieldErrors: Partial<Record<keyof Inquiry, string>> } | { ok: true; prefill: Inquiry }`, importing `Inquiry` from `./utils` (depends on T003)

**Checkpoint**: Validation, labeling, and email-sending logic all exist and are fully typed — user story implementation can now begin.

---

## Phase 3: User Story 1 - Visitor submits their project details before booking (Priority: P1) 🎯 MVP

**Goal**: Render the Questionnaire section matching the mockup; validate submissions server-side; on success, email the business and swap the Questionnaire section for a (not-yet-prefilled) Calendar section, on the same page, without a URL change.

**Independent Test**: Load `/booking`, submit the questionnaire with all required fields filled in, and verify the submission is accepted, an inquiry email is sent to the business, and the page advances to a rendered scheduling section — all per `quickstart.md` Scenarios 1–3.

### Implementation for User Story 1

- [ ] T005 [P] [US1] Create `app/routes/pages/booking/components/Questionnaire/Questionnaire.types.ts` exporting `QuestionnaireProps { fieldErrors?: Partial<Record<keyof Inquiry, string>>; defaultValues?: Partial<Inquiry> }`, importing `Inquiry` from `../../utils` (depends on T004)
- [ ] T006 [P] [US1] Create `app/routes/pages/booking/components/Questionnaire/questionnaire.css` with camelCase class names ported from the `.questionnaire`, `.questionnaire-header`, `.form-container`, `.form-section-label`, `.form-row`, `.form-row-double`, `.form-label`, `.form-input`/`:focus`, `.form-textarea`/`:focus`, `.form-select`/`:focus`, `.form-divider`, `.form-submit-area`, `.form-submit`/`:hover`, `.form-submit-note` rules in `.specify/site-design/curated-book-mockup.html` (lines 296–447), scoped section eyebrow/heading as `.questionnaire .sectionEyebrow` / `.questionnaire .sectionHeading` per the project's per-section convention; include the mockup's RESPONSIVE-block rules for this section (lines 664–670, 696–700, 707–712): `clamp()` horizontal padding, `clamp()` vertical padding, and the 960px-and-below `font-size: 16px` bump on `.formInput`/`.formSelect`/`.formTextarea`/`.formSubmit` (prevents iOS zoom-on-focus); collapse `.formRowDouble` from two columns to one at `max-width: 768px`, mirroring the breakpoint pattern already used in `two-paths.css`; add a new `.formError` class (not in the mockup) for inline field-error text, using an accessible, visually distinct color against `--warm-white`/`--warm-bg`
- [ ] T007 [US1] Create `app/routes/pages/booking/components/Questionnaire/Questionnaire.tsx`: a typed React FC accepting `QuestionnaireProps`, importing `./questionnaire.css`; renders `<section className="questionnaire" id="questionnaire">` with the header block (`sectionEyebrow` "New client intake", `sectionHeading` "Tell us about your space", supporting confidentiality paragraph) followed by `<Form method="post" className="formContainer">` containing: "About you" `formSectionLabel`, a `formRowDouble` of First name / Last name text inputs, a `formRowDouble` of Email / Phone inputs, a `formRow` Location text input; a `formDivider`; "About your project" `formSectionLabel`; a `formRow` service `<select name="service">` with the `SERVICE_LABELS` options (placeholder "Select a service"); a `formRow` spaces `<select name="spaces" multiple>` with the `SPACE_LABELS` options (placeholder-equivalent handled via an empty/disabled first option, since `multiple` selects don't collapse to a single placeholder line — per spec Assumptions, FR-003's multi-select capability takes precedence over exact single-line dropdown fidelity for this one control); a `formRow` timeframe `<select name="timeframe">` with `TIMEFRAME_LABELS` options; a `formRow` referral `<select name="referral">` with `REFERRAL_LABELS` options; a `formRow` notes `<textarea name="notes">`; a `formDivider`; a `formSubmitArea` with the submit `<button type="submit" className="formSubmit">Continue to scheduling →</button>` and `formSubmitNote` text; every input/select/textarea is paired with a real `<label htmlFor>`, uses `defaultValue`/`defaultChecked` from `defaultValues` so already-valid entries survive a re-render after a partial validation failure, and when `fieldErrors[name]` is set renders a `<p className="formError" id="{name}-error" role="alert">` plus `aria-invalid="true" aria-describedby="{name}-error"` on the corresponding control (depends on T005, T006)
- [ ] T008 [US1] Add an `action` export to `app/routes/pages/booking/index.tsx`, typed via `Route.ActionArgs` from `./+types/index`: read `await request.formData()`, call `parseInquiry`; on `!parsed.success`, map `parsed.error` into a `fieldErrors` object (one message per invalid field, per `contracts/booking-action.md`) and `return { ok: false, fieldErrors }`; on success, `await sendInquiry(parsed.data)` (awaited directly — failure-tolerance is added in US3) and `return { ok: true, prefill: parsed.data }` (depends on T003, T004)
- [ ] T009 [P] [US1] Create `app/routes/pages/booking/components/Calendar/Calendar.types.ts` exporting `CalendarProps { inquiry: Inquiry; onScheduled: () => void }`, importing `Inquiry` from `../../utils` (depends on T004)
- [ ] T010 [P] [US1] Create `app/routes/pages/booking/components/Calendar/calendar.css` with camelCase class names ported from the `.calendly-section`, `.calendly-embed`, `.calendly-embed::before`, `.calendly-icon`, `.calendly-embed-title`, `.calendly-embed-desc` rules in `.specify/site-design/curated-book-mockup.html` (lines 450–515), scoped section eyebrow/heading as `.calendarSection .sectionEyebrow` / `.calendarSection .sectionHeading`; include the mockup's RESPONSIVE-block `clamp()` vertical padding for `.calendly-section` (lines 702–705)
- [ ] T011 [US1] Create `app/routes/pages/booking/components/Calendar/Calendar.tsx`: a typed React FC accepting `CalendarProps`, importing `./calendar.css` and `InlineWidget` from `react-calendly`; renders `<section className="calendarSection" id="calendly">` with `sectionEyebrow` "Select a time" and `sectionHeading` "Choose your consultation slot"; wrap the widget in a small error boundary (a local class component or React Router `ErrorBoundary`) whose fallback renders the mockup's static placeholder markup (📅 icon in a circle, "Calendly scheduling widget" title, description paragraph) per FR-012; the non-error path renders a local `CALENDLY_URL = 'https://calendly.com/lifengineered-bilalmasters/consultation'` constant into `<InlineWidget url={CALENDLY_URL} styles={{ minWidth: '320px', height: '700px' }} pageSettings={{ backgroundColor: 'fdfbf7', primaryColor: '2c2c2a', textColor: '2c2c2a', hideEventTypeDetails: false, hideGdprBanner: true }} />` — no `prefill` prop yet (added in US2) (depends on T009, T010)
- [ ] T012 [US1] Update `app/routes/pages/booking/index.tsx`: import `Questionnaire` and `Calendar`; call `const actionData = useActionData<typeof action>()`; keep `<Hero />` and `<TwoPaths />` rendering unconditionally; render `actionData?.ok ? <Calendar inquiry={actionData.prefill} onScheduled={() => {}} /> : <Questionnaire fieldErrors={actionData?.ok === false ? actionData.fieldErrors : undefined} />` in the position directly after `<TwoPaths />` (depends on T007, T008, T011)

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently — submitting a valid questionnaire emails the business and swaps in a working (not-yet-personalized) Calendar section; an invalid submission shows field errors and stays on the Questionnaire.

---

## Phase 4: User Story 2 - Visitor picks a consultation time without re-entering their details (Priority: P2)

**Goal**: Make the Calendar section built in US1 pre-fill the visitor's name/email and push their questionnaire answers in as custom answers attached to the booking, and wire up the `onScheduled` callback.

**Independent Test**: Complete the questionnaire from User Story 1, then verify — per `quickstart.md` Scenario 4 — that the scheduling widget already shows the visitor's name/email, and that a completed booking's custom answers include the submitted spaces, timeframe, and notes.

### Implementation for User Story 2

- [ ] T013 [US2] Update `app/routes/pages/booking/components/Calendar/Calendar.tsx` (from T011): import `SPACE_LABELS`, `TIMEFRAME_LABELS` from `../../utils`; add a `prefill` prop to `InlineWidget`: `{ name: \`${inquiry.firstName} ${inquiry.lastName}\`, email: inquiry.email, customAnswers: { a1: inquiry.spaces.map((s) => SPACE_LABELS[s]).join(', '), a2: TIMEFRAME_LABELS[inquiry.timeframe], a3: inquiry.notes } }` (depends on T011)
- [ ] T014 [US2] Update `app/routes/pages/booking/components/Calendar/Calendar.tsx` (from T011/T013): import `useCalendlyEventListener` from `react-calendly` and call `useCalendlyEventListener({ onEventScheduled: onScheduled })` inside the component so the `onScheduled` prop fires when the visitor completes a booking on the widget (depends on T011, T013)

**Checkpoint**: At this point, User Stories 1 AND 2 both work — the Calendar section carries the visitor's name, email, and questionnaire answers directly onto the booking it creates.

---

## Phase 5: User Story 3 - Business is notified of every inquiry, even if scheduling isn't completed (Priority: P3)

**Goal**: Make the business-notification email failure-tolerant, so a Resend outage or misconfiguration never prevents a visitor from reaching the Calendar section.

**Independent Test**: Force `sendInquiry` to fail (e.g. an invalid `RESEND_API_KEY`) and confirm — per `quickstart.md` Scenario 5 — that a valid questionnaire submission still swaps to the Calendar section, with the failure logged server-side rather than surfaced to the visitor or left to crash the request.

### Implementation for User Story 3

- [ ] T015 [US3] Update the `action` in `app/routes/pages/booking/index.tsx` (from T008): wrap the `await sendInquiry(parsed.data)` call in a `try`/`catch` (or `.catch()`), logging the failure server-side (`console.error`) without rethrowing, so the function still proceeds to `return { ok: true, prefill: parsed.data }` regardless of whether the email send succeeded (depends on T008)

**Checkpoint**: All three user stories are independently functional — validation/transition (US1), Calendar personalization (US2), and email resilience (US3) all work on their own and together.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification against the spec's success criteria.

- [ ] T016 [P] Run `quickstart.md` Scenarios 1–7 against `/booking` at desktop (≥1280px), tablet (~768px), and mobile (~375px) widths — layout match, validation errors, successful submission/email/transition, pre-fill/custom-answers, email-failure resilience, Calendly-load-failure fallback, and mobile usability (SC-001 through SC-006)
- [ ] T017 [P] Run `npm run typecheck` and lint to confirm no TypeScript or lint errors were introduced, and confirm no `any`/`@ts-ignore` were needed anywhere in `utils.ts`, `booking.types.ts`, `Questionnaire.tsx`, or `Calendar.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately. T001, T002 can run in parallel.
- **Foundational (Phase 2)**: Depends on T001 (needs `zod`/`resend` installed). T003 then T004 (T004 imports `Inquiry` from T003's file) — BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion. T005, T006, T009, T010 can run in parallel (different files, only depend on Foundational). T007 depends on T005+T006. T008 depends on T003+T004. T011 depends on T009+T010. T012 depends on T007+T008+T011.
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion (extends `Calendar.tsx` created in T011) — not independently deployable in parallel with US1 since they share one file, but independently testable/verifiable as its own increment once added. T014 depends on T013 (same file, sequential edits).
- **User Story 3 (Phase 5)**: Depends on Phase 3 completion (extends the `action` created in T008). Independent of US2 — could be built in parallel with Phase 4 by a different developer, since it touches `index.tsx`'s `action` while US2 touches `Calendar.tsx`.
- **Polish (Phase 6)**: Depends on all three user stories being complete.

### Parallel Opportunities

- T001, T002 (Setup) can run in parallel
- T005, T006, T009, T010 (User Story 1) touch different files and can run in parallel once Foundational is done
- Phase 4 (US2) and Phase 5 (US3) touch different files (`Calendar.tsx` vs. `index.tsx`) and can be worked on in parallel once Phase 3 is complete
- T016, T017 in Polish can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all independent-file User Story 1 tasks together (after Foundational is done):
Task: "Create Questionnaire.types.ts with QuestionnaireProps"
Task: "Create questionnaire.css with camelCase classes ported from the mockup"
Task: "Create Calendar.types.ts with CalendarProps"
Task: "Create calendar.css with camelCase classes ported from the mockup"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`zod`/`resend` installed, env vars documented)
2. Complete Phase 2: Foundational (`utils.ts` engine + `booking.types.ts` — CRITICAL, blocks all stories)
3. Complete Phase 3: User Story 1 (Questionnaire renders, validates, emails, and swaps to a base Calendar)
4. **STOP and VALIDATE**: Run `quickstart.md` Scenarios 1–3 and confirm they pass
5. Deploy/demo if ready — a working intake-to-scheduling flow, even before Calendar personalization, is a legitimate, independently valuable MVP

### Incremental Delivery

1. Complete Setup + Foundational → engine ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Calendar now pre-filled, answers attached to the booking)
4. Add User Story 3 → Test independently → Deploy/Demo (email sending is now failure-tolerant)
5. Complete Polish → Full cross-viewport and success-criteria validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Developer A: User Story 1 (must go first — US2/US3 both extend files it creates)
3. Once US1 lands: Developer A takes User Story 2 (`Calendar.tsx`) while Developer B takes User Story 3 (`index.tsx`'s `action`) in parallel — different files, no conflict

---

## Notes

- [P] tasks = different files, no dependencies
- [US1]/[US2]/[US3] labels map tasks to their user story for traceability
- T009 (`Calendar.types.ts`) and T011 (`Calendar.tsx` base render) are tagged US1 because US1's independent test requires *something* to render in the swapped-to position, even though `Calendar.tsx` is completed by US2's edits in T013/T014 — this mirrors how COT-017 tagged its shared `PathCard.tsx` for both of its stories
- Commit after each task or logical group
- Avoid: vague tasks, same-file conflicts beyond the intentional US1→US2 (`Calendar.tsx`) and US1→US3 (`index.tsx` action) extensions called out above
