# Feature Specification: Services page content from the content studio

**Feature Branch**: `COT-032-services-sanity-integration`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "COT-032: Update Sanity Schema integration Services page

Description:

Integrate the updated sanity schema so that the data renders on the services page. All fallbacks must be in place.

Acceptance Criteria:

- Sanity schema is wired up to render data on the frontend for the Services page
- All fall backs are in place so that data will still render in the case of a network issue"

## Clarifications

### Session 2026-10-08

- Q: Four bundled service images exist for five backup services. Which image should the fifth service use? → A: None of the bundled ones. The backup service images are the image addresses the Services page uses today, one per service, kept unchanged. The rest of the work follows the COT-031 Home page pattern.

## Context

The content studio already has a "Services page" document with a section for each part of the Services page: Hero, About, Services, Pricing, and Search & sharing. The certification logos shown in the About section are kept in Site Settings ("About-page credential badges") so they can be reused. The live Services page doesn't read any of it. Every word, image and price on the page is hardcoded, so the site owner can't change their services or prices without a developer and a deploy.

Global content (COT-028, COT-030) and the Home page (COT-031) are already connected. This feature does the same for the Services page, following the same pattern: the live page shows what the owner publishes, and falls back to built-in backup content whenever the studio content is missing or can't be reached.

How the studio sections map to the Services page:

| Studio section | Services page section | What the owner controls |
|----------------|-----------------------|-------------------------|
| Hero | Text-only page header | Small line above the headline, headline, supporting line |
| About | Founder photo and bio | Founder photo, small line above the heading, heading, bio, signature line |
| Site Settings → About-page credential badges | Certification logos under the bio | Each logo and its label |
| Services | Alternating image-and-text service blocks | For each service: number label, heading, description, image, feature bullets, button label |
| Pricing | Pricing cards | Small line above the heading, heading, note, and for each card: small line, title, price, description, feature list, highlighted or not, button label |
| Search & sharing | Services page title, summary and share image in Google and link previews | Page title, page summary, share image |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Owner updates services and prices without a developer (Priority: P1)

The site owner opens the Services page document in the content studio, raises a price, adds a feature bullet to a service and swaps the founder photo, then publishes. The next time anyone loads the Services page, they see the new content.

**Why this priority**: This is the point of the feature. Services and prices change more often than any other copy on the site, and today every change needs a code change and a deploy.

**Independent Test**: Change one value in each Services page section in the studio, publish, reload the Services page, and confirm each change appears in the right place.

**Acceptance Scenarios**:

1. **Given** the Hero section is filled in, **When** a visitor loads the Services page, **Then** the header shows the published small line, headline and supporting line.
2. **Given** the About section is filled in, **When** the page loads, **Then** it shows the published founder photo, small line, heading, bio and signature line, on both mobile and desktop layouts.
3. **Given** Site Settings has credential badges, **When** the page loads, **Then** the About section shows each published logo with its label, in studio order.
4. **Given** the Services list has five entries, **When** the page loads, **Then** five service blocks appear in studio order, alternating image left and image right as today, each with its published number label, heading, description, image, feature bullets and button label.
5. **Given** the Pricing section is filled in, **When** the page loads, **Then** it shows the published small line, heading and note, and one card per published pricing tier in studio order, each showing only the parts that tier has (price, description, feature list, button).
6. **Given** a pricing tier is marked "Featured" in the studio, **When** the page loads, **Then** that card is highlighted; tiers not marked are not highlighted.
7. **Given** the owner adds or removes a service, feature bullet, pricing tier or credential badge and publishes, **When** the page loads, **Then** the number of items shown matches what was published.
8. **Given** an image has alt text in the studio, **When** the page loads, **Then** that image uses the published alt text.
9. **Given** the owner set a focal point (hotspot) or crop on the founder photo or a service image, **When** the image is shown, **Then** the visible part of the image respects that focal point and crop.

---

