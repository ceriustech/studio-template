# Feature Specification: Alt text for every CMS image

**Feature Branch**: `COT-029-image-alt-text`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "COT-029: Update Sanity Schema

Description:

Update all Sanity schema so that every image field has an 'alt' that can be used to hydrate the alt attribute data for all images across the site.

Acceptance Criteria:

- The sanity schema will have an 'alt' field for all images that can be used to update the data for that attribute across the entire site."

## Context

Today, some images in the content studio have an alt text field and some don't. Images without one can't get a meaningful description from the CMS, so the site either hardcodes the description or shows none. People using screen readers then hear nothing useful, and search engines get less context.

Current state of image fields in the content studio:

| Where the image appears | Has alt text today? |
|-------------------------|---------------------|
| Gallery / before-after images (shared "Image" object) | Yes |
| Home page service cards | Yes |
| Services page offering items | Yes |
| Video poster frames (alt set on the video) | Yes |
| Hero section carousel images | **No** |
| Services page founder photo | **No** |
| Site CTA background image | No — decorative, stays without alt text |
| Site logo | **No** |
| Credential / association badge logos | **No** (has a label only) |
| Social share image (SEO) | **No** |
| Gallery full-resolution lightbox override | **No** (shares its parent image's alt) |

## Clarifications

### Session 2026-09-28

- Q: Required or optional alt text? → A: Required on every meaningful image. Decorative images get no alt field in the schema; their components hardcode `alt=""`.
- Q: Schema-only, or also update connected site sections? → A: Schema only.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Editor adds alt text to any image (Priority: P1)

A content editor uploads or changes any image in the content studio. Right next to the image, they see an "Alt text" field with short guidance on what to write. They fill it in and publish.

**Why this priority**: This is the whole ticket. Without the field, there's nothing for the site to show.

**Independent Test**: Open each document type in the studio that has an image. Confirm every image has an alt text field and that the value saves and publishes.

**Acceptance Scenarios**:

1. **Given** an editor is editing the Services page, **When** they view the founder photo, **Then** an alt text field is shown with that image.
2. **Given** an editor is editing a hero section, **When** they add a carousel image, **Then** each carousel image has its own alt text field.
3. **Given** an editor enters alt text and publishes, **When** the published content is read by the site, **Then** the alt text is returned with that image.

---

### User Story 2 - Editor is stopped from publishing a meaningful image without a description (Priority: P2)

An editor adds an image that carries meaning (a photo, a logo) but forgets the alt text. The studio flags the missing field before publishing.

**Why this priority**: A field that's easy to skip will get skipped. Validation is what makes alt text actually present on the live site.

**Independent Test**: Add an image with no alt text and try to publish. Confirm the studio shows the rule in [FR-004](#functional-requirements).

**Acceptance Scenarios**:

1. **Given** an image with no alt text, **When** the editor tries to publish, **Then** the studio responds as defined in FR-004.
2. **Given** an editor is editing the site CTA background image, **When** they view it, **Then** no alt text field is shown and publishing succeeds.

---

### User Story 3 - Alt text is ready for the site to use (Priority: P3)

When the site fetches content from the CMS, each meaningful image comes with its alt text. Later page tickets use this to set the image descriptions visitors get.

**Why this priority**: This is what makes the new field useful to visitors. Showing it on the site is out of scope here (see [FR-007](#functional-requirements)), but the data must be available.

**Independent Test**: Fetch published content for each document type with a meaningful image. Confirm each image returns its alt text.

**Acceptance Scenarios**:

1. **Given** the site logo has alt text in the studio, **When** the site fetches site settings, **Then** the logo's alt text can be read with it.

---

### Edge Cases

- **Existing content**: Images that already have alt text must keep it. No editor should have to re-enter it.
- **Existing images without alt text**: After this change, published images with no alt text may fail the new validation the next time an editor opens them. They stay live until then.
- **Gallery lightbox override**: The full-resolution override shows the same picture as its parent, so it reuses the parent's alt text instead of needing a second field.
- **Decorative images**: The site CTA background sits behind text and adds no information, so it has no alt text field. Its component hardcodes `alt=""` so screen readers skip it. The slot is only ever used for decorative images.
- **Video poster frames**: The alt text on the video already describes the poster. No second field is added.
- **Social share image**: Social platforms read a separate description tag. The alt text for this image feeds that tag, not an on-page image.
- **Credential badges**: They already have a label (e.g. "NAPO Member"). Alt text is still required (FR-004), but the label may be offered as a starting value so editors don't type the same thing twice.
- **Very long alt text**: Descriptions longer than about 125 characters are cut off by some screen readers. The studio warns but does not block.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every meaningful image field in the content studio MUST have an alt text field. Exceptions: the site CTA background (decorative) and the gallery lightbox override and video poster (they reuse their parent's alt text). See Edge Cases.
- **FR-002**: Alt text MUST use one consistent pattern, in field name, label and placement, across all image fields, so the site reads it the same way everywhere.
- **FR-003**: Each alt text field MUST show brief guidance to editors (describe what the image shows; leave out "image of").
- **FR-004**: Alt text MUST be required to publish on every image that has an alt text field. The schema MUST NOT include a "decorative" option.
- **FR-005**: Alt text already entered on existing content MUST be preserved with no data loss.
- **FR-006**: The studio MUST warn (not block) when alt text is longer than 125 characters.
- **FR-007**: This ticket changes the content studio only. Site components and queries MUST NOT be changed to show the new alt text; that happens in later page tickets. Existing site pages MUST keep working as they do today.
- **FR-008**: The generated content types used by the site MUST include the new alt text fields once type generation is set up. That setup is a separate ticket, as in COT-028.

### Key Entities

- **Image with alt text**: An uploaded image plus a short text description of what it shows.
- **Image locations**: The 11 places listed in the Context table. 5 need a new alt text field: hero carousel, founder photo, logo, credential badges and social share image. The other 6 either have alt text already, reuse a parent's, or are decorative.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of meaningful image fields in the content studio have an alt text field or explicitly reuse a parent's alt text.
- **SC-002**: 0 existing alt text values are lost after the change.
- **SC-003**: An editor can add alt text to any image without leaving the image's editing panel.
- **SC-004**: Every meaningful image returned from the CMS includes its alt text value.
- **SC-005**: 0 visible changes on the live site after this ticket ships (schema-only).
- **SC-006**: An editor cannot publish empty alt text on any image that has an alt text field.

## Assumptions

- "All images" means images managed in the content studio. Images hardcoded in the site's code are out of scope.
- Alt text is single-language. The site has no localization.
- 125 characters is used as the soft length limit, following common accessibility guidance.
- The lightbox override and video poster don't need their own alt text because they show the same subject as their parent.
- Existing sibling alt text fields may be moved into the image itself if that gives one consistent pattern (FR-002), but only with a migration that preserves values (FR-005).
- Pages other than the global sections (Home, Services, Gallery, Booking) aren't connected to the CMS yet. They will read alt text when their own connection tickets are done.
- The site CTA background is the only decorative image. All other images carry meaning (photos, logos, badges, the social share preview).
- Decorative images are handled in code, not the schema: their components hardcode `alt=""`. This is done in the page tickets, not this one.
- The video poster being an uploaded image conflicts with the project rule that posters are generated from the video. That's out of scope here and doesn't change this ticket.
