---

description: "Task list template for feature implementation"
---

# Tasks: Remove Form Validation & Fast-Track Booking

**Input**: Design documents from `/specs/COT-021-remove-form-validation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested in the feature specification, and no automated test suite exists in this repo (no Vitest/Jest/Playwright configured) — no automated test tasks are included. Validation is manual, via `quickstart.md`.

**Organization**: This feature has four user stories (US1: "Schedule now" bypass, P1; US2: questionnaire no longer blocks on incomplete fields, P2; US3: placeholder text updates, P3; US4: phone auto-formatting, P4). Each story touches a distinct, mostly-disjoint slice of the same small route: US1 touches `Calendar.{tsx,types.ts}`, `PathCard.{tsx,types.ts}`, `two-paths/index.tsx` (+ new `TwoPaths.types.ts`), and `booking/index.tsx`; US2 touches `utils.ts`'s schema and `Questionnaire.tsx`'s submit handling; US3 and US4 both make further, later edits to `Questionnaire.tsx` (placeholders, then controlled phone input) and, for US4, `utils.ts` (new `formatPhoneNumber` helper). Because US2, US3, and US4 all edit `Questionnaire.tsx`, their tasks are ordered sequentially even though they are independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

Single React Router app (`app/`) per `plan.md` — all paths below are relative to `app/routes/pages/booking/`.

---

## Phase 1: Setup

**Purpose**: Project initialization and basic structure.

No setup tasks are required — this feature adds no new dependency, environment variable, or project-level configuration (per `plan.md`'s Technical Context). Proceed directly to Phase 2.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

No foundational tasks are required. Unlike COT-018 (which needed a shared validation/email "engine" built before any UI could exist), this feature only modifies existing, already-working components. Each user story below is additive to a different (or, for US2/US3/US4, sequentially-edited) part of the existing route — there is no new shared infrastructure all four stories depend on. Proceed directly to Phase 3.

---

## Phase 3: User Story 1 - Returning client skips the questionnaire entirely (Priority: P1) 🎯 MVP

**Goal**: Clicking "Schedule now" in the "Book again" card takes the visitor directly to the scheduling calendar, without ever showing or requiring the questionnaire — and the calendar renders and books correctly with no `Inquiry` data behind it.

**Independent Test**: From the Booking page, click "Schedule now" in the "Book again" card and verify the questionnaire never appears while the scheduling calendar appears immediately and is bookable — per `quickstart.md` Scenario 1.

### Implementation for User Story 1

- [ ] T001 [P] [US1] Update `app/routes/pages/booking/components/Calendar/Calendar.types.ts`: change `inquiry: Inquiry;` to `inquiry: Inquiry | null;` in `CalendarProps`
- [ ] T002 [US1] Update `app/routes/pages/booking/components/Calendar/Calendar.tsx` (depends on T001): compute a `prefill` value before the `return`, conditional on `inquiry`: `const prefill = inquiry ? { name: \`${inquiry.firstName} ${inquiry.lastName}\`.trim(), email: inquiry.email, customAnswers: { a1: inquiry.service ? SERVICE_LABELS[inquiry.service] : '', a2: inquiry.deadline ?? '', a3: inquiry.investmentTarget ? INVESTMENT_LABELS[inquiry.investmentTarget] : '', a4: inquiry.decisionMakersReady ? DECISION_LABELS[inquiry.decisionMakersReady] : '', a5: inquiry.referral ? REFERRAL_LABELS[inquiry.referral] : '', a6: [inquiry.phone && \`Phone: ${inquiry.phone}\`, inquiry.location && \`Location: ${inquiry.location}\`, inquiry.notes && \`Notes: ${inquiry.notes}\`].filter(Boolean).join('\\n') } } : undefined;` (this is the existing inline `prefill` object, unchanged in content, just extracted and made conditional); replace the `<InlineWidget ... prefill={{ ... }} ... />` inline object with `prefill={prefill}`
- [ ] T003 [P] [US1] Create `app/routes/pages/booking/components/two-paths/TwoPaths.types.ts` exporting `export interface TwoPathsProps { onBookAgain: () => void; }`
- [ ] T004 [P] [US1] Update `app/routes/pages/booking/components/two-paths/components/PathCard/PathCard.types.ts`: add `onClick?: () => void;` to `PathCardProps`
- [ ] T005 [US1] Update `app/routes/pages/booking/components/two-paths/components/PathCard/PathCard.tsx` (depends on T004): destructure `onClick` from props alongside the existing fields; on the `<a>` element, add `onClick={onClick ? (event) => { event.preventDefault(); onClick(); } : undefined}`, keeping `href={ctaHref}` and the existing class logic unchanged so the element remains a real, keyboard-operable link
- [ ] T006 [US1] Update `app/routes/pages/booking/components/two-paths/index.tsx` (depends on T003, T005): import `TwoPathsProps` from `./TwoPaths.types`; change `const TwoPaths = () => {` to `const TwoPaths = ({ onBookAgain }: TwoPathsProps) => {`; in the `cards.map(...)` call, add `onClick={card.title === 'Book again' ? onBookAgain : undefined}` to the spread `<PathCard key={card.title} {...card} onClick={...} />` (the `cards` array itself, and the "Get started" card's plain anchor-scroll behavior, are unchanged)
- [ ] T007 [US1] Update `app/routes/pages/booking/index.tsx` (depends on T002, T006): add `const [showCalendar, setShowCalendar] = useState(false);` alongside the existing `inquiry` state; pass `<TwoPaths onBookAgain={() => setShowCalendar(true)} />`; change the render condition from `{inquiry ? (...) : (...)}` to `{inquiry || showCalendar ? (<Calendar inquiry={inquiry} onScheduled={() => {}} />) : (<Questionnaire onSubmit={setInquiry} />)}`

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently — "Schedule now" bypasses the questionnaire and shows a working, bookable calendar with no prefill; the normal questionnaire → calendar flow (with `inquiry` set) is unaffected.

---

## Phase 4: User Story 2 - Visitor can proceed through the questionnaire without completing it (Priority: P2)

**Goal**: The questionnaire's "Continue to scheduling" action always succeeds and advances to the calendar, regardless of which fields are filled in or how they're formatted.

**Independent Test**: Load the questionnaire, leave every field blank (and separately, enter a malformed email), click "Continue to scheduling," and verify the scheduling calendar appears with no error messages shown anywhere — per `quickstart.md` Scenario 2.

### Implementation for User Story 2

- [ ] T008 [P] [US2] Update `InquirySchema` in `app/routes/pages/booking/utils.ts`: remove `.min(1, 'Please enter your first name')` from `firstName` (leaving `z.string().trim().optional().default('')`); remove `.min(1, 'Please enter your last name')` from `lastName` (leaving `z.string().trim().optional().default('')`); replace `email: z.string().trim().email('Please enter a valid email')` with `email: z.string().trim().optional().default('')` (drop the required/format check entirely); replace `notes: z.string().trim().max(2000, 'Please keep notes under 2000 characters').optional().default('')` with `notes: z.string().trim().transform((s) => s.slice(0, 2000)).optional().default('')` so an over-length note is silently truncated rather than rejected (there is no longer a field-error UI to surface a rejection to); leave `phone`, `location`, `service`, `deadline`, `investmentTarget`, `decisionMakersReady`, `referral` exactly as they are today (they were already optional and non-blocking)
- [ ] T009 [US2] Update `app/routes/pages/booking/components/Questionnaire/Questionnaire.tsx` (depends on T008): remove the `fieldErrors` state (`const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Inquiry, string>>>({});`) and its two setters in `handleSubmit`; simplify `handleSubmit` to `event.preventDefault(); const formData = new FormData(event.currentTarget); const parsed = parseInquiry(formData); if (!parsed.success) return; onSubmit(parsed.data);`; remove the `aria-invalid`/`aria-describedby` props and the trailing `{fieldErrors.X && <p className="formError" ...>...}</p>` block for each of `firstName`, `lastName`, `email`, and `notes` (four removal sites); keep `SERVICE_LABELS`, `INVESTMENT_LABELS`, `DECISION_LABELS`, `REFERRAL_LABELS` imports (still used by the `<select>` options) — only remove what relates to `fieldErrors`
- [ ] T010 [US2] Update `app/routes/pages/booking/components/Questionnaire/questionnaire.css` (depends on T009): remove the now-unused `.formError` rule (lines ~167–173) — per the constitution's "No dead code" rule, since nothing in `Questionnaire.tsx` renders a `.formError` element anymore after T009

**Checkpoint**: At this point, User Stories 1 AND 2 both work independently — the questionnaire can be submitted blank or with malformed values and still reach the calendar; "Schedule now" still bypasses it entirely.

---

## Phase 5: User Story 3 - Field placeholders read clearly and consistently (Priority: P3)

**Goal**: The First name, Last name, and Email fields show generic placeholder text instead of a stranger's example name.

**Independent Test**: Load the questionnaire with all fields empty and visually confirm the placeholder text in the First name, Last name, and Email fields — per `quickstart.md` Scenario 3.

### Implementation for User Story 3

- [ ] T011 [US3] Update `app/routes/pages/booking/components/Questionnaire/Questionnaire.tsx` (sequential after T009/T010 — same file): change the First name `<input>`'s `placeholder="Jane"` to `placeholder="First name"`; change the Last name `<input>`'s `placeholder="Smith"` to `placeholder="Last name"`; change the Email `<input>`'s `placeholder="jane@example.com"` to `placeholder="youremail@example.com"`; leave the Phone field's `placeholder="(555) 123-4567"` untouched (FR-008)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 all work independently.

---

## Phase 6: User Story 4 - Phone number formats automatically while typing (Priority: P4)

**Goal**: As a visitor types digits into the Phone field, the value automatically formats to `(XXX) XXX-XXXX`.

**Independent Test**: Load the questionnaire and type a 10-digit number one digit at a time into the Phone field, verifying it progressively formats to `(232) 234-5678` for input `2322345678`, re-formats cleanly on backspace, and drops non-digit/extra-digit input — per `quickstart.md` Scenario 4.

### Implementation for User Story 4

- [ ] T012 [P] [US4] Add `formatPhoneNumber(value: string): string` to `app/routes/pages/booking/utils.ts` (new export, same file as T008 but non-overlapping addition): strip non-digits via `const digits = value.replace(/\D/g, '').slice(0, 10);`; then `if (digits.length === 0) return ''; if (digits.length <= 3) return \`(${digits}\`; if (digits.length <= 6) return \`(${digits.slice(0, 3)}) ${digits.slice(3)}\`; return \`(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}\`;`
- [ ] T013 [US4] Update `app/routes/pages/booking/components/Questionnaire/Questionnaire.tsx` (depends on T012; sequential after T011 — same file): import `formatPhoneNumber` from `../../utils`; add `const [phone, setPhone] = useState('');`; change the Phone `<input>` from uncontrolled to controlled by adding `value={phone}` and `onChange={(event) => setPhone(formatPhoneNumber(event.target.value))}`, keeping `id="phone"`, `name="phone"`, `type="tel"`, `className="formInput"`, and the existing `placeholder="(555) 123-4567"` unchanged

**Checkpoint**: All four user stories are now independently functional together.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification against the spec's success criteria.

- [ ] T014 [P] Run `npm run typecheck` to confirm no TypeScript errors were introduced and that no new `any`/`@ts-ignore` was needed in `utils.ts`, `Questionnaire.tsx`, `Questionnaire.types.ts`, `Calendar.tsx`, `Calendar.types.ts`, `TwoPaths.types.ts`, `two-paths/index.tsx`, `PathCard.tsx`, or `PathCard.types.ts`
- [ ] T015 [P] Run `quickstart.md` Scenarios 1–5 against the Booking page at desktop (≥1280px) and mobile (~375px) widths — bypass via "Schedule now", blank/malformed questionnaire submission, placeholder text, phone auto-formatting (including backspace and non-digit/extra-digit input), and the regression check that both the questionnaire path and the bypass path complete a real Calendly booking (SC-001 through SC-005)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No tasks — skipped.
- **Foundational (Phase 2)**: No tasks — skipped.
- **User Story 1 (Phase 3)**: No dependency on Setup/Foundational tasks (none exist). T001, T003, T004 can run in parallel (three different, unrelated files). T002 depends on T001. T005 depends on T004. T006 depends on T003 and T005. T007 depends on T002 and T006.
- **User Story 2 (Phase 4)**: Independent of Phase 3's files (`utils.ts`, `Questionnaire.tsx` vs. `Calendar.*`, `PathCard.*`, `two-paths/*`, `booking/index.tsx`) — could be built in parallel with Phase 3 by a different developer. T008 has no dependency. T009 depends on T008. T010 depends on T009.
- **User Story 3 (Phase 5)**: T011 depends on T009/T010 completing first, since it edits the same JSX blocks in `Questionnaire.tsx` that T009 modified.
- **User Story 4 (Phase 6)**: T012 has no dependency (new, independent function in `utils.ts`). T013 depends on T012 and on T011 completing first (same file, sequential edits).
- **Polish (Phase 7)**: Depends on all four user stories being complete.

### Parallel Opportunities

- T001, T003, T004 (User Story 1) touch different files and can run in parallel
- T008 (User Story 2) and T012 (User Story 4) both touch `utils.ts` but are non-overlapping additions/edits — safe to do in either order, though not literally simultaneously in one file
- Phase 3 (US1) and Phase 4 (US2) touch entirely disjoint files and can be built in parallel by different developers
- T014, T015 (Polish) can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch the independent-file User Story 1 tasks together:
Task: "Update Calendar.types.ts: inquiry: Inquiry | null"
Task: "Create TwoPaths.types.ts with TwoPathsProps"
Task: "Update PathCard.types.ts: add onClick?: () => void"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Skip Phase 1/2 (nothing required)
2. Complete Phase 3: User Story 1 (the "Schedule now" bypass — this is the ticket's headline problem)
3. **STOP and VALIDATE**: Run `quickstart.md` Scenario 1 and confirm it passes
4. Deploy/demo if ready — a working bypass button is independently valuable even before the questionnaire's own validation is relaxed

### Incremental Delivery

1. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
2. Add User Story 2 → Test independently → Deploy/Demo (questionnaire itself no longer blocks)
3. Add User Story 3 → Test independently → Deploy/Demo (placeholder copy updated)
4. Add User Story 4 → Test independently → Deploy/Demo (phone auto-formats)
5. Complete Polish → Full cross-viewport and success-criteria validation

### Parallel Team Strategy

With multiple developers:

1. Developer A: User Story 1 (`Calendar.*`, `PathCard.*`, `two-paths/*`, `booking/index.tsx`)
2. Developer B: User Story 2 (`utils.ts` schema, `Questionnaire.tsx` validation removal) — different files, no conflict with Developer A
3. Once US2 lands, either developer picks up User Story 3 then User Story 4 sequentially (both keep editing `Questionnaire.tsx`)

---

## Notes

- [P] tasks = different files, no dependencies
- [US1]/[US2]/[US3]/[US4] labels map tasks to their user story for traceability
- T010 (CSS cleanup) is grouped under User Story 2 rather than Polish because it only exists as a direct, immediate consequence of T009's edit removing the last consumer of `.formError`
- Commit after each task or logical group
- Avoid: vague tasks, same-file conflicts beyond the intentional, explicitly-ordered US2 → US3 → US4 sequence on `Questionnaire.tsx`