### User Story 2 - Visitors always see a complete Services page, even when the content service is down (Priority: P1)

A visitor loads the Services page while the content service is unreachable, slow, or not configured. They still see a complete Services page with every section filled in, using built-in backup content.

**Why this priority**: The acceptance criteria require it. The Services page is where visitors decide whether to book, so it must never be blank, broken or missing prices because of a network problem.

**Independent Test**: Make the content service unreachable (for example, by removing its configuration or blocking network access) and load the Services page. Every section renders with backup content, and nothing looks broken.

**Acceptance Scenarios**:

1. **Given** the content service can't be reached, **When** a visitor loads the Services page, **Then** every section renders with built-in backup content that matches today's Services page copy and prices, and the page shows no error.
2. **Given** the content service is slow to respond, **When** a visitor loads the Services page, **Then** the page stops waiting after the same short time limit used for global and Home page content and renders with backup content.
3. **Given** the content service isn't configured at all, **When** the Services page loads, **Then** it renders with backup content.
4. **Given** the Services page document has never been created or published, **When** the Services page loads, **Then** it renders with backup content.
5. **Given** backup content is in use, **When** the page loads, **Then** the founder photo and credential logos come from images bundled with the site, and each service shows the same image it shows today.

---

### User Story 3 - Partially filled content still produces a complete page (Priority: P2)

The owner fills in some Services page sections, or only some fields within a section, and publishes. Each section decides on its own whether to use published or backup content, so the page never shows a section without its heading, a service block with no picture, or an empty pricing card.

**Why this priority**: The owner will edit the studio over time and may clear or half-fill fields. Without this, a half-finished edit would leave gaps on the live page.

**Independent Test**: Publish a Services page document with the About heading and photo cleared and one service missing its image. Confirm the About section shows its backup content in full, the service without an image is dropped, the other services still show published content, and Hero and Pricing are unaffected.

**Acceptance Scenarios**:

1. **Given** a section's required content is missing (see FR-011), **When** the page loads, **Then** that section shows its backup content in full while the other sections keep using published content.
2. **Given** a section has its required content but an optional text field is empty, **When** the page loads, **Then** that field is hidden. It is not filled in with backup text.
3. **Given** a list (services, pricing tiers, credential badges, feature bullets) has at least one usable item, **When** the page loads, **Then** only the published items are shown. Backup items are not mixed in.
4. **Given** a list of services, pricing tiers or credential badges is empty, or none of its items are usable, **When** the page loads, **Then** the full backup list is shown.
5. **Given** the founder photo is missing, **When** the page loads, **Then** only the photo uses its backup; the published About text is still shown.

---

### User Story 4 - Services page has its own Google and link-preview text (Priority: P3)

The owner fills in the Services page's own "Search & sharing" fields. The Services page uses them in Google results and link previews. Fields left empty use the site-wide default from Site Settings.

**Why this priority**: COT-030 set up the site-wide default and deferred per-page values to each page's feature. It improves search and sharing, but the page works without it.

**Independent Test**: Fill in only the Services page summary, publish, and view the Services page source. The description uses the Services page summary; the title and share image use the site-wide default.

**Acceptance Scenarios**:

1. **Given** the Services page has its own title, summary and share image, **When** the Services page loads, **Then** its page title, description, social-preview title, social-preview description and social-preview image use the Services page values.
2. **Given** a Services page search & sharing field is empty, **When** the page loads, **Then** that field uses the site-wide default, one field at a time.
3. **Given** a Services page title is set, **When** the page loads, **Then** the business name is added to the end of the title exactly as on every other page, and never twice.
4. **Given** the Services page content can't be loaded, **When** the page loads, **Then** its search & sharing info is the same as the site-wide default.

---

### Edge Cases

