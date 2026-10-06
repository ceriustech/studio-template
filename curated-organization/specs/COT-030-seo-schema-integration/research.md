# Research: Plain-language SEO fields and a site-wide default

All Technical Context unknowns are resolved below. Each entry is a decision, the rationale, and the alternatives considered.

## R1. Existing content and migration

**Decision**: No migration. Rename and remove fields directly.

**Rationale**: A public query against `production` on 2026-10-05 returned one document, `siteSettings` (`brandName: "Curated"`, `defaultSeo: null`). No page documents exist yet, so no `metaTitle`, `metaDescription`, `keywords` or `ogImage` values exist to move.

**Alternatives considered**: A `sanity migration` that renames the fields. Rejected because there's no data to move.

## R2. Where the title suffix comes from

**Decision**: Add a new optional `businessName` string to `siteSettings` (group `brand`). The loader uses `businessName`, or the backup `"Curated Organization"` when it's empty. The suffix is skipped when the title already contains it (case-insensitive).

**Rationale**: `brandName` is the nav wordmark ("Curated"), so using it would produce "… | Curated". The user chose a separate field that isn't required (see the spec's Clarifications). The backup keeps titles correct while the field is empty, which matches how every other global field falls back today.

**Alternatives considered**: Use `brandName` (wrong text); hardcode the suffix in code (the client can't edit it); make the field required (rejected by the user).

## R3. "Required only on the default"

**Decision**: The shared `seo` object has no `required()` rules. The `defaultSeo` field on `siteSettings` gets an object-level `rule.custom()` that returns path-scoped errors (`{message, path: ['title']}` and `['description']`). The errors then show on the child fields.

**Rationale**: One shared type stays optional everywhere (FR-008). The default still blocks publishing when either value is empty (FR-007), and the error appears next to the field that needs fixing.

**Alternatives considered**: Two object types (`seo` and `defaultSeo`). Rejected because it duplicates the concept, against constitution II. Another option was a `required` option read through `options`, but Sanity validation rules can't read field options cleanly.

## R4. Length warnings

**Decision**: `rule.max(60).warning(...)` on `title` and `rule.max(160).warning(...)` on `description`. Warning text: "Google usually shows about 60 characters; longer titles may be cut off." and "Google usually shows about 160 characters; longer summaries may be cut off."

**Rationale**: Warnings don't block publishing (FR-005). The live preview (R6) shows the count, so the owner sees the number and not just the warning.

## R5. Live-site meta output

**Decision**:
- The root loader's `GLOBAL_QUERY` also selects `businessName` and `defaultSeo{ title, description, image{ asset, crop, hotspot, alt } }`. This adds no extra request (FR-016).
- `root.loader.server.ts` gets a `mapSeo()` that returns a resolved `SeoContent` (`{ title, description, image? }`). The title already has the suffix. Values are trimmed, and line breaks in the description are collapsed. Missing values fall back per field to `FALLBACK.seo`.
- `app/lib/seo.ts` gets a pure `buildMeta(seo, pathname)` that returns React Router `MetaDescriptor[]`. `root.tsx` exports `meta = ({ loaderData, location }) => …`. Later page tickets reuse `buildMeta` with their merged values, which is why it lives in `app/lib/`.
- `SITE_URL = 'https://curatedorganization.com'` goes in `app/constants/index.ts`. `og:url` is `SITE_URL + pathname` (FR-013).

**Rationale**: This follows the pattern COT-028 set: fetch once, map to app types in the loader, fall back per field. Keeping resolution in the loader keeps `meta` a plain mapping, and keeps `.server` fallback content out of the client bundle.

**Alternatives considered**: Resolving fallbacks inside `meta`. Rejected because `meta` also runs in the client bundle and can't import `root.fallback.server.ts`.

**Note**: If the root loader didn't run (a non-GET error response), `loaderData` is undefined and `meta` returns `[]`. That matches how `Layout` already skips global chrome in that case. These responses are never indexed or shared.

## R6. Tags emitted

**Decision**: `title`, `description`, `og:type=website`, `og:url`, `og:title`, `og:description`. When an image exists, also `og:image`, `og:image:width`, `og:image:height`, `og:image:alt` (when alt is set), and `twitter:card=summary_large_image`.

**Rationale**: `og:image:alt` uses the COT-029 alt text (spec edge case). Without `twitter:card`, X shows a small thumbnail instead of the share image, which would fail SC-005 on X. `og:type` is required by the Open Graph protocol.

**Share image URL**: `urlFor(image).width(1200).height(630).fit('crop').format('jpg').url()`. This respects the hotspot and crop. The format is fixed to JPEG because some link-preview scrapers don't handle WebP or AVIF, and `auto('format')` depends on the scraper's Accept header.

## R7. Duplicate charset and viewport tags

**Decision**: Remove `httpEquiv: Content-type` and `viewport` from the meta output. `Layout` already renders `<meta charSet="utf-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1">`.

**Rationale**: Today both are output twice. The `META_DATA` viewport adds `maximum-scale=1.0`, which blocks pinch-zoom and conflicts with WCAG 1.4.4 (Resize text, constitution VII). FR-014 requires one copy each. **Visible effect**: users can pinch-zoom on mobile again.

## R8. Google-result preview in Studio

**Decision**: A custom object input, `studio/components/SeoInput.tsx`, set as `components.input` on the `seo` type. It renders a preview card above `props.renderDefault(props)`. Inputs:
- Its own values come from `props.value` (`title`, `description`). They update as the owner types.
- Defaults and the business name come from `useEditState('siteSettings', 'siteSettings')` (draft, otherwise published). This lets a page's preview show the default when its own field is empty, and makes the Site Settings preview react live to `businessName` edits.
- Title composition (suffix + no-duplicate check) is a small helper in `studio/components/seoTitle.ts`. It mirrors `mapSeo`'s logic, because the Studio is a separate package and can't import from `app/`.
- The URL line shows `curatedorganization.com`. The character count appears as "42 / 60". The preview's UI is built with `@sanity/ui` (`Card`, `Stack`, `Text`), so it matches the Studio theme in light and dark mode.

**Rationale**: Wrapping `renderDefault` keeps all the standard field behavior (validation markers, help text, image input) and adds only the preview. `useEditState` is the public Studio hook for reading another document's current state, with no extra client or listener setup.

**Alternatives considered**: `sanity-plugin-seo-pane` / `@sanity/seo-tools`. Rejected because they're a heavier dependency for about 40 lines of UI, and they add their own jargon-heavy UI. A document-level view pane was rejected because it's hidden behind a tab, so the owner wouldn't see it next to the fields.

**Dependency note**: `@sanity/ui` (4.2.4) is already installed as a dependency of `sanity`. It was meant to be declared in `studio/package.json`, but declaring it re-resolves `react` to 19.3.0 while `react-dom` stays at 19.2.7, which the Studio rejects. It stays undeclared until a dependency ticket aligns React (see tasks T002).

## R9. Pages that override root meta

**Decision**: Leave the not-found route's own `meta` (title + `noindex`) unchanged.

**Rationale**: In React Router, a route that exports `meta` replaces its parent's. A 404 shouldn't show the site default or be indexed. Every other route exports no `meta`, so they inherit root's (FR-011).

## R10. TypeGen

**Decision**: Hand-write the `CmsSeo` type in `root.loader.server.ts`, next to the existing hand-written `Cms*` types. Log the exception in Complexity Tracking.

**Rationale**: TypeGen isn't set up yet (`sanity.types.ts` doesn't exist). COT-028 and COT-029 logged the same exception and left TypeGen for its own ticket.

## R11. Testing

**Decision**: There's no automated test suite. Verification uses `npm run typecheck` (app), `npx tsc --noEmit`, `npx sanity schema validate` and `npx sanity build` (studio), plus the manual checks in [quickstart.md](quickstart.md). These include view-source checks and a share-debugger check on the deployed URL.
