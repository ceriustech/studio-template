# Quickstart: Questionnaire and Calendar sections

Manual validation guide — no automated test suite exists in this repo (see `plan.md` Technical
Context). Run through this after implementation to confirm the feature meets spec `spec.md`
Success Criteria (SC-001–SC-006).

## Prerequisites

1. Install the new dependencies: `zod`, `resend` (`react-calendly` is already installed).
2. Add the two new required env vars to `.env` (see `.env.example` once created):
   - `RESEND_API_KEY` — a Resend API key with permission to send from the configured `from` address.
   - `BOOKING_INBOX` — the business email address that should receive inquiry notifications.
   - For local testing without a verified sending domain, Resend's test mode / a Resend sandbox
     API key can be used so `sendInquiry` succeeds without actually reaching a real inbox.
3. `npm run dev` and navigate to `/booking`.

## Scenario 1 — Layout match (SC-006)

1. Load `/booking` at a desktop viewport (≥1280px).
2. Scroll to the Questionnaire section. Compare against the design screenshot: eyebrow "New client
   intake," heading "Tell us about your space," confidentiality copy, "About you"/"About your
   project" groupings, and all ten fields with matching labels/placeholders.
3. Scroll to the section immediately below it. Before any submission, confirm nothing renders
   there yet (the Calendar section only appears after a successful submission — see Scenario 2).

## Scenario 2 — Validation blocks bad submissions (FR-005, SC-005)

1. Leave "First name," "Email," and "Which spaces need attention?" empty (or enter an invalid
   email, e.g. `not-an-email`).
2. Select "Continue to scheduling."
3. Confirm: the page does not navigate away, each invalid/missing required field shows its own
   error message next to it, and fields that *were* already filled in correctly are still filled
   in (not cleared).
4. Confirm no email arrives at `BOOKING_INBOX`.

## Scenario 3 — Successful submission hands off to Calendar (FR-006, FR-007, SC-001, SC-002)

1. Fill in all required fields (first/last name, valid email, at least one space, a timeframe) and
   any optional fields you want to verify end-to-end.
2. Select "Continue to scheduling."
3. Confirm the Questionnaire section is replaced, in place, by the Calendar section ("Select a
   time" / "Choose your consultation slot") — the browser URL does not change.
4. Confirm an email arrives at `BOOKING_INBOX` within a few minutes, containing every field
   submitted in step 1, clearly labeled.

## Scenario 4 — Calendar is pre-filled and carries answers into the booking (FR-009, FR-010, SC-003, SC-004)

1. Continuing from Scenario 3, open the scheduling widget.
2. Confirm the visitor's name/email fields are already populated in the widget (not blank).
3. Pick a time and complete a booking (a Calendly test/sandbox event type is fine for this check).
4. In the Calendly dashboard, open the resulting booking and confirm the submitted spaces,
   timeframe, and notes appear as custom answers on the event itself — not only in the earlier
   email.

## Scenario 5 — Email failure doesn't block scheduling (FR-011)

1. Temporarily set `RESEND_API_KEY` to an invalid value (or otherwise force `sendInquiry` to
   reject) and restart the dev server.
2. Repeat Scenario 3's submission.
3. Confirm the flow still advances to the Calendar section despite the email failing to send (check
   server logs for the logged failure), then restore the valid `RESEND_API_KEY`.

## Scenario 6 — Calendly load-failure fallback (FR-012)

1. Block the Calendly script/iframe (e.g., browser devtools request blocking for
   `assets.calendly.com` / `calendly.com`) and repeat Scenario 3's submission.
2. Confirm the Calendar section falls back to the mockup's static placeholder visual (calendar
   icon, "Calendly scheduling widget" title and description, dashed box) instead of rendering
   blank or throwing an unhandled error.

## Scenario 7 — Mobile viewport (Edge Cases)

1. Repeat Scenario 1 and Scenario 3 at a mobile viewport width (≤430px) and at 768px.
2. Confirm all fields, the multi-select spaces control, and the Calendar section remain usable,
   readable, and free of horizontal overflow.
