# Data Model: Home page content from the content studio

No schema changes. This document describes the CMS shape the app reads, the resolved shape components receive, and the rules that turn one into the other.

## 1. Source: `homePage` singleton (existing, `studio/schemaTypes/documents/homePage.ts`)

| Field | Type | Studio-required |
|---|---|---|
| `hero` | `heroSection`: `eyebrow`, `heading`, `body`, `images[]` (image + `alt`), `linkLabel`, `linkHref` | `heading` |
| `intro` | `heroSection` (images ignored) | `heading` |
| `servicesTeaser` | `eyebrow`, `heading`, `cards[]` (`serviceCard`: `title`, `description`, `image` + `alt`), `linkLabel`, `linkHref` | card `title`, `image` |
| `process` | `eyebrow`, `heading`, `steps[]` (`step`: `number`, `title`, `description`) | step `number`, `title` |
| `beforeAfter` | `eyebrow`, `heading`, `beforeImage`/`afterImage` (`imageMedia`: `image` + `alt`), `caption`, `linkLabel`, `linkHref` | `imageMedia.image` |
| `testimonials[]` | `testimonial`: `quote`, `clientName`, `clientLocation`, `rating` (1–5) | `quote`, `clientName`, `rating` |
| `seo` | `seo`: `title`, `description`, `image` + `alt` | none |

Studio validation only blocks publishing in the Studio. GROQ can still return `null` for any field (empty sections, older documents), so the loader treats every field as optional.

## 2. Resolved shape (`app/routes/pages/home/home.types.ts` + component `.types.ts`)

Shared building blocks (existing `app/types/global.ts`): `LinkItem { label; url }`, `SeoContent`.

New, in `app/types/global.ts`:

```ts
type BackgroundImage = { src: string; alt: string; position: string }; // alt '' = decorative
type PageSeo = Partial<SeoContent>;
```

Component props (each in its component's `.types.ts`):

| Type | Shape |
|---|---|
| `HeroProps` | `{ eyebrow?; heading; body?; link?: LinkItem; slides: BackgroundImage[] }` |
| `IntroProps` | `{ eyebrow?; heading; body?; link?: LinkItem }` |
| `ServicesProps` | `{ eyebrow?; heading; link?: LinkItem; cards: ServiceCardItem[] }` |
| `ServiceCardItem` | `{ title; description?; image: BackgroundImage }` |
| `ProcessProps` | `{ eyebrow?; heading; steps: ProcessStep[] }` |
| `ProcessStep` | `{ number; title; description? }` |
| `BeforeAfterProps` | `{ eyebrow?; heading; before: BackgroundImage; after: BackgroundImage; caption?; link?: LinkItem }` |
| `TestimonialProps` | `{ items: TestimonialItem[] }` |
| `TestimonialItem` | `{ quote; clientName; clientLocation?; rating: 1–5 }` |

Route-level (`home.types.ts`):

```ts
type HomeContent = {
	hero: HeroProps;
	intro: IntroProps;
	services: ServicesProps;
	process: ProcessProps;
	beforeAfter: BeforeAfterProps;
	testimonials: TestimonialItem[];
	seo: PageSeo; // {} when the page has none or the fetch failed
};
```

Invariants the loader guarantees: every `heading` is non-empty; `slides`, `cards`, `steps` and `testimonials` each have at least one item; `link` is present only with a non-empty label and a valid URL.

## 3. Resolution rules (`home.loader.server.ts`)

`text(v)` means trimmed, with empty strings treated as `undefined`. `FB` means `FALLBACK_HOME_CONTENT`.

| Section | Anchor (FR-011) | If anchor missing | If anchor present |
|---|---|---|---|
| Hero text | `text(hero.heading)` | `eyebrow`, `heading`, `body`, `link` from `FB.hero` | Published `eyebrow?`, `heading`, `body?`. `link` follows the link rule below with backup href `/booking` |
| Hero slides | ≥1 image with an asset | `FB.hero.slides` | `toBackground(img, 1800)` per image, in order |
| Intro | `text(intro.heading)` | `FB.intro` | Published fields. Link backup href `/services` |
| Services header | `text(servicesTeaser.heading)` | `eyebrow`, `heading`, `link` from `FB.services` | Published fields. Link backup href `/services` |
| Service cards | ≥1 card with `text(title)` and an image asset | `FB.services.cards` | Usable cards only. Image `toBackground(img, 800)`, alt = `text(alt) ?? title` |
| Process header | `text(process.heading)` | `eyebrow`, `heading` from `FB.process` | Published fields |
| Process steps | ≥1 step with `text(number)` and `text(title)` | `FB.process.steps` | Usable steps only |
| Before/after text | `text(beforeAfter.heading)` | `eyebrow`, `heading`, `caption`, `link` from `FB.beforeAfter` | Published fields. Link backup href `/gallery` |
| Before image / after image | each: image asset present | That image from `FB.beforeAfter` | `toBackground(img, 1100)`. Alt = `text(alt) ?? "Before — {heading}"` (or "After — …") |
| Testimonials | ≥1 with `text(quote)` and `text(clientName)` | `FB.testimonials` | Usable items. `rating` = integer 1–5, otherwise 5. `clientLocation?` |
| SEO | none (per field) | n/a | `title` = `withBusinessName(text(seo.title), text(businessName) ?? BACKUP_BUSINESS_NAME)` if set. `description` = text with line breaks collapsed. `image` = `toShareImage` (1200×630 JPG). Each key is omitted when empty |

**Link rule**: no `text(linkLabel)` means no link. Otherwise the result is `{ label, url: linkHref }` if `isValidLink`, or `{ label, url: backupHref }` if not.

**Whole-document failure**: if there's no client, the fetch throws, or the result is `null`, the loader returns `FB` (with `seo: {}`) and logs `[home] …`. A `null` result is logged as a warning; a thrown error as an error.

## 4. Backup content (`home.fallback.server.ts`)

`FALLBACK_HOME_CONTENT: HomeContent` holds today's hardcoded copy, moved out of the six components. Changes from today's code:

- Link labels lose their trailing `→`, which the components now render (research R7).
- Hero slides, service card images and before/after images use the bundled `app/assets/home_*` AVIFs (R5).
- `seo` is `{}`, so the page uses the site default.

## 5. SEO merge (`app/lib/seo.ts`)

`mergeSeo(defaults: SeoContent, page: PageSeo = {}): SeoContent` returns `{ ...defaults, ...page }`, keeping only the page keys that are defined. Home `meta` passes the merged result to the existing `buildMeta`.
