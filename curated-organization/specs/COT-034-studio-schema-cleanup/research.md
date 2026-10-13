# Research: Content studio cleanup for page headers and portfolio pieces

All Technical Context unknowns are resolved below. Each entry gives the decision, the rationale, and the alternatives considered.

## R1. Existing content

**Decision**: No migration and no content edits.

**Rationale**: A public CDN query against `production` on 2026-10-13 found:

| Document | `hero` images | `hero` link label | `intro` images | `intro` link label |
|---|---|---|---|---|
| `homePage` | 3 | "Discover Your Space" | none | "Learn more about us" |
| `servicesPage` | none | none | — | — |
| `galleryPage` | none | none | — | — |
| `bookingPage` | not published | | | |
| `portfolioPiece` | 0 published documents, so 0 with a `slug` | | | |

Every field this feature hides is empty wherever it gets hidden, and the field it removes holds no published values. Drafts aren't visible to the public CDN. Any draft values stay stored and invisible (spec Edge Cases).

## R2. How to hide fields on some pages but not others

**Decision**: Keep the single `heroSection` object type and give `images`, `linkLabel` and `linkHref` a `hidden` callback. The callback reads a small allow-list in `heroSection.ts` that maps a document type and field name to the extras it shows:

```text
homePage.hero  → images, link
homePage.intro → link
(everything else) → none
```

The callback uses the `document._type` and `path[0]` values that Studio passes to it. `ConditionalPropertyCallbackContext` in `@sanity/types` (Sanity 6.18) exposes `document`, `parent`, `value`, `currentUser` and `path`. `linkHref` keeps its existing "hidden until a label is entered" rule, combined with the allow-list.

When `document` is undefined (briefly, while a document loads), the extras are hidden. The allow-list fails closed.

**Rationale**:
- The user ruled out a migration. A separate text-only object type would change the stored `_type` on existing Services/Gallery hero values. Sanity 6.18 then raises a `TYPE_ANNOTATION_MISMATCH` error on the field, documented in `sanity/lib/types-*.d.ts`, so a migration would be needed.
- An allow-list keeps every rule in one file. A future page that needs images or a link is a one-line change, and pages are text-only by default.
- `hidden` only changes what the form shows. It never reads or writes content, which satisfies FR-004 and SC-005.

**Alternatives considered**:
- *Separate `pageHeader` type.* Rejected: it needs the migration above.
- *Inline anonymous object per page.* Rejected: it duplicates the hero concept, which the constitution's Content Ownership principle forbids, and the stored `_type` would still mismatch.
- *Hide by document type only.* Rejected: it can't hide images on the Home intro while showing them on the Home hero.
- *`readOnly` instead of `hidden`.* Rejected: editors would still see the confusing fields.

## R3. Validation on hidden fields

**Decision**: No change. Hidden fields keep their validation.

**Rationale**: Studio still validates hidden fields. The only rule inside them is the slide images' alt text (required). No hidden location has images (R1), so no editor can be blocked by an error they can't see. If a draft somewhere does hold an image without alt text, publishing that document would show a validation error on a hidden field. That's acceptable given R1, and it's recorded as a known edge in [quickstart.md](quickstart.md).

## R4. Removing `slug` from `portfolioPiece`

**Decision**: Delete the `slug` field definition. Nothing else changes.

**Rationale**:
- Nothing in `app/` reads it: `GALLERY_QUERY` selects `_id`, `title`, `category`, `location`, `description`, `videos` and `images`.
- Nothing in `studio/` references it: the preview uses `title`, `location` and `images.0.image`, and there's no custom structure or ordering on slug.
- Its `required()` rule disappears with the field, so publishing no longer needs it (FR-005).
- Any draft value becomes an unknown field. Studio shows it as removable, with no effect on the site.

**Alternatives considered**:
- *Hide the slug.* Rejected: the user asked for removal, and a hidden required field would block publishing.
- *Unset existing slugs with a migration.* Not needed: there are none published, and the user ruled out migrations.

## R5. Help text

**Decision**: Reword the `heroSection` type description and the Home `intro` field description (FR-008):
- `heroSection`: "Small line, heading and body for a page header. Slide images and a link/button appear only on pages that use them."
- Home `intro`: "Small line, heading, body and an optional link."

**Rationale**: The current text ("leave images/CTA empty when not needed", "no images needed here") describes fields the editor can no longer see.

## R6. Verification

**Decision**: There's no automated suite.
- Static checks: `npx tsc --noEmit` and `npx sanity schema validate` in `studio/`. Then `npm run typecheck` and `npm run build` in `app/`.
- Manual checks in `npx sanity dev` and on `/gallery`, per [quickstart.md](quickstart.md).

