# Feature Specification: Connect global components to Sanity

**Feature Branch**: `COT-028-global-sanity-content`

**Created**: 2026-09-27

**Status**: Draft

**Input**: User description: "COT-028: Connect global components to Sanity

Description:
The global components (Navigation, Footer and the site CTA) currently hardcode their content. This ticket makes them render content from the `siteSettings` and `siteCta` documents in Sanity, and falls back to static content when Sanity can't be reached.

This is the first frontend Sanity ticket, so it also adds the shared setup that later page tickets will reuse: the Sanity client, an image URL helper and the environment config.

Approach (agreed architecture):
- Add `@sanity/client`, `groq` and `@sanity/image-url` to the app.
- Add one server-only client at `app/lib/sanity/client.server.ts`. It reads SANITY_PROJECT_ID and SANITY_DATASET from the environment, pins `apiVersion`, sets `useCdn: true` and uses the `published` perspective.
- Add a `urlFor` helper in `app/lib/sanity/` so images keep the crop and hotspot editors set.
- Add a root loader in `app/root.tsx` that fetches `siteSettings` and `siteCta` in one GROQ query, converts them to the component prop types, and falls back to static content for each section.
- Keep rendering in `Layout` and read the data with `useRouteLoaderData('root')`, so Nav and Footer still show on error and 404 pages.
- Add `shouldRevalidate` returning false on the root, so global content isn't refetched on every navigation.
- Replace the pathname check that switches between the CTA and What to Expect with a route `handle` (e.g. `hideSiteCta`) read through `useMatches()`.

Acceptance Criteria:
Setup
- `@sanity/client`, `groq` and `@sanity/image-url` are installed in the app (not only in `studio/`).
- `.env.example` lists SANITY_PROJECT_ID and SANITY_DATASET, and `.env` stays gitignored.
- The Sanity client and fallback modules are server-only (`*.server.ts`), and a production build confirms they are not in the browser bundle.

Root loader
- One query returns `siteSettings` and `siteCta` together.
- If the fetch throws, the error is logged and every global section renders its static fallback. The site does not show an error page.
- If a document exists but a required field is empty (e.g. `brandName`, `siteCta.heading`), that section uses its fallback and the other sections still use CMS data.
- Fallback content is today's hardcoded copy, moved into a `fallback.server.ts`.
- Global content is not refetched on client-side navigation.

Navigation
- The brand name, tagline and logo come from `siteSettings`, with the current local assets as the fallback.
- Nav links render from `siteSettings.navLinks` in the order set in Studio, and replace `NAVBAR_DATA`.
- The \"Book now\" label comes from `siteSettings.bookNowLabel`.
- The active-link state, mobile menu and existing accessibility attributes behave exactly as they do now.

Footer
- The brand description, credential logos (with alt text), connect links, hours and copyright text come from `siteSettings`.
- The \"Navigate\" column renders from `siteSettings.navLinks` instead of hardcoded links.
- No placeholder `href=\"#\"` links render when the CMS provides URLs.

Site CTA
- The background image, heading, subheading, button label and button link come from `siteCta`.
- The background image goes through `urlFor`, so the editor's crop and hotspot apply.
- The CTA is hidden on routes whose `handle` sets `hideSiteCta` (Booking), and What to Expect shows there as it does today.

Verification
- `typecheck` and the production build pass.
- Manually tested with populated Sanity documents, with an empty dataset and with an invalid project ID. All three render a complete layout.

Out of scope:
- What to Expect content. It lives on `bookingPage`, so it belongs in the Booking ticket; this ticket only changes how it gets shown or hidden.
- Route registration and page SEO meta (`PAGE_ROUTES_DATA`).
- TypeGen. Hand-written CMS types are fine until that ticket."

## Clarifications

### Session 2026-09-27

- Q: Should a nav link to the Booking page be hidden from the link list, or shown like any other link? → A: Hide it in the header, where "Book now" covers it, but show it in the footer "Navigate" column. This is the default recommendation, applied when `/speckit-plan` ran with the question open; the owner can revise it.
- Q: When the footer falls back to built-in content, should the `#` placeholder links render? → A: No. The fallback leaves out links without a real destination. This is the default recommendation, applied the same way; the owner can revise it.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Editor updates site-wide content without a deploy (Priority: P1)

As the site owner, I want to change the navigation, footer and call-to-action content in the content studio, publish it, and see it on every page of the live site, so that routine copy, link and image changes don't need a developer or a code release.

**Why this priority**: This is the reason the ticket exists. Navigation, Footer and the CTA appear on every page, so they are the highest-value content to hand over to the editor, and they prove the content connection works before any page-level ticket builds on it.

