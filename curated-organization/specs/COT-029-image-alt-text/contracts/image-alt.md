# Contract: Reading alt text from CMS images

This ticket adds no queries (FR-007). This file shows how later page tickets read the new field.

## Shape

Every meaningful image field returns `alt` alongside the asset:

```groq
logo{ asset, crop, hotspot, alt, "dimensions": asset->metadata.dimensions }
```

| Location | Path |
|----------|------|
| Hero carousel | `hero.images[].alt` |
| Services founder photo | `about.photo.alt` |
| Site logo | `logo.alt` |
| Credential badges | `footerLogos[].image.alt`, `credentialBadges[].image.alt` |
| Social share image | `seo.image.alt`, `defaultSeo.image.alt` (renamed from `ogImage` in COT-030) |
| `imageMedia` (gallery, before/after) | `<field>.image.alt` (also used for `fullImage`) |
| Service card / services item | `image.alt` |
| Video poster | `videoMedia.alt` (unchanged) |
| Site CTA background | none. Render `alt=""` |

## Rules for consumers

- `alt` is typed as optional, since older or draft content may lack it. When it's missing, fall back to the static copy, as COT-028 does for other fields.
- The social share alt goes into `og:image:alt` meta, not an `<img>`.
