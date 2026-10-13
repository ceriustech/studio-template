# Data Model: Content studio cleanup

Schema changes in `studio/schemaTypes/`. Stored content is unchanged.

## `heroSection` (object, `objects/heroSection.ts`)

| Field | Stored | Shown in the form when |
|---|---|---|
| `eyebrow` | unchanged | always |
| `heading` (required) | unchanged | always |
| `body` | unchanged | always |
| `images[]` (image + required `alt`) | unchanged | document is `homePage` **and** field is `hero` |
| `linkLabel` | unchanged | document is `homePage` (`hero` or `intro`) |
| `linkHref` | unchanged | `linkLabel` shows **and** has a value (the existing rule) |

The allow-list lives in `heroSection.ts`; see [research.md](research.md) R2. The type description is reworded (R5).

### Where `heroSection` is used

| Document → field | Extras shown |
|---|---|
| `homePage.hero` | images, link |
| `homePage.intro` | link |
| `servicesPage.hero` | none |
| `galleryPage.hero` | none |
| `bookingPage.hero` | none |

## `portfolioPiece` (document, `documents/portfolioPiece.ts`)

| Field | Change |
|---|---|
| `slug` | **Removed**, together with its `required()` rule |
| all others | unchanged |

## `homePage` (document)

`intro` field description reworded (R5). No field changes.

## `videoMedia` (object, `objects/videoMedia.ts`)

| Field | Change |
|---|---|
| `duration` | **Removed**, together with its `required().positive()` rule. The length is read from the file in the browser (research R8) |
| `posterOffset` | **Removed**. Never used by the site (research R11) |
| `captions` | **Removed**. Only fed an optional caption track (research R11) |
| all others | unchanged |

## `imageMedia` (object, `objects/imageMedia.ts`)

| Field | Change |
|---|---|
| `fullImage` | **Removed**. The viewer uses a larger render of `image` (research R9) |
| all others | unchanged |

## Frontend impact

- **Hero and slug:** none. No GROQ query reads `slug`. The Services and Gallery queries read only `hero{ eyebrow, heading, body }`. The Home query still reads `images`, `linkLabel` and `linkHref`, which Home keeps.
- **Gallery:**

| File | Change |
|---|---|
| `gallery.query.ts` | `videos[]` drops `duration`, `posterOffset` and `"captionsSrc"`; `images[]` drops `fullImage{…}` |
| `gallery.types.ts` | `VideoMedia` drops `duration`, `posterOffset` and `captionsSrc`. `ImageMedia.fullSrc` stays (always the photo's large render for CMS pieces; unset for backup pieces) |
| `gallery.loader.server.ts` | `mapVideo` no longer requires a duration. `fullSrc` is always built from `image` |
| `gallery.fallback.server.ts` | `BEFORE_VIDEO_DURATION` / `AFTER_VIDEO_DURATION` and `posterOffset` removed |
| `Lightbox.tsx` | The optional `<track kind="captions">` is removed |
| `VideoPanel.tsx` | Badge reads its value from `useVideoDuration(media.src)` and is hidden while that's `null` |
