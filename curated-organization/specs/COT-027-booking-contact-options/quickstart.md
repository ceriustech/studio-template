# Quickstart: Booking contact options & shortened intake

No automated test suite exists in this repo (consistent with every prior Booking-page feature).
Verification is manual, against the three design screenshots and the acceptance scenarios in
[spec.md](./spec.md).

## Prerequisites

- Install dependencies and run the dev server from the repo root:

```sh
npm install
npm run dev
```

- Open the Booking route in a browser (`/booking`, per `app/routes/constants/index.ts`).

## Scenarios to verify

### 1. Default / empty state (User Story 3, FR-011, SC-005)

1. Load the Booking page fresh (hard refresh, no prior interaction).
2. Confirm: Hero → Two Paths → **immediately** "What to Expect" — no call-info view, questionnaire, or calendar visible anywhere in between.

### 2. Email path — shortened questionnaire → calendar (User Story 1, FR-004–FR-008, SC-001, SC-002, SC-006)

1. In "Get started," select **Email us**.
2. Confirm the questionnaire shows only: First name, Last name, Email, Phone (all under "About you"), and one open-ended field labeled "Anything you'd like us to know?" — no service/deadline/investment/decision-maker/referral fields.
3. Leave First name blank, fill the rest, and submit. Confirm submission is blocked and an accessible, field-specific error appears on First name (test with a screen reader or by checking `aria-describedby`/`aria-invalid` in devtools), and the other entered values are preserved.
4. Fill in First name, Last name, and a valid Email; leave Phone and the note blank. Submit. Confirm the questionnaire is replaced, on the same page, by the Calendly scheduling view, and that the visitor's name/email appear already applied in the widget (no re-entry needed).

### 3. Call path (User Story 2, FR-002, FR-003, SC-003)

1. Reload the page, select "Get started" → **Call us**.
2. Confirm the business phone number is shown as visible text and is a working `tel:` link (inspect the anchor's `href`), plus supporting copy about what happens next.
3. Select "Prefer to write? Send us your details instead." Confirm the view switches to the shortened questionnaire without returning to the Two Paths cards.

### 4. Book again bypass (User Story 4, FR-009, SC-004)

1. Reload the page, select "Book again" → **Schedule now**.
2. Confirm the Calendly scheduling view appears immediately below Two Paths with no call-info view or questionnaire shown first, and with no name/email prefill (since no contact details were collected).

### 5. Keyboard & focus (General acceptance criteria, FR-012, FR-013, SC-007)

1. Reload the page and navigate using only Tab/Shift+Tab/Enter/Space — no mouse.
2. Confirm every control along the way — "Call us," "Email us," the phone `tel:` link, the "prefer to write" link, every questionnaire field and the submit button, and "Schedule now" — receives a visible focus indicator and can be activated from the keyboard.

### 6. Visual match

Compare each of the three new/changed views (Get started two-option card, call-info view, shortened questionnaire) against the corresponding provided screenshot at a desktop width, then again at a mobile width, confirming layout, spacing, and copy match and that nothing overlaps or truncates.
