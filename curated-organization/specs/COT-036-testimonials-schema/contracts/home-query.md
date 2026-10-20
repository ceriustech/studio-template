# Contract: `HOME_QUERY` (changed)

`HOME_QUERY` is defined in `app/routes/pages/home/home.query.ts` and fetched only by `home.loader.server.ts`.

## Change

- **Removed** from the `page` projection: `testimonials[]{ quote, clientName, clientLocation, rating }`.
- **Added** at the top level:

```groq
"testimonials": *[_type == "testimonial"] | order(_createdAt desc, _id asc){
	quote, clientName, clientLocation
}
```

Everything else in the query (`page.hero`, `intro`, `servicesTeaser`, `process`, `beforeAfter`, `seo`, `businessName`) is unchanged.

## Result shape

```ts
{
	page: { hero, intro, servicesTeaser, process, beforeAfter, seo } | null,
	testimonials: Array<{
		quote: string | null,
		clientName: string | null,
		clientLocation: string | null,
	}>,                 // [] when none are published
	businessName: string | null,
}
```

## Guarantees

- One request per Home page load, as today.
- Only published documents are returned (`published` perspective, CDN).
- Order: newest first, then `_id` ascending for documents created at the same time.

## Loader output (unchanged contract to the component)

`HomeContent.testimonials: TestimonialItem[]`, always non-empty. It holds either the usable CMS items or the backup list. See [research.md](../research.md#r6-fetch-and-fallback).
