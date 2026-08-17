# Feature Specification: Booking contact options & shortened intake

**Feature Branch**: `COT-027-booking-contact-options`

**Created**: 2026-08-16

**Status**: Draft

**Input**: User description: "COT-027: Update booking form user flow

Description:

Rework the booking page so first-time clients can reach out by phone or email instead of being routed straight into a questionnaire, and so the intake form that remains is reduced to contact details plus one open-ended question.

The page keeps its existing two-card split. \"Get started\" now offers two contact options rather than a single questionnaire button: calling the business directly, or reaching out by email. The call option surfaces the business phone number with supporting copy. The email option opens the shortened questionnaire, and on submit advances to the Calendly embed with the name and email carried over from the form. \"Book again\" continues to go straight to the Calendly embed with no intake.

The full questionnaire is being cut down at the client's request — their clients often don't have the bandwidth for a long form, and the remaining questions will be handled over email or during the consult itself.

Should match the designs.

Acceptance Criteria:

Get started card
- The single \"Start questionnaire\" button is replaced by two options: call and email
- The call option displays the business phone number as visible text, wrapped in a `tel:` link so it is usable on both desktop and mobile
- The call option includes supporting copy explaining what happens next
- The email option opens the shortened questionnaire

Shortened questionnaire
- Only the \"About you\" contact fields remain: name, email, and phone
- All other existing questions are removed
- A single open-ended field is added, labelled \"Anything you'd like us to know?\"
- Submitting the form advances the user to the Calendly embed
- Required fields are validated before submission, with accessible error messaging

Book again card
- \"Schedule now\" goes directly to the Calendly embed with no intake step

General
- All interactive controls have visible focus states and accessible labels
- The flow is navigable by keyboard from card selection through to the embed
- Both new component views will render below the 'twoPaths' section of the page
- If there's no option chosen in the 'twoPaths' view the section below it will remain empty, so users should see the 'twoPaths' option and the 'whatToExpect' section on first render or if there's no options chosen."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New client emails their contact details and reaches scheduling (Priority: P1)

As a first-time visitor who prefers to write rather than call, I want to choose "Email us," fill in only my contact details and one open note, and be taken straight to a scheduling calendar that already knows my name and email, so that starting a consultation doesn't require answering a long questionnaire.

**Why this priority**: This is the core problem statement driving the ticket — the existing long questionnaire is a bandwidth barrier for the client's customers, and this shortened path is the primary replacement for it. It is independently testable end-to-end: choose "Email us," submit the shortened form, and confirm the calendar appears pre-filled.

**Independent Test**: From the Booking page, select "Get started," choose "Email us," fill in first name, last name, and email (leaving phone and the open-ended field blank), and submit. Verify the scheduling calendar appears in place of the form, pre-filled with the submitted name and email, without navigating to a different URL.

**Acceptance Scenarios**:

1. **Given** a visitor has selected "Get started," **When** they choose "Email us," **Then** a shortened questionnaire appears below the Two Paths section showing only "About you" contact fields (first name, last name, email, phone) and a single open-ended field labeled "Anything you'd like us to know?" — with no service, deadline, investment, decision-maker, or referral questions present.
2. **Given** the shortened questionnaire is showing, **When** the visitor submits it with all required fields completed, **Then** the questionnaire is replaced, on the same page, by the scheduling calendar, and the calendar is pre-filled with the submitted name and email.
3. **Given** the shortened questionnaire is showing, **When** the visitor leaves a required field empty (or enters an invalid email) and attempts to submit, **Then** submission is blocked, an accessible, field-specific error message is shown, and any already-entered valid answers are preserved.
4. **Given** the visitor is navigating by keyboard only, **When** they tab through the "Email us" option, the form fields, and the submit control, **Then** every control receives a visible focus indicator and can be activated without a mouse.

---

### User Story 2 - New client calls the business directly (Priority: P2)

As a first-time visitor who'd rather talk to someone than fill out a form, I want to choose "Call us" and immediately see the business phone number and what to expect from the call, so that I can reach out without completing any form at all.

**Why this priority**: This is the other half of the new "reach out however works best" entry point and directly reduces the number of visitors funneled into any form. It is independently testable and does not depend on the email/questionnaire path.

**Independent Test**: From the Booking page, select "Get started," then choose "Call us." Verify the business phone number appears as visible text and as a working `tel:` link, with no form fields shown.

**Acceptance Scenarios**:

