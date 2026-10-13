# Feature Specification: Content studio cleanup for page headers and portfolio pieces

**Feature Branch**: `COT-034-studio-schema-cleanup`

**Created**: 2026-10-13

**Status**: Draft

**Input**: User description: "COT-034: Studio schema cleanup — hide hero slide images and link fields on Services, Gallery and Booking; remove the portfolio piece Slug field.

Description:

1. The Services, Gallery and Booking page documents show 'Slide images' and 'Link/button label' (and its destination) fields on their Hero. They are unnecessary on those pages and will confuse the client. They share the hero type with the Home page, which needs them (Home hero uses slide images and a link; the Home intro uses a link), so hide these fields everywhere except the Home page rather than removing them from the shared type. No data migration. Also hide 'Slide images' on the Home intro, whose own help text says no images are needed.
2. Remove the 'Slug' field from the Portfolio piece schema. The Gallery lives at /gallery and filters with ?category=, so portfolio pieces don't need their own URLs.

Acceptance Criteria:

- Services, Gallery and Booking hero sections in Studio show only the small line, heading and body
- Home hero still shows slide images and link fields; Home intro shows the link but not slide images
- Portfolio piece documents no longer have a Slug field
- No data migration; the live site is unaffected"

**Follow-up input (2026-10-13)**: "Another thing that I'm noticing that we don't need is the duration field. We should be getting the video duration from the uploaded video itself because you probably won't know how long it is. The other field is the Full-resolution override field because there will never be a case when the image and it's thumbnail won't match."

## Clarifications

### Session 2026-10-13

- Q: Once the Duration field is gone, where does the video length shown on each video panel come from? → A: It's read from the video itself in the visitor's browser. No field, no Studio step, and it works for backup videos too. The length badge appears a moment after the page loads.
- Q: Should removing Duration and Full-resolution override be a separate ticket? → A: No. Fold it into COT-034.
- Q: Are "Poster focal offset" and "Captions (.vtt)" needed on before/after videos? → A: No. Remove both as part of COT-034.

## Context

Every page document in the content studio uses the same "Hero section" building block: small line, heading, body, slide images, and a link/button label with its destination. Only the Home page needs all of it. The live Services, Gallery and Booking headers are text-only, so the extra fields there do nothing and invite the owner to fill in content that never appears.

Portfolio pieces also ask for a "Slug" (a web address for each project). Projects don't have their own pages; the Gallery shows them all at one address and filters by category, so the field serves no purpose and is currently required, which adds a pointless step to every new project.

Portfolio videos also ask for a "Duration" in seconds. The owner can't reasonably know it, and it's already contained in the uploaded video file. Portfolio photos ask for a "Full-resolution override" for the pop-up viewer, but the viewer always shows the same photo as the thumbnail, just larger. Videos also ask for a "Poster focal offset", which the site never uses, and an optional "Captions (.vtt)" file, which the owner doesn't need for silent before/after footage. All four fields add work and invite mistakes.

Where each hero field should appear after this change:

| Studio location | Small line | Heading | Body | Slide images | Link/button label & destination |
|-----------------|:---:|:---:|:---:|:---:|:---:|
| Home page → Hero | ✓ | ✓ | ✓ | ✓ | ✓ |
| Home page → Intro | ✓ | ✓ | ✓ | hidden | ✓ |
| Services page → Hero | ✓ | ✓ | ✓ | hidden | hidden |
| Gallery page → Hero | ✓ | ✓ | ✓ | hidden | hidden |
| Booking page → Hero | ✓ | ✓ | ✓ | hidden | hidden |

The link destination keeps its existing rule of only appearing once a link label is entered.

Portfolio piece fields after this change:

| Item | Fields the owner fills in |
|------|---------------------------|
| Portfolio piece | Title, Category, Location, Description, Before/after videos, Images (**no Slug**) |
| Before/after video | Video file, Poster image, Before/after, Alt/description text (**no Duration, Poster focal offset or Captions**) |
| Image | Image (with alt text), Caption (**no Full-resolution override**) |

Published content today (checked 2026-10-13): Services and Gallery heroes have no slide images or link; there is no published Booking page; the Home hero has 3 slide images and a link; the Home intro has a link and no images; no published portfolio piece has a slug.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Owner edits page headers without irrelevant fields (Priority: P1)