**Independent Test**: In the content studio, change the brand tagline, reorder two navigation links, edit the copyright text, and replace the CTA heading and background image. Publish. Load any page of the site in a fresh browser session and confirm all four changes appear.

**Acceptance Scenarios**:

1. **Given** the Site settings document is published with a brand name, tagline and logo, **When** a visitor loads any page, **Then** the header shows that brand name, tagline and logo.
2. **Given** the Site settings document lists navigation links in a particular order, **When** a visitor loads any page, **Then** the header's links and the footer's "Navigate" column show those links in that same order, each pointing to its configured destination.
3. **Given** the editor adds a new navigation link and publishes, **When** a visitor next loads the site, **Then** the new link appears in both the header and the footer without any code change.
4. **Given** the Site settings document has a "Book now" label, **When** a visitor loads any page, **Then** the header's booking button shows that label.
5. **Given** the Site settings document has a footer description, credential logos, connect links, hours and copyright text, **When** a visitor loads any page, **Then** the footer shows all of them, and every credential logo has alternative text.
6. **Given** the Site CTA document is published with a background image, heading, subheading, button label and button destination, **When** a visitor loads a page that shows the CTA, **Then** the CTA shows that content, and the background image respects the crop and focal point the editor set.

---

### User Story 2 - Visitors always see a complete layout, even when content can't be loaded (Priority: P1)

As a visitor, I want the header, footer and call-to-action to always appear and work, even when the content service is down, misconfigured or not yet populated, so that I can still navigate the site and book a consultation.

**Why this priority**: The header and footer are on every page. If their content failure broke the page, one outage in the content service would take down the entire site, which is worse than showing slightly stale copy. It shares top priority with User Story 1 because shipping Story 1 without it would make the whole site depend on the content service being up.

**Independent Test**: Run the site three ways: with the content service unreachable (for example an invalid project ID), with an empty content dataset, and with Site settings published but its brand name left blank. In every case, load several pages and confirm the header, footer and CTA render in full, links work, and no error page appears.

**Acceptance Scenarios**:

1. **Given** the content service cannot be reached, **When** a visitor loads any page, **Then** the header, footer and CTA render using today's built-in content, the page itself renders normally, and the failure is recorded in the server logs.
2. **Given** the content dataset is empty (no Site settings or Site CTA document exists), **When** a visitor loads any page, **Then** every global section renders using today's built-in content.
3. **Given** Site settings exists but its brand name is blank, **When** a visitor loads any page, **Then** the header's brand area uses the built-in brand content, while the other global sections still show the editor's published content.
4. **Given** Site CTA exists but its heading is blank, **When** a visitor loads a page that shows the CTA, **Then** the CTA uses its built-in content, while the header and footer still show the editor's published content.
5. **Given** a page's own content fails and the site shows its error or "not found" page, **When** that page renders, **Then** the header and footer still appear on it.

---

### User Story 3 - The Booking page shows What to Expect instead of the CTA (Priority: P2)

As a visitor on the Booking page, I want to see the "What to Expect" section at the bottom of the page instead of a "Book a consultation" banner, so that I'm not asked to book again on the page where I'm already booking.

**Why this priority**: This behavior already exists today. This ticket changes how it is decided, so the story confirms nothing regresses. It is independently testable by visiting two pages.

**Independent Test**: Load the Home page and confirm the CTA appears above the footer. Load the Booking page and confirm the CTA is absent and the "What to Expect" section appears in its place.

**Acceptance Scenarios**:

1. **Given** a visitor is on any page other than Booking, **When** the page renders, **Then** the site CTA appears above the footer and "What to Expect" does not.
2. **Given** a visitor is on the Booking page, **When** the page renders, **Then** the site CTA is not shown and the "What to Expect" section appears above the footer.
3. **Given** a visitor moves between the Booking page and another page within the site, **When** each page renders, **Then** the CTA and "What to Expect" swap correctly each time.

---

### User Story 4 - Navigation keeps working exactly as it does today (Priority: P2)

As a visitor, I want the header navigation to look and behave the same as before, including the highlighted current page, the mobile menu and keyboard and screen-reader support, so that moving the content into the CMS doesn't make the site harder to use.

**Why this priority**: Navigation is used on every visit. This story guards against regressions introduced by switching the links' source; it adds no new behavior.

**Independent Test**: With navigation links coming from the content studio, visit each page and confirm the matching link is highlighted. On a phone-width screen, open and close the mobile menu, select a link, and confirm the menu closes. Tab through the header using only the keyboard.

**Acceptance Scenarios**:

