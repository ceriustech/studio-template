---

description: "Task list for COT-032: Services page content from the content studio"
---

# Tasks: Services page content from the content studio

**Input**: Design documents from `/specs/COT-032-services-sanity-integration/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/services-query.md](contracts/services-query.md), [quickstart.md](quickstart.md)

**Tests**: The spec doesn't ask for automated tests, so none are included. Checks are static checks plus the manual steps in [quickstart.md](quickstart.md).

**Organization**: Tasks are grouped by user story.

- US1: published content renders.
- US2: complete page when the content service is down.
- US3: partially filled content.
- US4: Services search & sharing.

US2 runs before US1, as in COT-031. Both are P1, and wiring the backup content first gives a shippable page that looks exactly like today, which every later story builds on.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US4)

## Path Conventions

- All paths are relative to `curated-organization/`. `SVC` = `app/routes/pages/services`. `HOME` = `app/routes/pages/home`.
- App code style: tabs, single quotes, semicolons, `{ spaced }` braces. Match `HOME/home.loader.server.ts`, which is the template for this work.
- MUST NOT touch `studio/` (no schema changes).
- No `any`, `@ts-ignore` or `as` casts (constitution V). Use type guards, as `nonNull` does.
- Don't import or stage the untracked `app/assets/services_img_{1,2,3,4}.avif` files (spec Clarifications).

---

## Phase 1: Setup

- [X] T001 Confirm the current branch is `COT-032-services-sanity-integration` (created from `main` on 2026-10-08) and that `npm run typecheck` passes before any changes, so later failures are clearly from this work.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared helpers, types, query, backup content and prop-driven components. Every story depends on these. See [data-model.md](data-model.md) §2, §4 and §5.

- [X] T002 In `app/lib/sanity/mappers.server.ts`, add two exports moved from `HOME/home.loader.server.ts` (research R3):
  - `export const nonNull = <T>(value: T | null | undefined): value is T => value != null;`
  - `export function toPageSeo(seo: Maybe<CmsSeo>, businessName: string): PageSeo`. Copy the body of Home's `mapPageSeo`, but use the `businessName` argument directly in `withBusinessName(title, businessName)`. Keep its comment (`// Same rules as the root default (COT-030), but empty keys are left out so they fall back to it.`). Import `PageSeo` from `~/types/global`. MUST NOT import from `~/root.fallback.server`.
- [X] T003 Update `HOME/home.loader.server.ts`: delete the local `nonNull` and `mapPageSeo`, import `nonNull` and `toPageSeo` from `~/lib/sanity/mappers.server`, and in `mapHome` set `seo: toPageSeo(page.seo, text(businessName) ?? BACKUP_BUSINESS_NAME)`. Drop any imports that become unused (`toShareImage`, `withBusinessName`, `CmsSeo`, `PageSeo` if no longer referenced). Home behavior MUST be unchanged. Depends on T002.
- [X] T004 [P] Create the new component types files from [data-model.md §2](data-model.md):
  - `SVC/components/hero/Hero.types.ts`: `export type HeroProps = { eyebrow?: string; heading: string; body?: string };`
  - `SVC/components/about/About.types.ts`: `CredentialBadge = { label?: string; image: ImageItem }` and `AboutProps = { eyebrow?: string; heading: string; bio: string; signature?: string; photo: ImageItem; badges: CredentialBadge[] }`. Import `ImageItem` from `~/types/global`.
  - `SVC/components/service/Service.types.ts`: `export type ServiceProps = { items: ServiceEntry[] };`, importing `ServiceEntry` from `./components/ServiceItem/ServiceItem.types`.
  - `SVC/components/pricing/Pricing.types.ts`: `PricingProps = { eyebrow?: string; heading: string; note?: string; cards: PricingCardProps[] }`, importing `PricingCardProps` from `./components/PricingCard/PricingCard.types`.
- [X] T005 [P] Update the existing types files:
  - `SVC/components/service/components/ServiceItem/ServiceItem.types.ts`: replace with `ServiceEntry = { eyebrow?: string; heading: string; description?: string; image: BackgroundImage; items: string[]; ctaLabel?: string }` and `ServiceItemProps = ServiceEntry & { reversed?: boolean }`. Import `BackgroundImage` from `~/types/global`.
  - `SVC/components/pricing/components/PricingCard/PricingCard.types.ts`: make `eyebrow` optional. Keep the rest.