1. **Given** a visitor has selected "Get started," **When** they choose "Call us," **Then** a call-info view appears below the Two Paths section displaying the business phone number as visible text and supporting copy explaining what happens next (e.g., what the call covers and when someone is available).
2. **Given** the call-info view is showing, **When** the visitor activates the phone number on a touch device, **Then** the device's phone dialer opens pre-filled with the business number, because the number is wrapped in a `tel:` link.
3. **Given** the visitor is on the call-info view, **When** they decide they'd rather write instead, **Then** they can switch to the shortened email questionnaire from that view without needing to return to the Two Paths cards.
4. **Given** the visitor is navigating by keyboard only, **When** they tab to the "Call us" option and any links within the call-info view, **Then** every control receives a visible focus indicator and can be activated via keyboard.

---

### User Story 3 - Booking page shows only the card choice until an option is picked (Priority: P3)

As any visitor landing on the Booking page, I want to see just the "Get started"/"Book again" choice and the "What to Expect" content at first, with no form or calendar appearing prematurely, so that the page doesn't look cluttered or confusing before I've made a choice.

**Why this priority**: This is the foundational display rule underpinning both new paths — without it, the page risks regressing to always showing a form by default, which is exactly the behavior this feature removes. It's independently verifiable with a single page load and no interaction.

**Independent Test**: Load the Booking page fresh (no prior selection). Verify the area below the Two Paths section is empty and the "What to Expect" section is the next visible content — no call-info view, questionnaire, or calendar is shown.

**Acceptance Scenarios**:

1. **Given** a visitor loads the Booking page for the first time, **When** the page renders, **Then** the Two Paths section is shown, the area directly below it is empty, and the "What to Expect" section follows — no call-info view, questionnaire, or calendar is visible.
2. **Given** a visitor has not yet chosen "Call us," "Email us," or "Schedule now," **When** they view the page at any point before making a choice, **Then** the section below Two Paths remains empty.

---

### User Story 4 - Returning client skips intake entirely (Priority: P4)

As a returning client, I want "Schedule now" in "Book again" to take me straight to the scheduling calendar with no call-info view or questionnaire in between, so that I don't repeat information I've already given.

**Why this priority**: This behavior already exists from prior work on the Booking page; this story exists to confirm it remains correct once the area below Two Paths is driven by the new call/email/empty state model introduced by this feature.

**Independent Test**: From the Booking page, select "Schedule now" in "Book again." Verify the scheduling calendar appears immediately below the Two Paths section with no call-info view or questionnaire shown at any point.

**Acceptance Scenarios**:

1. **Given** a visitor is on the Booking page, **When** they select "Schedule now" in "Book again," **Then** the scheduling calendar appears directly below the Two Paths section with no call-info view or questionnaire shown first.
2. **Given** the calendar was reached via "Schedule now," **When** it renders, **Then** it does so without any name/email prefill and without error, since no contact details were collected.

---

### Edge Cases

- What happens if a visitor chooses "Call us" and then chooses "Email us" (or vice versa)? The previously shown view is replaced cleanly by the newly chosen one below the Two Paths section; both views never appear at once.
- What happens if a visitor submits the shortened questionnaire, then reloads the page? The flow does not persist across a reload — the visitor returns to the empty state described in User Story 3 and must choose an option again, consistent with the page's existing lack of session/answer persistence.
- What happens if a visitor reaches the calendar via "Schedule now" and uses the browser back button? They return to the Booking page in its empty default state (Two Paths visible, nothing chosen), consistent with existing behavior.
- What happens at tablet and mobile viewport widths? The "Call us"/"Email us" options, the call-info view, and the shortened questionnaire all remain fully usable, readable, and touch-friendly, consistent with the mobile-first requirement already applied to the rest of the page.
- What happens if a visitor types a value into the Phone field? Existing digit-only auto-formatting behavior on the Phone field is preserved unchanged.
- What happens if a visitor tries to submit the shortened questionnaire multiple times in quick succession? Only one advance to the scheduling calendar occurs per valid submission.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The "Get started" card MUST present two distinct contact options — "Call us" and "Email us" — replacing the single "Start questionnaire" control.
- **FR-002**: Selecting "Call us" MUST display a call-info view containing the business phone number rendered as visible text and wrapped in a functional `tel:` link, plus supporting copy explaining what happens next, matching the design mockup.
- **FR-003**: The call-info view MUST provide a way to switch to the shortened email questionnaire without returning to the Two Paths cards.
- **FR-004**: Selecting "Email us" MUST display the shortened questionnaire.
- **FR-005**: The shortened questionnaire MUST collect only the "About you" contact fields — first name, last name, email, and phone — plus a single open-ended field labeled "Anything you'd like us to know?"; all other previously present questions (location, service interest, deadline, investment target, decision-makers, referral source) MUST be removed.
- **FR-006**: The system MUST require first name, last name, and email before allowing the shortened questionnaire to be submitted, and MUST show an accessible, field-specific error message for any missing or invalid required field without discarding already-entered answers. Phone and the open-ended field remain optional.
- **FR-007**: On successful submission of the shortened questionnaire, it MUST be replaced, on the same page (no navigation to a different URL), by the scheduling calendar.
- **FR-008**: The scheduling calendar reached via the shortened questionnaire MUST be pre-filled with the visitor's submitted name and email.
- **FR-009**: The "Book again" card's "Schedule now" control MUST continue to take the visitor directly to the scheduling calendar, with no call-info view or questionnaire shown first.
- **FR-010**: The call-info view and the shortened questionnaire (and, after submission or after "Schedule now," the scheduling calendar) MUST render below the existing Two Paths section, in the same page area previously occupied by the questionnaire/calendar.
- **FR-011**: On first render of the Booking page, and at any time before the visitor has chosen "Call us," "Email us," or "Schedule now," no call-info view, questionnaire, or calendar MUST be shown below the Two Paths section — only the Two Paths section and the "What to Expect" section MUST be visible in that area.
- **FR-012**: All interactive controls introduced or changed by this feature ("Call us," "Email us," the `tel:` link, the questionnaire fields and submit control, the "switch to email" control, and "Schedule now") MUST expose a visible focus state and an accessible name/label.
- **FR-013**: The full flow — choosing an option in the Two Paths section, interacting with the call-info view or shortened questionnaire, and reaching the scheduling calendar — MUST be operable using only the keyboard.
- **FR-014**: The visual presentation of the "Get started" two-option layout, the call-info view, and the shortened questionnaire MUST match the provided design mockups.
- **FR-015**: All CSS added or changed for this feature MUST use camelCase class names, consistent with the styling convention already used by sibling sections of the Booking page.