- **Text with extra spaces**: Leading and trailing whitespace is trimmed (for example, a published button label of "Book Consultation " shows as "Book Consultation"). A field containing only spaces counts as empty.
- **Service with no image**: A service entry with no picture uploaded, or no heading, is unusable and is dropped from the list. Its number label is shown exactly as published; numbers are not renumbered.
- **Service with no feature bullets**: The service block is shown without a bullet list. Blank bullets are dropped.
- **Service with no button label**: The button is hidden for that service.
- **Pricing tier with no title**: The tier is unusable and is dropped. A tier with a title but no price, description, feature list or button shows only the parts it has, as the "Fees" card does today.
- **Credential badge with no logo**: The badge is unusable and is dropped. Badge logos are shown at a consistent height so logos of different shapes line up, whatever their original proportions.
- **Image fails to load in the browser**: Images keep today's behaviour.
- **Image missing alt text**: The image is still shown. Service images use the service heading as their description; credential logos use the badge label; the founder photo uses the signature line, or is treated as decorative if that is empty, matching how the site handles alt text today (COT-029).
- **Hero fields the page doesn't have today**: The studio's hero shape also offers slide images and a button. The Services header is text-only, so any images or button entered there are ignored.
- **Unusually many items**: All published items are shown; layout wraps as it does today. Service blocks keep alternating sides however many there are. No upper limit is enforced on the live site.
- **Draft changes**: Only published content appears on the live site. Unpublished drafts never appear.
- **Content service recovers**: The next page load after the service recovers shows published content again. No restart or deploy is needed.

## Requirements *(mandatory)*

### Functional Requirements

**Showing published content**

- **FR-001**: The Services page MUST display published content from the studio's Services page document for all four visible sections: Hero, About, Services and Pricing, plus the credential badges from Site Settings.
- **FR-002**: Every piece of text, every image, every price and every highlight setting that the studio offers for a section (see the Context table) MUST come from the studio when it has a usable value. No owner-editable text on the Services page may remain hardcoded.
- **FR-003**: Lists (services, feature bullets, pricing tiers, pricing features, credential badges) MUST appear in the order set in the studio and MUST show exactly the usable items published.
- **FR-004**: The founder photo and service images MUST respect the focal point and crop the owner set in the studio, and all studio images MUST be delivered at a size suited to where they're shown rather than at full original size.
- **FR-005**: Images MUST use the alt text entered in the studio when present.
- **FR-006**: Only published content MUST appear on the live site.
- **FR-007**: Loading the Services page MUST make at most one content request for Services page content (including the credential badges), in addition to the global content the site already loads.

**Fallbacks**

- **FR-008**: The site MUST include built-in backup content for every Services page section and for the credential badges. The backup copy and prices MUST be the Services page copy as it reads today, moved out of the components unchanged.
- **FR-009**: The backup founder photo and credential logos MUST be the images bundled with the site that the page uses today. Each backup service image MUST be the image address that service uses today, unchanged.
- **FR-010**: If Services page content can't be loaded for any reason (service unreachable, slow beyond the time limit, not configured, document missing, or unexpected response), the failure MUST be recorded in the server logs, and the Services page MUST render in full with backup content without showing an error page.
- **FR-011**: Each section MUST make its own fallback decision. A section whose required content is missing uses its backup content, while the other sections keep using published content. The sections and what each one requires are:
  - Hero (requires the headline)
  - About text (requires the heading and the bio). The founder photo falls back on its own.
  - Credential badges (require at least one badge with a logo)
  - Services (require at least one service with a heading and an image)
  - Pricing heading area (requires the heading). The pricing cards are their own section and require at least one tier with a title.
- **FR-012**: When a section uses published content, its optional text fields that are left empty MUST be hidden, not filled with backup text. A button with no label MUST be hidden.
- **FR-013**: When a list has at least one usable item, only published items MUST be shown. When it has none, the complete backup list MUST be shown. Published and backup items MUST NOT be mixed in one list. Within a published service or pricing tier, an empty bullet or feature list is hidden, not backfilled.
- **FR-014**: Service and pricing buttons MUST keep linking to the booking page, as they do today; their destinations are not editable in the studio.
- **FR-014a**: The code that reads Services page content and the backup content MUST NOT be sent to the visitor's browser.
- **FR-014b**: A failure to load Services page content MUST NOT affect the navigation, footer, or call-to-action banner, which keep their own fallback behaviour.

