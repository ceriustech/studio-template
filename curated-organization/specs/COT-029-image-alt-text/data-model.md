# Data Model: Alt text for every CMS image

**Feature**: [spec.md](spec.md) | **Research**: [research.md](research.md)

## Shared field: `altTextField`

New file: `studio/schemaTypes/fields/altText.ts`.

| Property | Value |
|----------|-------|
| `name` | `alt` |
| `title` | `Alt text` |
| `type` | `string` |
| `description` | Describe what the image shows for people who can't see it. Leave out "image of". |
| Validation | Required (error). More than 125 characters (warning). |

It's attached to an image with `fields: [altTextField]`. The stored value becomes `<image>.alt`.

## Changes per location

| # | Schema file | Field | Before | After |
|---|-------------|-------|--------|-------|
| 1 | `objects/heroSection.ts` | `images[]` | `{type: 'image'}`, no alt | Each array item gets `fields: [altTextField]` |
| 2 | `documents/servicesPage.ts` | `about.photo` | No alt | `fields: [altTextField]` |
| 3 | `documents/siteSettings.ts` | `logo` | No alt | `fields: [altTextField]` |
| 4 | `objects/credentialBadge.ts` | `image` | No alt | `fields: [altTextField]` |
| 5 | `objects/seo.ts` | `ogImage` | No alt | `fields: [altTextField]` |
| 6 | `objects/imageMedia.ts` | `image` | Sibling `alt` on the object | `alt` moves into `image`. Sibling removed. Preview `subtitle: 'alt'` becomes `'image.alt'` |
| 7 | `objects/serviceCard.ts` | `image` | Sibling `alt` | `alt` moves into `image`. Sibling removed |
| 8 | `objects/servicesPageItem.ts` | `image` | Sibling `alt` | `alt` moves into `image`. Sibling removed |

No change:

| Schema file | Field | Reason |
|-------------|-------|--------|
| `documents/siteCta.ts` | `backgroundImage` | Decorative. The component hardcodes `alt=""` |
| `objects/imageMedia.ts` | `fullImage` | Reuses `image.alt` |
| `objects/videoMedia.ts` | `poster`, `alt` | The video's own `alt` covers the poster |

`homePage.beforeAfter.{beforeImage, afterImage}` and `portfolioPiece.images[]` use `imageMedia`, so row 6 covers them.

## Stored shape

```text
image field value
├── _type: "image"
├── asset: reference → sanity.imageAsset
├── crop?, hotspot?
└── alt: string        ← new (required when the image is set)
```

## Validation behaviour

| State | Result |
|-------|--------|
| No image set | Valid. Alt isn't checked |
| Image set, alt empty | Error. Publishing is blocked |
| Image set, alt 1–125 chars | Valid |
| Image set, alt > 125 chars | Warning. Publishing is allowed |

## Existing data

The published dataset has only `siteSettings`, with no alt values (checked 2026-09-28), so there's nothing to migrate. Draft content isn't publicly readable; see the quickstart step for checking it.
