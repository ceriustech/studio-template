# Contract: Global SEO query and root meta output

## 1. GLOBAL_QUERY additions (`app/lib/sanity/queries/global.ts`)

Two projections are added to the existing `settings` block. No new query is added, and the number of requests per page load doesn't change.

```groq
"settings": *[_id == "siteSettings"][0]{
	...existing fields,
	businessName,
	defaultSeo{
		title,
		description,
		image{ asset, crop, hotspot, alt }
	}
}
```

Any field may come back `null` (the document is already published with an empty `defaultSeo`).

## 2. Loader output (`GlobalContent.seo`)

See [data-model.md](../data-model.md#resolution-rules-loader). `seo` is always present and fully resolved. `meta` never applies fallbacks.

## 3. `buildMeta(seo, pathname)` (`app/lib/seo.ts`)

A pure function. Page tickets reuse it later with their merged page and default values.

| Descriptor | Value | When |
|---|---|---|
| `{ title }` | `seo.title` | always |
| `{ name: 'description', content }` | `seo.description` | always |
| `{ property: 'og:type', content: 'website' }` | | always |
| `{ property: 'og:url', content }` | `SITE_URL + pathname`; a trailing `/` on `/` is dropped, so it's `https://curatedorganization.com` | always |
| `{ property: 'og:title', content }` | `seo.title` | always |
| `{ property: 'og:description', content }` | `seo.description` | always |
| `{ property: 'og:image', content }` | `seo.image.src` | image present |
| `{ property: 'og:image:width' / 'og:image:height' }` | `'1200'` / `'630'` | image present |
| `{ property: 'og:image:alt', content }` | `seo.image.alt` | image present and alt non-empty |
| `{ name: 'twitter:card', content: 'summary_large_image' }` | | image present |

No `keywords`, `http-equiv` or `viewport` descriptors. `Layout` renders charset and viewport once.

## 4. Root `meta` export (`app/root.tsx`)

```ts
export const meta: Route.MetaFunction = ({ loaderData, location }) =>
	loaderData ? buildMeta(loaderData.seo, location.pathname) : [];
```

Inherited by every route that doesn't export `meta` (all routes except not-found).

## 5. Example rendered head (default filled, image set)

```html
<title>Professional Home Organizing in NOVA &amp; DMV | Curated Organization</title>
<meta name="description" content="Luxury professional organizing in Northern Virginia and the DMV.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://curatedorganization.com/services">
<meta property="og:title" content="Professional Home Organizing in NOVA &amp; DMV | Curated Organization">
<meta property="og:description" content="Luxury professional organizing in Northern Virginia and the DMV.">
<meta property="og:image" content="https://cdn.sanity.io/images/o2hxhkt0/production/…?rect=…&w=1200&h=630&fit=crop&fm=jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Organized walk-in closet with labeled bins">
<meta name="twitter:card" content="summary_large_image">
```
