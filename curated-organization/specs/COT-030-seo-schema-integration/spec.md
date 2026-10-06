# Feature Specification: Plain-language SEO fields and a site-wide default

**Feature Branch**: `COT-030-seo-schema-integration`

**Created**: 2026-10-05

**Status**: Draft

**Input**: User description (rescoped 2026-10-05: the site-wide default in the root layout only; Home page wiring is deferred): "COT-030: Update Sanity Schema integration SEO

Description:

Studio label (client sees) | Help text | Field name | Tags it produces
Page title | "Shown in the browser tab and as the blue headline in Google. The business name is added automatically." | title | <title>, og:title
Page summary | "The 1–2 sentences under the headline in Google, and in link previews when the page is shared." | description | description, og:description
Share image | "The picture shown when this page's link is shared on social media or in a text message. Best size: 1200×630." | image | og:image

Changes behind that:
- Rename metaTitle → title and metaDescription → description so they match the tag names, which gives you the symmetry. Nothing reads these fields yet, so renaming now costs nothing.
- Remove keywords. Google ignores the keywords tag, and it's the most confusing field for a client.
- Show a character counter. Use a .warning() at about 60 characters for the title and 160 for the summary, instead of a hard max(), so the client knows why the text is cut off in Google.
- Make the Site Settings version clearer. Title the group "Default search & sharing", with a description like "Used on any page that doesn't have its own."
- Required fields only on the default (siteSettings.defaultSeo); per-page seo fields are optional and fall back to the default.
- Code adds " | {brandName}" to page titles (editors type only the page title).
- Add a small Google-result preview above the fields (a custom input that shows the title and summary as they'd appear in search)."

## Clarifications

### Session 2026-10-05

- Q: Site Settings' brand name is "Curated" (the nav wordmark), so a brand-name suffix would make titles end in "| Curated". Where should the suffix come from? → A: A new "Business name" field in Site Settings, not required. When it's empty, the site uses the built-in backup "Curated Organization".

## Context

Every page in the content studio has an "SEO" section, and Site Settings has a "Default SEO (site-wide fallback)" section. Both use jargon ("Meta title", "Meta description", "Keywords"), have no help text, and say nothing about where the text ends up. The site owner, who isn't technical, can't tell what each field does or why it matters.

The live site doesn't read any of these fields yet. Every page shows the same hardcoded title and description, set once in the root layout. Per-page search text also exists in code, but no page renders it.

This feature does two things. It makes the studio fields understandable, and it replaces the hardcoded root-layout text with the site-wide default from Site Settings. Wiring page-specific values (Home, Services, Gallery, Booking) is left for later features, one page at a time.

How the client's fields map to what search engines and social platforms read:

| Client sees | Where it appears | Page information it feeds |
|-------------|------------------|---------------------------|
| Page title | Browser tab; headline in Google; headline in link previews | Page title, social-preview title |
| Page summary | Text under the headline in Google; text in link previews | Page description, social-preview description |
| Share image | Picture in link previews (social media, text messages) | Social-preview image |

The client fills in each value once, and the site writes it everywhere it's needed. Technical page information that never varies by business, such as character encoding and viewport settings, stays in code and doesn't appear in the studio.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Client understands and fills in search & sharing text (Priority: P1)

The site owner opens Site Settings in the content studio. They find a "Default search & sharing" section whose field names and help text say, in plain language, where each piece of text appears. A live preview shows what a page will look like as a Google result. When text is too long, the studio warns them that Google will cut it off, but still lets them save.

**Why this priority**: The whole feature exists so a non-technical owner can manage search and sharing text with no help. If the fields stay confusing, wiring them to the site has little value.

**Independent Test**: Give the studio to someone non-technical and ask them to change the site's Google headline and summary. They should find the right fields and explain what each one does from the studio alone.

**Acceptance Scenarios**:

1. **Given** the Site Settings search & sharing section is open, **When** the owner looks at it, **Then** they see three fields labeled "Page title", "Page summary" and "Share image", each with help text saying where it appears, and no "Keywords" field.
2. **Given** the owner types a title and summary, **When** they look above the fields, **Then** a preview shaped like a Google result shows their title (with the business name added) and summary, updating as they type.
3. **Given** the owner types a title longer than about 60 characters, **When** the document is validated, **Then** a warning explains that Google may cut off the title, and the document can still be published.
4. **Given** the owner types a summary longer than about 160 characters, **Then** a similar non-blocking warning appears.
5. **Given** the owner opens Site Settings, **When** they look at the section, **Then** it's titled "Default search & sharing" and says it's used on any page that doesn't have its own.
6. **Given** the owner opens any page's search & sharing section, **Then** it has the same three fields, help text, warnings and preview, and all of its fields are optional.

---

### User Story 2 - Site-wide default drives every page's search & sharing info (Priority: P1)

The owner fills in the default title, summary and share image once in Site Settings. Every page on the live site uses these, replacing today's hardcoded text.

**Why this priority**: This removes the hardcoded site-wide text and lets the owner change what Google and link previews show without a code change or deploy.

**Independent Test**: Change the default summary in Site Settings, publish, and view the source of any page. The new summary appears in both the page description and the social-preview description.

**Acceptance Scenarios**:

1. **Given** Site Settings has a default title, summary and share image, **When** a visitor or crawler loads any page, **Then** the page's title, description, social-preview title, social-preview description and social-preview image all come from the default.
2. **Given** the default title is "Professional Home Organizing in NOVA & DMV" and the business name is "Curated Organization", **When** any page loads, **Then** the browser tab and social-preview title read "Professional Home Organizing in NOVA & DMV | Curated Organization".
3. **Given** the owner tries to publish Site Settings with the default title or summary empty, **Then** publishing is blocked with a message saying these are required.
4. **Given** the business name is empty, **When** a page loads, **Then** titles end in " | Curated Organization" (built-in backup).
5. **Given** no default share image is set, **When** a page loads, **Then** no social-preview image is output (instead of a broken one).

---

### Edge Cases

- **Business name already in the title**: If the title already contains the business name (for example, it's just "Curated Organization"), the site doesn't add it again, so the title never reads "Curated Organization | Curated Organization". The check ignores letter case.
- **Default fields empty on the live site**: Site Settings is already published without a default title or summary. Until the owner fills them in, each empty value uses the built-in backup text, one field at a time.
- **"Page not found" page**: It keeps its own title and its "don't index" instruction instead of the default, since it shouldn't appear in search or be shared.
- **Content service unavailable**: If Site Settings can't be loaded, the site uses built-in backup text (the current hardcoded title and description), so pages never go out without a title or description. This matches how other global content behaves today.
- **Text pasted with extra spaces or line breaks**: Leading and trailing whitespace is trimmed, and summary line breaks are collapsed, before output.
- **Page-level values entered early**: The owner can fill in a page's own search & sharing fields now, but the live site won't use them until that page is wired in a later feature. Until then, every page shows the default.
- **Previously entered values under old field names**: Values entered in the old "Meta title" / "Meta description" / "Keywords" fields aren't carried over (see Assumptions).
- **Very long text**: Over-length text is allowed and output in full. Search engines decide how to truncate it. The studio warning and preview show the owner what to expect.
- **Share image without alt text**: The share image keeps its existing alt text field (from COT-029), and that alt text is output with the image when present.

## Requirements *(mandatory)*

### Functional Requirements

**Content studio: search & sharing section (shared by Site Settings and every page)**

- **FR-001**: The section MUST contain exactly three client-editable fields, labeled "Page title", "Page summary" and "Share image".
- **FR-002**: Each field MUST show this help text:
  - Page title: "Shown in the browser tab and as the blue headline in Google. The business name is added automatically."
  - Page summary: "The 1–2 sentences under the headline in Google, and in link previews when the page is shared."
  - Share image: "The picture shown when this page's link is shared on social media or in a text message. Best size: 1200×630."
- **FR-003**: The "Keywords" field MUST be removed.
- **FR-004**: The stored field names MUST match the page information they feed: `title`, `description` and `image`, replacing `metaTitle`, `metaDescription` and `ogImage`. This makes the mapping from studio to page obvious to developers.
- **FR-005**: A title longer than 60 characters and a summary longer than 160 characters MUST produce a non-blocking warning that explains Google may cut the text off. There MUST be no hard maximum length.
- **FR-006**: The section MUST show a preview, above the fields, of how a page appears as a Google search result: the title with the business name added, the site address, and the summary. It MUST update as the owner types.

**Content studio: required vs optional**

- **FR-007**: On Site Settings, the default title and summary MUST be required. The default share image MUST be optional.
- **FR-008**: On individual pages, all three fields MUST be optional. A page MUST be publishable with an empty search & sharing section.
- **FR-009**: The Site Settings section MUST be titled "Default search & sharing" and described as "Used on any page that doesn't have its own."
- **FR-010**: Page-level sections MUST be titled "Search & sharing", replacing "SEO".

**Live site (root layout)**

- **FR-011**: Every page except "page not found" MUST output its title, description, social-preview title, social-preview description and (when a default image exists) social-preview image from the Site Settings default. This replaces the hardcoded values in the root layout.
- **FR-012**: The site MUST add " | {business name}" to the title, unless the title already contains the business name (ignoring case). The business name comes from a new, optional "Business name" field in Site Settings. When that field is empty, the site uses "Curated Organization".
- **FR-012a**: Site Settings MUST have a "Business name" field, separate from the nav brand name, with help text: "Your full business name, e.g. \"Curated Organization\". It's added to the end of every page title in Google and the browser tab." It MUST NOT be required.
- **FR-013**: The social-preview address MUST still be built by the site from each page's path. It is not an editable field.
- **FR-014**: Technical page information (character encoding, viewport) MUST stay out of the content studio and be output exactly once per page.
- **FR-015**: If Site Settings can't be loaded, or the default title or summary is empty, the site MUST use built-in backup text for that value.
- **FR-016**: Reading search & sharing content MUST NOT add a separate content request per page load. It MUST come with the global content the root layout already loads.

### Key Entities

- **Search & sharing info**: a reusable group with a title, a summary and a share image (with alt text). It's used once in Site Settings as the default and once on each page for future overrides.
- **Site Settings**: holds the business name (used as the title suffix; separate from the nav brand name) and the default search & sharing info.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A non-technical person can identify, from the studio alone, where each of the three fields appears, and change the site's Google headline in under 2 minutes without help.
- **SC-002**: 100% of site pages output a non-empty title and description, including when the content service is unavailable.
- **SC-003**: A change to the default title or summary appears on the live site after publishing, with no code change or deploy.
- **SC-004**: No page title on the live site contains the business name twice.
- **SC-005**: Sharing any page link on a social platform or in a messaging app shows the configured default title, summary and (if set) share image.

## Out of Scope

- Wiring page-specific search & sharing values for Home, Services, Gallery and Booking. Each page gets its own later feature, which adds per-field fallback to this default.
- Removing the unused per-page search text in the route definitions. That text is the starting content for each page's fields, so it's removed as each page is wired.

## Assumptions

- No search & sharing content has been entered yet. Verified 2026-10-05: only Site Settings exists in the dataset, and its default is empty. Renaming and removing fields needs no content migration, and any stray old values can be re-entered by hand.
- "About 60" and "about 160" characters are taken as exactly 60 and 160 for the warnings, matching common search-result display limits.
- The Google-result preview approximates Google's appearance (headline, address, summary). It isn't pixel-perfect and doesn't simulate Google's own truncation.
- The preview shows the live site's public address as the result URL.
- Page-level studio fields get the new labels, help text, warnings and optional behavior now because the section is shared, even though the live site doesn't read them yet.
- The current hardcoded site-wide title and description become the built-in backup text (FR-015).
