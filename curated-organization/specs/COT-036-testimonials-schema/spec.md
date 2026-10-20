# Feature Specification: Testimonials as their own content studio section

**Feature Branch**: `COT-036-testimonials-schema`

**Created**: 2026-10-19

**Status**: Draft

**Input**: User description: "COT-036: Update Sanity Schema So That 'Testimonials' sits at the same level as 'Portfolio pieces'

Description:

Update the testimonials schema so that it sits as the same level as the portfolio pieces schema.

Acceptance Criteria:

- The Testimonials schema sits at the same level as pages, portfolio pieces, site settings, and site cta
- Sanity schema is wired up to render data on the frontend on the Home page
- All fall backs are in place so that data will still render in the case of a network issue"

## Context

Today the content studio's top level shows **Pages**, **Portfolio pieces**, **Site settings** and **Site CTA**. Testimonials aren't there. They live inside the Home page document, on its "Testimonials" tab, as a list. To add or change a client quote, the owner has to know to open Pages → Home → Testimonials.

Portfolio pieces work differently: each project is its own entry under a top-level "Portfolio pieces" item, and the owner can add, edit or delete one without opening any page. Testimonials are the same kind of content (a growing collection of client items, not page copy), so they should be managed the same way.

The Home page testimonial carousel already reads from the studio and falls back to backup quotes when it can't. This change moves where the quotes come from, not how they're shown.

Published content today (checked 2026-10-19): the Home page holds 3 testimonials (the "Client name" placeholder, Sarah M. and James T.), all rated 5. No separate testimonial entries exist yet. All three client names were saved with a leading "— " and a trailing ",", for example "— Sarah M.,". The carousel adds its own dash and comma, so the live site currently shows "— — Sarah M.,, McLean, VA".

Studio top level after this change. Testimonials is a top-level item of its own, a sibling of Portfolio pieces, not nested inside it:

| Order | Item | Kind |
|-------|------|------|
| 1 | Pages (Home, Services, Gallery, Booking) | Folder of single pages |
| — | divider | |
| 2 | Portfolio pieces | Collection |
| — | divider | |
| 3 | **Testimonials** | **Collection (new)** |
| — | divider | |
| 4 | Site settings | Single document |
| 5 | Site CTA | Single document |

## Clarifications

### Session 2026-10-19

- Q: Is the Rating field needed? → A: No. Every testimonial is always shown with 5 stars, so the field is removed and existing ratings aren't carried over.
- Q: Does Testimonials sit inside or grouped under Portfolio pieces? → A: No. It's its own top-level item at the same level as Pages, Portfolio pieces, Site settings and Site CTA.
- Q: Should the existing 3 testimonials be carried over, or re-entered by the owner? → A (default taken): Carried over automatically as separate testimonial entries, so the live Home page doesn't change content on release.
- Q: In what order does the Home carousel show testimonials? → A (default taken): Newest first, the same rule the Gallery uses for portfolio pieces. The carried-over three keep their current order.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Owner manages testimonials from the top level (Priority: P1)

The owner opens the content studio and sees "Testimonials" as its own top-level item, alongside Pages, Portfolio pieces, Site settings and Site CTA. She opens it, sees every testimonial as its own entry, and can add, edit, or delete one without opening the Home page.

**Why this priority**: This is the ticket's main ask: testimonials become a first-class collection the owner can find without knowing which page holds them.

**Independent Test**: Open the studio, confirm "Testimonials" appears as its own top-level item (not inside Portfolio pieces or Pages), create a new testimonial with a quote and client name, and publish it.

**Acceptance Scenarios**:

1. **Given** the owner opens the content studio, **When** the top-level list loads, **Then** "Testimonials" appears as its own top-level item, separated by dividers, at the same level as Pages, Portfolio pieces, Site settings and Site CTA, and is not repeated anywhere else in the list.
2. **Given** the owner opens Portfolio pieces, **When** the list loads, **Then** it contains only portfolio pieces and no testimonials.
3. **Given** the owner opens Testimonials, **When** the list loads, **Then** each testimonial is listed by client name with its location underneath.
4. **Given** the owner creates a testimonial, **When** she fills in the quote and client name, **Then** she can publish it. Location stays optional, and there is no Rating field.
5. **Given** the owner leaves the quote or client name empty, **When** she tries to publish, **Then** publishing is blocked with a message naming the missing field.
6. **Given** the owner opens the Home page, **When** she looks through its tabs, **Then** there is no Testimonials tab any more.

