# Contract: Services query, loader and meta

## 1. `SERVICES_QUERY` (`app/routes/pages/services/services.query.ts`)

Colocated with the route (constitution III), defined with `defineQuery`. One request per Services load, including the badges and business name (FR-007), alongside root's existing `GLOBAL_QUERY`.

```groq
{
	"page": *[_id == "servicesPage"][0]{
		hero{ eyebrow, heading, body },
		about{
			eyebrow, heading, bio, signature,
			photo{ asset, crop, hotspot, alt, "dimensions": asset->metadata.dimensions }
		},
		services[]{ eyebrow, heading, description, items, ctaLabel, image{ asset, crop, hotspot, alt } },
		pricing{ eyebrow, heading, note,
			tiers[]{ eyebrow, title, price, description, features, featured, ctaLabel } },
		seo{ title, description, image{ asset, crop, hotspot, alt } }
	},
	"badges": *[_id == "siteSettings"][0].credentialBadges[]{
		label, image{ asset, crop, hotspot, alt, "dimensions": asset->metadata.dimensions }
	},
	"businessName": *[_id == "siteSettings"][0].businessName
}
```

The query reads published content only, through the client's `perspective: 'published'`. Any projected field may be `null`.

## 2. Loader (`app/routes/pages/services/services.loader.server.ts`)

```ts
export async function loader(): Promise<ServicesContent>
```

Re-exported from `index.tsx` with `export { loader } from './services.loader.server'`. It never throws, and it always returns a complete `ServicesContent` built by the rules in [data-model.md](../data-model.md#3-resolution-rules-servicesloaderserverts).

| Condition | Log | Result |
|---|---|---|
| `getSanityClient()` returns `null` | (client already warns once) | `FALLBACK_SERVICES_CONTENT` |
| `fetch` throws (network, timeout > 2000 ms, bad dataset) | `console.error('[services] Sanity fetch failed, serving fallback content', error)` | `FALLBACK_SERVICES_CONTENT` |
| `result.page` is `null` | `console.warn('[services] servicesPage not found, serving fallback content')` | `FALLBACK_SERVICES_CONTENT` |
| Otherwise | none | Mapped content, with per-section fallback |

## 3. Route module (`app/routes/pages/services/index.tsx`)

```ts
export { loader } from './services.loader.server';

export const meta: Route.MetaFunction = ({ loaderData, matches, location }) => {
	const defaults = matches[0]?.loaderData?.seo;
	return defaults ? buildMeta(mergeSeo(defaults, loaderData?.seo), location.pathname) : [];
};

export default function Services({ loaderData }: Route.ComponentProps)
// <Hero {...hero} /> <About {...about} /> <Service items={services} /> <Pricing {...pricing} />
```

## 4. Meta output

Identical behavior to Home ([COT-031 contract §4](../../COT-031-home-sanity-integration/contracts/home-query.md)):

| Services `seo` state | `<title>` / `og:title` | description | `og:image` |
|---|---|---|---|
| All set (current production) | `"Services \| {businessName}"` | "Services tailored to your lifestyle." | Services share image, 1200×630 JPG |
| A field empty | that field from the site default | | |
| Services fetch failed | site default | site default | site default (if any) |

## 5. Removed

- `PAGE_ROUTES_DATA.SERVICES.metaData` in `app/routes/constants/index.ts` (FR-017). Nothing reads it since COT-030.
- The hardcoded `services` and `cards` arrays and all inline copy in the four section components (FR-002, FR-008).
