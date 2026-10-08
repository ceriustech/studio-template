# Data Model: Services page content from the content studio

No schema changes. This document describes the CMS shape the app reads, the resolved shape components receive, and the rules that turn one into the other.

## 1. Sources (existing)

**`servicesPage` singleton** (`studio/schemaTypes/documents/servicesPage.ts`):

| Field | Type | Studio-required |
|---|---|---|
| `hero` | `heroSection`: `eyebrow`, `heading`, `body` (`images`, `linkLabel`, `linkHref` ignored) | `heading` |
| `about` | `photo` (image + `alt`, hotspot), `eyebrow`, `heading`, `bio`, `signature` | photo `alt` |
| `services[]` | `servicesPageItem`: `eyebrow`, `heading`, `description`, `image` (+ `alt`, hotspot), `items[]` (string), `ctaLabel` | `eyebrow`, `heading`, `image` |
| `pricing` | `eyebrow`, `heading`, `note`, `tiers[]` (`pricingTier`: `eyebrow`, `title`, `price`, `description`, `features[]`, `featured`, `ctaLabel`) | tier `eyebrow`, `title` |
| `seo` | `seo`: `title`, `description`, `image` + `alt` | none |

**`siteSettings.credentialBadges[]`** (`credentialBadge`): `label`, `image` (+ `alt`). Both are studio-required.

As on Home, GROQ can return `null` for any field, so the loader treats every field as optional.

## 2. Resolved shape

Shared building blocks (existing, `app/types/global.ts`): `ImageItem`, `BackgroundImage`, `PageSeo`.

Component props (each in its component's `.types.ts`):

| Type | File | Shape |
|---|---|---|
| `HeroProps` | `components/hero/Hero.types.ts` (new) | `{ eyebrow?; heading; body? }` |
| `AboutProps` | `components/about/About.types.ts` (new) | `{ eyebrow?; heading; bio; signature?; photo: ImageItem; badges: CredentialBadge[] }` |
| `CredentialBadge` | same | `{ label?; image: ImageItem }` |
| `ServiceProps` | `components/service/Service.types.ts` (new) | `{ items: ServiceEntry[] }` |
| `ServiceEntry` | `ServiceItem.types.ts` (updated) | `{ eyebrow?; heading; description?; image: BackgroundImage; items: string[]; ctaLabel? }` |
| `ServiceItemProps` | same | `ServiceEntry & { reversed?: boolean }` |
| `PricingProps` | `components/pricing/Pricing.types.ts` (new) | `{ eyebrow?; heading; note?; cards: PricingCardProps[] }` |
| `PricingCardProps` | `PricingCard.types.ts` (updated) | `{ eyebrow?; title; price?; description?; features?: string[]; featured?: boolean; ctaLabel? }` |

Changes from today's types: `ServiceItemProps.imageUrl: string` becomes `image: BackgroundImage`. `description` and `ctaLabel` become optional. `PricingCardProps.eyebrow` becomes optional.

Route-level (`services.types.ts`, new):

```ts
type ServicesContent = {
	hero: HeroProps;
	about: AboutProps;
	services: ServiceEntry[];
	pricing: PricingProps;
	seo: PageSeo; // {} when the page has none or the fetch failed
};
```

Invariants the loader guarantees: every `heading`/`title` is non-empty, `about.bio` is non-empty, `badges`, `services` and `pricing.cards` each have at least one item, and `items`/`features` contain no blank strings. An empty `features` list is `undefined`.

## 3. Resolution rules (`services.loader.server.ts`)

`text(v)` means trimmed, with empty strings treated as `undefined`. `FB` means `FALLBACK_SERVICES_CONTENT`.

| Section | Anchor (FR-011) | If anchor missing | If anchor present |
|---|---|---|---|
| Hero | `text(hero.heading)` | `FB.hero` | Published `eyebrow?`, `heading`, `body?` |
| About text | `text(about.heading)` and `text(about.bio)` | `eyebrow`, `heading`, `bio`, `signature` from `FB.about` | Published `eyebrow?`, `heading`, `bio`, `signature?` |
| Founder photo | photo asset present | `FB.about.photo` | `toImage(photo, { height: 640, alt })`. Alt = `text(alt)`, then the resolved signature without a leading dash, then `''` |
| Credential badges | ≥1 badge with a logo asset | `FB.about.badges` | Usable badges in order. `toImage(image, { height: 48, alt: text(alt) ?? label ?? '' })`, `label: text(label)` |
| Services | ≥1 entry with `text(heading)` and an image asset | `FB.services` | Usable entries only. `image` = `toBackground(img, 1400)` with alt `text(alt) ?? heading`. `items` = trimmed non-empty bullets. `eyebrow?`, `description?`, `ctaLabel?` |
| Pricing header | `text(pricing.heading)` | `eyebrow`, `heading`, `note` from `FB.pricing` | Published `eyebrow?`, `heading`, `note?` |
| Pricing cards | ≥1 tier with `text(title)` | `FB.pricing.cards` | Usable tiers only. `featured` = `tier.featured === true`. `features` = trimmed non-empty strings, or `undefined` when none. Other fields trimmed and optional |
| SEO | none (per field) | n/a | Shared `toPageSeo(seo, text(businessName) ?? BACKUP_BUSINESS_NAME)` (research R3), the same rules as Home |

**Whole-document failure**: if there's no client, the fetch throws, or `page` is `null`, the loader returns `FB` (with `seo: {}`) and logs `[services] …`. A `null` page is a warning; a thrown error is an error. `badges` resolves from `credentialBadges` independently, but on whole-document failure the backup badges are used too, so the page is entirely backup.

## 4. Backup content (`services.fallback.server.ts`)

`FALLBACK_SERVICES_CONTENT: ServicesContent` holds today's hardcoded copy, moved out of the four section components unchanged:

- Hero, About and Pricing copy and prices exactly as today. "Lead Organizer" keeps `featured: true`.
- Five services with today's eyebrows, headings, descriptions, bullets and "Get started". Each image is today's Unsplash URL, with `alt` = heading and `position: '50% 50%'` (research R5).
- Founder photo: `ceo_img_3.png`, 640×640, alt "Rina, Founder and Lead Curator".
- Badges: "CPO Certified" (circular logo, 40×40) then "NAPO Member" (title logo, 80×50), with today's alt text.
- `seo: {}`.

## 5. Shared mappers (`app/lib/sanity/mappers.server.ts`)

Added, moved from `home.loader.server.ts` (research R3):
- `nonNull<T>(value): value is T`
- `toPageSeo(seo: Maybe<CmsSeo>, businessName: string): PageSeo`. The caller resolves `text(businessName) ?? BACKUP_BUSINESS_NAME`.