**Rationale**: Most of the changes are Studio form configuration, and are best verified by looking at the forms. The Gallery changes are verified by viewing the page.

**Not run**: `sanity typegen generate`. TypeGen isn't set up yet; it's the existing project-wide exception carried by COT-031 to COT-033. `sanity schema extract` only feeds TypeGen, so it's deferred with it.

## R7. Deployment

**Decision**: The hosted Studio picks up the change on the next `sanity deploy`, as with earlier schema work. It's listed as a release step in quickstart, not as a code task. The Gallery code ships with the normal app deploy.

## R8. Video length without a Duration field

**Decision**: Remove `videoMedia.duration`. A hook co-located with `VideoPanel` (`useVideoDuration(src)`) reads the length in the browser:
- On mount, it creates a detached `<video>` element with `preload = 'metadata'` and `muted`, and sets its `src`.
- On `loadedmetadata`, it stores `video.duration` if the value is finite and > 0.
- On unmount or `src` change, it removes the listener, clears the `src` and calls `load()` so the request is abandoned.
- It returns `number | null`. The panel renders the badge only when the length isn't null, using the existing `formatDuration` (m:ss).

The loader no longer drops a video for a missing duration. A video still needs a file, a poster and a before/after tag.

**Rationale**:
- Sanity stores no duration for a plain `file` asset, only size, MIME type and similar, so it can't come from the query.
- The user chose browser-side measurement (spec Clarifications).
- `preload="metadata"` makes the browser fetch only enough bytes to read the header (FR-012).
- It works the same for Sanity-hosted files and the backup `/gallery/videos/*.mp4`, so the backup durations can be removed too.
- The badge is an absolutely positioned overlay and isn't part of the panel's accessible name, so appearing late causes no layout shift and no change for screen readers.

**Alternatives considered**:
- *Studio auto-fill.* A custom input measures on upload and writes a read-only field. Rejected by the user: more code, and older uploads have no value.
- *Measure on the server in the loader.* Rejected: it would download each video on every request.
- *Reuse the visible lightbox `<video>`.* Rejected: the panel shows a poster `<img>`, not a video, and the length is needed before anything opens.

## R9. Viewer image without Full-resolution override

**Decision**:
- Remove `imageMedia.fullImage`.
- The loader always builds `fullSrc` from the photo itself, using the existing `fullUrl` (1600 px wide, `fit('max')`, auto format, respecting crop).
- `GALLERY_QUERY` drops `fullImage{…}`.
- `ImageMedia.fullSrc` stays in the type. The lightbox still prefers it over the 720×540 thumbnail, and the backup pieces leave it unset (they fall back to `src`, as today).

**Rationale**: The viewer always shows the same photo, so a larger render of it is all that's needed (FR-013). Keeping `fullSrc` keeps the viewer sharp without a second upload.

**Alternatives considered**: *Use `src` in the viewer too.* Rejected: 720×540 crops look soft at up to 1100 px wide.

## R11. Poster focal offset and captions

**Decision**:
- Remove `videoMedia.posterOffset` and `videoMedia.captions`.
- The Gallery drops `posterOffset` and `captionsSrc` from `VideoMedia`, the query, the loader and the backup content.
- The lightbox stops rendering its optional `<track kind="captions">`.

**Rationale**:
- `posterOffset` was mapped but never read by any component: posters are cropped by the editor's hotspot via the image URL.
- `captions` only fed an optional `<track>`.
- A CDN check on 2026-10-13 found neither set on any of the 6 published videos.
- The videos are silent, and each keeps its accessible name from Alt/description text (`aria-label` on the panel and the lightbox `<video>`), which meets constitution VII's "accessible label" requirement.

**Alternatives considered**: *Hide captions instead of removing them.* Rejected: the user asked for removal, and no value exists.

## R10. Removing fields with existing values

**Decision**: No migration. A second CDN check later on 2026-10-13 found 3 published portfolio pieces (Gallery kitchen reset, Master closet transformation, Kitchen + pantry overhaul). All 6 of their videos have a typed-in duration, and none of their images has a full-resolution override. The typed durations are left in place: the Studio lists them as unknown fields the editor can remove, and the site no longer reads them. Range reads of the actual files gave 0:11/0:19, 0:19/0:11 and 0:09/0:11, against typed values of 11/10, 10/10 and 9/11, so 3 of 6 were wrong. All three files keep their metadata at the end of the file. The Sanity CDN answers range requests (206), and a metadata read fetched about 320 KB of 14 to 29 MB. Any draft value becomes an unknown field the editor can clear. The site ignores it either way, because the query no longer selects it.