1. **Given** a visitor is on a page, **When** the header renders, **Then** the link for that page is visually highlighted and announced to assistive technology as the current page, as it is today.
2. **Given** a visitor is on a phone-width screen, **When** they open the menu, select a link, tap outside the menu, or widen the screen past the tablet breakpoint, **Then** the menu opens and closes exactly as it does today.
3. **Given** a visitor uses only the keyboard, **When** they tab through the header, **Then** every link and the menu toggle can be reached and activated, with a visible focus indicator.

---

### Edge Cases

- **Configuration missing entirely**: if the content-service settings are absent from the server environment, the site behaves as if the service were unreachable. It renders every global section from built-in content and logs the problem; the server does not crash or refuse to start.
- **Slow content service**: if the content service responds slowly, the page waits no longer than a short, fixed limit before rendering with built-in content, so a slow service can't stall every page.
- **Empty lists**: if the editor leaves a list empty (navigation links, connect links, hours or credential logos), that list uses its built-in content. It never renders as an empty column or an empty nav bar.
- **Incomplete list items**: a navigation or connect link missing its label or destination is left out, and the remaining valid items still render. If no valid items remain, the list uses its built-in content.
- **Missing images**: if the logo or the CTA background image is not set, that image falls back to today's built-in image while the rest of the section keeps the editor's content.
- **Editor publishes mid-visit**: a visitor who is already browsing keeps seeing the global content that loaded with their first page until they do a full page load. Moving between pages within the site does not refetch it.
- **Unpublished drafts**: content that is saved but not published in the studio never appears on the live site.
- **External or unusual destinations**: navigation and footer links whose destination is a full web address, `mailto:` or `tel:` link open that destination correctly. Internal paths navigate within the site.
- **Duplicate booking link**: if the editor's navigation links include the Booking page, the header hides it from its link list, and "Book now" stays the header's only booking entry, as today. The footer's "Navigate" column still shows it (see FR-012a).
- **Placeholder links in built-in content**: today's footer connect links point nowhere (`#`). The built-in fallback leaves out any link without a real destination, so visitors never see links that go nowhere (see FR-018a).

## Requirements *(mandatory)*

### Functional Requirements

**Content source**

- **FR-001**: The header, footer and site CTA MUST display content from the published Site settings and Site CTA documents in the content studio.
- **FR-002**: Content that is saved but not published MUST never appear on the live site.
- **FR-003**: Global content for a visit MUST be retrieved in a single request to the content service when a page is first loaded, and MUST NOT be requested again when the visitor moves between pages within the site.
- **FR-004**: The settings needed to reach the content service MUST be supplied through server configuration. The expected settings MUST be documented for developers in an example configuration file, and the real configuration file MUST stay out of version control.
- **FR-005**: The content-service settings, the code that talks to the content service, and the built-in fallback content MUST NOT be sent to the visitor's browser.
- **FR-006**: The content connection and the image-sizing helper introduced here MUST be shared, so later page features can reuse them without creating their own.

**Fallback behavior**

- **FR-007**: If the content service cannot be reached, errors, or is not configured, the system MUST record the failure in the server logs and render every global section with built-in content. The visitor MUST NOT see an error page because of it.
- **FR-008**: Each global section MUST make its own fallback decision. A section whose required content is missing uses its built-in content while the other sections keep using published content. The sections and the fields each one requires are:
  - Header brand (requires the brand name)
  - Navigation links (requires at least one valid link)
  - "Book now" label (requires the label)
  - Footer description
  - Footer credential logos (requires at least one logo with an image)
  - Footer connect links and footer hours (each requires at least one valid item)
  - Copyright text
  - Site CTA (requires a heading and a button label; the background image is optional and falls back on its own)
- **FR-009**: Built-in fallback content MUST be the content the site shows today, moved out of the components unchanged.
- **FR-010**: The header and footer MUST still appear on the site's error and "not found" pages.

**Navigation**

- **FR-011**: The header MUST show the brand name, tagline and logo from Site settings, falling back to today's brand text and logo image.
- **FR-012**: The header MUST render navigation links from Site settings in the order the editor set, replacing the hardcoded link list.
- **FR-012a**: A navigation link whose destination is the Booking page MUST be left out of the header's link list, because the "Book now" button already covers it. The same link MUST still appear in the footer's "Navigate" column.
- **FR-013**: The header's booking button MUST show the "Book now" label from Site settings and MUST continue to link to the Booking page.
- **FR-014**: The current-page highlight, mobile menu behavior (open, close on link selection, close on outside tap, close when the screen widens past the tablet breakpoint) and existing accessibility attributes MUST behave exactly as they do today.

**Footer**