**Search & sharing**

- **FR-015**: The Services page MUST use its own published search & sharing title, summary and share image, field by field, falling back to the site-wide default for each empty field.
- **FR-016**: Title formatting (adding the business name, never twice) and whitespace handling MUST behave exactly as for the site-wide default (COT-030) and the Home page (COT-031).
- **FR-017**: The per-page search text for the Services page currently kept in code MUST be retired, since the Services page now gets this from the studio.

### Key Entities

- **Services page content**: one document holding the four visible sections plus search & sharing info.
- **Hero section**: small line, headline, supporting line.
- **About section**: founder photo (with alt text and focal point), small line, heading, bio, signature line.
- **Credential badge**: label and logo (with alt text). Kept in Site Settings and shared, ordered.
- **Service**: number label (e.g. "01"), heading, description, image (with alt text and focal point), ordered feature bullets, button label. Ordered.
- **Pricing section**: small line, heading, note, and an ordered list of pricing tiers.
- **Pricing tier**: small line, title, optional price, optional description, optional feature list, highlighted yes/no, optional button label.
- **Backup Services page content**: a complete copy of all of the above, built into the site, used whenever studio content is missing or can't be loaded.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The owner can change any text, image, price or highlight on the Services page and see it live after publishing, with no code change or deploy.
- **SC-002**: With the content service unavailable, 100% of Services page loads render all four sections and the credential logos with complete content and no error.
- **SC-003**: With the content service slow or unreachable, the Services page still finishes loading within about 2 seconds plus normal page load time.
- **SC-004**: With the content service unavailable, the Services page is visually indistinguishable from today's Services page.
- **SC-005**: For any combination of empty and filled fields the owner publishes, the Services page shows no empty headings, empty pricing cards, service blocks without images, broken images or dead buttons.
- **SC-006**: Sharing the Services page link, or finding it in Google, shows the Services page's own title and summary when set, and the site-wide default otherwise.

## Out of Scope

- Changing the Services page document's structure in the studio. This feature uses the schema as it is now.
- Making the service and pricing button destinations editable. They aren't in the studio today and stay pointed at the booking page.
- Wiring the Gallery and Booking pages. Each gets its own feature.
- Live preview or visual editing of drafts in the studio.

## Assumptions

- The Services page document is already published with every section filled in: Hero (text only), About (photo, text and signature), five services each with an image, three pricing tiers, and Search & sharing. Site Settings has two credential badges (checked 2026-10-08). The page must still work if any of this is ever removed, and the fallbacks cover that case.
- Published content wins over today's hardcoded values, including the highlight setting. Today the "Lead Organizer" card is highlighted in code, but it is not marked "Featured" in the studio, so after this change it will show un-highlighted until the owner ticks "Featured". Likewise the credential labels will show the longer published wording instead of today's "CPO Certified" / "NAPO Member".
- The backup service images are the image addresses the page uses today (see Clarifications). The founder photo and NAPO logos already bundled with the site are the backup About photo and credential logos. The untracked services_img_1 to services_img_4 files are not used by this feature.
- The backup copy and prices are today's hardcoded Services page copy, moved into one place.
- "Network issue" covers the content service being unreachable, timing out, returning an error, or not being configured. The time limit is the same 2-second limit global and Home page content already use.
- Fallback follows the per-section pattern set by COT-028, COT-030 and COT-031: required content per section, optional empty text hidden, lists and images falling back on their own.
- Published changes appear on the next page load, subject to the content delivery caching already used for global content (typically under a minute).
- The Services page follows the approach already agreed for connecting pages to the studio and used by the Home page.
