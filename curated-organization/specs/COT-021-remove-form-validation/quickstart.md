# Quickstart: Validate Remove Form Validation & Fast-Track Booking

## Prerequisites

- Dependencies installed (`npm install`).
- No new environment variables are required by this feature (Calendly URL is unchanged, hardcoded in `Calendar.tsx`).

## Setup

```bash
npm run typecheck
npm run dev
```

Open the Booking page in a browser (the route configured for `booking` in `app/routes/constants/index.ts`).

## Validation Scenarios

Each scenario maps back to the acceptance scenarios in [spec.md](./spec.md).

### 1. Fast-track bypass via "Schedule now" (US1 / FR-003, FR-004)

1. Load the Booking page fresh.
2. Click **Schedule now** in the **Book again** card.
3. **Expect**: the questionnaire is never rendered; the scheduling calendar ("Select a time" / "Choose your consultation slot") appears immediately.
4. Pick an available time slot in the embedded widget.
5. **Expect**: the booking flow completes with no console errors and no broken prefill fields.

### 2. Questionnaire no longer blocks on empty fields (US2 / FR-001, FR-002)

1. Load the Booking page fresh, click **Start questionnaire** (or scroll to the questionnaire).
2. Leave every field blank.
3. Click **Continue to scheduling →**.
4. **Expect**: no error messages appear anywhere on the form; the scheduling calendar is displayed immediately.
5. Repeat, this time entering an intentionally malformed email (e.g., `not-an-email`) and leaving everything else blank.
6. **Expect**: submission still succeeds and reaches the calendar.

### 3. Placeholder text (US3 / FR-005, FR-006, FR-007)

1. Load the questionnaire with all fields empty.
2. **Expect**: First name field placeholder reads `First name`; Last name field placeholder reads `Last name`; Email field placeholder reads `youremail@example.com`.
3. **Expect**: Phone field placeholder is unchanged from before this feature.

### 4. Phone auto-formatting (US4 / FR-009, FR-010, FR-011)

1. Click into the Phone field and type `2322345678` one digit at a time.
2. **Expect**: the displayed value progressively formats, ending at `(232) 234-5678`.
3. Press backspace several times.
4. **Expect**: the value re-formats cleanly (no stray `(`, `)`, or `-` left dangling) as digits are removed.
5. Try pasting `abc123def4567890`.
6. **Expect**: only the digits are kept and formatted (extra digits beyond the 10th are dropped); letters are dropped entirely.

### 5. Regression — both paths still book correctly (US1/US2 / FR-012)

1. Complete the questionnaire fully (all fields) and confirm booking a slot still works and still carries prefill/context into Calendly as before this feature (per COT-018 behavior).
2. Repeat the "Schedule now" bypass (Scenario 1) and confirm booking a slot works with no prefill.
3. Check both flows at a mobile viewport width (e.g., 375px) — form fields, the "Schedule now"/"Start questionnaire" cards, and the calendar widget must remain usable and readable.

## Notes

- No automated test suite exists in this repo; the above is the full verification plan for this feature (see `plan.md` → Technical Context → Testing).
- Refer to [data-model.md](./data-model.md) for the exact `Inquiry` field changes and to [research.md](./research.md) for the implementation approach behind each scenario.
