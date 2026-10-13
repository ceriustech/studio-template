# Feature Specification: Gallery page and portfolio pieces from the content studio

**Feature Branch**: `COT-033-gallery-sanity-integration`

**Created**: 2026-10-08

**Status**: Draft

**Input**: User description: "COT-033: Update Sanity Schema integration Gallery page

Description:

Integrate the updated sanity schema so that the data renders on the Gallery page. All fallbacks must be in place.
The 'Portfolio pieces' also need to be integrated into the gallery page as well. So, we'll have both the Gallery page and Portfolio pieces integrated into the page.

We also want to use the following URL for the fall back image data `https://plus.unsplash.com/premium_photo-1700672863747-4934c195133a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`

Acceptance Criteria:

- Sanity schema is wired up to render data on the frontend for the Gallery page
- All fall backs are in place so that data will still render in the case of a network issue"

## Context

The content studio already has a "Gallery page" document (Hero, Search & sharing) and a separate "Portfolio piece" document type, one per project. The live Gallery page doesn't read any of it: the header copy and all 18 portfolio projects are hardcoded demo content, so the site owner can't show her real work without a developer and a deploy.

Global content (COT-028, COT-030), Home (COT-031) and Services (COT-032) are already connected. This feature does the same for the Gallery page, using the same pattern: the live page shows what the owner publishes, and falls back to built-in backup content whenever studio content is missing or can't be reached.

How the studio content maps to the Gallery page:

| Studio content | Gallery page section | What the owner controls |
|----------------|----------------------|-------------------------|
| Gallery page → Hero | Text-only page header | Small line above the headline, headline, supporting line |
| Gallery page → Search & sharing | Gallery title, summary and share image in Google and link previews | Page title, page summary, share image |
| Portfolio pieces | Category sections ("All" view), single-category view with pages, and the photo/video viewer | For each project: title, category, location, description, up to two before/after videos (each with a poster image, length, optional captions and a description), and a list of photos (each with alt text, optional caption and optional higher-resolution version for the viewer) |

The category filter (Kitchen, Closet, Pantry, Office, Living space, Garage), the five-projects-per-page limit and the "View all" links stay as they are today. They're page behaviour, not editorial content.

Published content today: the Gallery page Hero and Search & sharing are filled in. No portfolio pieces are published yet.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Owner publishes real projects to the gallery (Priority: P1)

The site owner creates a portfolio piece in the studio for a recent kitchen project, with before/after videos and photos, and publishes it. The next time anyone loads the Gallery page, the project appears in the Kitchen section, in the Kitchen filter, and in the photo/video viewer.

**Why this priority**: This is the point of the feature. The gallery is the site's proof of results, and today it can only show demo projects.

**Independent Test**: Publish one complete portfolio piece, reload the Gallery page, and confirm it appears in the right category with its title, location, description, videos and photos, and that the viewer opens each one.

**Acceptance Scenarios**:

1. **Given** published portfolio pieces, **When** a visitor loads the Gallery page with "All" selected, **Then** each category with at least one published project shows a section with its newest projects (up to five) and a "View all" link when the category has more than five. Categories with no published projects are not shown.
2. **Given** a visitor selects a category, **When** the page loads, **Then** it lists that category's published projects five per page with previous/next page controls, or says "No projects in this category yet." if it has none.
3. **Given** a project with before and after videos, **When** it is shown, **Then** the before video appears first and the after video second, each with its poster image, label and length; opening one plays it in the viewer, with captions when provided.
4. **Given** a project with photos, **When** a visitor opens a photo, **Then** the viewer shows the higher-resolution version if the owner provided one, otherwise a large copy of the photo, with its caption when provided.
5. **Given** the owner set a focal point or crop on an image in the studio, **When** the image is shown, **Then** the visible framing respects it.

---

### User Story 2 - Complete gallery when the content service is down (Priority: P1)

A visitor opens the Gallery page while the content studio can't be reached. The page still shows a complete header and a full set of example projects in every category, so it never looks broken or empty.

**Why this priority**: The ticket requires all fallbacks to be in place. The gallery is a key conversion page and must never render blank.

**Independent Test**: Make the content service unreachable, load the Gallery page and switch through every category; confirm every section, photo, video and viewer works.

**Acceptance Scenarios**:

1. **Given** the content service is unreachable, slow past the usual limit, or not configured, **When** a visitor loads the Gallery page, **Then** the header shows today's copy ("YOUR TRANSFORMATION" / "See the difference" / "Real spaces, Real results. From Dysfunction to Function.") and every category shows today's example projects with their titles, locations and descriptions.
2. **Given** backup projects are shown, **Then** every backup photo and every video poster uses the backup image supplied in the ticket, and the before/after videos still play.
3. **Given** the content service is reachable but has no usable portfolio pieces, **When** the page loads, **Then** the backup projects are shown as in scenario 1.
4. **Given** the content service is unreachable, **When** the page is shared or indexed, **Then** the site-wide default title, summary and share image are used.

---

### User Story 3 - Owner updates the gallery header and search listing (Priority: P2)

The owner edits the Gallery page header text and its Search & sharing fields and publishes. The header and the page's Google/link-preview listing update.

**Why this priority**: Useful but low-frequency; the header and listing change rarely compared with projects.

**Independent Test**: Change the headline and the page title in the studio, publish, reload, and confirm both changes.

**Acceptance Scenarios**:

1. **Given** the Hero has a headline, **When** the page loads, **Then** the header shows the published small line, headline and supporting line; a blank small line or supporting line is hidden rather than replaced.
2. **Given** the Hero has no headline, **When** the page loads, **Then** the whole header uses its backup copy.
3. **Given** Search & sharing values are published, **When** the page is shared or indexed, **Then** the title reads "{page title} | {business name}", and each blank field (title, summary, share image) uses the site-wide default.

