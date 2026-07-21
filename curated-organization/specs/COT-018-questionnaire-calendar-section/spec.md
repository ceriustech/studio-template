# Feature Specification: Questionnaire and Calendar sections

**Feature Branch**: `COT-018-questionnaire-calendar-section`

**Created**: 2026-07-20

**Status**: Draft

**Input**: User description: "COT-018: Implement Questionnaire and BookingCalendar section for the Booking page. Implement the Questionnaire and BookingCalendar section on the Booking page, matching the markup under the `<!-- QUESTIONNAIRE -->` and `<!-- CALENDLY EMBED -->` comments in the site design mockup. Components are named Questionnaire and Calendar. Flow: visitor fills out an intake form; on submit, the answers are emailed to the business and the visitor is taken to an embedded scheduling calendar, pre-filled with their name/email and carrying their answers as context attached to the booking itself. Acceptance: implementation matches the design screenshot, except the scheduling widget itself may use the screenshot's placeholder visual as a fallback."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor submits their project details before booking (Priority: P1)

As a visitor who has decided to book a consultation, I want to answer a short set of questions about myself and my project before picking a time, so that the team already has context on my needs when we speak.

**Why this priority**: This is the entry point to the whole booking flow — nothing else in this feature can happen until the questionnaire exists and can be submitted. It is independently valuable and testable on its own: a visitor can fill out and submit the form even before the scheduling step is evaluated.

**Independent Test**: Load the Booking page, fill in the required fields of the intake questionnaire, and submit. Verify the submission is accepted, an inquiry email is sent to the business, and the page advances to the scheduling step.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls to the questionnaire, **When** the section renders, **Then** they see the "New client intake" eyebrow, the heading "Tell us about your space," the supporting confidentiality note, and grouped fields for their personal details ("About you") and project details ("About your project") — first name, last name, email, phone, location, service interest, spaces needing attention, timeframe, referral source, and additional notes — matching the design mockup's labels, placeholders, and grouping.
2. **Given** a visitor has filled in all required fields, **When** they select "Continue to scheduling," **Then** the form submits successfully, an inquiry email containing their answers is sent to the business inbox, and the page transitions to the scheduling step without navigating to a different URL.
3. **Given** a visitor leaves a required field empty or enters an invalid value (e.g., a malformed email), **When** they attempt to submit, **Then** the submission is blocked, an accessible, field-specific error message is shown, and no inquiry email is sent.
4. **Given** a visitor needs to flag more than one area of their home, **When** they interact with "Which spaces need attention?", **Then** they can select multiple spaces, not just one.

---

### User Story 2 - Visitor picks a consultation time without re-entering their details (Priority: P2)

As a visitor who has just submitted the intake questionnaire, I want to be taken straight to a scheduling calendar that already knows my name, email, and answers, so that booking a time takes one step instead of two disconnected forms.

**Why this priority**: This is the payoff of the questionnaire step and the reason the flow exists — without it, the questionnaire would just be a dead-end contact form. It depends on User Story 1 completing successfully, which is why it is P2 rather than P1.

**Independent Test**: Complete the questionnaire from User Story 1, confirm the questionnaire is replaced by a scheduling calendar section ("Select a time" / "Choose your consultation slot"), and confirm the visitor's name and email do not need to be re-typed to book a slot.

**Acceptance Scenarios**:

1. **Given** a visitor has just submitted the questionnaire, **When** the scheduling step appears, **Then** it displays the "Select a time" eyebrow and "Choose your consultation slot" heading, matching the design mockup.
2. **Given** the scheduling widget loads, **When** the visitor views it, **Then** their name and email from the questionnaire are already applied, so they are not asked to re-enter them to book a slot.
3. **Given** a visitor completes booking a slot on the scheduling widget, **When** the team later reviews that booking, **Then** the visitor's questionnaire answers (spaces, timeframe, notes) are visible as context attached to that specific booking, not only in a separate email.

---

### User Story 3 - Business is notified of every inquiry, even if scheduling isn't completed (Priority: P3)

As the business owner, I want to receive an email for every submitted questionnaire, so that I can follow up with a visitor even if they close the page before choosing a time.

**Why this priority**: This is a safety net rather than a step in the primary visitor journey — the visitor doesn't observe it, and the flow still works end-to-end without it being separately verified. It is independently testable by submitting the questionnaire and checking the inbox, regardless of what happens afterward on the scheduling step.

**Independent Test**: Submit the questionnaire, then verify an email arrives at the business inbox containing the visitor's submitted answers, without completing the scheduling step.

**Acceptance Scenarios**:

1. **Given** a visitor submits a valid questionnaire, **When** the submission succeeds, **Then** an email is sent to the business inbox containing all of the visitor's submitted answers, formatted so each answer is clearly labeled.
2. **Given** a visitor submits the questionnaire but never picks a time on the scheduling calendar, **When** the business checks their inbox, **Then** the inquiry email is still present, so no visitor's request is lost.

---

### Edge Cases

