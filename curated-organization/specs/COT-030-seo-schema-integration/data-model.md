# Data Model: Plain-language SEO fields and a site-wide default

## Sanity schema (studio/)

### `seo` (object, shared): changed

The object's title changes from "SEO" to "Search & sharing". `components.input` is `SeoInput` (Google-result preview above the fields).

| Field | Before | After: name | After: Studio label | Type | Validation | Help text |
|---|---|---|---|---|---|---|
| Title | `metaTitle`, required, max 70 (error) | `title` | Page title | string | `max(60).warning("Google usually shows about 60 characters; longer titles may be cut off.")` | "Shown in the browser tab and as the blue headline in Google. The business name is added automatically." |
| Summary | `metaDescription`, required, max 200 (error) | `description` | Page summary | text, rows 3 | `max(160).warning("Google usually shows about 160 characters; longer summaries may be cut off.")` | "The 1–2 sentences under the headline in Google, and in link previews when the page is shared." |
| Image | `ogImage` (hotspot, `alt` via `altTextField`) | `image` | Share image | image, hotspot, `fields: [altTextField]` | none (alt keeps its COT-029 rules) | "The picture shown when this page's link is shared on social media or in a text message. Best size: 1200×630." |
| Keywords | `keywords` (string[] tags) | **removed** | | | | |

No field is required at the object level (FR-008).

### `siteSettings` (document): changed

| Change | Detail |
|---|---|
| New field `businessName` | string, group `brand`, placed after `brandName`. Title "Business name". Description: `Your full business name, e.g. "Curated Organization". It's added to the end of every page title in Google and the browser tab.` Not required. |
| Group `seo` | Title "SEO" (shown as "Default SEO") → "Default search & sharing" |
| Field `defaultSeo` | Title → "Default search & sharing". Description → "Used on any page that doesn't have its own." Validation: object-level `rule.custom()` that returns `{message: 'Add a default page title.', path: ['title']}` and/or `{message: 'Add a default page summary.', path: ['description']}` when either is empty after trimming. The share image stays optional. |

### `homePage`, `servicesPage`, `galleryPage`, `bookingPage` (documents): changed

| Change | Detail |
|---|---|
| Group `seo` | Title "SEO" → "Search & sharing" |
| Field `seo` | Title "SEO" → "Search & sharing". Optional (no validation). The live site doesn't read it yet. |

## App types (app/)

### `SeoContent` (new, `app/types/global.ts`)

```ts
type SeoContent = {
	title: string;        // resolved, business-name suffix already applied
	description: string;  // trimmed, line breaks collapsed
	image?: ImageItem;    // 1200×630 JPEG; alt '' when the editor left it empty
};
```

`GlobalContent` gets `seo: SeoContent`.

### `FALLBACK_GLOBAL_CONTENT.seo` (new, `app/root.fallback.server.ts`)

```ts
seo: { title: 'Curated Organization', description: 'Professional organizing services' }
```

These are today's hardcoded root values (FR-015). The backup business name `'Curated Organization'` is a constant in the same file.

## Resolution rules (loader)

| Output | Source, in order |
|---|---|
| base title | `defaultSeo.title` (trimmed) → `FALLBACK.seo.title` |
| business name | `businessName` (trimmed) → `'Curated Organization'` |
| title | base title if it contains business name (case-insensitive), else `` `${base} \| ${businessName}` `` |
| description | `defaultSeo.description` (trimmed, `\s*\n\s*` → space) → `FALLBACK.seo.description` |
| image | `defaultSeo.image` with an asset → `{ src: 1200×630 jpg, alt, width: 1200, height: 630 }`; otherwise omitted |

When the whole fetch fails, `FALLBACK` is returned. Its `seo` resolves to `"Curated Organization"` (contains the business name, so no suffix) and the backup description.
