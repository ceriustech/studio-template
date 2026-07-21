# Feature Specification: Remove Form Validation & Fast-Track Booking

**Feature Branch**: `COT-021-remove-form-validation`

**Created**: 2026-07-21

**Status**: Draft

**Input**: User description: "COT-021: Remove form validation. Remove the form validation on the booking page questionnaire so that returning clients can schedule a consult without filling out the questionnaire. The 'SCHEDULE NOW' button in the 'Book again' section should take you to the calendar to schedule a virtual consult. Update the placeholders for First name, Last name, and Email fields to 'First name', 'Last name', and 'youremail@example.com'. Auto-format the Phone field to (XXX) XXX-XXXX as the user types. Acceptance criteria cover validation removal, fast-track booking via 'Schedule now', placeholder updates, phone auto-formatting, and regression of calendar/booking functionality."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Returning client skips the questionnaire entirely (Priority: P1)

As a returning client who has already worked with the business, I want to click "Schedule now" in the "Book again" section and land straight on the scheduling calendar, so that I don't have to re-answer intake questions I've already answered before.

**Why this priority**: This is the core problem statement driving the whole feature — returning clients currently have no working way to skip the questionnaire. Without this, the rest of the feature has no entry point that matters to the target user.

**Independent Test**: From the Booking page, click "Schedule now" in the "Book again" card. Verify the questionnaire is never shown and the scheduling calendar appears immediately, ready to pick a virtual consult time.

**Acceptance Scenarios**:

1. **Given** a visitor is on the Booking page, **When** they click "Schedule now" in the "Book again" section, **Then** the questionnaire section is bypassed entirely and the scheduling calendar is displayed.
2. **Given** the scheduling calendar was reached via "Schedule now," **When** the visitor picks a time slot, **Then** the virtual consult booking completes normally, the same as if they had come from the questionnaire.
3. **Given** the scheduling calendar was reached via "Schedule now" (no questionnaire answers exist), **When** the calendar renders, **Then** it does not error or show broken/placeholder prefill fields — it simply presents an empty booking flow ready to be filled in on the scheduling widget itself.

---

### User Story 2 - Visitor can proceed through the questionnaire without completing it (Priority: P2)

As a visitor who starts the questionnaire (e.g., via "Start questionnaire"), I want to be able to continue to scheduling even if I skip fields, so that an incomplete or unwanted questionnaire never stops me from booking a consult.

**Why this priority**: This backs up User Story 1 for the case where a client lands on the questionnaire directly (e.g., a shared link, or by choosing "Start questionnaire" but changing their mind partway). It removes the same blocker from a second entry point, but the primary fix people asked for is the dedicated bypass button in User Story 1.

**Independent Test**: Load the questionnaire, leave every field blank, and click "Continue to scheduling." Verify the scheduling calendar appears with no error messages shown anywhere on the form.

**Acceptance Scenarios**:

1. **Given** a visitor leaves all questionnaire fields empty, **When** they click "Continue to scheduling," **Then** the submission succeeds and the scheduling calendar is displayed, with no blocking error messages.
2. **Given** a visitor fills in only some fields (e.g., just a first name), **When** they click "Continue to scheduling," **Then** the submission succeeds using whatever partial information was provided.
3. **Given** a visitor enters an unconventional value in a field that previously had a strict format check (e.g., an email without an "@"), **When** they click "Continue to scheduling," **Then** the submission is not blocked because of that value.

---

### User Story 3 - Field placeholders read clearly and consistently (Priority: P3)

As a visitor filling out the questionnaire, I want the First name, Last name, and Email fields to show generic, unambiguous placeholder text instead of a stranger's example name, so that the form doesn't look like it's showing someone else's pre-filled data.

**Why this priority**: This is a copy/clarity improvement independent of the validation changes — it can be verified and shipped on its own regardless of whether validation or the bypass button work has landed.

**Independent Test**: Load the questionnaire with all fields empty and visually confirm the placeholder text shown in the First name, Last name, and Email fields.

**Acceptance Scenarios**:

1. **Given** the questionnaire is freshly loaded, **When** the visitor looks at the First name field, **Then** the placeholder reads "First name."
2. **Given** the questionnaire is freshly loaded, **When** the visitor looks at the Last name field, **Then** the placeholder reads "Last name."
3. **Given** the questionnaire is freshly loaded, **When** the visitor looks at the Email field, **Then** the placeholder reads "youremail@example.com."

---

### User Story 4 - Phone number formats automatically while typing (Priority: P4)

As a visitor entering my phone number, I want the digits I type to automatically arrange into a familiar `(XXX) XXX-XXXX` format, so that I can tell at a glance whether I've entered my number correctly without doing the formatting myself.

**Why this priority**: This is a self-contained input-quality improvement to a single field. It's lowest priority because it doesn't unblock anyone — visitors could always type a phone number, formatted or not — but it meaningfully polishes the experience.

**Independent Test**: Load the questionnaire and type a 10-digit number (e.g., 2322345678) into the Phone field one digit at a time. Verify the displayed value updates to `(232) 234-5678` as digits are entered.

**Acceptance Scenarios**:

