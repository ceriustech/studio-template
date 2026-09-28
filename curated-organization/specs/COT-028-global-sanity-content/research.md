# Research: Connect global components to Sanity (COT-028)

Each entry records a decision, why it was chosen, and what else was considered. Versions were checked against the npm registry on 2026-09-27.

## R1. Package versions

- **Decision**: Add `@sanity/client@^8.7.0`, `@sanity/image-url@^2.1.1` and `groq@^6.16.0` to the app's `dependencies`.
- **Rationale**: These are the current releases, and the first two match what `studio/` already resolves, so the app and Studio use the same client. `@sanity/image-url` v2 exports a named `createImageUrlBuilder`; the default export is deprecated.
- **Alternatives**: Importing the client from `studio/node_modules` was rejected; the app and Studio are separate projects and must not share installs.

## R2. Getting the Sanity settings into the server

- **Decision**: `client.server.ts` reads `process.env.SANITY_PROJECT_ID` and `process.env.SANITY_DATASET`. In development only, it first loads `.env` with Node's built-in `process.loadEnvFile()` (Node 24 is installed), wrapped in a try/catch so a missing file is not an error. In production the host (Netlify or the Docker runtime) supplies the variables.
- **Rationale**: Vite only exposes `VITE_`-prefixed variables, and it does not copy `.env` into `process.env` for server code. Adding the `SANITY_` prefix to Vite's `envPrefix` was rejected because any accidental client-side reference would then inline the value into the browser bundle, which FR-005 forbids.
- **Alternatives**: Adding the `dotenv` package works but is an extra dependency when Node already provides the same thing.

## R3. Missing configuration must not crash the server

- **Decision**: `client.server.ts` exports `getSanityClient(): SanityClient | null`. It returns `null`, and logs once, when `SANITY_PROJECT_ID` is missing. The root loader treats `null` as "unreachable" and serves the fallback.
- **Rationale**: The illustrative sketch threw at import time. A throw during module load would take down every request and break the spec's "configuration missing entirely" edge case. Returning `null` keeps that failure on the same fallback path as a network error.
- **Alternatives**: A lazy throw inside the loader's try/catch also works, but it logs a stack trace on every request instead of once.

## R4. Slow responses

- **Decision**: Create the client with `timeout: 2000` (ms), and wrap the fetch in the loader's try/catch. A timeout is handled the same way as an unreachable service.
- **Rationale**: SC-004 requires pages to render within 3 seconds when Sanity is slow or down. A 2-second cap leaves room for rendering. `@sanity/client` 8.x supports `timeout` in its client config (confirmed in `index.node.d.ts`).
- **Alternatives**: `AbortSignal.timeout()` per fetch gives the same result with more code at each call site; the client-level option covers every later page ticket too.

## R5. Root loader data on a real 404

- **Finding**: For a URL that matches no route, React Router's static handler returns `loaderData: {}` without running any loader. The root loader is included. This was confirmed in `react-router/dist/development/index-react-server.js` (the `!matches` branch uses `getShortCircuitMatches`). On a real 404, `useRouteLoaderData('root')` would therefore be `undefined`, and Nav and Footer would have no content, which breaks FR-010.
- **Decision**: Add a catch-all route (`route('*', 'routes/pages/not-found/index.tsx')`) whose loader *returns* `data(null, { status: 404 })` and renders the not-found message itself. The root loader then runs, so `Layout` has the global data.
  - *Changed during implementation*: the first version threw the 404. That also kept Nav and Footer, but React Router then renders the root boundary and ignores the route's own `meta`, so the page lost its "Page not found" title and `noindex`. Returning the status keeps both. `Layout` also handles `undefined` data defensively by rendering the page without global chrome, which covers rare cases such as 405 responses.
- **Rationale**: This is the standard React Router pattern for a data-backed 404. It keeps the fallback server-only (FR-005) instead of shipping a second copy to the browser.
- **Alternatives**:
  - Making the fallback client-importable was rejected because it conflicts with FR-005 and the ticket's server-only acceptance criterion.
  - Hiding Nav and Footer on 404 was rejected because it conflicts with FR-010.
- **Scope note**: This adds one line to `app/routes.ts`. It does not touch `PAGE_ROUTES_DATA`, so the ticket's "route registration" exclusion (which is about `PAGE_ROUTES_DATA`) still holds.

## R6. Images: crop, hotspot and dimensions