- **FR-015**: The footer MUST show the brand description, credential logos, connect links, hours and copyright text from Site settings.
- **FR-016**: Every credential logo MUST have alternative text, using the logo's alt text from Site settings, or the credential's label when alt text is empty.
- **FR-017**: The footer's "Navigate" column MUST render from its own footer link list in Site settings (`footerNavLinks`), replacing its hardcoded links. *Revised after release: it originally shared the header's navigation links.*
- **FR-018**: When Site settings provides a destination for a link, the rendered link MUST use that destination. No placeholder `#` link may render for content that came from the studio.
- **FR-018a**: Built-in fallback content MUST leave out any link that has no real destination (today's `#` placeholders). If that leaves a fallback list empty, its column is not rendered.
- **FR-019**: Footer hours MUST render as plain text, not as links.

**Site CTA**

- **FR-020**: The site CTA MUST show the background image, heading, subheading, button label and button destination from Site CTA.
- **FR-021**: The CTA background image MUST respect the crop and focal point the editor set in the studio, and MUST be delivered at a size suited to the banner rather than the original upload size.
- **FR-022**: Whether the CTA is shown MUST be decided by a setting each page declares for itself, not by comparing the page's address. The Booking page MUST declare that the CTA is hidden, and "What to Expect" MUST appear there in its place, as it does today.

### Key Entities

- **Site settings**: The single, site-wide document holding brand identity (name, tagline, logo), the "Book now" label, the ordered navigation links, and footer content (description, credential logos, connect links, hours, copyright). Shared by the header and footer on every page.
- **Site CTA**: The single, site-wide call-to-action banner: background image, heading, subheading, button label and button destination. Shown on every page that does not opt out.
- **Navigation link**: A label and a destination (an internal path or an external address). One ordered list drives both the header links and the footer's "Navigate" column.
- **Built-in fallback content**: The copy, links and images the site shows today. It is used per section whenever published content is unavailable or incomplete.
- **Page CTA setting**: A per-page declaration of whether the site CTA is hidden on that page. Only the Booking page sets it today.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An editor can change any header, footer or CTA text, link or image and see it live on the site within 5 minutes of publishing, with no code change or deployment.
- **SC-002**: 100% of page loads render a complete header, footer and CTA (or What to Expect on Booking) in each of three conditions: content fully published, content dataset empty, and content service unreachable.
- **SC-003**: 0 error pages are shown to visitors as a result of the content service being unreachable, empty or partially filled in.
- **SC-004**: When the content service is unreachable or slow, pages still render within 3 seconds.
- **SC-005**: Moving between pages within the site makes 0 additional requests for global content after the first page load.
- **SC-006**: 0 links whose content came from the studio render with a placeholder `#` destination.
- **SC-007**: Header behavior shows 0 regressions against today's site: current-page highlight, mobile menu open/close rules, keyboard access and screen-reader labels all pass the same checks they pass now.
- **SC-008**: 0 content-service settings or fallback content appear in the code sent to visitors' browsers, as confirmed by inspecting a production build.

## Assumptions

- **Agreed architecture**: The technical approach listed in the input (server-only content client, shared image helper, root-level loading, rendering kept in the outer layout, a per-page setting for hiding the CTA, and no refetching on in-site navigation) was agreed before this spec. It is recorded in the input and will be detailed in the plan rather than restated here as requirements.
- **Constitution exceptions**: This ticket knowingly departs from the project constitution in two places, and both need to be logged as approved exceptions in the plan's Complexity Tracking:
  - Principle III requires generated content types and forbids hand-written ones; the ticket defers type generation to its own ticket.
  - Principle III names a public-safe `client.ts`, while this ticket's client is server-only.
- **Existing schema**: The Site settings and Site CTA document types already exist in the studio. The Site settings fields are brand name, tagline, logo, "Book now" label, navigation links, footer description, footer logos, connect links, footer hours and copyright. This ticket makes no schema changes.
- **Credential logo alt text**: COT-029 added a required `alt` field to every credential logo. The footer uses it, and falls back to the credential's label for content published before COT-029.
- **Link labels render as entered**: Navigation link labels render exactly as the editor types them. Today's code reformats all-caps labels (for example "HOME" to "Home"); that reformatting is dropped, because the editor now controls the text directly. Fallback labels keep today's displayed casing.
- **Footer Navigate column changes slightly**: It currently lists Services, Gallery and "Book", and omits Home. It will now show the same links as the header, which is the intended outcome of sharing one list.
- **Freshness**: A visitor sees newly published global content on their next full page load. Content may take a short time to propagate through the content service's cache, which SC-001's 5-minute window allows for.
- **Slow-service limit**: Treating a slow content service as unreachable after a short, fixed wait is a reasonable default. The exact limit is an implementation detail for the plan.
- **Out of scope**: What to Expect's content (it moves with the Booking page ticket), route registration and page-level SEO metadata, content type generation, editor preview of drafts, and the location of the global components within the codebase.
