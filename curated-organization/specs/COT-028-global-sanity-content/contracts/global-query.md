# Contract: global content query and root loader

## GROQ query: `GLOBAL_QUERY` (`app/lib/sanity/queries/global.ts`)

It is defined with `defineQuery` (constitution III). One request returns both singletons, which are addressed by the fixed IDs that `studio/structure/index.ts` pins.

```groq
{
  "settings": *[_id == "siteSettings"][0]{
    brandName,
    brandTagline,
    logo{ asset, crop, hotspot, "dimensions": asset->metadata.dimensions },
    bookNowLabel,
    navLinks[]{ label, url },
    footerBrandDescription,
    footerLogos[]{ label, image{ asset, crop, hotspot, alt, "dimensions": asset->metadata.dimensions } },
    connectLinks[]{ label, url },
    socialLinks[]{ label, url },
    footerHours[]{ label, value },
    copyrightText
  },
  "cta": *[_id == "siteCta"][0]{
    backgroundImage{ asset, crop, hotspot, "dimensions": asset->metadata.dimensions },
    heading,
    subheading,
    buttonLabel,
    buttonLink
  }
}
```

- Array order is Studio order, so `navLinks` renders in the order the editor set (FR-012).
- The `published` perspective is set on the client, so drafts never match (FR-002).
- The field names match `studio/schemaTypes`: `navLink` and `contactLink` use `{label, url}`, `hoursLine` uses `{label, value}`, and `credentialBadge` uses `{label, image}`.

Result type: `GlobalQueryResult` (see [data-model.md](../data-model.md) §1).

## Root loader: `loader()` in `app/root.loader.server.ts`, re-exported from `app/root.tsx`

- **Input**: none.
- **Output**: `GlobalContent` (data-model §2). It always resolves.
- **Guarantees**:
  - It never throws. A missing client, a network error, a timeout (2s) or a malformed response is logged with a `[global]` prefix, and the loader resolves with values built from the fallback (FR-007).
  - Each section is decided on its own (data-model §3).
  - It makes exactly one Sanity request per document load, and none on client navigation, because `shouldRevalidate` returns false (FR-003).

## Route handle contract

Any route module may export `handle: { hideSiteCta?: boolean }`. When any matched route sets `hideSiteCta`, `Layout` does not render the site CTA and renders `WhatToExpect` in its place (FR-022).