- [X] T006 Create `SVC/services.types.ts` exporting `ServicesContent = { hero: HeroProps; about: AboutProps; services: ServiceEntry[]; pricing: PricingProps; seo: PageSeo }`, with the comment on `seo` used in `HOME/home.types.ts` (`// {} when the page has no search & sharing values of its own, or the fetch failed.`). Depends on T004 and T005.
- [X] T007 [P] Create `SVC/services.query.ts` exporting `SERVICES_QUERY = defineQuery(...)` (from `groq`) with the GROQ in [contracts/services-query.md §1](contracts/services-query.md) exactly. Format it like `HOME/home.query.ts`.
- [X] T008 Create `SVC/services.fallback.server.ts` exporting `FALLBACK_SERVICES_CONTENT: ServicesContent` (data-model §4). Copy all copy **verbatim** from the current components before T009 changes them. Depends on T006.
  - **hero:** eyebrow `'Our services'`, heading `'Tailored Flow, Elevated Living'`, and today's body from `SVC/components/hero/index.tsx` (collapse the JSX line breaks to single spaces).
  - **about:**
    - Eyebrow `'About Curated'`, heading `'Where order meets elegance'`, today's bio from `SVC/components/about/index.tsx` as one string (collapse JSX line breaks to single spaces, keep the em dash in "sanctuaries—delivering"), signature `'— Rina, Founder and Lead Curator'`.
    - `photo`: `{ src: ceoImage, alt: 'Rina, Founder and Lead Curator', width: 640, height: 640 }`, importing `ceoImage from '~/assets/ceo_img_3.png'`.
    - `badges`, in today's order: `{ label: 'CPO Certified', image: { src: napoCircularLogo, alt: 'The Board of Certification for Professional Organizers', width: 40, height: 40 } }`, then `{ label: 'NAPO Member', image: { src: napoTitleLogo, alt: 'NAPO — National Association of Productivity and Organizing Professionals member', width: 80, height: 50 } }`. Import both from `~/assets/napo-*.png`, as `app/root.fallback.server.ts` does.
  - **services:** today's five entries from `SVC/components/service/index.tsx` with the same `eyebrow`, `heading`, `description`, `items` and `ctaLabel: 'Get started'`. Replace each `imageUrl` with `image: { src: <today's URL, unchanged>, alt: <the heading>, position: '50% 50%' }`.
  - **pricing:** eyebrow `'Investment'`, heading `'Transparent pricing'`, today's note (one string), and `cards` = today's three cards from `SVC/components/pricing/index.tsx` exactly, including `featured: true` on Lead Organizer and `ctaLabel: 'Book consultation'`.
  - **seo:** `{}`.
- [X] T009 [P] Make the four section components and two item components prop-driven. Delete every hardcoded copy, image and list constant, since it now lives in T008. Optional props MUST be hidden when `undefined` (FR-012). Keep class names, CSS and markup otherwise. Depends on T004 and T005, and on T008 having copied the old copy first.
  - **`SVC/components/hero/index.tsx`** (`React.FC<HeroProps>`): render the `sectionEyebrow` and the body `<p>` only when present.
  - **`SVC/components/about/index.tsx`** (`React.FC<AboutProps>`):
    - Render the eyebrow + heading block in both `aboutBriefHeaderMobile` and `aboutBriefHeaderDesktop` from the same props; the eyebrow only when present.
    - `<img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} className="aboutBriefPhoto" fetchPriority="high" />`. Keep the commented-out overlay line.
    - Bio in the existing `<p>`. `aboutSignature` only when `signature` exists.
    - Map `badges` (index key, research R12) into the existing `aboutLogoItem` markup: `aboutLogoLabel` only when `label` exists, and `<img src alt width height>` from `badge.image`.
    - Remove the three asset imports (they move to T008).
  - **`SVC/components/service/index.tsx`** (`React.FC<ServiceProps>`): map `items` to `<ServiceItem key={index} {...item} reversed={index % 2 === 1} />`. Delete the `services` array.
  - **`SVC/components/service/components/ServiceItem/ServiceItem.tsx`:**
    - Image div: `role="img"`, `aria-label={image.alt}`, `style={{ backgroundImage: \`url('${image.src}')\`, backgroundPosition: image.position }}` (research R8). Keep the overlay div.
    - Render eyebrow, description, the `serviceIncludes` list (only when `items.length > 0`, index keys) and the `/booking` CTA (only when `ctaLabel` exists) conditionally.
  - **`SVC/components/pricing/index.tsx`** (`React.FC<PricingProps>`): eyebrow and `pricingNote` only when present. Map `cards` with `key={index}`. Delete the `cards` array.
  - **`SVC/components/pricing/components/PricingCard/PricingCard.tsx`:** render `pricingCardEyebrow` only when `eyebrow` exists, render the features list only when `features` has items, and switch feature keys to index. CTA stays `/booking`.

**Checkpoint**: `npm run typecheck` passes, apart from `SVC/index.tsx` not yet passing props (fixed in T010).

---

## Phase 3: User Story 2 - Visitors always see a complete Services page, even when the content service is down (Priority: P1) 🎯 MVP

**Goal**: The Services route always renders full content. For now it always uses backup content, and US1 adds published content.

**Independent Test**: With `SANITY_PROJECT_ID` removed, and again with `SANITY_DATASET=does-not-exist`, `/services` renders all four sections exactly like `main` (same Unsplash images, badges and highlighted Lead Organizer), with no error page and the expected log line (quickstart §3).

- [X] T010 [US2] Rewrite `SVC/index.tsx`:
  - `export { loader } from './services.loader.server';`
  - `export default function Services({ loaderData }: Route.ComponentProps)` with `import type { Route } from './+types/index'`. It renders `<main>` with `<Hero {...loaderData.hero} />`, `<About {...loaderData.about} />`, `<Service items={loaderData.services} />`, `<Pricing {...loaderData.pricing} />`.
- [X] T011 [US2] Create `SVC/services.loader.server.ts`.
  - **Types:** hand-written `CmsServices*` result types for [contracts/services-query.md §1](contracts/services-query.md), built from `Maybe`/`CmsImage`/`CmsSeo` in `mappers.server.ts`, with the comment `// Hand-written until the TypeGen ticket. GROQ returns null for any field an editor left blank.` Lists are `Maybe<Maybe<T>[]>`, string lists `Maybe<Maybe<string>[]>`. Define `ServicesQueryResult = { page: CmsServicesPage | null; badges: Maybe<Maybe<CmsBadge>[]>; businessName: Maybe<string> }`.
  - **Loader:** `export async function loader(): Promise<ServicesContent>`, matching Home's loader line for line:
    - No client: return `FALLBACK`.
    - `try` the fetch of `SERVICES_QUERY`. If `!result?.page`, run `console.warn('[services] servicesPage not found, serving fallback content')` and return `FALLBACK`.
    - Otherwise return `mapServicesPage({ ...result, page: result.page })`.
    - `catch`: `console.error('[services] Sanity fetch failed, serving fallback content', error)` and return `FALLBACK`.
  - For this phase, `mapServicesPage` returns `FALLBACK`, and US1 replaces it. Import `FALLBACK_SERVICES_CONTENT as FALLBACK`. **Done:** written in its final form (with T012, T013 and T016) rather than as a stub, since all four tasks edit the same file.

**Checkpoint**: Run quickstart §3. The page looks identical to `main` (SC-004), apart from service images now exposing alt text.

---

## Phase 4: User Story 1 - Owner updates services and prices without a developer (Priority: P1)

**Goal**: Published `servicesPage` content and Site Settings badges render, with the per-section fallback decisions in [data-model.md §3](data-model.md).

**Independent Test**: Quickstart §2. Every section shows published content (Sanity CDN images, alt text, published badge wording, no highlighted pricing card).

- [X] T012 [US1] In `SVC/services.loader.server.ts`, add one mapper per section. Each follows the data-model §3 rules exactly. Add the comment Home uses above its mappers, adapted: `// Each section has an anchor. Without it the section's text uses its backup in full; with it, empty optional fields are hidden. Lists and images fall back on their own.`
  - **`mapHero(hero)`:** anchor `text(hero?.heading)`. Missing means `FALLBACK.hero`. Otherwise `{ eyebrow: text(..), heading, body: text(..) }`. Ignore any images or link.
  - **`mapAbout(about, badges)`:**
    - Text anchor is `text(about?.heading)` **and** `text(about?.bio)`. If either is missing, take `eyebrow`, `heading`, `bio` and `signature` from `FALLBACK.about`; otherwise published `eyebrow`/`signature` via `text(..)`.
    - `photo` = `toImage(about?.photo, { height: 640, alt })` ?? `FALLBACK.about.photo`, where `alt` = `text(about?.photo?.alt) ?? resolvedSignature?.replace(/^[—–-]\s*/, '') ?? ''`.
    - `badges` = `orFallback((badges ?? []).flatMap(...), FALLBACK.about.badges)`. For each badge, `label = text(badge?.label)` and `image = toImage(badge?.image, { height: 48, alt: text(badge?.image?.alt) ?? label ?? '' })`. Drop badges with no image. Return `{ label, image }`.
  - **`mapServiceList(services)`:** keep entries with `text(heading)` and a non-null `toBackground(image, 1400)`. Image alt is `image.alt || heading`. `items` = `(entry.items ?? []).map(text).filter(nonNull)`. `eyebrow`, `description`, `ctaLabel` via `text(..)`. Apply `orFallback` with `FALLBACK.services`.
  - **`mapPricing(pricing)`:**
    - Cards (decided independently): keep tiers with `text(title)`. `featured: tier.featured === true`. `features` = trimmed non-empty strings, or `undefined` when none remain. `eyebrow`, `price`, `description`, `ctaLabel` via `text(..)`. Apply `orFallback` with `FALLBACK.pricing.cards`.
    - Header anchor is `text(pricing?.heading)`. Missing means `{ ...FALLBACK.pricing, cards }`. Otherwise `{ eyebrow: text(..), heading, note: text(..), cards }`.
- [X] T013 [US1] Replace the `mapServicesPage` stub. It calls the four mappers with `result.page.*` (and `result.badges` for About) and sets `seo: {}`, which US4 fills in.

**Checkpoint**: Quickstart §2 passes. Publish a bullet edit in Studio and confirm it appears after a reload, then revert it.

---

## Phase 5: User Story 3 - Partially filled content still produces a complete page (Priority: P2)

**Goal**: Confirm the per-section rules from T009 and T012 hold for every partial-content case. These are the same functions, so this phase is verification plus fixes.

**Independent Test**: Quickstart §4.

- [X] T014 [US3] Code-review `SVC/services.loader.server.ts` against every row of [data-model.md §3](data-model.md):
  - No section mixes published and backup text when its anchor is present.
  - No list mixes published and backup items (services, cards, badges); empty bullet/feature lists inside a published item are hidden, not backfilled.
  - The founder photo and badges resolve independently of the About text.
  - Whitespace-only strings count as empty everywhere, including list items.

  Fix any gaps in place.
- [X] T015 [US3] Verify [quickstart.md §4](quickstart.md). Every section is published, so either run the rows with temporary Studio edits (restore each one), or do what COT-031 T017 did: run the real loader against fixture documents through a stubbed Sanity client, covering every §4 row plus the Studio-required anchors. Record which method was used and the results here. **2026-10-08:** Ran the real loader against fixture documents through a stubbed Sanity client (Vite `ssrLoadModule` with the client module replaced). 36/36 checks pass, covering every quickstart §4 row, the Studio-required anchors (whitespace-only hero heading, untitled tier, service without heading), whole-document failures and per-field SEO. Re-running §4 in Studio is optional.

---

## Phase 6: User Story 4 - Services page has its own Google and link-preview text (Priority: P3)

**Goal**: Services' own `seo` overrides the site default field by field (FR-015–FR-017).

**Independent Test**: [quickstart.md §5](quickstart.md).

- [X] T016 [US4] In `SVC/services.loader.server.ts`, set `seo: toPageSeo(page.seo, text(businessName) ?? BACKUP_BUSINESS_NAME)` in `mapServicesPage`. Import `BACKUP_BUSINESS_NAME` from `~/root.fallback.server`. Depends on T002 and T013.
- [X] T017 [US4] In `SVC/index.tsx`, add the same `meta` as `HOME/index.tsx`, with its comment: `export const meta: Route.MetaFunction = ({ loaderData, matches, location }) => { const defaults = matches[0]?.loaderData?.seo; return defaults ? buildMeta(mergeSeo(defaults, loaderData?.seo), location.pathname) : []; };`. Import `buildMeta` and `mergeSeo` from `~/lib/seo`.
- [X] T018 [P] [US4] In `app/routes/constants/index.ts`, delete the `metaData` property of `PAGE_ROUTES_DATA.SERVICES` only (FR-017). Leave `BASE_META`, `getSocialMeta` and the Gallery and Booking `metaData` alone.

**Checkpoint**: Quickstart §5. `/services` shows `Services | {businessName}` and the published description and share image. `/` keeps Home's values.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T019 Run [quickstart.md §1](quickstart.md): `npm run typecheck`, `npm run build`, and the `build/client` grep, which must print nothing. Fix any failures.
- [X] T020 Check for leftovers with `grep -rn "unsplash\|const services\|const cards\|ceo_img\|napo-" app/routes/pages/services --include=*.tsx`. There should be no hits (they now live only in `services.fallback.server.ts`). Also confirm `grep -n "mapPageSeo\|const nonNull" HOME/home.loader.server.ts` has no hits.
- [X] T021 Walk through [quickstart.md](quickstart.md) §2, §3 and §6 against `npm run dev`, and recheck `/` still renders Home content and Home's `<head>` (regression check for T003). Record results, and anything left for the user (for example, the network-off case or Studio publishing), under this task. **2026-10-08:** §2 verified against the live CMS: every section published, 5 Sanity service images with alt text, no highlighted card, published badge labels, "Book Consultation" trimmed, `<title>Services | Curated Organization</title>`. `/` still renders Home content with `Home | Curated Organization`. §3 verified for "not configured" and "bad dataset" (expected log lines, about 300 ms). The backup render's `<main>` was diffed against `main` rendered in a temporary worktree: the only differences are the new `role="img"`/`aria-label`/`background-position` on service images and `width`/`height` on the founder photo (SC-004). §6 verified in the HTML. Network-off case is left for the user. **Content issue found:** the Services share image is a 299×83 logo, so the 1200×630 crop keeps only its middle (`rect=71,0,158,83`). Fix this in Studio by uploading a landscape share image.
- [X] T022 [P] In `specs/COT-032-services-sanity-integration/plan.md` Scale/Scope, correct the file counts if implementation differed. Then mark completed tasks `[X]` in this file. **Done:** counts match the plan (8 new, 12 edited).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none.
- **Foundational (Phase 2)**: after Setup. Blocks every story.
- **US2 (Phase 3)**: after Phase 2. It's the MVP and makes the route compile and render.
- **US1 (Phase 4)**: after US2, because it fills in `mapServicesPage` in the loader US2 creates.
- **US3 (Phase 5)**: after US1, because it verifies US1's mappers.
- **US4 (Phase 6)**: T016 after T013 (same function). T017 after T010 (same file). T018 any time after Phase 2.
- **Polish (Phase 7)**: after all stories.

### Within phases

- Phase 2: T002 → T003. T004, T005 and T007 in parallel. T006 after T004 and T005. T008 after T006. T009 after T004/T005, but read the old copy for T008 first.
- US2: T010 and T011 together (index imports the loader).
- US1: T012 → T013.
- US4: T016 → T017, with T018 in parallel.

### Parallel Opportunities

```text
# Phase 2
T002 → T003   ||   T004 || T005 || T007   → T006 → T008 → T009 (6 component files)

# US4
T018 (constants/index.ts) || T016 → T017
```

---

## Implementation Strategy

### MVP First

1. Phases 1–2, then **US2**. Services is prop-driven and renders its backup content in every case. It looks like today and survives any outage.
2. **US1**. Published content goes live in every section.
3. **US3**. Verify the partial-content rules.
4. **US4**. Services' own search & sharing fields take effect.
5. Polish.

### Notes

- Commit per phase using Conventional Commits, prefixed with the ticket as in earlier work. For example:
  - `COT-032: refactor: share page seo mapper`
  - `COT-032: feat: services renders from fallback content`
  - `COT-032: feat: wire services page to sanity`
  - `COT-032: feat: services page seo`
- Don't stage `app/assets/services_img_*.avif` (unused by this feature) or any `studio/` files.
- Visible changes to mention in the PR (research R1):
  - Every section now shows published content, including the owner's service photos.
  - "Lead Organizer" is no longer highlighted until "Featured" is ticked in the Studio.
  - The credential badges show the published labels, NAPO first, at a shared height.
  - The page title is now "Services | {businessName}" with its own description and share image.
  - Service images now expose alt text.
