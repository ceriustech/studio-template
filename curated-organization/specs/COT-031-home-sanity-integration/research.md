# Research: Home page content from the content studio

All Technical Context unknowns are resolved below. Each entry is a decision, the rationale, and the alternatives considered.

## R1. Existing content

**Decision**: No migration and no seeding. Code against the published `homePage` singleton as it is.

**Rationale**: A public CDN query against `production` on 2026-10-08 found a published `homePage` document (`_id: "homePage"`, a Studio singleton):

| Section | State |
|---|---|
| `hero` | Filled. Eyebrow "The sanctuary of simplicity", heading "Curated", body, 3 images with alt text, no hotspots, link "Discover Your Space" → `/booking` |
| `intro` | Filled. "Our Approach" / "Functional Luxury", link "Learn more about us" → `/services` |
| `servicesTeaser` | Filled. Heading, 3 cards each with a title, image and alt text, link "View all services" → `/services` |
| `process` | Filled. Heading and 4 steps |
| `beforeAfter`, `testimonials`, `seo` | Not set |

Once this ships, four sections use published content right away, and Before/after, Testimonials and SEO exercise the fallback path in production. This updates the spec assumption that the document might not exist; the fallbacks still cover that case.

**Alternatives considered**: Seed the missing sections from the backup copy. Rejected because entering content is out of scope (spec), and leaving them empty proves the fallbacks.

## R2. Fallback pattern

**Decision**: Use the COT-028/COT-030 pattern unchanged (spec Clarifications).

- The loader returns fully resolved content. Components never see CMS shapes or apply fallbacks themselves.
- Each section has an anchor: the required fields in FR-011. If the anchor is missing, the section is replaced by its `FALLBACK` entry, the same way `mapCta` in `root.loader.server.ts` works.
- If the anchor is present, empty optional strings resolve to `undefined` and the component hides them (as with `cta.subheading`).
- Lists use `orFallback(published, backup)`, and individual images are resolved separately (as with `cta.background`).
- If there's no client, the fetch throws, or the document is `null`, the loader logs with a `[home]` prefix and returns `FALLBACK_HOME_CONTENT`.

**Rationale**: The user asked for the established pattern. It keeps one fallback decision per section in one file, which makes it easy to audit.

**Alternatives considered**: Fall back field by field for all text (the first spec draft). Rejected by the user, because it mixes published and backup copy within one section.

## R3. Sharing mapping helpers between root and Home

**Decision**: Move the generic helpers out of `root.loader.server.ts` into a new `app/lib/sanity/mappers.server.ts`:

- types: `Maybe`, `CmsImage`, `CmsLink`, `CmsSeo`
- helpers: `text`, `isValidLink`, `toLinks`, `toHref`, `hotspotPosition`, `toImage`, `toBackground`, `orFallback`, `withBusinessName`, `toShareImage`

The root loader imports them, and its behavior doesn't change.

**Rationale**: The constitution puts anything used on two or more routes in `app/lib/`. The Home loader needs the same text trimming, link validation, image building and title suffix. Copying them would let the two drift, and Services, Gallery and Booking will need them next. The `.server` suffix keeps them out of the browser bundle (FR-014a).

**Alternatives considered**: Import them from `root.loader.server.ts`, which couples a route to root internals. Or duplicate them in the Home loader. Both rejected.

## R4. Image delivery

**Decision**: All Home images keep today's markup: CSS `background-image`, plus a visually hidden `<img>` for before/after. Each image resolves to `{ src, alt, position }`:

- `src` = `urlFor(image).width(W).auto('format')`. `urlFor` applies the editor's crop rectangle.
- `position` = the hotspot as a `background-position`, or `50% 50%` when there's no hotspot.

This is the same approach as the CTA banner. The widths, about 2× the largest rendered width, are:

| Image | Width |
|---|---|
| Hero slide | 1800 (matches CTA) |
| Service card | 800 (card max ≈ 360px; 420px on mobile) |
| Before / after | 1100 (cell max ≈ 540px) |

**Rationale**: Covers FR-004 (crop, focal point and suitable size) without changing the markup or CSS. `auto('format')` serves AVIF/WebP. Background images don't cause layout shift because the containers have fixed heights in CSS.

**Alternatives considered**: Switch to `<img>` with `width`/`height` and `object-position`. That's a markup and CSS rework of three sections, outside this ticket, so it's left for a later performance pass.

## R5. Backup images

**Decision**: `home.fallback.server.ts` imports `app/assets/home_hero_slide_img_{1,2,3}.avif` and `home_services_img_{1,2,3}.avif`, and `home_beforeandafter_img_1.avif` (before) and `home_beforeandafter_img_2.avif` (after). Vite resolves them to hashed URLs, as `root.fallback.server.ts` does for the logos. The before/after component keeps its `onError` "image unavailable" placeholder as a last resort. Backup images use `position: '50% 50%'` and today's alt text.

