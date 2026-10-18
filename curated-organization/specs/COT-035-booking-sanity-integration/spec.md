# Feature Specification: Booking page from the content studio

**Feature Branch**: `COT-035-booking-sanity-integration`

**Created**: 2026-10-16

**Status**: Draft

**Input**: User description: "COT-035: Update Sanity Schema integration Booking page

Description:

Integrate the updated sanity schema so that the data renders on the Booking page. All fallbacks must be in place.

Acceptance Criteria:

- Sanity schema is wired up to render data on the frontend for the Booking page
- All fall backs are in place so that data will still render in the case of a network issue"

**Follow-up input (2026-10-17)**: "Also, I want to remove the calendly url implementation so that it can be accessed and modified in sanity. We'll need to update the schema for the booking page accordingly so that the calendly url entered in calendly takes priority over the one set as an environment variable."

## Context

The content studio already has a "Booking page" document with tabs for Hero, Two paths, Call info, Questionnaire, Calendar, What to expect, and Search & sharing. The business phone number and hours are kept in Site settings so they match the rest of the site. The live Booking page doesn't read any of this. All of its copy is hardcoded, so the site owner can't change the wording without a developer and a deploy.

Global content (COT-028, COT-030), Home (COT-031), Services (COT-032) and Gallery (COT-033) are already connected. This feature does the same for the Booking page, using the same pattern: the live page shows what the owner publishes, and falls back to built-in backup content whenever studio content is missing or can't be reached.

How the studio content maps to the Booking page:

| Studio content | Booking page section | What the owner controls |
|----------------|----------------------|-------------------------|
| Booking page → Hero | Text-only page header | Small line above the headline, headline, supporting line |
| Booking page → Two paths | The two path cards ("Get started" and "Book again") | For each card: icon, title, description; for the options card, each option's icon (phone/email) and label; for the single-button card, the button label, destination and style |
| Booking page → Call info, plus Site settings → business phone and hours | "Give us a call" section | Small line, heading, intro, the "switch to email" link text; phone number and hours come from Site settings |
| Booking page → Questionnaire | "New client intake" form | Small line, heading, intro, the two form section labels, every field label and placeholder, submit button label, note under the button, and the four messages shown when required fields are missing or the email is invalid |
| Booking page → Calendar | "Select a time" scheduling section | Small line, heading, the Calendly scheduling link (**new field**), and the icon, title and description shown when the scheduling widget can't load |
| Booking page → What to expect | "What to expect" section shown at the bottom of the Booking page in place of the site-wide call-to-action banner | Small line, heading, numbered steps (number, title, description) |
| Booking page → Search & sharing | Booking title, summary and share image in Google and link previews | Page title, page summary, share image |

The flow between sections stays as it is today: choosing "Call us" opens the call section, "Email us" opens the form, the "Schedule now" button on the "Book again" card or submitting the form opens the scheduling (Calendly) view, and the page scrolls to whichever opens. The form's fields, what it checks, and the scheduling widget's styling and pre-filled visitor details are page behaviour, not editorial content, and stay in code.

**The scheduling link moves to the studio (follow-up input, 2026-10-17).** Today the Calendly link is set only in the server's environment settings, so changing it needs a developer. This feature adds a "Calendly scheduling link" field to the Booking page's Calendar tab. The page uses the studio link first. If that link is blank, isn't a valid Calendly link, or the studio can't be reached, the page uses the link in the environment settings (today `https://calendly.com/rc-curatedorganization`). If neither is available, the "can't load" message is shown, as today. The Booking page document's studio description, which currently says the Calendly link stays in code, is updated to match.

Published content today (checked 2026-10-16): there is no published Booking page. Site settings has the business phone ("(703) 555-0182") and hours ("Mon-Fri, 9am-5pm ET · Sat by appointment"), which match what the page shows today.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Owner edits the Booking page wording (Priority: P1)

The site owner opens the Booking page in the content studio, rewrites the header, the path cards, the call section, the form wording, the scheduling section and the "What to expect" steps, then publishes. The next time anyone loads the Booking page, all of it shows her new wording, and the page works exactly as before.

**Why this priority**: This is the point of the feature. The Booking page is where visitors become clients, and today the owner can't change any of its wording herself.

**Independent Test**: Publish a Booking page with every tab filled in, reload the page, go through each path (call, email form, book again), and confirm every section shows the published wording.

**Acceptance Scenarios**:

1. **Given** a published Booking page Hero with a headline, **When** a visitor loads the page, **Then** the header shows the published small line, headline and supporting line.
2. **Given** published path cards, **When** the page loads, **Then** the cards appear in the published order with their icon, title and description. The options card lists each option with a phone or envelope icon and its label. The single-button card shows its button label (today "Schedule now") in the chosen style.
3. **Given** the visitor picks the phone option, **When** the call section opens, **Then** it shows the published small line, heading, intro and "switch to email" link text, plus the phone number and hours from Site settings. Tapping the phone number starts a call to that number.
4. **Given** the visitor picks the email option or the "switch to email" link, **When** the form opens, **Then** every heading, section label, field label, placeholder, the button label and the note under it show the published wording.
5. **Given** the visitor submits the form without a required field or with an invalid email, **When** the form checks it, **Then** the matching published message is shown next to that field.
6. **Given** scheduling opens, **When** the widget loads, **Then** the section shows the published small line and heading. **When** the widget can't load, **Then** it shows the published icon, title and description instead.
7. **Given** published "What to expect" steps, **When** the page loads, **Then** the section at the bottom shows the published small line, heading and steps in order, with the connector between steps as today.

---

### User Story 2 - Complete Booking page when the content service is down (Priority: P1)

A visitor opens the Booking page while the content studio can't be reached. The page still shows every section with today's wording, and the visitor can still call, fill in the form and book a time.

**Why this priority**: The ticket requires all fallbacks to be in place. If the Booking page breaks, the business loses bookings.

**Independent Test**: Make the content service unreachable, load the Booking page, and go through each of the three paths to the end.

**Acceptance Scenarios**:

1. **Given** the content service is unreachable, too slow, or not configured, **When** a visitor loads the Booking page, **Then** every section shows today's copy: the header ("Book a consultation" / "Let's transform your space" / "Your complimentary 30-minute consultation starts here. Choose your path below."), both path cards, the call section with phone "(703) 555-0182" and hours "Mon-Fri, 9am-5pm ET · Sat by appointment", the full form with today's labels, placeholders and messages, the scheduling section, and the three "What to expect" steps.
2. **Given** backup content is shown, **When** the visitor goes through the call, email or "book again" path, **Then** each one works exactly as it does today.
3. **Given** the content service is reachable but no Booking page is published (the situation today), **When** the page loads, **Then** every section uses backup content as in scenario 1, and the phone and hours come from Site settings.
4. **Given** the content service is unreachable, **When** the page is shared or indexed, **Then** the site-wide default title, summary and share image are used.

---

### User Story 3 - Owner updates the Booking page's search listing (Priority: P2)

The owner fills in the Booking page's Search & sharing fields and publishes. The page's Google listing and link previews update.

**Why this priority**: Useful but low-frequency compared with the page wording.

**Independent Test**: Set the page title and summary in the studio, publish, reload, and check the browser tab and the page's preview data.

**Acceptance Scenarios**:

1. **Given** Search & sharing values are published, **When** the page is shared or indexed, **Then** the title reads "{page title} | {business name}" and the summary and share image are the published ones.
2. **Given** any Search & sharing field is blank, **Then** that field alone uses the site-wide default.

---

### User Story 4 - Owner changes the Calendly scheduling link (Priority: P2)

The owner switches to a different Calendly event (for example a new consultation type), pastes its link into the Booking page's Calendar tab, and publishes. The next visitor who opens scheduling sees the new event, with no developer or deploy needed.

**Why this priority**: The link changes rarely, but when it does the owner shouldn't need a developer, and a wrong link means lost bookings.

**Independent Test**: Publish a different Calendly link, reload the page, open scheduling, and confirm the new event loads. Then clear the field, publish, and confirm the environment link loads.

**Acceptance Scenarios**:

1. **Given** a published Calendly link, **When** a visitor opens scheduling, **Then** the widget loads that link, even if a different link is set in the environment settings.
2. **Given** the studio link is blank, **When** a visitor opens scheduling, **Then** the widget loads the environment link.
3. **Given** the content service is unreachable, **When** a visitor opens scheduling, **Then** the widget loads the environment link.
4. **Given** the owner enters something that isn't a Calendly link, **When** she tries to publish, **Then** the studio explains the problem and blocks publishing. If such a value reaches the site anyway, the page ignores it and uses the environment link.
5. **Given** neither a studio link nor an environment link is available, **When** a visitor opens scheduling, **Then** the "can't load" message is shown, as today.
6. **Given** the visitor filled in the form first, **When** scheduling opens with either link, **Then** their name, email, phone and notes are pre-filled, as today.

---

### User Story 5 - Partially filled content never looks broken (Priority: P3)

The owner publishes the Booking page with some fields left blank. The page shows what is complete, quietly leaves out optional extras, and never shows a broken form or an empty section.