1. **Given** an empty Phone field, **When** a visitor types digits one at a time, **Then** the field's displayed value progressively formats to match `(XXX) XXX-XXXX`.
2. **Given** a Phone field with a formatted number already entered, **When** the visitor deletes digits (e.g., via backspace), **Then** the displayed value re-formats correctly rather than leaving stray formatting characters behind.
3. **Given** a visitor pastes or types non-digit characters into the Phone field, **When** the value is rendered, **Then** only the digits are kept and formatted — the non-digit characters do not appear in the field.
4. **Given** the Phone field is empty, **When** the visitor has not yet typed anything, **Then** the placeholder text shown is unchanged from what it was before this feature.

---

### Edge Cases

- What happens if a visitor types more than 10 digits into the Phone field? Additional digits beyond the 10 needed for `(XXX) XXX-XXXX` are not appended to the formatted value, since the format has no room for an extension or country code.
- What happens if a visitor clicks "Schedule now" and then uses the browser back button? They return to the Booking page in its default state (showing both "Book again" and "Get started" options again), since no persistent step/session state is introduced by this feature.
- What happens to the "Get started" → "Start questionnaire" path? It is unaffected by this feature apart from the questionnaire no longer blocking submission on incomplete fields — the questionnaire itself still renders and is still the recommended path for new clients.
- What happens if the questionnaire is submitted completely empty and the visitor never had any prior relationship with the business (i.e., they used "Start questionnaire" rather than "Schedule now")? The submission still succeeds and reaches the calendar, per User Story 2 — this feature does not distinguish new vs. returning visitors on the questionnaire path itself, only via the separate "Book again" bypass button.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The questionnaire's "Continue to scheduling" action MUST succeed and advance the visitor to the scheduling calendar regardless of which fields, if any, are filled in.
- **FR-002**: The system MUST NOT display field-specific error messages or otherwise block progression when questionnaire fields are left empty or contain values that previously failed format checks (e.g., a malformed email).
- **FR-003**: The "Schedule now" call-to-action in the "Book again" section MUST take the visitor directly to the scheduling calendar for booking a virtual consult, without showing or requiring the questionnaire.
- **FR-004**: The scheduling calendar MUST render and function correctly when reached via "Schedule now," even though no questionnaire answers exist to pre-fill it with.
- **FR-005**: The First name field's placeholder text MUST read "First name."
- **FR-006**: The Last name field's placeholder text MUST read "Last name."
- **FR-007**: The Email field's placeholder text MUST read "youremail@example.com."
- **FR-008**: The Phone field's placeholder text MUST remain exactly as it was before this feature.
- **FR-009**: As a visitor types digits into the Phone field, the displayed value MUST automatically format to match the pattern `(XXX) XXX-XXXX`.
- **FR-010**: Deleting characters from the Phone field MUST re-format the remaining digits correctly, without leaving orphaned formatting punctuation.
- **FR-011**: Non-digit characters entered or pasted into the Phone field MUST be excluded from the displayed and stored value.
- **FR-012**: Scheduling a virtual consult, selecting a time slot, and completing a booking MUST continue to work correctly both when reached by completing the questionnaire and when reached by bypassing it via "Schedule now."

### Key Entities

- **Inquiry**: The visitor's questionnaire answers (first name, last name, email, phone, and the remaining project-detail fields). After this feature, every field is optional for the purpose of reaching the scheduling calendar — an Inquiry may be entirely blank, or entirely absent when the visitor bypasses the questionnaire via "Schedule now."

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A returning client can go from the Booking page to a ready-to-use scheduling calendar in a single click, without entering any information.
- **SC-002**: 100% of questionnaire submission attempts reach the scheduling calendar, regardless of how many fields were completed.
- **SC-003**: 100% of visitors see the updated placeholder text ("First name," "Last name," "youremail@example.com") in the corresponding fields on first load of the questionnaire.
- **SC-004**: 100% of 10-digit phone numbers entered into the Phone field display in `(XXX) XXX-XXXX` format by the time entry is complete.
- **SC-005**: 100% of consultations booked through either the questionnaire path or the "Schedule now" bypass complete successfully with no scheduling errors.

## Assumptions

- "Remove the form validation" is interpreted broadly: both required-field checks and format checks (e.g., email shape) on the questionnaire fields are removed, since the ticket's intent is to let a visitor proceed regardless of what they have or haven't entered, not just to relax which fields are mandatory.
- When the scheduling calendar is reached via the "Schedule now" bypass, there are no questionnaire answers to pass along; the calendar is expected to render usably with no name/email prefill in that case, since prefill was always a convenience rather than a requirement for booking.
- The "Schedule now" bypass reuses the existing same-page pattern already used for the questionnaire-to-calendar transition (the calendar replaces the current section in place, without a full page navigation), for consistency with the existing booking flow.
- Phone number auto-formatting targets a 10-digit US-style number in `(XXX) XXX-XXXX` format; digits beyond the 10th are not incorporated into the formatted display.
- The "Start questionnaire" path and the questionnaire's visible fields, labels, and grouping are otherwise unchanged by this feature — only the blocking behavior on submission and the four field-specific changes (three placeholders, phone formatting) are in scope.
- No backend, database, or email-notification behavior changes are required by this feature; any existing inquiry-submission side effects (such as notifying the business) continue to fire on whatever data is present, including an entirely blank or absent Inquiry.