---

### User Story 4 - Partially filled projects never look broken (Priority: P3)

The owner saves a project without some details. The gallery shows what is complete and quietly leaves out what isn't.

**Why this priority**: The studio already requires most project fields, so incomplete projects are uncommon, but they must not break the layout.

**Independent Test**: Publish projects with different missing fields and confirm each behaves as below.

**Acceptance Scenarios**:

1. **Given** a project has no title, an unrecognised category, or no usable photo or video, **When** the page loads, **Then** that project is left out.
2. **Given** a project has no location or no description, **Then** that line is hidden.
3. **Given** a video is missing its file, poster image, before/after label or length, **Then** that video is left out and the rest of the project still shows.
4. **Given** a project has two "before" (or two "after") videos, **Then** only the first of each is shown.
5. **Given** a photo has no alt text, **Then** its caption is used as the description, or "{project title} photo {n}" if it has no caption either.

### Edge Cases

- The Gallery page document is deleted but portfolio pieces exist: the header uses backup copy, search listing uses site defaults, and the published projects still show.
- Some categories have published projects and others don't: only published projects show; backup projects never fill the gaps.
- A visitor requests a page number beyond the last page: they see the last page, as today.
- Switching category or page only changes the filter; the visitor doesn't wait for content to be fetched again.
- A project has only videos or only photos: it shows whichever it has.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Gallery page MUST show the published Gallery page header (small line, headline, supporting line).
- **FR-002**: The header MUST use its headline as its anchor: without a headline the whole header uses backup copy; with one, blank optional lines are hidden.
- **FR-003**: The Gallery page MUST show all published portfolio pieces, newest first, grouped by their category in both the "All" view and the single-category view.
- **FR-004**: Each shown project MUST display its title, category, location (when present), description (when present), up to one before and one after video (before first), and its photos.
- **FR-005**: A project MUST be left out when it has no title, an unrecognised category, or neither a usable photo nor a usable video.
- **FR-006**: Portfolio projects MUST fall back as a whole list: if at least one published project is usable, only published projects are shown; otherwise the backup projects are shown. Published and backup projects MUST never be mixed.
- **FR-007**: Backup projects MUST keep today's titles, categories, locations, descriptions, alt text, captions and before/after videos, and MUST use the backup image from the ticket for every photo and video poster.
- **FR-008**: When the content service is unreachable, too slow, or not configured, the page MUST render the full backup header and backup projects, and the failure MUST be recorded in the server logs.
- **FR-009**: Images from the studio MUST respect the owner's crop and focal point, and the viewer MUST use the owner's higher-resolution override when one is provided.
- **FR-010**: Photos MUST have a text description: the owner's alt text, else the caption, else "{project title} photo {n}". Videos MUST have a description: the owner's, else "{project title} — Before/After".
- **FR-011**: The page's search and sharing title, summary and share image MUST come from the Gallery page's Search & sharing fields, each falling back on its own to the site-wide default; the title MUST include the business name.
- **FR-012**: Changing category or page MUST NOT refetch content.
- **FR-013**: Backup content MUST NOT be sent to visitors' browsers except as the rendered page content.
- **FR-014**: The category list, page size, filter, pagination, "View all" links and viewer behaviour MUST stay as they are today.

### Key Entities

- **Gallery page**: the single studio document for the page. Holds the header (small line, headline, supporting line) and the Search & sharing values (title, summary, share image).
- **Portfolio piece**: one project. Title, category (one of six), location, description, up to two before/after videos, and an ordered list of photos.
- **Before/after video**: a video file with poster image, before/after label, length in seconds, optional captions file and a description.
- **Photo**: an image with alt text, optional caption and optional higher-resolution version for the viewer.
- **Backup gallery content**: built-in header copy and 18 example projects across all six categories, used when studio content is missing or unreachable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The owner can publish a new project and see it on the live Gallery page on the next page load, with no developer involvement.
- **SC-002**: With the content service unreachable, 100% of Gallery page loads show the header and projects in all six categories, with no blank sections, broken images or errors.
- **SC-003**: With the content service unreachable, the page loads no slower than the usual content time limit plus normal render time; a visitor never waits indefinitely.
- **SC-004**: Every photo and video on the page has a text description (0 missing alt texts in an accessibility scan).
- **SC-005**: Switching between categories and pages causes no additional content fetches.
- **SC-006**: On release, the Gallery page's browser tab and search listing show "Gallery | Curated Organization" and the published summary.

## Assumptions

- **Portfolio fallback replaces the earlier empty-state plan.** The COT-028 architecture agreed an empty state for portfolio pieces when the studio is unreachable. This ticket asks for all fallbacks so data still renders and supplies a fallback image, so backup projects are shown instead. *Confirm this is intended.*
- **The supplied image is used for every backup photo and poster**, so all backup projects will look visually identical apart from their text. The backup before/after video files are kept.
- **No published projects exist today**, so on release visitors will see the backup projects (with the new image) until the owner publishes her first project.
- **Ordering is newest first.** The studio has no manual ordering field for portfolio pieces; adding one would be a studio change outside this ticket.
- **Videos are served as the studio stores them today** (uploaded files with a separate poster image). Moving video hosting is out of scope.
- **No studio changes.** The Gallery page and Portfolio piece types are used as they are; the category list in the page mirrors the studio's list.
- **The header image carousel field is not used.** The Gallery header is text-only today and stays that way.
- **Draft preview is out of scope**; only published content is shown.