**Rationale**: FR-009 requires bundled backups for the hero and cards. The user added before/after AVIFs on 2026-10-08, so every Home backup image is now bundled, with no outside image service. The 1 = before, 2 = after mapping follows file order; confirm it visually during implementation.

**Alternatives considered**: Use `site_brand_img.png` as a share-image backup. Rejected because the backup SEO is the site default, which COT-030 deliberately leaves without an image.

## R6. Home search & sharing (FR-015–FR-017)

**Decision**:

- `HOME_QUERY` also fetches `seo{ title, description, image{…} }` and `"businessName": *[_id == "siteSettings"][0].businessName`, still in one request (FR-007).
- The loader resolves a `PageSeo` (all fields optional) with the same rules as `mapSeo`: trim, collapse summary line breaks, suffix the business name using `BACKUP_BUSINESS_NAME` when empty, never twice, and a 1200×630 JPEG share image.
- `app/lib/seo.ts` gains `mergeSeo(defaults: SeoContent, page?: PageSeo): SeoContent`, which overrides only the fields the page defines.
- Home exports `meta`. It reads the root default from `matches[0].loaderData.seo` and returns `buildMeta(mergeSeo(rootSeo, loaderData?.seo), location.pathname)`. It returns `[]` when root data is missing, which matches root's own guard.
- `PAGE_ROUTES_DATA.HOME.metaData` is deleted. `Routes.metaData` is already optional, and other pages keep theirs until their tickets.

**Rationale**: In React Router a child `meta` replaces the parent's, so Home must emit the full set. Merging in `meta` means a Home fetch failure (`seo: {}`) yields exactly the site default (US4 scenario 4) with no duplicated default logic. The title is composed server-side, so `meta` (which runs in the client bundle) never imports `.server` code. COT-030 R5 sets the same constraint.

**Alternatives considered**: Add `businessName` to `GlobalContent` and compose in `meta`. That changes the root contract and puts suffix logic in the client bundle. Or fetch `defaultSeo` again in `HOME_QUERY`, which duplicates data root already has. Both rejected.

## R7. Visual parity with editor-typed text

**Decision**:

- Add `text-transform: uppercase` to `.heroHeadline`. The published heading is "Curated", and today's hardcoded headline is "CURATED".
- Render the `→` after text links as a decorative `<span aria-hidden="true">` in the component, not as part of the label. This applies to the Intro, Services and Before/after links. The hero button has no arrow. Published labels have no arrow ("Learn more about us"), and backup labels drop theirs.

**Rationale**: Editors type natural text, and the design treatment stays in code (SC-004: indistinguishable from today). The eyebrow and CTA are already uppercased in CSS.

**Alternatives considered**: Ask the owner to type arrows and capitals. Rejected because it's fragile and the arrow would be read aloud by screen readers.

## R8. Accessibility of CMS images

**Decision**:

- **Hero:** the active slide gets `role="img"` and `aria-label={alt}` when alt is present. Inactive slides, and slides without alt, stay `aria-hidden`.
- **Service cards:** use the card's alt, or the card title if alt is empty (spec edge case).
- **Before/after:** the hidden `<img>` uses the CMS alt, or `"{Before|After} — " + heading` if empty.

**Rationale**: FR-005 and constitution VII. The published hero slides already have alt text.

## R9. Revalidation and caching

**Decision**: No `shouldRevalidate` on Home. The loader reruns on each navigation to `/`. The client keeps `useCdn: true` with a 2000 ms timeout.

**Rationale**: Home has no search params, so the gallery-style skip doesn't apply. Rerunning keeps published edits fresh. The CDN request is fast, and the timeout bounds the worst case (SC-003).

## R10. Verification approach

**Decision**: No automated suite (same as COT-028/030). Checks are `npm run typecheck`, `npm run build`, a scan of `build/client` for server-only strings, and the manual scenarios in [quickstart.md](quickstart.md). Outages are simulated by:

- unsetting `SANITY_PROJECT_ID` (not configured)
- setting `SANITY_DATASET` to a non-existent dataset (request error)
- turning the network off (unreachable or timeout)

**Rationale**: These match the project's current tooling. Partial-content cases are covered in production by the empty Before/after, Testimonials and SEO sections (R1). Anchor-missing cases are checked by temporarily unpublishing a field in Studio and restoring it.

## R11. TypeGen

**Decision**: Hand-write the `CmsHome*` result types next to the loader, and log the same exception as COT-028/029/030.

**Rationale**: `sanity.types.ts` still doesn't exist. Setting up TypeGen is its own ticket.
