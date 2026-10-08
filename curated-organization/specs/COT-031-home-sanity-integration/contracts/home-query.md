# Contract: Home query, loader and meta

## 1. `HOME_QUERY` (`app/routes/pages/home/home.query.ts`)

Colocated with the route (constitution III), defined with `defineQuery`. One request per Home load (FR-007), alongside root's existing `GLOBAL_QUERY`.

```groq
{
	"page": *[_id == "homePage"][0]{
		hero{ eyebrow, heading, body, linkLabel, linkHref,
			images[]{ asset, crop, hotspot, alt } },
		intro{ eyebrow, heading, body, linkLabel, linkHref },
		servicesTeaser{ eyebrow, heading, linkLabel, linkHref,
			cards[]{ title, description, image{ asset, crop, hotspot, alt } } },
		process{ eyebrow, heading, steps[]{ number, title, description } },
		beforeAfter{ eyebrow, heading, caption, linkLabel, linkHref,
			beforeImage{ image{ asset, crop, hotspot, alt } },
			afterImage{ image{ asset, crop, hotspot, alt } } },
		testimonials[]{ quote, clientName, clientLocation, rating },
		seo{ title, description, image{ asset, crop, hotspot, alt } }
	},
	"businessName": *[_id == "siteSettings"][0].businessName
}
```

The query reads published content only, through the client's `perspective: 'published'`. Any projected field may be `null`.

## 2. Loader (`app/routes/pages/home/home.loader.server.ts`)

```ts
export async function loader(): Promise<HomeContent>
```

Re-exported from `index.tsx` with `export { loader } from './home.loader.server'`, following the `root.tsx` pattern. It never throws, and it always returns a complete `HomeContent` built by the rules in [data-model.md](../data-model.md#3-resolution-rules-homeloaderserverts).

| Condition | Log | Result |
|---|---|---|
| `getSanityClient()` returns `null` | (client already warns once) | `FALLBACK_HOME_CONTENT` |
| `fetch` throws (network, timeout > 2000 ms, bad dataset) | `console.error('[home] Sanity fetch failed, serving fallback content', error)` | `FALLBACK_HOME_CONTENT` |
| `result.page` is `null` | `console.warn('[home] homePage not found, serving fallback content')` | `FALLBACK_HOME_CONTENT` |
| Otherwise | none | Mapped content, with per-section fallback |

## 3. Route module (`app/routes/pages/home/index.tsx`)

```ts
export { loader } from './home.loader.server';

export const meta: Route.MetaFunction = ({ loaderData, matches, location }) => {
	const defaults = matches[0]?.loaderData?.seo;
	return defaults ? buildMeta(mergeSeo(defaults, loaderData?.seo), location.pathname) : [];
};

export default function Home({ loaderData }: Route.ComponentProps) // passes each section its props
```

## 4. Meta output

The descriptor set is the same as COT-030's `buildMeta` ([global-seo.md §3](../../COT-030-seo-schema-integration/contracts/global-seo.md)). Values come from each Home field when set, otherwise from the site default:

| Home `seo` state | `<title>` / `og:title` | description | `og:image` |
|---|---|---|---|
| Not set (current production) | site default | site default | site default (if any) |
| Only `description` set | site default | Home summary | site default (if any) |
| All set | `"{Home title} \| {businessName}"` | Home summary | Home share image, 1200×630 JPG |
| Home fetch failed | site default | site default | site default (if any) |

## 5. Removed

- `PAGE_ROUTES_DATA.HOME.metaData` in `app/routes/constants/index.ts` (FR-017).
