# Data Model: Connect global components to Sanity (COT-028)

**No Sanity schema changes.** This ticket reads the existing `siteSettings` and `siteCta` documents (`studio/schemaTypes/documents/`).

There are three layers:

1. **CMS result**: what the query returns. Every field is optional, because editors can leave anything blank.
2. **Global content**: what the root loader returns and the components receive. Every required field is present.
3. **Fallback**: a constant of the global content type.

The loader's mappers turn layer 1 into layer 2, deciding the fallback one section at a time.

## 1. CMS result (hand-written; replaced by TypeGen in its own ticket)

The query is in [contracts/global-query.md](./contracts/global-query.md).

```ts
type CmsImage = {
	asset?: { _ref: string };
	crop?: { top: number; bottom: number; left: number; right: number };
	hotspot?: { x: number; y: number; width: number; height: number };
	dimensions?: { width: number; height: number; aspectRatio: number };
	alt?: string; // COT-029; only read for credential logos
};
type CmsLink = { label?: string; url?: string };            // navLink + contactLink share this shape
type CmsHoursLine = { label?: string; value?: string };
type CmsCredential = { label?: string; image?: CmsImage };

type CmsSiteSettings = {
	brandName?: string;
	brandTagline?: string;
	logo?: CmsImage;
	bookNowLabel?: string;
	navLinks?: CmsLink[];
	footerBrandDescription?: string;
	footerLogos?: CmsCredential[];
	footerNavLinks?: CmsLink[];
	connectLinks?: CmsLink[];
	footerHours?: CmsHoursLine[];
	copyrightText?: string;
};

type CmsSiteCta = {
	backgroundImage?: CmsImage;
	heading?: string;
	subheading?: string;
	buttonLabel?: string;
	buttonLink?: string;
};

type GlobalQueryResult = { settings: CmsSiteSettings | null; cta: CmsSiteCta | null };
```

## 2. Global content (`app/types/global.ts`)

```ts
type LinkItem = { label: string; url: string };             // url validated per research R8
type ImageItem = { src: string; alt: string; width: number; height: number };

type BrandContent = { name: string; tagline?: string; logo: ImageItem };

type FooterContent = {
	description?: string;          // may contain \n; the component renders the line breaks
	logos: ImageItem[];
	navigateLinks: LinkItem[];     // footer "Navigate" column
	connectLinks: LinkItem[];      // may be empty → column not rendered (FR-018a)
	hours: { label: string; value: string }[];
	copyright?: string;
};

type CtaContent = {
	background: { src: string; position: string };    // position = CSS background-position from the hotspot, default "50% 50%"
	heading: string;
	subheading?: string;
	buttonLabel: string;
	buttonHref: string;
};

type GlobalContent = {
	brand: BrandContent;
	navLinks: LinkItem[];          // header filters out the Booking path (FR-012a); footer uses all
	bookNowLabel: string;
	footer: FooterContent;
	cta: CtaContent;
};
```

## 3. Fallback decision per section (FR-008)

Each row falls back independently of the others.

| Section | Uses CMS when… | Otherwise |
|---|---|---|
| `brand` | `brandName` is non-empty. The tagline and logo then fall back individually if missing. | Fallback brand |
| `navLinks` | At least one item passes link validation (R8), after dropping invalid items | Fallback nav links |
| `bookNowLabel` | Non-empty | `"Book now"` |
| `footer.description` | Non-empty | Fallback description |
| `footer.logos` | At least one credential has an image asset; the image's `alt` (COT-029) becomes the alt text, falling back to the label (FR-016) | Fallback logos |
| `footer.connectLinks` | At least one valid item | Fallback: `[]` (every placeholder is `#`, so the column isn't rendered) |
| `footer.hours` | At least one item with both label and value | Fallback hours |
| `footer.copyright` | Non-empty | Fallback copyright |
| `cta` | `heading`, `buttonLabel` and `backgroundImage.asset` are all present. `buttonLink` must pass link validation, otherwise it defaults to the Booking path. | Fallback CTA |

If the whole fetch fails, the client is not configured, or both documents are `null`, every row takes its "Otherwise" value.

## 4. Fallback values (`app/root.fallback.server.ts`)

These are today's hardcoded values, moved unchanged. The one exception is that `#` links are dropped (FR-018a).

| Field | Value |
|---|---|
| brand.name / tagline | `CURATED` / `Professional Organizing` |
| brand.logo | `~/assets/curated-logo.png`, alt `""`, 40×40. Decorative, because the link's `aria-label` names it, as today. |
| navLinks | Home `/`, Services `/services`, Gallery `/gallery`, Booking `/booking`. These are today's displayed casings; the "HOME"→"Home" reformatting is removed. |
| bookNowLabel | `Book now` |
| footer.description | `Your home curated to your lifestyle - because time is your biggest luxury.\nBased in the NOVA / DMV area.` |
| footer.logos | NAPO circular (32×32) and NAPO title (64×32) local assets, with today's alt text |
| footer.connectLinks | `[]` |
| footer.hours | `Mon – Fri` / `9am – 5pm`; `Sat` / `By appointment`; `Sun` / `Closed` |
| footer.copyright | `© 2026 Curated Organization. All rights reserved.` |
| cta | Today's Unsplash background (position `50% 50%`), "Ready to transform your space?", "Your complimentary 30-minute consultation starts here", "Book a consultation", `/booking` |

The footer's "Navigate" column now renders the shared `navLinks` list. That means it shows "Home" and "Booking" where today it shows "Services", "Gallery" and "Book". This change is expected (see the spec's Assumptions).

## 5. Component props

| Component | Props (new) | Replaces |
|---|---|---|
| `Navigation` | `{ brand: BrandContent; links: LinkItem[]; bookNowLabel: string }` | `{ items?: NavItems }` with the `NAVBAR_DATA` default |
| `Footer` | `{ brandName: string; content: FooterContent; navLinks: LinkItem[] }` | `{}` |
| `Cta` | `CtaContent` | `{}` |

`NAVBAR_DATA`, and the `NAVIGATION` global interface in `app/index.d.ts`, are deleted once nothing references them (constitution: no dead code).

## 6. Route handle

```ts
type RouteHandle = { hideSiteCta?: boolean };
```

Only `booking/index.tsx` exports one: `{ hideSiteCta: true }`.