The site owner opens the Services, Gallery or Booking page in the content studio and edits the header. She sees only the small line, heading and body, which are exactly the parts the live header shows.

**Why this priority**: This is the confusion the owner would hit most often and the main reason for the ticket.

**Independent Test**: Open each of the three page documents' Hero tab and confirm only three fields are shown; open the Home page and confirm its Hero and Intro are unchanged apart from the Intro's slide images.

**Acceptance Scenarios**:

1. **Given** the owner opens the Services, Gallery or Booking page, **When** she views the Hero, **Then** she sees the small line, heading and body, and no slide images, link/button label or link destination fields.
2. **Given** the owner opens the Home page, **When** she views the Hero, **Then** slide images and the link/button label (and its destination once a label is entered) are still available and show their current content.
3. **Given** the owner opens the Home page, **When** she views the Intro, **Then** the link/button label and destination are available and slide images are not shown.
4. **Given** any of these pages is published after the change, **Then** the live site shows the same header content as before.

---

### User Story 2 - Owner adds a portfolio project without a slug (Priority: P1)

The owner creates a new portfolio piece. She is not asked for a slug and can publish once the remaining required details are filled in.

**Why this priority**: The slug is currently required, so every new project carries an extra, meaningless step; removing it directly affects the owner's first projects.

**Independent Test**: Create and publish a new portfolio piece with title, category, location and one image, and confirm no slug field appears and publishing succeeds.

**Acceptance Scenarios**:

1. **Given** the owner creates a portfolio piece, **When** the form opens, **Then** there is no Slug field.
2. **Given** a portfolio piece with title, category, location and at least one image, **When** the owner publishes, **Then** publishing is not blocked by any missing slug.
3. **Given** a published portfolio piece, **When** a visitor opens the Gallery, **Then** it appears and filters exactly as before.

---

### User Story 3 - Owner adds videos and photos without technical details (Priority: P2)

The owner uploads before/after videos and photos to a portfolio piece. She isn't asked how long each video is or for a second "full-resolution" copy of each photo. Visitors still see each video's length on its panel, and photos still open large and sharp in the viewer.

**Why this priority**: No portfolio pieces exist yet, so this removes friction before the owner's first projects. It's lower than P1 because these fields only appear deep inside a project.

**Independent Test**: In the studio, add a video and a photo to a portfolio piece and confirm neither field appears. On the Gallery page, confirm each video panel shows the correct length and each photo opens sharp in the viewer.

**Acceptance Scenarios**:

1. **Given** the owner adds a before/after video, **When** the form opens, **Then** there are no Duration, Poster focal offset or Captions fields, and the video can be published without them.
2. **Given** the owner adds a photo, **When** the form opens, **Then** there is no Full-resolution override field.
3. **Given** a project with videos, **When** a visitor views it on the Gallery page, **Then** each video panel shows the video's actual length (for example "0:09"), shortly after the page appears.
4. **Given** a video whose length can't be read (for example, the file fails to load), **When** a visitor views it, **Then** the panel shows no length badge and everything else works.
5. **Given** a project with photos, **When** a visitor opens a photo in the viewer, **Then** a larger, sharp copy of the same photo is shown.
6. **Given** the backup projects are shown (content service down), **Then** their video panels also show each backup video's actual length.

### Edge Cases

