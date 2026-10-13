# Research: Gallery page and portfolio pieces from the content studio

## R1. Existing content

A public CDN query against `production` on 2026-10-08 found:

| Content | State |
|---|---|
| `galleryPage.hero` | "Your Transformation" / "See the difference" / "Real spaces, Real results. From Dysfunction to Function." No images, no link |
| `galleryPage.seo` | Title "Gallery", description "View our work and see how we transform real spaces.", share image with alt |
| `portfolioPiece` | **None published** |

**Visible differences on release**: the eyebrow renders as typed ("Your Transformation"; CSS may still uppercase it), the title becomes "Gallery | {businessName}", and, because no pieces are published, the backup pieces render with the new Unsplash image in place of today's local photos.

## R2. Fallback pattern

Same as COT-031/032: the loader returns fully resolved content; one fallback decision per section.

| Section | Anchor | Falls back on its own |
|---|---|---|
| Hero | `heading` | — |
| Portfolio pieces | ≥1 usable piece (title, known category, ≥1 usable image or video) | — |
| SEO | per field | → `siteSettings.defaultSeo` (root) |

A missing client or thrown fetch → `[gallery]` log + full backup. A missing `galleryPage` only affects hero/SEO; pieces are separate documents and still map.

**Change from COT-028**: the agreed "empty state on CMS failure" for portfolio pieces is replaced by backup pieces, per the COT-033 ticket (spec Clarifications).

## R3. Image sizes

| Use | Rendered | Requested |
|---|---|---|
| Detail photo (`src`) | ≤ ~360×220 | 720×540, `fit('crop')` (hotspot), auto format |
| Lightbox (`fullSrc`) | ≤ 1100w, 72vh | `fullImage` if set, else the photo; 1600w `fit('max')` |
| Video poster | ≤ ~550×400 | 1200×800, `fit('crop')` |

## R4. Videos

The schema keeps `video` and `captions` as Sanity file assets; the query dereferences `asset->url`. A piece shows at most one "before" and one "after" video, in that order, matching the `VideoPair` tuple type and its tag-based keys.

## R5. Revalidation

`shouldRevalidate` returns false for GET navigations that keep the pathname (filter pills, pagination, "View all"), so switching categories doesn't refetch Sanity.

## R6. Ordering

No order field exists on `portfolioPiece`; `_createdAt desc` puts the newest work first.
