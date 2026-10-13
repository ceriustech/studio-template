# Data Model: Gallery page

## GalleryContent (loader → route)

| Field | Type | Source | Fallback |
|---|---|---|---|
| `hero` | `HeroProps` `{ eyebrow?, heading, body? }` | `galleryPage.hero` | Backup copy when `heading` empty |
| `pieces` | `PortfolioPiece[]` | `*[_type == "portfolioPiece"]` | Backup pieces when none usable |
| `seo` | `PageSeo` | `galleryPage.seo` | `{}` → root default per field |

## PortfolioPiece

| Field | Type | CMS field | Rule |
|---|---|---|---|
| `id` | string | `_id` | — |
| `title` | string | `title` | Required, else piece skipped |
| `category` | `Category` | `category` | Must be a known category, else skipped |
| `location` | string? | `location` | Hidden when empty |
| `description` | string? | `description` | Hidden when empty |
| `videos` | `readonly VideoMedia[]` | `videos[]` | ≤1 before + ≤1 after, before first |
| `images` | `ImageMedia[]` | `images[]` | Items without an asset skipped |

A piece with no usable image and no usable video is skipped.

## VideoMedia

`src` (`video.asset->url`, required), `poster` (image, required), `posterOffset` (default 0), `tag` (`before`/`after`, required), `duration` (> 0, required), `captionsSrc?` (`captions.asset->url`), `alt` (fallback "{title} — Before/After").

## ImageMedia

`src` (photo, required), `alt` (alt → caption → "{title} photo {n}"), `caption?`, `fullSrc?` (`fullImage` or the photo at lightbox size).