- A Services, Gallery or Booking hero already holds slide images or a link (for example, an unpublished draft): the content is left untouched and simply not shown in the editing form; the live site never displayed it, so nothing changes for visitors.
- A portfolio piece draft already has a slug entered: the studio may show it as an unrecognised leftover value that the owner can clear; it has no effect on the site.
- A Booking page document is created for the first time: its Hero shows only the three text fields from the start.
- The owner duplicates the Home page or another page: each copy shows the fields appropriate to its page type.
- A video or photo saved before this change already has a duration or override value: the value is ignored. The site uses the video's real length and the photo itself.
- A visitor's browser blocks or delays loading video information: the length badge stays hidden. Nothing else is affected.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Hero of the Services, Gallery and Booking page documents MUST show only the small line, heading and body fields.
- **FR-002**: The Home page Hero MUST continue to show slide images and the link/button label, with the destination appearing once a label is entered.
- **FR-003**: The Home page Intro MUST continue to show the link/button label and destination and MUST NOT show slide images.
- **FR-004**: Hiding fields MUST NOT delete, alter or move any existing content; no content migration is performed.
- **FR-005**: The Portfolio piece document MUST NOT have a Slug field, and publishing a portfolio piece MUST NOT require one.
- **FR-006**: All other Hero and Portfolio piece fields, their labels, help text and required rules MUST stay as they are.
- **FR-007**: The live website MUST render identically before and after this change, except for the video length badge described in FR-011.
- **FR-008**: The help text on the Hero section building block MUST no longer suggest leaving images or the link empty on pages where those fields are hidden.
- **FR-009**: The before/after video item MUST NOT have a Duration field, and saving or publishing a video MUST NOT require one.
- **FR-010**: The portfolio image item MUST NOT have a Full-resolution override field.
- **FR-011**: Each video panel on the Gallery page MUST show the length read from the video itself, in the existing m:ss format, once it's known. It shows no badge when the length can't be read. A video MUST NOT be left out of the Gallery for lacking a length.
- **FR-012**: Reading a video's length MUST NOT download the whole video.
- **FR-013**: The photo viewer MUST show a larger copy of the same photo as its thumbnail, respecting the owner's crop and focal point as before.
- **FR-014**: The before/after video item MUST NOT have Poster focal offset or Captions (.vtt) fields, and the Gallery MUST NOT read them. Each video keeps its accessible description (Alt/description text) in the panel and the viewer.

### Key Entities

- **Hero section**: the shared page-header building block (small line, heading, body, slide images, link/button label and destination), used by the Home Hero, Home Intro, and the Services, Gallery and Booking Heroes.
- **Portfolio piece**: one gallery project (title, category, location, description, before/after videos, photos); loses its Slug.
- **Before/after video**: video file, poster image, before/after label, description; loses its Duration, Poster focal offset and Captions.
- **Portfolio image**: image with alt text and caption; loses its Full-resolution override.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The Services, Gallery and Booking Hero forms each show exactly 3 fields (down from 5 today, or 6 once a link label is entered).
- **SC-002**: The Home Hero shows all 5 fields (6 once a link label is entered); the Home Intro shows 4 fields (5 once a link label is entered).
- **SC-003**: A new portfolio piece can be published with one fewer required field than today.
- **SC-004**: 0 visible differences on the live Home, Services, Gallery and Booking pages before vs. after release, apart from the video length badge appearing once its length is known.
- **SC-005**: 0 content documents are changed by the release.
- **SC-006**: A before/after video form shows 4 fields instead of 7 (one fewer required), and a photo form shows one fewer field.
- **SC-007**: 100% of video panels whose video loads show a length matching the actual video, to the nearest second.

## Assumptions

- **Hide rather than remove.** The slide images and link fields stay part of the shared Hero building block because the Home page needs them; giving the other pages a separate building block would require migrating their saved content, which this ticket rules out.
- **Hidden fields keep any existing values.** Since no published Services, Gallery or Booking hero has images or a link, there is nothing to clean up; any draft values are harmless and invisible.
- **Website code changes are limited to the Gallery page.** The live site never reads the slug, and the Services and Gallery pages don't read hero images or links. The Booking page isn't connected to the studio yet; when it is, it will read only the three text fields. The Gallery stops reading Duration and Full-resolution override, and measures video length in the browser.
- **Existing Duration values are ignored, not migrated.** Three portfolio pieces were published later on 2026-10-13, and all six of their videos have a Duration typed in. The site stops reading it; the Studio shows it as a leftover unknown field the owner can clear. Three of those six values didn't match the real video length (for example 10 entered for a 0:19 video), which shows why the length should come from the file. No piece uses Full-resolution override.
- **Field labels stay as named in the studio today** ("Slide images", "Link/button label", "Link/button destination").
- **Captions aren't needed for accessibility here.** The before/after videos are silent walkthroughs. Each keeps its description (Alt/description text) as the accessible name in the panel and the viewer, which satisfies the constitution's "accessible label" rule for video. If narrated videos are added later, captions would need to come back.
- **No published video uses Poster focal offset or Captions** (checked 2026-10-13, 3 pieces, 6 videos).
- **Out of scope**: other unused fields elsewhere in the studio, and moving video hosting.
