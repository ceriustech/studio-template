# Feature Specification: Home page content from the content studio

**Feature Branch**: `COT-031-home-sanity-integration`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "COT-031: Update Sanity Schema integration Home page

Description:

Integrate the updated sanity schema so that the data renders on the home page. All fallbacks must be in place.

Acceptance Criteria:

- Sanity schema is wired up to render data on the frontend for the Home page
- All fall backs are in place so that data will still render in the case of a network issue"

## Clarifications

### Session 2026-10-08

- Q: How should fallbacks behave when Home page content is partly filled in? → A: Follow the pattern COT-028 and COT-030 set. Each section makes its own fallback decision based on its required fields. A section with its required content shows published content, and its optional fields that are left empty are hidden. Images and lists fall back on their own. Search & sharing falls back field by field to the site-wide default.

## Context

The content studio already has a "Home page" document with a section for each part of the Home page: Hero, Intro, Services teaser, Process, Before/after, Testimonials, and Search & sharing. The live Home page doesn't read any of it. Every word, image and link on the page is hardcoded, so the site owner can't change the Home page without a developer and a deploy.

Global content (navigation, footer, call-to-action banner and the site-wide search & sharing default) was connected in COT-028 and COT-030. This feature does the same for the Home page, following the same pattern: the live page shows what the owner publishes, and falls back to built-in backup content whenever the studio content is missing or can't be reached.

How the studio sections map to the Home page:

| Studio section | Home page section | What the owner controls |
|----------------|-------------------|-------------------------|
| Hero | Full-screen hero with rotating images | Small line above the headline, headline, supporting line, slide images, button label and destination |
| Intro | "Our approach" text block | Small line above the heading, heading, body text, link label and destination |
| Services teaser | Three service cards | Small line above the heading, heading, cards (title, description, image), link label and destination |
| Process | Numbered "How it works" steps | Small line above the heading, heading, steps (number, title, description) |
| Before/after | Side-by-side transformation photos | Small line above the heading, heading, before image, after image, caption, link label and destination |
| Testimonials | Rotating client quotes | Quote, client name, client location, star rating |
| Search & sharing | Home page title, summary and share image in Google and link previews | Page title, page summary, share image |

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Owner updates Home page content without a developer (Priority: P1)

The site owner opens the Home page document in the content studio, changes the hero headline, swaps a service card image and adds a new testimonial, then publishes. The next time anyone loads the Home page, they see the new content.

**Why this priority**: This is the point of the feature. The Home page is the most-visited page, and today every change to it needs a code change and a deploy.

**Independent Test**: Change one value in each Home page section in the studio, publish, reload the Home page, and confirm each change appears in the right place.

**Acceptance Scenarios**:

1. **Given** the Home page document has hero content, **When** a visitor loads the Home page, **Then** the hero shows the published small line, headline, supporting line, button label and button destination, and rotates through the published slide images in the order they appear in the studio.
2. **Given** the Intro section is filled in, **When** the page loads, **Then** the intro shows the published small line, heading, body and link.
3. **Given** the Services teaser has three cards, **When** the page loads, **Then** three cards appear in studio order, each with its published title, description and image, and the section shows the published heading and "view all" link.
4. **Given** the Process section has four steps, **When** the page loads, **Then** four steps appear in studio order with their published numbers, titles and descriptions.
5. **Given** the Before/after section is filled in, **When** the page loads, **Then** it shows the published before and after images, caption, heading and link.
6. **Given** the Testimonials list has entries, **When** the page loads, **Then** the testimonial carousel cycles through the published quotes in studio order, each with its client name, location and star rating.
7. **Given** the owner adds or removes a testimonial, service card, process step or slide image and publishes, **When** the page loads, **Then** the number of items shown matches what was published.
8. **Given** an image has alt text in the studio, **When** the page loads, **Then** that image uses the published alt text.
9. **Given** the owner set a focal point (hotspot) or crop on an image, **When** the image is shown, **Then** the visible part of the image respects that focal point and crop.

---

### User Story 2 - Visitors always see a complete Home page, even when the content service is down (Priority: P1)

A visitor loads the Home page while the content service is unreachable, slow, or not configured. They still see a complete, good-looking Home page with every section filled in, using built-in backup content.

**Why this priority**: The acceptance criteria require it. The Home page is the first impression for most visitors, so it must never be blank, broken or half-rendered because of a network problem.

**Independent Test**: Make the content service unreachable (for example, by removing its configuration or blocking network access) and load the Home page. Every section renders with backup content, and nothing looks broken.

**Acceptance Scenarios**:

1. **Given** the content service can't be reached, **When** a visitor loads the Home page, **Then** every section renders with built-in backup content that matches today's Home page copy, and the page shows no error.
2. **Given** the content service is slow to respond, **When** a visitor loads the Home page, **Then** the page stops waiting after the same short time limit used for global content and renders with backup content.
3. **Given** the content service isn't configured at all, **When** the Home page loads, **Then** it renders with backup content.
4. **Given** the Home page document has never been created or published, **When** the Home page loads, **Then** it renders with backup content.
5. **Given** backup content is in use, **When** the hero and service card images load, **Then** they (and the before/after images) come from images bundled with the site, so they don't depend on any outside image service.