**Why this priority**: The Booking page document has no required fields, so partly filled content is likely, especially while the owner is first setting it up.

**Independent Test**: Publish a Booking page with different fields blank and confirm each behaves as below.

**Acceptance Scenarios**:

1. **Given** a section (Hero, Call info, Questionnaire, Calendar or What to expect) has no heading, **When** the page loads, **Then** that whole section uses its backup copy.
2. **Given** a section has a heading but a blank small line or intro, **Then** that line is hidden rather than replaced.
3. **Given** the form is published with some field labels, section labels, the button label or some messages blank, **Then** each blank one uses its backup wording on its own, so the form always has a label for every field, a working button, and a message for every problem. A blank placeholder or a blank note under the button is hidden.
4. **Given** the call section's "switch to email" link text is blank, **Then** the backup link text is used, so the visitor can always switch to the form.
5. **Given** the scheduling section's "can't load" title is blank, **Then** the backup "can't load" icon, title and description are used together. If only the icon or description is blank, that part is hidden.
6. **Given** a path card has no title, an unrecognised type, or (for the options card) no usable options, **Then** that card is left out. An option without a label or a recognised icon is left out. A single-button card without a button label uses the backup label.
7. **Given** no published path card is usable, **Then** both backup cards are shown. Published and backup cards are never mixed.
8. **Given** a "What to expect" step has no number or no title, **Then** that step is left out. If no step is usable, the backup steps are shown. Published and backup steps are never mixed.
9. **Given** Site settings has no phone number (display text or dialling number missing), **Then** the call section uses the backup phone number. If the hours are blank, the hours line is hidden.

### Edge Cases

- The owner publishes only one path card (for example only the "Book again" card): only that card is shown, and the other path isn't available. This is the owner's choice, not an error.
- The options card has two phone options or two email options: both show, and each opens the section that matches its icon.
- Two options cards are published: both show, and each one's options work as above.
- The "What to expect" section sits below the page, outside the main page area. It must still show published or backup content when the page loads directly, after moving from another page, and when the content service is down.
- If the Booking page itself fails with an error, the error page shows without the "What to expect" section, as today.
- A visitor fills in part of the form and then switches between paths: the form behaves as it does today.
- The scheduling widget fails to load while the content service is also down: the backup "can't load" message is shown.
- The owner publishes a valid Calendly link to an event that has been deleted or made private: Calendly shows its own "page not found" inside the widget. The site can't detect this, so checking the link is the owner's job.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Booking page MUST show the published wording for the Hero, Two paths, Call info, Questionnaire, Calendar and What to expect sections.
- **FR-002**: Each of the Hero, Call info, Questionnaire, Calendar and What to expect sections MUST use its heading as its anchor. Without a heading, the whole section uses backup copy. With one, a blank small line or intro is hidden.
- **FR-003**: The call section MUST show the business phone number and hours from Site settings. The phone number (display text and dialling number together) falls back to the backup number when either is missing, and a blank hours line is hidden.
- **FR-004**: Form wording the form needs to work (both section labels, every field label, the button label and all four messages) MUST fall back one item at a time to backup wording, so it is never blank. Placeholders and the note under the button MUST be hidden when blank.
- **FR-005**: Published messages for a missing first name, last name or email, or an invalid email, MUST replace today's messages. What the form checks MUST stay the same.
- **FR-006**: Path cards MUST show in published order. Each card shows its icon (plus or refresh), title and description. The options card's phone option MUST open the call section, and its email option MUST open the form. The single-button card MUST show its button label in the chosen style (primary or secondary), and clicking it MUST open the scheduling view on the same page, as today.
- **FR-007**: A path card MUST be left out when it has no title, an unrecognised type, or (for an options card) no usable options. Path cards MUST fall back as a whole list: if at least one published card is usable, only published cards are shown; otherwise both backup cards are shown.
- **FR-008**: "What to expect" steps MUST show in published order. A step without a number or title is left out. Steps MUST fall back as a whole list and MUST never mix published and backup steps.
- **FR-009**: The scheduling section's "can't load" message MUST use its title as its anchor: without a title, the backup icon, title and description are used together; with one, a blank icon or description is hidden.
- **FR-010**: When the content service is unreachable, too slow, or not configured, the page MUST render every section with backup content, and the failure MUST be recorded in the server logs.
- **FR-011**: Backup content MUST be today's Booking page copy, unchanged.
- **FR-012**: The page's search and sharing title, summary and share image MUST come from the Booking page's Search & sharing fields. Each field falls back on its own to the site-wide default, and the title MUST include the business name.
- **FR-013**: The flow between sections, the scrolling to each section, the form's fields and checks, and the scheduling widget's styling and pre-filled visitor details MUST stay as they are today.
- **FR-014**: Opening the call section, form or scheduling MUST NOT fetch content again.
- **FR-015**: Backup content MUST NOT be sent to visitors' browsers except as page content.
- **FR-016**: The single-button card's published destination MUST be used as the button's link address, falling back to today's in-page scheduling address when blank. Clicking the button MUST always open the scheduling view on the same page, as today, whatever the destination.
- **FR-017**: The Booking page's Calendar tab MUST have an optional "Calendly scheduling link" field, with help text explaining that it overrides the link the developer set.
- **FR-018**: The studio MUST block publishing a scheduling link that isn't a secure (https) calendly.com address.
- **FR-019**: The scheduling widget MUST use the published studio link when it is a valid Calendly address. Otherwise it MUST use the link from the environment settings. If neither is available, it MUST show the "can't load" message.
- **FR-020**: The Booking page document's description in the studio MUST no longer say the Calendly link is set in code.