### Key Entities

- **Inquiry**: A visitor's submitted shortened-questionnaire answers — first name, last name, email, phone, and one open-ended note ("Anything you'd like us to know?"). Replaces the prior, longer Inquiry shape; produced once per shortened-questionnaire submission and consumed by the scheduling calendar's name/email prefill.
- **Path Selection**: The visitor's in-page choice among "Call us," "Email us," or "Schedule now" (or no choice yet). Determines which single view — call-info, shortened questionnaire, scheduling calendar, or none — renders below the Two Paths section at any given time.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can reach either a usable phone number or a submitted shortened questionnaire in under four fields of input, with zero project-detail questions presented.
- **SC-002**: 100% of visitors who successfully submit the shortened questionnaire reach the scheduling calendar with their name and email already present, requiring zero re-entry of those fields.
- **SC-003**: 100% of visitors who choose "Call us" see the business phone number as both readable text and a functioning tap-to-call link, with no form fields presented on that view.
- **SC-004**: 100% of returning clients who select "Schedule now" reach the scheduling calendar in a single click, with zero intake fields shown.
- **SC-005**: On page load, and until a visitor actively makes a choice, 0% of visitors see a call-info view, questionnaire, or calendar below the Two Paths section.
- **SC-006**: Visitors who omit a required field on the shortened questionnaire can identify and correct exactly which field is missing on their first attempt, without losing any other already-entered answer.
- **SC-007**: The entire path — from choosing an option in the Two Paths section through reaching the scheduling calendar — can be completed using only a keyboard, with a visible focus indicator at every interactive control along the way.

## Assumptions

- The business phone number and hours copy shown in the design mockup are placeholder content; the actual production phone number and hours text are a content/configuration detail to be finalized during implementation, consistent with how the business notification inbox address was treated as a configuration concern in the prior questionnaire feature (COT-018).
- First name, last name, and email are the required contact fields on the shortened questionnaire; phone and the open-ended note remain optional. This follows standard consultation-intake practice and matches the two fields the ticket explicitly states must carry over to the scheduling calendar (name and email).
- This feature reintroduces required-field validation specifically for the shortened questionnaire's contact fields, superseding the "no validation" behavior applied to the prior, longer questionnaire in COT-021; the "Schedule now" bypass remains unaffected and continues to require no fields.
- The existing digit-only phone-number auto-formatting behavior (introduced in COT-021) carries over unchanged to the shortened questionnaire's Phone field.
- If the prior questionnaire's business-notification-email side effect (COT-018) exists in the current implementation, it is preserved unchanged for the shortened field set, since this ticket does not request its removal.
- The "What to Expect" section is unaffected by this feature and continues to render below the booking flow regardless of which option, if any, is chosen in the Two Paths section.
- The Two Paths section's own card copy, icons, and layout (established in COT-017) are unchanged by this feature except that "Get started" now leads to two sub-options instead of one button; "Book again" is unaffected in appearance.
- The call-info view is presentational and does not submit data anywhere; it only displays static business contact information and a control to switch to the email path.