---

### User Story 3 - Partially filled content still produces a complete page (Priority: P2)

The owner fills in some Home page sections, or only some fields within a section, and publishes. Each section decides on its own whether to use published or backup content, so the page never shows a section without its heading, empty cards, or broken links.

**Why this priority**: The owner is likely to fill in the studio gradually. Without this, publishing a half-finished document would leave gaps on the live page.

**Independent Test**: Publish a Home page document that fills in only the hero headline and one testimonial. Confirm the hero shows the new headline with no small line, supporting line or button (those were left empty), the hero still rotates the backup slide images, the testimonial carousel shows only the new testimonial, and every other section shows backup content.

**Acceptance Scenarios**:

1. **Given** a section's required content is missing (see FR-011), **When** the page loads, **Then** that section shows its backup content in full while the other sections keep using published content.
2. **Given** a section has its required content but an optional text field is empty, **When** the page loads, **Then** that field is hidden. It is not filled in with backup text.
3. **Given** a list (slide images, service cards, process steps or testimonials) has at least one usable item, **When** the page loads, **Then** only the published items are shown. Backup items are not mixed in.
4. **Given** a list is empty, or none of its items are usable, **When** the page loads, **Then** the full backup list is shown.
5. **Given** a before or after image is missing, **When** the page loads, **Then** only that image uses its backup.
6. **Given** a link has a label but its destination is missing or isn't a valid address, **When** the page loads, **Then** the link uses its backup destination.

---

### User Story 4 - Home page has its own Google and link-preview text (Priority: P3)

The owner fills in the Home page's own "Search & sharing" fields. The Home page uses them in Google results and link previews. Fields left empty use the site-wide default from Site Settings.

**Why this priority**: COT-030 set up the site-wide default and deferred per-page values to each page's feature. It improves search and sharing, but the page works without it.

**Independent Test**: Fill in only the Home page summary, publish, and view the Home page source. The description uses the Home page summary; the title and share image use the site-wide default.

**Acceptance Scenarios**:

1. **Given** the Home page has its own title, summary and share image, **When** the Home page loads, **Then** its page title, description, social-preview title, social-preview description and social-preview image use the Home page values.
2. **Given** a Home page search & sharing field is empty, **When** the page loads, **Then** that field uses the site-wide default, one field at a time.
3. **Given** a Home page title is set, **When** the page loads, **Then** the business name is added to the end of the title exactly as on every other page, and never twice.
4. **Given** the Home page content can't be loaded, **When** the page loads, **Then** its search & sharing info is the same as the site-wide default.

---

### Edge Cases

- **Text with extra spaces**: Leading and trailing whitespace is trimmed. A field containing only spaces counts as empty.
- **Image with no file**: A slide image, card image, or before/after image entry that has no picture uploaded is treated as unusable. A service card with no usable image or no title is dropped from the list.
- **Image fails to load in the browser**: The before/after section keeps its existing "image unavailable" placeholder. Other images keep today's behaviour.
- **Image missing alt text**: The image is still shown. Service card images use the card title as their description; other images are treated as decorative, matching how the site handles alt text today (COT-029).
- **Only one hero slide image**: The hero shows that image without rotating.
- **Only one testimonial**: The carousel shows it and hides the previous/next buttons, as it does today.
- **Star rating missing or out of range**: The testimonial shows 5 stars.
- **Testimonial without a location**: The attribution shows the client name only, with no trailing comma.
- **Process steps count**: The connector line between steps appears between every pair of steps, however many steps are published.
- **Unusually many items**: All published items are shown; layout wraps as it does today. No upper limit is enforced on the live site.
- **Fields in the studio that the page doesn't have today**: The hero "slide images" are used by the Home hero. The Intro section reuses the hero shape in the studio; any images entered there are ignored, as the studio help text already says.
- **Draft changes**: Only published content appears on the live site. Unpublished drafts never appear.
- **Content service recovers**: The next page load after the service recovers shows published content again. No restart or deploy is needed.

## Requirements *(mandatory)*

### Functional Requirements

**Showing published content**

- **FR-001**: The Home page MUST display published content from the studio's Home page document for all six visible sections: Hero, Intro, Services teaser, Process, Before/after, and Testimonials.
- **FR-002**: Every piece of text, every image, and every link destination that the studio offers for a section (see the Context table) MUST come from the studio when it has a usable value. No owner-editable text on the Home page may remain hardcoded.
- **FR-003**: Lists (hero slide images, service cards, process steps, testimonials) MUST appear in the order set in the studio and MUST show exactly the usable items published.
- **FR-004**: Images MUST respect the focal point and crop the owner set in the studio, and MUST be delivered at a size suited to where they're shown rather than at full original size.
- **FR-005**: Images MUST use the alt text entered in the studio when present.
- **FR-006**: Only published content MUST appear on the live site.
- **FR-007**: Loading the Home page MUST make at most one content request for Home page content, in addition to the global content the site already loads.

**Fallbacks**