---

### User Story 2 - Visitors see the owner's testimonials on the Home page (Priority: P1)

A visitor opens the Home page and the testimonial carousel shows the testimonials the owner has published in the Testimonials collection.

**Why this priority**: Moving the quotes is pointless if the Home page doesn't show them. Equal priority to Story 1 because together they're the minimum releasable change.

**Independent Test**: Publish a new testimonial, reload the Home page, and confirm it's the first one shown in the carousel; delete it and confirm it disappears.

**Acceptance Scenarios**:

1. **Given** published testimonials exist, **When** a visitor opens the Home page, **Then** the carousel shows each one's quote, client name and location (when given) under 5 stars, newest first.
2. **Given** the owner publishes a new testimonial, **When** a visitor next loads the Home page, **Then** it appears as the first slide.
3. **Given** the owner deletes or unpublishes a testimonial, **When** a visitor next loads the Home page, **Then** it no longer appears.
4. **Given** a testimonial without a location, **When** it's shown, **Then** only "— Client name" appears, with no trailing comma.
5. **Given** only one testimonial is shown, **Then** the previous/next arrows are hidden, as today.

---

### User Story 3 - Existing testimonials carry over and the Home page keeps working when content can't load (Priority: P1)

On release, the three testimonials the owner already entered appear as separate entries in the new collection, and the live carousel shows the same quotes as before (with the doubled dash and comma fixed). If the content service can't be reached, or there are no usable testimonials, visitors still see the backup testimonials.

**Why this priority**: The acceptance criteria require fallbacks, and losing the owner's existing quotes or showing an empty section would be a visible regression.

**Independent Test**: After release, confirm the Testimonials collection holds the 3 existing quotes and the Home carousel shows them. Then simulate an outage (or point the site at an empty collection) and confirm the backup testimonials appear.

**Acceptance Scenarios**:

1. **Given** the release has run, **When** the owner opens Testimonials, **Then** she sees the three existing testimonials with the same quotes and locations, and client names without the stray leading "— " or trailing ",".
2. **Given** the release has run, **When** a visitor opens the Home page, **Then** the carousel shows the same three quotes in the same order as before, with the attribution reading "— Sarah M., McLean, VA" (single dash, single comma).
3. **Given** the content service is unreachable or errors, **When** a visitor opens the Home page, **Then** the carousel shows the backup testimonials and the rest of the page behaves as it does today.
4. **Given** the collection is empty, or every testimonial in it is missing a quote or client name, **When** a visitor opens the Home page, **Then** the carousel shows the backup testimonials.
5. **Given** some testimonials are usable and others aren't, **When** a visitor opens the Home page, **Then** only the usable ones are shown, and backup testimonials are not mixed in.
6. **Given** the testimonials load but the Home page document itself is missing, **When** a visitor opens the Home page, **Then** the owner's testimonials are still shown alongside the backup page copy.

### Edge Cases

