# Research: Services page content from the content studio

All Technical Context unknowns are resolved below. Each entry is a decision, the rationale, and the alternatives considered. Where COT-031 already settled a question the same way, the entry says so rather than repeating the reasoning.

## R1. Existing content

**Decision**: No migration and no seeding. Code against the published `servicesPage` singleton and `siteSettings.credentialBadges` as they are.

**Rationale**: A public CDN query against `production` on 2026-10-08 found:

| Section | State |
|---|---|
| `hero` | Filled. "Our services" / "Tailored Flow, Elevated Living" / body. No images, no link |
| `about` | Filled. Photo (alt "founder photo"), "About Curated" / "Where order meets elegance", bio, signature "— Rina, Founder and Lead Curator" |
| `services` | 5 entries, 01–05, each with heading, description, image with alt, 3–5 bullets, CTA "Get started" |
| `pricing` | "Investment" / "Transparent pricing", note, 3 tiers: Coaching (price, description, CTA "Book Consultation"), Lead Organizer (price, description, CTA "Book Consultation " with a trailing space, **`featured: false`**), Fees (4 features, no price/description/CTA) |
| `seo` | Title "Services", description "Services tailored to your lifestyle.", share image with alt |
| `siteSettings.credentialBadges` | 2 badges, both with logos: "National association of productivity and organizing", "The board of certification for professional organizers" |

Every section uses published content right away. The fallback paths are exercised only by the outage and partial-content checks in [quickstart.md](quickstart.md). Unlike Home, there's no empty section in production to prove a fallback.

**Visible differences on release** (published content wins, spec Assumptions):
- "Lead Organizer" loses its highlight until the owner ticks "Featured".
- The badge labels show the longer published wording, in studio order (NAPO first).
- Service images change from Unsplash to the owner's uploaded images.
- The page title becomes "Services | {businessName}" (from Studio SEO) instead of today's site default. `PAGE_ROUTES_DATA.SERVICES.metaData` isn't read anywhere since COT-030, so the page currently shows the site-wide default.

**Alternatives considered**: Ask the owner to set "Featured" before release. That's an editorial step, not code. It's flagged in the handover instead.

## R2. Fallback pattern

**Decision**: Same as COT-031 R2, unchanged. The loader returns fully resolved content. Each section has an anchor (FR-011). A missing anchor means the whole section uses its `FALLBACK` entry, empty optional strings resolve to `undefined` and are hidden, and lists and images use `orFallback` / their own backup. A missing client, a thrown fetch or a `null` page means the loader logs with a `[services]` prefix and returns `FALLBACK_SERVICES_CONTENT`.

Services-specific anchors:

| Section | Anchor | Falls back on its own |
|---|---|---|
| Hero | `heading` | — |
| About text | `heading` **and** `bio` | Founder photo; credential badges |
| Credential badges | ≥1 badge with a logo asset | — |
| Services | ≥1 entry with `heading` and an image asset | — |
| Pricing header | `heading` | Pricing cards |
| Pricing cards | ≥1 tier with `title` | — |

About needs both heading and bio because the bio is the body of the section. A heading over an empty column would look broken (SC-005).

**Rationale**: The user asked for the COT-031 pattern.

## R3. Shared helpers

**Decision**: Move two helpers from `home.loader.server.ts` into `app/lib/sanity/mappers.server.ts`:
- `nonNull` (type guard)
- `mapPageSeo` → exported as `toPageSeo(seo, businessName: string)`. Callers pass `text(businessName) ?? BACKUP_BUSINESS_NAME`, so the shared lib doesn't import from a root file.

The Home loader then imports both. Its behavior doesn't change.

**Rationale**: COT-031 R3 set the rule: anything two routes use goes in `app/lib/`. Services is the second route with page SEO, so per-page SEO mapping is now shared. Copying it would let the title suffix and description rules drift (FR-016). Gallery and Booking will reuse it.

**Alternatives considered**: Duplicate `mapPageSeo` in the Services loader. Rejected for drift. Import it from the Home loader, which couples two routes. Rejected.

## R4. Image delivery

**Decision**:

| Image | Markup today | Resolved as | Size |
|---|---|---|---|
| Service image | CSS `background-image` on `.serviceImg` | `BackgroundImage` via `toBackground(img, 1400)` | Half of a full-width row (≈720px at 1440px) → 1400 |
| Founder photo | `<img>` with `object-fit: contain` | `ImageItem` via `toImage(img, { height: 640, alt })` | Requests 1280px tall. `width`/`height` attributes reduce layout shift |
| Credential logo | `<img>` | `ImageItem` via `toImage(img, { height: 48, alt })` | Same helper as footer logos (32 high there). Width follows the logo's aspect ratio, so logos of any shape share one height (spec edge case) |

`toImage` needs `dimensions`, so the query projects `"dimensions": asset->metadata.dimensions` for the founder photo and logos, as the global query does for footer logos.

The founder photo uses `object-fit: contain`, so the whole (cropped) image is always visible. `urlFor` applies the crop. The focal point has nothing to adjust, so it's satisfied trivially (FR-004). The service images use `toBackground`, which applies crop and hotspot, the same as Home's cards.

**Rationale**: Keeps today's markup and CSS. `auto('format')` serves AVIF/WebP.

**Alternatives considered**: Switch service images to `<img>`. That's the same deferred markup rework as COT-031 R4.

## R5. Backup images

**Decision** (spec Clarifications):
- **Service images**: today's five Unsplash URLs, unchanged, as `BackgroundImage { src, alt: heading, position: '50% 50%' }`.
- **Founder photo**: `~/assets/ceo_img_3.png` (2048×2048), as `ImageItem` with `width: 640, height: 640` and today's alt "Rina, Founder and Lead Curator".
- **Credential logos**: `~/assets/napo-circular-logo.png` (40×40) and `napo-title-logo.png` (80×50), today's labels "CPO Certified" / "NAPO Member", today's alt text and order.

The untracked `services_img_1–4.avif` files are not imported.

**Rationale**: The user chose today's URLs so the outage page is identical to today (SC-004).

## R6. Search & sharing

**Decision**: Same as COT-031 R6. `SERVICES_QUERY` also fetches `seo{…}` and `"businessName"` in the one request (FR-007). The loader resolves `seo` with the shared `toPageSeo` (R3). `index.tsx` exports `meta` that merges over the root default with `mergeSeo`, identical to Home's. `PAGE_ROUTES_DATA.SERVICES.metaData` is deleted (FR-017).

The entry is already dead code: nothing has read `metaData` since COT-030, so deleting it (including its `keywords` tag) changes no output.

## R7. Visual parity with editor-typed text

**Decision**: No CSS changes. The eyebrows and CTA labels are already uppercased in CSS. Published copy matches today's casing, and the pricing tier eyebrows ("COACHING", "Lead") are shown as typed, as today. Trailing spaces are trimmed by `text()`.

## R8. Accessibility of CMS images

**Decision**:
- **Service image**: `.serviceImg` gains `role="img"` and `aria-label={image.alt}`, matching Home's `ServiceCard`. Alt is the CMS alt, or the service heading. Today the div has no accessible name.
- **Founder photo**: CMS alt, then the signature line with the leading "— " removed, then `''` (decorative).
- **Credential logo**: CMS alt, then the badge label.

**Rationale**: FR-005, constitution VII, COT-029.

## R9. Revalidation and caching

**Decision**: Same as COT-031 R9. No `shouldRevalidate`; `useCdn: true` with the 2000 ms timeout.

## R10. Verification approach

**Decision**: Same as COT-031 R10: `npm run typecheck`, `npm run build`, a client-bundle scan, and the manual scenarios in [quickstart.md](quickstart.md). Because every section is published (R1), the partial-content checks need temporary Studio edits (or a non-production dataset), restored afterwards.

## R11. TypeGen

**Decision**: Hand-write the `CmsServices*` types next to the loader. This is the same exception COT-028 to COT-031 logged.

## R12. List keys

**Decision**: Service blocks, pricing cards, bullets and features key on their index. Badges key on index too.

**Rationale**: Keys are only stable within one server render, and published text may repeat (two identical bullets, or two tiers both titled "Fees"). Duplicate keys would drop items, which breaks FR-003. The lists never reorder on the client, so index keys are safe.
