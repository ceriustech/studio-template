# Research: Booking page from the content studio

## R1. Existing content

A public CDN query against `production` on 2026-10-16 found:

| Content | State |
|---|---|
| `bookingPage` | **Not published** |
| `siteSettings.businessPhoneDisplay` / `businessPhoneTel` | "(703) 555-0182" / "+17035550182" |
| `siteSettings.businessHours` | "Mon-Fri, 9am-5pm ET · Sat by appointment" |
| `siteSettings.businessName` | `null`, so titles use `BACKUP_BUSINESS_NAME` |
| `CALENDLY_URL` (`.env`) | `https://calendly.com/rc-curatedorganization` |

**Visible differences on release**: none. Every section uses its backup copy, the phone and hours already match today's values, and the Calendly widget falls back to the environment link.

## R2. Fallback pattern

The fallback pattern is the same as COT-031 to COT-033: the loader returns fully resolved content, with one fallback decision per section.

| Section | Anchor | Falls back field by field | Hidden when blank |
|---|---|---|---|
| Hero | `heading` | — | eyebrow, body |
| Path cards | ≥1 usable card | `ctaLabel`, `ctaHref` → `#calendly`, `variant` → `secondary` | description |
| Call info | `heading` | `switchToEmailLabel` | eyebrow, intro |
| Phone (`siteSettings`) | display text **and** `tel` value | — | hours |
| Questionnaire | `heading` | both section labels, all 5 field labels, `submitLabel`, all 4 messages | eyebrow, intro, placeholders, `submitNote` |
| Calendar | `heading` | — | eyebrow |
| Calendar "can't load" message | `errorTitle` | — | icon, description |
| What to expect | `heading` | — | eyebrow |
| What to expect steps | ≥1 step with `number` and `title` | — | step description |
| Calendly link | valid studio link | → `CALENDLY_URL` → `null` | — |
| SEO | per field | → `siteSettings.defaultSeo` (from the root loader) | — |

A missing client or a failed fetch logs a `[booking]` message and serves the full backup. In that case the Calendly link still comes from `CALENDLY_URL`, because the environment variable doesn't depend on Sanity.

**Path cards.** A card is usable when it has a title, a known `kind` and a known `icon`. An `options` card also needs at least one option with a label and a `phone` or `email` icon. Published and backup cards are never mixed. `ctaHref` is kept when it starts with `#`, `/` or `https://`, and otherwise falls back to `#calendly`. The click handler still opens scheduling on the page, as today.

## R3. Where "What to expect" renders

`Layout` in `root.tsx` renders `<WhatToExpect />` in place of the CTA when a matched route's `handle` sets `hideSiteCta`. The booking loader returns `whatToExpect`, and `Layout` reads it with `useRouteLoaderData<typeof bookingLoader>('routes/pages/booking/index')`, which is typed. The route id is React Router's default (the component path without its extension) because `routes.ts` doesn't set ids. That id goes in a `BOOKING_ROUTE_ID` constant next to the import.

`Layout` renders the section only when that data exists. If the booking route fails and its error boundary shows, the section is left out rather than shown with hardcoded copy. Copy is never kept in the client bundle (FR-015).

**Alternative rejected**: fetching `whatToExpect` in the root loader. It would add a query to every page for a section that only Booking shows.

## R4. Questionnaire messages

`utils.ts` currently builds a module-level zod schema with hardcoded messages. The change replaces it with `createInquirySchema(messages)`, and `parseInquiry(form, messages)` builds the schema on each submit, which is cheap. `Inquiry` stays `z.infer<ReturnType<typeof createInquirySchema>>`. What gets checked is unchanged. Only the message strings change.

## R5. Calendly link

- **Studio**: add a `calendlyUrl` field (type `url`) to the `calendar` object, with the validation `rule.uri({ scheme: ['https'] }).custom(...)`. The custom check accepts only the hosts `calendly.com` and `www.calendly.com`, and its message reads "Use your Calendly link, e.g. https://calendly.com/your-name". The field is optional. Its help text says it overrides the link the developer set. The document description drops "The Calendly URL … stay code-defined".
- **App**: `utils.ts` gets `isCalendlyUrl()`, with the same rule and a "keep in sync with studio" comment. The loader resolves `text(calendar.calendlyUrl)` when it passes that check, then `process.env.CALENDLY_URL`, then `null`, and still reads the environment variable only on the server.
- **Deploy**: deploy the Studio after merging so the field appears for the owner. The field is optional, so no migration is needed.

## R6. Icons

The loader returns icon keys (`plus`/`refresh`, `phone`/`email`). Loader data must be serializable, so it can't hold React elements. The components map each key to today's glyphs: `+`, `↻`, `FaPhoneSquareAlt` and `FaEnvelope`. `TwoPaths` connects each option's icon to its handler: `phone` → `onSelectCall`, `email` → `onSelectEmail`. Option keys change from `label` to the option's index, because the owner could enter the same label twice.

## R7. SEO

The page uses the same `meta` export as Gallery: `mergeSeo(rootDefaults, loaderData.seo)`, with `toPageSeo(page.seo, businessName ?? BACKUP_BUSINESS_NAME)`. Under the COT-030 agreement, `PAGE_ROUTES_DATA.*.metaData` was seed copy kept only until each page was wired. Booking is the last page, so `BOOKING.metaData` is removed (as COT-033 did for Gallery). That leaves `BASE_META`, `getSocialMeta`, the `metaData` field and its `PageMetaData` type unused, so they are removed too.