- What happens if a visitor reloads or navigates back to the Booking page after submitting the questionnaire but before picking a time? The flow does not persist across a reload — the visitor sees the questionnaire again and must resubmit, since no session/answer persistence is in scope for this feature.
- What happens if the inquiry email fails to send? The visitor's progress to the scheduling step MUST NOT be blocked by an email delivery failure, since the visitor's ability to book a time is the higher-priority outcome.
- What happens if the visitor's submitted notes are very long? Excessively long free-text input must be rejected with a clear error rather than silently truncated or causing a failed submission with no explanation.
- What happens at tablet and mobile viewport widths? All form fields, the multi-select spaces control, and the scheduling widget must remain usable and readable, consistent with the mobile-first requirement applied to every other section of this page.
- What happens if a visitor tries to submit the form multiple times in quick succession (e.g., double-clicking "Continue to scheduling")? Only one inquiry email must be sent per valid submission.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Booking page MUST render a Questionnaire section directly after the existing "Two Paths" section, containing an eyebrow ("New client intake"), heading ("Tell us about your space"), and supporting copy, matching the design mockup.
- **FR-002**: The Questionnaire MUST collect, grouped as "About you" and "About your project": first name, last name, email, phone, location, service interest, spaces needing attention, timeframe, referral source, and additional notes — with labels, placeholder text, and grouping matching the design mockup.
- **FR-003**: The "Which spaces need attention?" field MUST allow the visitor to select more than one space.
- **FR-004**: The system MUST require, at minimum, a name, a valid email, and at least one selected space before allowing submission; all other fields' required/optional status MUST follow standard consultation-intake practice (contact fields required, elaboration fields optional).
- **FR-005**: The system MUST validate submitted answers before accepting them, and MUST show a clear, field-specific, accessible error message for any invalid or missing required field without discarding the visitor's other already-entered answers.
- **FR-006**: On successful submission, the system MUST send an email to the business inbox containing every answer the visitor submitted, clearly labeled.
- **FR-007**: On successful submission, the Questionnaire section MUST be replaced, on the same page (no navigation to a different URL), by a Calendar section for choosing a consultation time.
- **FR-008**: The Calendar section MUST display an eyebrow ("Select a time") and heading ("Choose your consultation slot"), matching the design mockup.
- **FR-009**: The Calendar section MUST pre-fill the visitor's name and email into the scheduling widget so the visitor does not have to re-enter them.
- **FR-010**: The Calendar section MUST attach the visitor's questionnaire answers (at minimum: spaces, timeframe, and notes) to the booking itself, so the team has that context available when reviewing the scheduled consultation — not only inside the notification email.
- **FR-011**: A failure to send the business notification email MUST NOT prevent the visitor from reaching or using the Calendar section.
- **FR-012**: The design mockup's static scheduling-widget visual (icon, "Calendly scheduling widget" title, description, dashed placeholder box) MUST be available for use as a fallback/reference visual for the Calendar section in case the live scheduling widget cannot be shown; it is not required to be the primary rendered content once a live scheduling widget is wired up.
- **FR-013**: All CSS translated from the mockup into the project's stylesheets MUST use camelCase class names, consistent with the styling convention already used by sibling sections (Hero, Two Paths, Intro, Services, Process, Testimonial, Cta, Footer).

### Key Entities

- **Inquiry**: A visitor's submitted questionnaire answers — name, email, phone, location, service interest, one or more spaces needing attention, timeframe, referral source, and free-text notes. Produced once per questionnaire submission; consumed by the notification email and carried into the scheduling step.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can go from an empty questionnaire to a rendered scheduling calendar, without leaving the Booking page, in a single continuous flow.
- **SC-002**: 100% of successfully submitted questionnaires produce a business notification email containing the visitor's full submitted answers.
- **SC-003**: 100% of visitors who reach the scheduling step have their name and email already present on the scheduling widget, with zero required re-entry of those two fields.
- **SC-004**: 100% of consultations booked through this flow carry the visitor's questionnaire answers as context on the booking itself, visible to the team without needing to cross-reference a separate email.
- **SC-005**: Visitors who submit an invalid or incomplete questionnaire can identify exactly which field needs correction, without needing to re-enter fields that were already valid.
- **SC-006**: The rendered Questionnaire and Calendar sections visually match the design screenshot at desktop viewport widths, with the sole exception of the live scheduling widget's own internal content.

## Assumptions

- The mockup file referenced in the ticket (`curated-gallery-mockup.html`) does not contain the `<!-- QUESTIONNAIRE -->` or `<!-- CALENDLY EMBED -->` markup; this spec is based on that markup as it actually appears in `.specify/site-design/curated-book-mockup.html`, consistent with how the Booking page's prior sections (Hero, Two Paths) sourced their markup from that same file.
- The design mockup's dropdown/option wording for service, spaces, timeframe, and referral source is the authoritative source for visitor-facing labels and choices; the illustrative option values in the ticket's suggested code (e.g., `kitchen`, `1-3-months`) are a starting shape for the underlying data, not a constraint on the visible copy, and will be reconciled to the mockup's actual option text during implementation.
- "Which spaces need attention?" renders as a single dropdown in the static mockup but its placeholder text ("Select all that apply") signals multi-select intent; per FR-003, the implemented control supports selecting multiple spaces even though the static screenshot shows only the resting/placeholder state.
- Name, email, and at least one space are the only fields enforced as strictly required (per FR-004); this mirrors standard consultation-intake practice where contact and problem-area information are essential but elaboration details (phone, location, service, timeframe, referral source, notes) are helpful but not blocking. Exact per-field required/optional status beyond this minimum is a planning-level detail.
- No answer persistence (e.g., across a page reload) is in scope; a visitor who reloads before scheduling starts over at the questionnaire, consistent with there being no existing session/draft-storage mechanism on this page.
- There is no existing email-sending or third-party scheduling integration elsewhere in the codebase; both are being introduced by this feature and will require their own service configuration (business inbox address, scheduling account) as a planning/implementation concern, not a specification concern.
- A live third-party scheduling widget is the intended end state for the Calendar section; the mockup's static placeholder visual is retained only as a fallback/reference per FR-012, not as the shipped default experience.
- The "What to Expect" section shown after the scheduling widget in the mockup is separate, pre-existing static content outside the scope of this feature and is unaffected by this work.