- A testimonial saved with an old rating value: the value is ignored, and it's shown with 5 stars like every other.
- A client name or quote is only spaces: treated as empty, so that testimonial is skipped.
- A client name typed with its own leading dash or trailing comma (as the old data was): the studio's help text tells the owner the site adds these. Nothing strips them automatically on the site.
- The Home page document still holds its old testimonials list after release: the site ignores it, and the studio no longer shows it.
- The owner creates many testimonials: all published ones are shown in the carousel; no limit is introduced.
- A testimonial is saved as a draft but not published: visitors don't see it.
- Two testimonials are published at the same moment: their order is stable between page loads.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Testimonials MUST be their own content type, with one entry per testimonial, managed from a top-level "Testimonials" item in the content studio.
- **FR-002**: "Testimonials" MUST be its own top-level item in the studio, at the same level as Pages, Portfolio pieces, Site settings and Site CTA, in its own divider-separated section after Portfolio pieces. It MUST NOT be nested inside Portfolio pieces or Pages, and MUST appear only once in the top-level list.
- **FR-003**: Each testimonial MUST have Quote (required), Client name (required) and Client location (optional), with today's labels and rules. There MUST be no Rating field.
- **FR-004**: The Client name field MUST carry help text telling the owner to enter the name only, because the site adds the dash and comma.
- **FR-005**: Each testimonial MUST be listed in the studio by client name, with location as the secondary line.
- **FR-006**: The Home page document MUST NOT show a Testimonials tab or field.
- **FR-007**: The Home page carousel MUST show every published testimonial that has a quote and client name, newest first, with a stable order when two share the same creation time.
- **FR-008**: The three testimonials currently stored on the Home page MUST be carried over as separate published testimonial entries, keeping their quote, location and current display order (ratings are not carried over), with the stray leading "— " and trailing "," removed from client names.
- **FR-009**: The carry-over MUST be safe to run more than once without creating duplicates, and MUST NOT change any other Home page content.
- **FR-010**: If the content service is unreachable, errors, or is not configured, the Home page MUST show the backup testimonials.
- **FR-011**: If no published testimonial has both a quote and client name, the Home page MUST show the backup testimonials. CMS and backup testimonials MUST never be mixed.
- **FR-012**: Testimonials MUST fall back independently of the rest of the Home page: a missing Home page document doesn't hide the owner's testimonials, and missing testimonials don't affect other Home sections.
- **FR-013**: Fallback events MUST be logged on the server, as other Home sections are today.
- **FR-014**: Every testimonial MUST display with 5 stars, announced to screen readers as "5 out of 5 stars".
- **FR-015**: The carousel's appearance and behaviour (stars, quote, attribution, arrows, live-region announcements) MUST otherwise stay as they are today.

### Key Entities

- **Testimonial**: one client quote. Quote, client name, optional client location. No rating. Now a standalone entry instead of an item inside the Home page.
- **Home page**: the Home page's editable copy. Loses its Testimonials list; all other sections are unchanged.
- **Backup testimonials**: the fixed set of quotes the site shows when no usable testimonials can be loaded. Unchanged.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The owner can reach the testimonials list in 1 click from the studio's top level (down from 3: Pages → Home → Testimonials tab).
- **SC-002**: The owner can add and publish a new testimonial in under 1 minute, and it appears on the Home page on the next page load.
- **SC-003**: 3 of 3 existing testimonials are present in the new collection after release, with 0 lost.
- **SC-004**: After release, the Home carousel shows the same 3 quotes in the same order as before, and 0 attributions show a doubled dash or comma.
- **SC-005**: With the content service unavailable, 100% of Home page loads still show a working testimonial carousel.
- **SC-006**: 0 visible changes to any other Home page section, or any other page, before vs. after release.

## Assumptions

- **"Same level as Portfolio pieces" means a top-level collection.** Testimonials get their own studio entry type and their own top-level item, a sibling of Portfolio pieces with its own dividers, not nested under it and not a single document holding a list.
- **Carry over, don't re-enter.** Existing content is copied into the new collection by a one-off content migration, matching the approach used for the footer links. The migration also removes the old list from the Home page document so no hidden leftover remains.
- **Fixing the client names is in scope.** The carry-over touches these values anyway, and the doubled dash and comma is a visible defect on the live site today.
- **Order follows Portfolio pieces.** Newest first, with no manual ordering control. If the owner later wants to hand-pick the order, that's a separate ticket.
- **Backup testimonials stay as they are.** The three quotes in the site's backup copy are unchanged (per the agreed rule that backups keep today's content).
- **Testimonials are Home-only for now.** No other page shows them; another page could read the same collection later without remodelling.
- **Out of scope**: changes to the carousel's design, adding photos or links to testimonials, and featuring or hiding individual testimonials.
