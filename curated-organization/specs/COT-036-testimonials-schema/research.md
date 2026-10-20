# Research: Testimonials as their own content studio section

## R1. Existing content

A public CDN query against `production` on 2026-10-19 found:

| Content | State |
|---|---|
| `homePage.testimonials` | 3 items, all `rating: 5`, in this order: placeholder ("Client name", Arlington, VA), Sarah M. (McLean, VA), James T. (Washington, DC) |
| Client names as stored | `"— Client name,"`, `"— Sarah M.,"`, `"— James T.,"` |
| Documents of `_type == "testimonial"` | 0 |

The carousel renders `— {clientName}, {clientLocation}`, so the live page shows "— — Sarah M.,, McLean, VA".

The quote, location and rating text matches the backup testimonials in `home.fallback.server.ts` exactly. The only difference is the stray characters in the names. So whichever source the Home page reads from during release, visitors see the same three quotes.

## R2. Studio placement

**Decision**: Add `S.documentTypeListItem('testimonial').title('Testimonials').icon(icons.comment)` to `studio/structure/index.ts` as a top-level item with its own dividers, after Portfolio pieces and before Site settings. Exclude `testimonial` from the trailing `documentTypeListItems()` catch-all, as `portfolioPiece` already is, so it appears only once.

**Rationale**: This matches how Portfolio pieces is listed, and FR-002 (as clarified) asks for a sibling item, not a nested one.

**Alternatives considered**: Let the catch-all list it. Rejected: the item would sit at the bottom with no title or icon control, and it couldn't be placed after Portfolio pieces.

## R3. Schema shape

**Decision**: Move `testimonial` from `schemaTypes/objects/` to `schemaTypes/documents/` and change `type: 'object'` to `type: 'document'`, keeping the same `name`, fields, labels, validation, icon and preview. Add a `description` to Client name saying the site adds the dash and comma. In `homePage`, remove the `testimonials` field and its group.

**Rationale**: Keeping the type name `testimonial` means the 3 embedded items (which already carry `_type: "testimonial"`) map onto the new documents one to one, and the frontend's field names don't change. A type name can't be both an object and a document, so it moves rather than being duplicated (Constitution II: model once per concept).

**Alternatives considered**:
- A `testimonials` singleton holding an array: rejected, because the spec says each testimonial is its own entry, the same way Portfolio pieces work.
- Keeping the `homePage` field hidden instead of removing it: rejected, because the migration removes the data, and FR-006 says the tab goes away.

## R4. Carrying content over

**Decision**: Add a migration at `studio/migrations/testimonials-to-documents/index.ts`, following the existing `footer-link-columns` migration, with `documentTypes: ['homePage']`. For the published `homePage`, it returns a single `transaction([...])` (from `sanity/migrate`) containing:

1. One `createIfNotExists` per item, with deterministic IDs `testimonial-migrated-1`, `-2` and `-3` in the current array order. Each has the cleaned client name, plus `quote` and `clientLocation` copied as-is. `rating` is not copied (the field is removed).
2. A patch that unsets `testimonials` on `homePage`.

Using one explicit transaction makes sure the three documents share a `_createdAt`, which R5 relies on. It also means the copy and the removal can't be applied separately.

For a `drafts.homePage`, it only unsets `testimonials`, so documents aren't created twice. It skips any document whose `testimonials` is already `undefined`.

The name clean-up trims whitespace, removes leading dashes (`—`, `–`, `-`) and removes trailing commas.

**Rationale**:
- **Safe to re-run (FR-009)**: the IDs are deterministic and `createIfNotExists` won't create duplicates.
- **No other Home content changes**: the patch touches only `testimonials`.
- **Order kept (FR-008)**: R5 explains how.

**Alternatives considered**:
- Asking the owner to re-enter the testimonials: rejected by the spec's default.
- A one-off script calling the client directly: rejected, because `sanity migration run` gives a dry run by default and is the pattern the repo already uses.

**How to run**: from `studio/`, run `npx sanity migration run testimonials-to-documents` (a dry run), then add `--no-dry-run`. The project owner must run it while logged in to the Sanity CLI.

## R5. Order on the Home page

**Decision**: `*[_type == "testimonial"] | order(_createdAt desc, _id asc)`.

**Rationale**:
- Newest first, the same as the Gallery's `portfolioPiece` order.
- The migration creates all three documents in one explicit transaction (R4), so they share a `_createdAt`. Without that, separate batches would give `-3` the newest timestamp and reverse the order. The `_id asc` tiebreaker then orders them `-1`, `-2`, `-3`, which is today's order.
- Documents created later in the Studio get later timestamps, so they appear first.
- The tiebreaker also makes the order stable when timestamps match (edge case in the spec).

**Alternatives considered**: A manual `order` field, or an orderable-list plugin. Rejected because the spec rules out manual ordering for this ticket.

## R6. Fetch and fallback

**Decision**:
- Add `"testimonials": *[_type == "testimonial"] | order(_createdAt desc, _id asc){ quote, clientName, clientLocation }` to `HOME_QUERY` as a top-level key. It sits next to `page` and `businessName`, so it's still one request.
- `mapTestimonials` keeps its rules: drop items without a quote or name, and use the backup only when no usable items are left, never mixing the two.
- **FR-012**: when `page` is null but the fetch succeeded, the loader returns `{ ...FALLBACK, testimonials: mapTestimonials(result.testimonials) }` and still logs the existing `[home] homePage not found` warning.
- If the client is missing or the fetch fails, the loader returns the full `FALLBACK` (including backup testimonials) and logs, as it does today.

| Situation | Testimonials shown | Log |
|---|---|---|
| Client not configured | Backup | Existing `[sanity]` warning |
| Fetch throws | Backup | `[home] Sanity fetch failed…` |
| `homePage` missing, testimonials present | CMS | `[home] homePage not found…` |
| No usable testimonial documents | Backup | None (same as other lists on Home today) |
| Some usable | Only the usable ones | None |

**Rationale**: FR-013 asks for logging "as other Home sections are today". Today the Home loader logs a missing client, a failed fetch or a missing document, but not a list falling back to its backup items. Testimonials follow the same rule.

**Alternatives considered**: A separate request for testimonials. Rejected because it adds a round trip, and the single GROQ projection already isolates each key.

## R7. Release order

Either order is safe, because the backup testimonials match the published text (R1):

- **Studio and migration first**: the deployed app reads `homePage.testimonials`, which is now unset, so it shows the backups. Visitors see the same quotes, with the names already clean.
- **App first**: the app finds no `testimonial` documents and shows the backups. Same result.

**Recommended order**: deploy the Studio, then run the migration, then deploy the app. Then the Studio never shows a removed field with leftover data while the app is reading documents that don't exist yet.

## R8. Types

`CmsTestimonial` stays hand-written in `home.loader.server.ts`, under the same TypeGen exception as COT-031 to COT-035. `HomeQueryResult` gains `testimonials: Maybe<Maybe<CmsTestimonial>[]>`, and `CmsHomePage` loses `testimonials`. `TestimonialItem`, `TestimonialProps` and the `Testimonial` component are unchanged.