- **FR-008**: The site MUST include built-in backup content for every Home page section. The backup copy MUST be the Home page copy as it reads today, moved out of the components unchanged.
- **FR-009**: Backup hero slide images, service card images and before/after images MUST be images bundled with the site, not images from an outside service.
- **FR-010**: If Home page content can't be loaded for any reason (service unreachable, slow beyond the time limit, not configured, document missing, or unexpected response), the failure MUST be recorded in the server logs, and the Home page MUST render in full with backup content without showing an error page.
- **FR-011**: Each section MUST make its own fallback decision. A section whose required content is missing uses its backup content, while the other sections keep using published content. The sections and what each one requires are:
  - Hero text (requires the headline). The slide images are their own section and require at least one usable image.
  - Intro (requires the heading)
  - Services teaser heading area (requires the heading). The service cards are their own section and require at least one card with a title and an image.
  - Process heading area (requires the heading). The steps are their own section and require at least one step with a number and a title.
  - Before/after (requires the heading). The before image and the after image each fall back on their own.
  - Testimonials (requires at least one testimonial with a quote and a client name)
- **FR-012**: When a section uses published content, its optional text fields that are left empty MUST be hidden, not filled with backup text. A link or button with no label MUST be hidden.
- **FR-013**: When a list has at least one usable item, only published items MUST be shown. When it has none, the complete backup list MUST be shown. Published and backup items MUST NOT be mixed in one list.
- **FR-014**: A link destination MUST be used only if it is an internal path or a full web, email or phone address. Otherwise a labelled link MUST use its backup destination.
- **FR-014a**: The code that reads Home page content and the backup content MUST NOT be sent to the visitor's browser.
- **FR-014b**: A failure to load Home page content MUST NOT affect the navigation, footer, or call-to-action banner, which keep their own fallback behaviour.

**Search & sharing**

- **FR-015**: The Home page MUST use its own published search & sharing title, summary and share image, field by field, falling back to the site-wide default for each empty field.
- **FR-016**: Title formatting (adding the business name, never twice) and whitespace handling MUST behave exactly as for the site-wide default (COT-030).
- **FR-017**: The unused per-page search text for the Home page currently kept in code MUST be retired, since the Home page now gets this from the studio.

### Key Entities

- **Home page content**: one document holding the six visible sections plus search & sharing info. Each section has a small line above its heading, a heading, and section-specific content.
- **Hero section**: small line, headline, supporting line, ordered slide images (each with alt text and focal point), button label and destination.
- **Service card**: title, description, image with alt text. The teaser holds an ordered list of these plus a heading and "view all" link.
- **Process step**: display number (e.g. "01"), title, description. Ordered.
- **Before/after**: before image, after image (each with alt text), caption, heading, link.
- **Testimonial**: quote, client name, optional client location, star rating from 1 to 5. Ordered.
- **Backup Home page content**: a complete copy of all of the above, built into the site, used whenever studio content is missing or can't be loaded.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The owner can change any text, image or link on the Home page and see it live after publishing, with no code change or deploy.
- **SC-002**: With the content service unavailable, 100% of Home page loads render all six sections with complete content and no error.
- **SC-003**: With the content service slow or unreachable, the Home page still finishes loading within about 2 seconds plus normal page load time.
- **SC-004**: With the content service unavailable, the Home page is visually indistinguishable from today's Home page apart from bundled backup images replacing today's stock images.
- **SC-005**: For any combination of empty and filled fields the owner publishes, the Home page shows no empty headings, empty cards, broken images (other than the existing "image unavailable" placeholder) or dead links.
- **SC-006**: Sharing the Home page link, or finding it in Google, shows the Home page's own title and summary when set, and the site-wide default otherwise.

## Out of Scope

- Changing the Home page document's structure in the studio. This feature uses the schema as it is now.
- Entering real content into the studio. The owner (or a separate task) fills in the Home page document; until then the live page shows backup content.
- Wiring the Services, Gallery and Booking pages. Each gets its own feature.
- Live preview or visual editing of drafts in the studio.
- Making the service card link destination or the "Before"/"After" labels editable. They aren't in the studio today and stay fixed.

## Assumptions

- The Home page document is already published, with Hero, Intro, Services teaser and Process filled in. Before/after, Testimonials and Search & sharing are empty (checked 2026-10-08). Those sections show backup content until the owner fills them in. The page must still work if the document is ever missing, and the fallbacks cover that case.
- The bundled images recently added to the project are the intended backup images: three hero slide images, three service card images, and a before and an after image. The before/after section keeps its existing "image unavailable" placeholder for when an image fails to load.
- The backup copy is today's hardcoded Home page copy, moved into one place, including the current placeholder testimonial.
- "Network issue" covers the content service being unreachable, timing out, returning an error, or not being configured. The time limit is the same 2-second limit global content already uses.
- Fallback follows the per-section pattern set by COT-028 and COT-030 (see Clarifications). This avoids a page that mixes published and placeholder copy within one section.
- Published changes appear on the next page load, subject to the content delivery caching already used for global content (typically under a minute).
- The Home page follows the approach already agreed for connecting pages to the studio, so later pages can reuse it.
