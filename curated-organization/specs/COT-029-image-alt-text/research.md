# Research: Alt text for every CMS image

**Feature**: [spec.md](spec.md) | **Date**: 2026-09-28

## R1. Where the alt text field lives

**Decision**: Put `alt` inside the image field itself, using the image type's `fields` option, so every image returns `{asset, crop, hotspot, alt}`. Move the 3 existing sibling `alt` fields (`imageMedia`, `serviceCard`, `servicesPageItem`) into their images.

**Rationale**:
- This is the pattern Sanity recommends for alt text. The Studio shows the field inside the image's own panel, which meets SC-003.
- It's the only pattern that works for every location. The hero carousel is an array of bare images, so a sibling field has nowhere to go.
- The frontend reads alt text the same way everywhere: `image.alt`. That's FR-002.
- The move costs nothing now. The published dataset holds only `siteSettings`, which has no alt values yet (checked 2026-09-28), so there's no data to migrate (FR-005).

**Alternatives considered**:
- *Keep sibling `alt` fields and add more.* This fails on the hero array, and the logo would need an oddly named `logoAlt`. The frontend would have 2 read paths.
- *A new named image type (e.g. `accessibleImage`) used everywhere.* This works, but it adds a type to the schema list and changes every field's `type`. A shared field definition (R2) gives the same consistency with less change.

## R2. One definition of the alt field

**Decision**: Add a single exported `altTextField` definition in `studio/schemaTypes/fields/altText.ts`. Every image imports it and uses `fields: [altTextField]`.

**Rationale**: The name, label, guidance text and validation are written once, so FR-002, FR-003, FR-004 and FR-006 can't drift between fields.

**Alternatives considered**: Copying the field into each schema file. That's 8 copies to keep in sync.

## R3. Validation

**Decision**: `validation: (rule) => [rule.required().error(...), rule.max(125).warning(...)]`.

**Rationale**:
- `required` blocks publishing when an image is set but its alt text is empty (FR-004).
- `max(125).warning()` flags long text without blocking it (FR-006).
- Nested fields only validate when the image object exists. Optional images (logo, founder photo, social share image) can still be left empty.

## R4. Locations with no new field

| Location | Decision | Why |
|----------|----------|-----|
| `siteCta.backgroundImage` | No alt field | Decorative. The component hardcodes `alt=""` (clarified 2026-09-28). |
| `imageMedia.fullImage` | No alt field | Shows the same picture as `imageMedia.image`, so it reuses `image.alt`. |
| `videoMedia.poster` | No alt field. `videoMedia.alt` stays where it is | That alt describes the video, not a standalone image. |

## R5. Credential badge label as starting value

**Decision**: Don't pre-fill badge alt text from the label.

**Rationale**: `initialValue` runs when the item is created, before the editor has typed a label, so it can't copy the label across. A custom input component would add weight for little benefit. The spec says "may", so leaving it out doesn't break a requirement.

## R6. Generated types (FR-008)

**Decision**: Defer. `sanity.types.ts` doesn't exist yet. TypeGen setup is its own ticket, following the exception logged in COT-028. Once that ticket runs, the new fields are picked up automatically.

**Rationale**: Setting up TypeGen here would pull an unrelated setup task into a schema-only ticket. Logged in the plan's Complexity Tracking.

## R7. Effect on the running site

**Decision**: None expected. `GLOBAL_QUERY` projects `logo{asset, crop, hotspot, dimensions}` and `footerLogos[]{label, image{...}}`, so the new `alt` key isn't fetched. `siteCta.backgroundImage` doesn't change. The existing mappers are untouched (FR-007, SC-005).
