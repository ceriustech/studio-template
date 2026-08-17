---

description: "Task list template for feature implementation"
---

# Tasks: Booking contact options & shortened intake

**Input**: Design documents from `/specs/COT-027-booking-contact-options/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested in the feature specification, and no automated test suite exists in this repo (no Vitest/Jest/Playwright configured) — no automated test tasks are included. Validation is manual, via `quickstart.md`.

**Organization**: This feature has four user stories (US1: email path, P1 🎯 MVP; US2: call path, P2; US3: empty default state, P3; US4: Book again bypass, P4). Because "Get started" must render both of its options at once, and the area below Two Paths is driven by one shared state value, the `PathCard`/`TwoPaths` restructuring and the new `BookingView` state model are built once, under US1 — the story whose independent test genuinely requires that plumbing to exist. US2 then only adds the `CallInfo` component and one new branch to the state model US1 already built. US3 (nothing renders until a choice is made) and US4 (Book again still bypasses intake) are **verification-only** phases: both behaviors fall out directly of US1's state-model rewrite, so their tasks confirm, rather than add, functionality — the same pattern COT-018 used when tagging a shared `Calendar.tsx` base render under its own US1.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) per `plan.md` — all paths below are relative to `app/routes/pages/booking/`.

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure.

No setup tasks are required — this feature adds no new dependency, environment variable, or project-level configuration (per `plan.md`'s Technical Context: all dependencies are already installed). Proceed directly to Phase 2.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Reduce the `Inquiry` shape to the fields the shortened questionnaire actually collects, before any component that consumes `Inquiry` is edited.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T001 Update `InquirySchema`/`parseInquiry` in `app/routes/pages/booking/utils.ts` per `data-model.md`: remove `SERVICE_VALUES`, `INVESTMENT_VALUES`, `DECISION_VALUES`, `REFERRAL_VALUES` and their corresponding schema fields (`location`, `service`, `deadline`, `investmentTarget`, `decisionMakersReady`, `referral`), and remove the `SERVICE_LABELS`, `INVESTMENT_LABELS`, `DECISION_LABELS`, `REFERRAL_LABELS` exports (nothing after this task references them); change `firstName`/`lastName` to `z.string().trim().min(1, 'Please enter your first name'/'Please enter your last name')` (required); change `email` to `z.string().trim().min(1, 'Please enter your email').email('Please enter a valid email')` (required, valid shape); leave `phone` (`z.string().trim().max(30).optional().default('')`) and `notes` (`z.string().trim().transform((s) => s.slice(0, 2000)).optional().default('')`) optional, unchanged; update `parseInquiry(form: FormData)` to read only `firstName`, `lastName`, `email`, `phone`, `notes` via `form.get()`; keep `formatPhoneNumber` exactly as-is

**Checkpoint**: `Inquiry` is now `{ firstName, lastName, email, phone, notes }` with `firstName`/`lastName`/`email` required — `Questionnaire` and `Calendar` edits can now proceed.

---

## Phase 3: User Story 1 - New client emails their contact details and reaches scheduling (Priority: P1) 🎯 MVP

**Goal**: "Get started" renders as two options (Call us / Email us) instead of one button; choosing "Email us" shows a questionnaire trimmed to name/email/phone plus one open note, with required-field validation; a valid submission swaps in the Calendly view, prefilled with name/email. This phase also introduces the `BookingView` state model that makes "nothing shown until a choice is made" (US3) and "Book again" (US4) work correctly as a byproduct — see Organization note above.

**Independent Test**: From the Booking page, select "Get started" → "Email us", fill in first name/last name/email (leaving phone and the note blank), and submit. Verify the shortened form (no project-detail questions) is replaced, on the same page, by the Calendly view, pre-filled with the submitted name/email — per `quickstart.md` Scenario 2.

### Implementation for User Story 1

- [X] T002 [P] [US1] Update `app/routes/pages/booking/components/two-paths/components/PathCard/PathCard.types.ts` per `data-model.md`: replace the current flat props with a discriminated union — shared `{ icon: string; title: string; description: string }` intersected with either `{ kind: 'cta'; ctaLabel: string; ctaHref: string; variant: 'primary' | 'secondary'; onClick?: () => void }` (today's single-button shape) or `{ kind: 'options'; options: PathOption[] }`, where `PathOption` is a new exported interface `{ icon: string; label: string; onClick: () => void }`
- [X] T003 [US1] Update `app/routes/pages/booking/components/two-paths/components/PathCard/PathCard.tsx` (depends on T002): keep the existing icon/title/description markup common to both card kinds; branch the CTA area on `props.kind` — `'cta'` renders the existing `<a href={ctaHref} className={...pathBtnPrimary/pathBtnSecondary} onClick={...preventDefault + onClick}>{ctaLabel}</a>` unchanged; `'options'` renders `<div className="pathOptions">` mapping `options` to `<a key={option.label} href="#" className="pathOption" onClick={(event) => { event.preventDefault(); option.onClick(); }}><span className="pathOptionIcon">{option.icon}</span><span className="pathOptionLabel">{option.label}</span></a>` (an `<a>`, matching the existing keyboard/click pattern already used for the single-CTA case, so both branches stay real, focusable, keyboard-operable controls with their accessible name coming from the visible label text)
- [X] T004 [US1] Update `app/routes/pages/booking/components/two-paths/components/PathCard/pathCard.css` (depends on T003): add `.pathOptions` (flex row, `gap`, `margin-top` matching the existing `.pathDesc` bottom margin so it sits where `.pathBtn` used to), `.pathOption` (flex column, centered, bordered box, padding, `text-decoration: none`, `color: var(--charcoal)`, `transition`), `.pathOptionIcon` (font-size sized to read clearly at a glance, `color: var(--taupe-dark)`, `margin-bottom`), `.pathOptionLabel` (small uppercase label matching `.pathBtn`'s type scale), `.pathOption:hover`/`.pathOption:focus-visible` (border/background shift, matching the existing `.pathBtnSecondary:hover` treatment for visual consistency), and an explicit `outline`-based `:focus-visible` state on both `.pathOption` and the existing `.pathBtn` if one is not already implied by the browser default (per FR-012)
- [X] T005 [P] [US1] Update `app/routes/pages/booking/components/two-paths/TwoPaths.types.ts`: replace `TwoPathsProps { onBookAgain: () => void }` with `TwoPathsProps { onSelectCall: () => void; onSelectEmail: () => void; onBookAgain: () => void }`
- [X] T006 [US1] Update `app/routes/pages/booking/components/two-paths/index.tsx` (depends on T003, T005): replace the current `cards.map(...)` render (which assumed one shared CTA shape) with two explicit `<PathCard>` elements, since the two cards now have different discriminated shapes — "Get started": `icon="+"`, `title="Get started"`, `description="New to Curated? Reach out however works best for you."`, `kind="options"`, `options={[{ icon: '☎', label: 'Call us', onClick: onSelectCall }, { icon: '✉', label: 'Email us', onClick: onSelectEmail }]}` (icon glyphs are a starting point — swap for closer matches, or inline SVG, if they don't visually read as a phone/envelope against the screenshot during Polish); "Book again": unchanged copy/props from today, `kind="cta"`, `ctaLabel="Schedule now"`, `ctaHref="#calendly"`, `variant="secondary"`, `onClick={onBookAgain}`; destructure `{ onSelectCall, onSelectEmail, onBookAgain }: TwoPathsProps` as the component's props
- [X] T007 [P] [US1] Update `app/routes/pages/booking/components/Questionnaire/Questionnaire.tsx` (depends on T001): remove the entire "About your project" block (the `formDivider` + `formSectionLabel` "About your project" + the `location` input + `service`/`investmentTarget`/`decisionMakersReady`/`referral` `<select>` fields) and their now-unused `SERVICE_LABELS`/`INVESTMENT_LABELS`/`DECISION_LABELS`/`REFERRAL_LABELS` imports from `../../utils`; change the header paragraph to "Just your contact details and anything you'd like us to know. We'll cover the rest during your consultation."; keep the "About you" section (First name/Last name row, Email/Phone row) as-is; after it, add a `formDivider` + `formSectionLabel` "Anything else" + a `formRow` with `<label htmlFor="notes">Anything you'd like us to know?</label>` and `<textarea id="notes" name="notes" className="formTextarea" placeholder="Goals, challenges, or anything that would help us prepare..." />` (the existing `notes` field, relocated and relabeled); add `const [errors, setErrors] = useState<Partial<Record<'firstName' | 'lastName' | 'email', string>>>({})`; rewrite `handleSubmit` to call `parseInquiry`, and on `!parsed.success`, build `errors` from `parsed.error.flatten().fieldErrors` (one message per invalid field) via `setErrors(...)` and `return` without calling `onSubmit`; on success, `setErrors({})` and call `onSubmit(parsed.data)`; on the `firstName`, `lastName`, and `email` inputs, add `aria-invalid={Boolean(errors.firstName)}` (etc.) and `aria-describedby={errors.firstName ? 'firstName-error' : undefined}`, and immediately after each input render `{errors.firstName && (<p id="firstName-error" role="alert" className="formError">{errors.firstName}</p>)}` (same pattern for `lastName`, `email`)
- [X] T008 [US1] Update `app/routes/pages/booking/components/Questionnaire/questionnaire.css` (depends on T007): remove the `.formSelect` rule block (dead code — no `<select>` remains anywhere in the shortened questionnaire) per the "no dead code" workflow rule; add a `.formError` rule for the new inline field-error text — small font size, a red/error color with at least 4.5:1 contrast against `var(--warm-bg)`, `margin-top` to sit just under its input
- [X] T009 [P] [US1] Update `app/routes/pages/booking/components/Calendar/Calendar.tsx` (depends on T001): remove the `SERVICE_LABELS`, `INVESTMENT_LABELS`, `DECISION_LABELS`, `REFERRAL_LABELS` import from `../../utils`; replace the `prefill.customAnswers` object with `{ a1: inquiry.phone ? \`Phone: ${inquiry.phone}\` : '', a2: inquiry.notes ?? '' }`, keeping the rest of the `prefill` construction (`name`, `email`, the `inquiry ? {...} : undefined` guard) unchanged
- [X] T010 [US1] Update `app/routes/pages/booking/index.tsx` (depends on T006, T007, T009): replace the `inquiry`/`showCalendar` boolean pair with `type BookingView = 'none' | 'call' | 'questionnaire' | 'calendar';` and `const [view, setView] = useState<BookingView>('none');` (keep `const [inquiry, setInquiry] = useState<Inquiry | null>(null);`); render `<TwoPaths onSelectCall={() => setView('call')} onSelectEmail={() => setView('questionnaire')} onBookAgain={() => setView('calendar')} />` directly after `<Hero />`; below it, render `{view === 'questionnaire' && <Questionnaire onSubmit={(data) => { setInquiry(data); setView('calendar'); }} />}` and `{view === 'calendar' && <Calendar inquiry={inquiry} onScheduled={() => {}} />}` — do **not** add a `'call'` branch yet (added in US2, T014); when `view === 'none'` or `'call'`, nothing renders in this position, which is the correct behavior for `'none'` (FR-011) and an intentionally incomplete, non-erroring state for `'call'` until US2 lands

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently — the default state below Two Paths is empty, "Email us" leads to a validated shortened form that swaps to a prefilled Calendly view on success, and "Book again" still swaps directly to an unprefilled Calendly view (byproducts of this phase's state-model rewrite, formally verified in US3/US4 below). Selecting "Call us" changes state but renders nothing yet — expected until US2.

---

## Phase 4: User Story 2 - New client calls the business directly (Priority: P2)

**Goal**: Selecting "Call us" shows the business phone number as visible text and a working `tel:` link, supporting copy, and a way to switch to the email path without returning to the Two Paths cards.

**Independent Test**: From the Booking page, select "Get started" → "Call us". Verify the phone number renders as both visible text and a functioning `tel:` link, with no form fields shown, and that "Prefer to write?" switches to the shortened questionnaire — per `quickstart.md` Scenario 3.

### Implementation for User Story 2

- [X] T011 [P] [US2] Create `app/routes/pages/booking/components/CallInfo/CallInfo.types.ts` exporting `export interface CallInfoProps { onPreferEmail: () => void; }`
- [X] T012 [P] [US2] Create `app/routes/pages/booking/components/CallInfo/callInfo.css` with camelCase classes: `.callInfo` (section padding matching `.questionnaire`/`.calendarSection`, background `var(--warm-white)`, centered text), `.callInfo .sectionEyebrow` / `.callInfo .sectionHeading` scoped per the existing per-section convention, `.callIntro` (supporting-copy paragraph style matching `.questionnaireHeader p`), `.callPhone` (large serif text sized like a heading, `color: var(--charcoal)`, `border-bottom: 1px solid var(--border)` or similar underline treatment per the screenshot, generous padding, `display: inline-block`), `.callHours` (small muted text matching `.formSubmitNote`), `.callSwitchLink` (underlined link text, `color: var(--charcoal-soft)` or `var(--brand-teal)`, focus-visible outline); reuse the existing `768px`/`960px` breakpoints for responsive padding/font-size adjustments, matching `questionnaire.css`
- [X] T013 [US2] Create `app/routes/pages/booking/components/CallInfo/CallInfo.tsx` (depends on T011, T012): a typed React FC accepting `CallInfoProps`, importing `./callInfo.css`; define `const BUSINESS_PHONE = '(703) 555-0182';` and `const BUSINESS_PHONE_TEL = 'tel:+17035550182';` as local constants (placeholder values — see `research.md`; swap for the real business number when available) alongside `const BUSINESS_HOURS = 'Mon-Fri, 9am-5pm ET · Sat by appointment';`; render `<section className="callInfo" id="call">` containing `sectionEyebrow` "Give us a call", `sectionHeading` "We'd love to hear from you", a `callIntro` paragraph "Call and we'll talk through your space, answer questions, and find a time that works — no forms required.", `<a href={BUSINESS_PHONE_TEL} className="callPhone">{BUSINESS_PHONE}</a>`, a `callHours` paragraph rendering `BUSINESS_HOURS`, and `<a href="#questionnaire" className="callSwitchLink" onClick={(event) => { event.preventDefault(); onPreferEmail(); }}>Prefer to write? Send us your details instead →</a>` (same preventDefault-and-callback pattern already used by `PathCard`, so it stays a real, keyboard-operable link)
- [X] T014 [US2] Update `app/routes/pages/booking/index.tsx` (depends on T010 from US1, T013): import `CallInfo`; add `{view === 'call' && <CallInfo onPreferEmail={() => setView('questionnaire')} />}` alongside the existing `'questionnaire'`/`'calendar'` branches

**Checkpoint**: At this point, User Stories 1 AND 2 both work independently — "Call us" shows a working `tel:` link and can hand off to the email path; the email path and the default empty state are unaffected.

---

## Phase 5: User Story 3 - Booking page shows only the card choice until an option is picked (Priority: P3)

**Goal**: Confirm that, on first render and at any time before a choice is made, only the Two Paths section and "What to Expect" are visible — no call-info view, questionnaire, or calendar.

**Independent Test**: Load the Booking page fresh. Verify the area directly below Two Paths is empty and "What to Expect" is the next visible content — per `quickstart.md` Scenario 1.

### Verification for User Story 3

- [ ] T015 [US3] Manually verify, per `quickstart.md` Scenario 1, that `app/routes/pages/booking/index.tsx` renders nothing below `<TwoPaths />` when `view === 'none'` (its initial value) and that `WhatToExpect` (rendered unconditionally in `app/root.tsx`, outside `Booking`) is the next visible section — no code change is required here beyond what T010 already implemented; this task exists to formally confirm that behavior as its own independently-testable increment, per this feature's user stories

**Checkpoint**: All three of User Stories 1, 2, and 3 are independently confirmed working.

---

## Phase 6: User Story 4 - Returning client skips intake entirely (Priority: P4)

**Goal**: Confirm "Schedule now" in "Book again" still takes the visitor straight to the scheduling calendar, with no call-info view or questionnaire shown first, and no name/email prefill.

**Independent Test**: From the Booking page, select "Schedule now" in "Book again". Verify the Calendly view appears immediately below Two Paths, with no call-info view or questionnaire shown at any point — per `quickstart.md` Scenario 4.

### Verification for User Story 4

- [ ] T016 [US4] Manually verify, per `quickstart.md` Scenario 4, that clicking "Schedule now" sets `view` to `'calendar'` directly (via the `onBookAgain` handler wired in T010) and that `Calendar` renders correctly with `inquiry={null}` (no prefill, no error) — no code change is required here beyond what T006 (PathCard `kind: 'cta'` branch, unchanged from today) and T010 already implemented; this task exists to formally confirm that regression as its own independently-testable increment

**Checkpoint**: All four user stories are now independently confirmed functional together.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification against the spec's success criteria.

- [X] T017 [P] Run `npm run typecheck` and lint to confirm no TypeScript or lint errors were introduced, and that no `any`/`@ts-ignore` was needed anywhere in `utils.ts`, `PathCard.types.ts`, `PathCard.tsx`, `TwoPaths.types.ts`, `two-paths/index.tsx`, `Questionnaire.tsx`, `Calendar.tsx`, `CallInfo.types.ts`, `CallInfo.tsx`, or `booking/index.tsx`
- [ ] T018 [P] Run `quickstart.md` Scenarios 1–6 against the Booking page at desktop (≥1280px) and mobile (~375px) widths — default empty state, email path with validation and Calendly prefill, call path with a working `tel:` link and switch-to-email, Book-again bypass, full keyboard/focus-visible operability, and a visual comparison of the "Get started" two-option card, call-info view, and shortened questionnaire against the three provided screenshots

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No tasks — skipped.
- **Foundational (Phase 2)**: No dependencies — can start immediately. T001 alone — BLOCKS `Questionnaire`/`Calendar` edits in User Story 1 (T007, T009), but not the `PathCard`/`TwoPaths` edits (T002–T006), which don't touch `Inquiry`.
- **User Story 1 (Phase 3)**: T002, T005 have no dependency and can start immediately (in parallel with T001, since different files). T003 depends on T002. T004 depends on T003. T006 depends on T003 and T005. T007 depends on T001. T008 depends on T007. T009 depends on T001. T010 depends on T006, T007, and T009.
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion (T014 extends `index.tsx` from T010). T011, T012 have no dependency and can run in parallel. T013 depends on T011 and T012. T014 depends on T010 and T013.
- **User Story 3 (Phase 5)**: Depends on Phase 3 completion (T015 verifies behavior T010 already implements). Independent of Phase 4 — could be verified in parallel with it.
- **User Story 4 (Phase 6)**: Depends on Phase 3 completion (T016 verifies behavior T006/T010 already implement). Independent of Phases 4 and 5 — could be verified in parallel with either.
- **Polish (Phase 7)**: Depends on all four user stories being complete.

### Parallel Opportunities

- T001 (Foundational) and T002, T005 (User Story 1) touch different files and can run in parallel
- T007 and T009 (User Story 1) touch different files and, once T001 is done, can run in parallel
- T011 and T012 (User Story 2) touch different files and can run in parallel
- User Story 3 (T015) and User Story 4 (T016) are independent verification tasks and can run in parallel once Phase 3 is complete
- T017, T018 (Polish) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch the independent-file User Story 1 tasks together:
Task: "Update PathCard.types.ts to a kind: 'cta' | 'options' discriminated union"
Task: "Update TwoPaths.types.ts with onSelectCall/onSelectEmail/onBookAgain"
```

```bash
# Once Foundational (T001) is done, launch these together:
Task: "Trim Questionnaire.tsx to About You + one open note, add required-field validation"
Task: "Reduce Calendar.tsx's customAnswers mapping to phone + notes"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (`Inquiry` shape reduced — CRITICAL, blocks Questionnaire/Calendar work)
2. Complete Phase 3: User Story 1 (two-option "Get started" card, shortened validated questionnaire, prefilled Calendly view, and the `BookingView` state model)
3. **STOP and VALIDATE**: Run `quickstart.md` Scenario 2 (and Scenario 1, since it's a byproduct) and confirm both pass
4. Deploy/demo if ready — a working email intake path, with the empty default state already correct, is independently valuable even before "Call us" has anywhere to lead

### Incremental Delivery

1. Complete Foundational → `Inquiry` shape ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (`CallInfo` now reachable)
4. Confirm User Story 3 → Deploy/Demo (empty default state formally verified)
5. Confirm User Story 4 → Deploy/Demo (Book-again bypass formally verified)
6. Complete Polish → Full cross-viewport, keyboard, and visual-match validation

### Parallel Team Strategy

With multiple developers:

1. Developer A: Foundational (T001), then User Story 1's `PathCard`/`TwoPaths` restructuring (T002–T006)
2. Developer B: Once T001 lands, User Story 1's `Questionnaire`/`Calendar` edits (T007–T009) — different files, no conflict with Developer A
3. Either developer completes T010 once both halves of User Story 1 are done
4. Once User Story 1 lands: Developer A takes User Story 2 (`CallInfo`) while Developer B verifies User Stories 3 and 4 in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- [US1]/[US2]/[US3]/[US4] labels map tasks to their user story for traceability
- User Stories 3 and 4 are verification-only phases — both behaviors are delivered as a direct consequence of User Story 1's `BookingView` state-model rewrite (T010) and its `PathCard`/`TwoPaths` restructuring (T003/T006); this mirrors how COT-018 tagged a shared `Calendar.tsx` base render under its own User Story 1 rather than inventing artificial, disconnected implementation tasks for later stories
- Commit after each task or logical group
- Avoid: vague tasks, same-file conflicts beyond the intentional, explicitly-ordered edits to `index.tsx` (T010 → T014) and `Questionnaire.tsx`/`Calendar.tsx` (each edited once, in User Story 1)