- **Decision**: `image.server.ts` exports `urlFor(source)`, built with `createImageUrlBuilder` using the same project ID and dataset as the client. Queries return image fields as `{ asset, crop, hotspot }` plus `"dimensions": asset->metadata.dimensions`. The loader builds final URL strings, so components only ever receive plain `src`, `width` and `height` values.
  - **Nav logo**: `urlFor(logo).width(80).height(80).fit('crop').auto('format')`, rendered at 40×40 as today. It is shown at 2× density and cropped around the hotspot.
  - **Credential logos**: height 64 (rendered at 32), with the width taken from the asset's aspect ratio. This preserves today's mixed 32×32 and 64×32 logos, and constitution VIII's explicit width and height.
  - **CTA background**: `urlFor(bg).width(1800).auto('format')` applies the editor's crop. Because the banner is a CSS `background-size: cover` image, the hotspot is applied as `background-position: {x*100}% {y*100}%`. This is the only way a cover background can respect the focal point.
- **Rationale**: This satisfies FR-021. Building URLs server-side keeps the project settings and the builder out of the browser bundle.
- **Alternatives**: Appending `?w=` to raw asset URLs was rejected earlier because it ignores crop and hotspot.

## R7. Hiding the CTA per page

- **Decision**: Route modules can export `handle = { hideSiteCta: true }`. `Layout` reads `useMatches()` and checks whether any match's `handle.hideSiteCta` is set. For now, when it is set, `Layout` renders `WhatToExpect` in the CTA's place, exactly as the pathname check did. Only `booking/index.tsx` sets the handle.
- **Rationale**: This satisfies FR-022 and removes the dependency on `PAGE_ROUTES_DATA.BOOKING.path` inside `Layout`.
- **Forward note**: The Booking ticket will source What to Expect content from `bookingPage`, which the root loader doesn't have. That ticket will likely move `WhatToExpect` into the booking route's own render and leave `Layout` to handle only `hideSiteCta`.

## R8. Rendering links

- **Decision**: A link is valid when it has a non-empty label and a URL that starts with `/`, `http://`, `https://`, `mailto:` or `tel:`. `#` and anything else are dropped during mapping. URLs starting with `/` render through React Router's `Link`; all others render as `<a href>`.
- **Rationale**: This satisfies the spec's incomplete-items edge case, FR-018 (no `#` from the CMS) and the external-destinations edge case.
- **Alternatives**: Rendering every link as `<a>` was rejected because internal links would lose client-side navigation, and prefetching would need the root loader to be skipped anyway.

## R9. Excluding Booking from the header links (clarification Q1)

- **Decision**: The header filters out any nav link whose URL equals `PAGE_ROUTES_DATA.BOOKING.path`, as the current code does. The footer's "Navigate" column renders the full list. "Book now" keeps linking to `PAGE_ROUTES_DATA.BOOKING.path`.
- **Rationale**: This follows FR-012a.

## R10. Footer description line breaks

- **Decision**: The CMS field is plain `text`. The component splits it on `\n` and joins the lines with `<br />`. The fallback stores today's two lines joined by `\n`.
- **Rationale**: This reproduces today's `<br />` without rich text or `dangerouslySetInnerHTML`.

## R11. Where the root's loader, fallback and query live

- **Decision**:
  - The query goes in `app/lib/sanity/queries/global.ts`. Constitution III puts cross-route queries in `app/lib/sanity/queries/` and names siteSettings as its example.
  - The loader and mappers go in `app/root.loader.server.ts`, and the fallback in `app/root.fallback.server.ts`, next to `root.tsx`, which is their only consumer.
  - The global prop types go in `app/types/global.ts`, since constitution V puts shared shapes in `app/types/`.
- **Rationale**: This follows the gallery template's split (queries, `loader.server`, `fallback.server`) adapted to a root that is a single file rather than a folder.
- **Alternatives**: A new `app/global/` folder was rejected; it would add a top-level directory for three files.

## R12. Not refetching on navigation

- **Decision**: Root exports `shouldRevalidate = () => false`.
- **Rationale**: This satisfies FR-003 and SC-005. There are no root-level actions, so there is no case where the root data needs refreshing mid-session.

## R13. Server-only verification

- **Decision**: After `npm run build`, search `build/client/` for `SANITY_PROJECT_ID`, the project ID value, `fallback`-only strings (for example the fallback copyright text) and `createClient`. Any match fails SC-008. Quickstart step 6 has the exact commands.