### Key Entities

- **Booking page**: the single studio document for the page. Holds the Hero, path cards, Call info, Questionnaire, Calendar and What to expect wording, and the Search & sharing values.
- **Path card**: one of the cards that start a booking path. Either an options card (a list of phone/email options) or a single-button card (button label, destination, style). Each has an icon, a title and a description.
- **Path option**: one choice on an options card: a phone or email icon and a label. The icon decides which section it opens.
- **What to expect step**: a numbered step with a number label, a title and a description. Shared with the Home page's Process section.
- **Site contact details**: the business phone (display text and dialling number) and hours, kept in Site settings.
- **Calendly scheduling link**: the address of the Calendly event visitors book. Set in the Booking page's Calendar tab, with the environment setting as the backup.
- **Backup booking content**: today's Booking page copy, used when studio content is missing or unreachable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The owner can change any wording on the Booking page and see it live on the next page load, with no developer involvement.
- **SC-002**: With the content service unreachable, 100% of Booking page loads show every section with no blank areas or errors, and a visitor can finish each of the three paths (call, email form to scheduling, book again).
- **SC-003**: With the content service unreachable, the page loads no slower than the usual content time limit plus normal render time; a visitor never waits indefinitely.
- **SC-004**: Every form field always has a visible label and every form check always has a message (0 unlabelled fields in an accessibility scan), however the content is filled in.
- **SC-005**: Opening the call section, the form or scheduling causes no additional content fetches.
- **SC-006**: On release, with no Booking page published, the page looks and behaves the same as it does today.
- **SC-007**: The owner can change the Calendly event visitors book, and the next visitor who opens scheduling sees the new event, with no developer involvement.

## Assumptions

- **Studio changes:** the new Calendly link field on the Booking page's Calendar tab, plus the updated document description. The Path card, Path option and Step types are used as they are. An optional new field needs no data migration.
- **Follow-up (2026-10-18):** the Booking draft had hidden "Slide images" without alt text left over from before COT-034, and that blocked publishing with an error the owner couldn't see or fix. Slide images and the link fields now stay hidden on pages that don't use them only while they're empty. Leftover data shows up so the owner can delete it.
- **Phone and hours come only from Site settings**, as the Booking page document's own description says. The Booking page has no phone or hours fields.
- **Form wording is editorial; the form itself is not.** The owner controls labels, placeholders, button text and messages. Which fields exist, which are required, and how they're checked stay in code (Content Ownership principle).
- **The environment setting stays as the backup.** It isn't removed, so scheduling keeps working while no Booking page is published (the situation today) and when the studio is down. Only the Calendly link becomes studio-editable. The widget's styling (colours, size, hidden cookie banner) and the pre-filled visitor details stay in code.
- **Only Calendly links are accepted**, because the scheduling widget is Calendly's and can't embed other booking services.
- **Backup copy is today's text, unchanged**, including the current scheduling "can't load" message ("Calendly scheduling widget" / "Embedded inline…"), which reads like placeholder text. Rewriting it is the owner's job in the studio.
- **Today's search listing text for Booking** (the "Book a Free Consultation…" title, description and keywords kept in the route list) is seed copy. The live listing follows the COT-030 rule: the page's own Search & sharing fields, else the site-wide default.
- **The path card icon options** ("Plus" and "Refresh") match the "+" and "↻" shown today, and the option icons ("Phone" and "Email") match today's phone and envelope icons.
- **Draft preview is out of scope**; only published content is shown.
