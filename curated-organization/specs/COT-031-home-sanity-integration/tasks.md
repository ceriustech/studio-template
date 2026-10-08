---

description: "Task list for COT-031: Home page content from the content studio"
---

# Tasks: Home page content from the content studio

**Input**: Design documents from `/specs/COT-031-home-sanity-integration/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/home-query.md](contracts/home-query.md), [quickstart.md](quickstart.md)

**Tests**: The spec doesn't ask for automated tests, so none are included. Checks are static checks plus the manual steps in [quickstart.md](quickstart.md).

**Organization**: Tasks are grouped by user story.

- US1: published content renders.
- US2: complete page when the content service is down.
- US3: partially filled content.
- US4: Home search & sharing.

US2 runs before US1. Both are P1, and wiring the backup content first gives a shippable page that looks exactly like today, which every later story builds on.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1–US4)

## Path Conventions

- All paths are relative to `curated-organization/`. `HOME` = `app/routes/pages/home`.
- App code style: tabs, single quotes, semicolons, `{ spaced }` braces. Match `app/root.loader.server.ts`.
- MUST NOT touch `studio/` (no schema changes). `studio/package.json` and `studio/package-lock.json` have the user's uncommitted changes, so leave them alone and don't stage them.
- No `any`, `@ts-ignore` or `as` casts (constitution V). Use type guards, as `isValidLink` does.

---

## Phase 1: Setup

- [X] T001 Confirm the current branch is `COT-031-home-sanity-integration` (created from `main` on 2026-10-08).
- [X] T002 Confirm these untracked backup images exist in `app/assets/`: `home_hero_slide_img_{1,2,3}.avif`, `home_services_img_{1,2,3}.avif` and `home_beforeandafter_img_{1,2}.avif`. Open the before/after pair and confirm `_1` is the "before" (cluttered) image and `_2` the "after". If they're the other way round, swap them in T009 and note it here. **2026-10-08:** All 8 files are present. The tooling here can't decode AVIF, so the before/after order (`_1` = before, `_2` = after) is unverified. The user should confirm it visually.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared helpers, types, query, backup content and prop-driven components. Every story depends on these. See [data-model.md](data-model.md) §2–§4.

- [X] T003 Create `app/lib/sanity/mappers.server.ts` and move these from `app/root.loader.server.ts` unchanged, exporting each:
  - **Types:** `Maybe`, `CmsImage`, `CmsLink`, `CmsSeo`.
  - **Helpers:** `LINK_PREFIXES` (unexported), `text`, `isValidLink`, `toLinks`, `hotspotPosition`, `ImageOptions` + `toImage`, `orFallback`, `withBusinessName` (keep its comment pointing to `studio/components/seoTitle.ts`).

  Add these new helpers:
  - `toHref(url: Maybe<string>, backup: string): string`. Returns `url` if it starts with one of `LINK_PREFIXES`, otherwise `backup`.
  - `toLink(label: Maybe<string>, url: Maybe<string>, backupUrl: string): LinkItem | undefined`. Returns `undefined` when `text(label)` is empty, otherwise `{ label: text(label), url: toHref(url, backupUrl) }`.
  - `toBackground(image: Maybe<CmsImage>, width: number): BackgroundImage | null`. Returns `null` without `image?.asset?._ref`. Otherwise returns `{ src: urlFor(image).width(width).auto('format').url(), alt: text(image.alt) ?? '', position: hotspotPosition(image) }`.
  - `toShareImage(image: Maybe<CmsImage>): ImageItem | undefined`. Move the image branch out of `mapSeo`: 1200×630, `fit('crop')`, `format('jpg')`, alt `text(image.alt) ?? ''`, and keep the JPEG comment.
- [X] T004 Update `app/root.loader.server.ts` to import everything T003 moved, and delete the local copies. In `mapSeo`, replace the inline image block with `...(image && { image })`, where `const image = toShareImage(seo?.image)`. Use `toBackground` only if it gives identical output for the CTA. Otherwise leave `mapCta` as is. Root behavior MUST be unchanged. **Done:** `mapCta` left as is (its background has no `alt`, so `toBackground` isn't identical).
- [X] T005 [P] In `app/types/global.ts`, add `export type BackgroundImage = { src: string; alt: string; position: string };` with the comment `// alt '' = decorative`, and `export type PageSeo = Partial<SeoContent>;`.
- [X] T006 [P] Update the component prop types to match [data-model.md §2](data-model.md):
  - Create `HOME/components/hero/Hero.types.ts`, exporting `HeroProps`.
  - Create `HOME/components/Intro/Intro.types.ts`, exporting `IntroProps`.
  - Create `HOME/components/BeforeAfter/BeforeAfter.types.ts`, exporting `BeforeAfterProps`.
  - Rewrite `HOME/components/Services/Services.types.ts`: `ServicesProps`, `ServiceCardItem` and `ServiceCardProps = ServiceCardItem`.
  - Rewrite `HOME/components/Process/Process.types.ts`: `ProcessProps`, with `ProcessStep.description` optional.
  - Rewrite `HOME/components/Testimonial/Testimonial.types.ts`: `TestimonialItem` with `clientLocation?: string`, and `TestimonialProps = { items: TestimonialItem[] }`.

  Import `LinkItem` and `BackgroundImage` from `~/types/global`.
- [X] T007 Create `HOME/home.types.ts` exporting `HomeContent` from data-model §2. Import the component prop types from T006 and `PageSeo`. Depends on T005 and T006.
- [X] T008 [P] Create `HOME/home.query.ts` exporting `HOME_QUERY = defineQuery(...)` with the GROQ in [contracts/home-query.md §1](contracts/home-query.md) exactly. Add a `CmsHome` result type next to the loader in T013, not here.
- [X] T009 Create `HOME/home.fallback.server.ts` exporting `FALLBACK_HOME_CONTENT: HomeContent`. Copy today's copy verbatim from the six components before T010 changes them. Depends on T007.
  - **hero:**
    - Eyebrow `'THE SANCTUARY OF SIMPLICITY'`, heading `'CURATED'`, body `'Your home curated to your lifestyle - because time is your biggest luxury'`.
    - Link `{ label: 'DISCOVER YOUR SPACE', url: '/booking' }`.
    - Slides: imports of `~/assets/home_hero_slide_img_{1,2,3}.avif`, each `{ src, alt: '', position: '50% 50%' }`.
  - **intro:**
    - Today's eyebrow, heading and body.
    - Link `{ label: 'Learn more about us', url: '/services' }`, with no arrow.
  - **services:**
    - Eyebrow `'Personalized services'`, heading `'Tailored Flow, Elevated Living'`.
    - Link `{ label: 'View all services', url: '/services' }`.
    - Cards: today's three titles, descriptions and alt texts, with images from `~/assets/home_services_img_{1,2,3}.avif` at position `'50% 50%'`.
  - **process:** eyebrow `'Our process'`, heading `'How it works'`, and today's four steps.
  - **beforeAfter:**
    - Eyebrow `'The transformation'`, heading `'See the difference'`, and today's caption.
    - Link `{ label: 'View full gallery', url: '/gallery' }`.
    - `before`/`after` from `~/assets/home_beforeandafter_img_1.avif` / `_2.avif`, with today's alt texts.
  - **testimonials:** today's three items.
  - **seo:** `{}`.
- [X] T010 [P] Make the six components prop-driven. Delete every hardcoded copy, image and list constant, since it now lives in T009. Optional props MUST be hidden when `undefined` (FR-012). Keep existing class names, CSS and markup otherwise.
  - **`HOME/components/hero/index.tsx`** (`React.FC<HeroProps>`):
    - Map `slides` with `key={slide.src}`, setting `backgroundImage` and `backgroundPosition: slide.position`.
    - The active slide with a non-empty `alt` gets `role="img"` and `aria-label={alt}`. All others get `aria-hidden="true"` (research R8).
    - Start the interval only when `slides.length > 1`, depending on `slides.length`.
    - Render `heroStrapline`, `heroDescriptor` and the `heroCta` link only when their prop exists.
  - **`HOME/components/Intro/Intro.tsx`** (`React.FC<IntroProps>`): render eyebrow, body and link only when present. The link text is `{link.label} <span aria-hidden="true">→</span>`.
  - **`HOME/components/Services/Services.tsx` + `ServiceCard.tsx`:**
    - Map `cards` with `key={card.title}`.
    - The card image div uses `backgroundImage: url('${image.src}')`, `backgroundPosition: image.position` and `aria-label={image.alt || title}`.
    - The card still links to `/services` (functional). Render the description only when present.
    - The footer link uses `Link` from `react-router` with `to={link.url}`, and only when `link` exists, followed by the `aria-hidden` arrow.
  - **`HOME/components/Process/Process.tsx`:** map `steps` from props. Keep the connector condition `index < steps.length - 1`, and render the description only when present.
  - **`HOME/components/BeforeAfter/BeforeAfter.tsx`:**
    - Build the two cells from `before`/`after` props with the tags `'Before'`/`'After'`. The cells still link to `/gallery`.
    - Set `backgroundPosition` from `image.position`, and set the hidden `<img alt>` from `image.alt`.
    - Keep the `onError` placeholder logic.
    - Render the eyebrow, caption and footer link (with arrow) only when present.
  - **`HOME/components/Testimonial/Testimonial.tsx`:**
    - Take `{ items }`. If `activeIndex` could exceed the range after `items` changes, clamp it (`items[activeIndex] ?? items[0]`).
    - Attribution is `— {clientName}`, plus `, {clientLocation}` only when present.
    - Remove the `console.log`. Also remove the `console.log` in `useTestimonialCarousel.ts`.
- [X] T011 [P] In `HOME/components/hero/hero.css`, add `text-transform: uppercase;` to `.heroHeadline` (research R7).

**Checkpoint**: `npm run typecheck` passes, apart from `HOME/index.tsx` not yet passing props (fixed in T012).

---

## Phase 3: User Story 2 - Visitors always see a complete Home page, even when the content service is down (Priority: P1) 🎯 MVP

**Goal**: The Home route always renders full content. For now it always uses backup content, and US1 adds published content.

**Independent Test**: With `SANITY_PROJECT_ID` removed, and again with `SANITY_DATASET=does-not-exist`, `/` renders all six sections exactly like today, with bundled images, no error page and the expected log line (quickstart §3).

- [X] T012 [US2] Rewrite `HOME/index.tsx`:
  - `export { loader } from './home.loader.server';`
  - `export default function Home({ loaderData }: Route.ComponentProps)` with `import type { Route } from './+types/index'`. It renders `<main>` with each section, passing its props: `<Hero {...loaderData.hero} />`, `<Intro {...loaderData.intro} />`, `<Services {...loaderData.services} />`, `<Process {...loaderData.process} />`, `<BeforeAfter {...loaderData.beforeAfter} />`, `<Testimonial items={loaderData.testimonials} />`.
- [X] T013 [US2] Create `HOME/home.loader.server.ts`.
  - **Types:** hand-written `CmsHome*` result types for [contracts/home-query.md §1](contracts/home-query.md), built from the `Maybe`/`CmsImage`/`CmsSeo` types in `mappers.server.ts`. Add the comment `// Hand-written until the TypeGen ticket.`. Also define `HomeQueryResult = { page: CmsHomePage | null; businessName: Maybe<string> }`.
  - **Loader:** `export async function loader(): Promise<HomeContent>`, following root's pattern:
    - No client: return `FALLBACK`.
    - `try` the fetch of `HOME_QUERY`. If `!result?.page`, run `console.warn('[home] homePage not found, serving fallback content')` and return `FALLBACK`.
    - Otherwise return `mapHome(result)`.
    - `catch`: `console.error('[home] Sanity fetch failed, serving fallback content', error)` and return `FALLBACK`.
  - For this phase, `mapHome` returns `FALLBACK`, and US1 replaces it. Import `FALLBACK_HOME_CONTENT as FALLBACK`.

**Checkpoint**: Run quickstart §3. The page looks identical to the current `main`, apart from bundled images replacing today's stock photos and the arrows now being `aria-hidden` spans.

---

## Phase 4: User Story 1 - Owner updates Home page content without a developer (Priority: P1)

**Goal**: Published `homePage` content renders, with the per-section fallback decisions in [data-model.md §3](data-model.md).

**Independent Test**: Quickstart §2. Hero, intro, services and process show the published content (Sanity CDN images, alt text), and before/after and testimonials show backup content because they're unset.

- [X] T014 [US1] In `HOME/home.loader.server.ts`, add one mapper per section. Each follows the data-model §3 rules exactly.
  - **`mapHero(hero)`:**
    - Text anchor is `text(hero?.heading)`. If it's missing, take `eyebrow`, `heading`, `body` and `link` from `FALLBACK.hero`.
    - If it's present, use `eyebrow: text(..)`, `body: text(..)` and `link: toLink(linkLabel, linkHref, '/booking')`.
    - `slides` = `orFallback(images.map((i) => toBackground(i, 1800)).filter(nonNull), FALLBACK.hero.slides)`, decided independently of the text.
  - **`mapIntro(intro)`:** anchor `heading`. Missing means `FALLBACK.intro`. Link backup is `'/services'`.
  - **`mapServices(teaser)`:**
    - Header anchor is `heading` (eyebrow, heading and link, with link backup `'/services'`).
    - Cards: keep cards with `text(title)` and a non-null `toBackground(image, 800)`. Image alt is `text(image.alt) ?? title`, and description is `text(..)`. Apply `orFallback` with `FALLBACK.services.cards`.
  - **`mapProcess(process)`:**
    - Header anchor is `heading`.
    - Steps: keep steps with `text(number)` and `text(title)`, and description `text(..)`. Apply `orFallback` with `FALLBACK.process.steps`.
  - **`mapBeforeAfter(ba)`:**
    - Text anchor is `heading` (eyebrow, heading, caption, and link with backup `'/gallery'`). If it's missing, take all four from `FALLBACK.beforeAfter`.
    - `before` = `toBackground(ba?.beforeImage?.image, 1100)` with alt `text(alt) ?? \`Before — ${heading}\``, or `FALLBACK.beforeAfter.before`. Do the same for `after`. Use the resolved heading.
  - **`mapTestimonials(items)`:** keep items with `text(quote)` and `text(clientName)`. `clientLocation` is `text(..)`. `rating` is the value if `Number.isInteger(rating) && rating >= 1 && rating <= 5`, otherwise `5`. Apply `orFallback` with `FALLBACK.testimonials`.

  Use a small `nonNull` type guard for the filters; don't use casts.
- [X] T015 [US1] Replace the `mapHome` stub with `mapHome(result): HomeContent`. It calls the six mappers with `result.page.*` and sets `seo: {}`, which US4 fills in.

**Checkpoint**: Quickstart §2 passes. Publish a hero edit in Studio and confirm it appears after a reload, then revert it.

---

## Phase 5: User Story 3 - Partially filled content still produces a complete page (Priority: P2)

**Goal**: Confirm the per-section rules from T010 and T014 hold for every partial-content case. These are the same functions, so this phase is verification plus fixes.

**Independent Test**: Quickstart §4.

- [X] T016 [US3] Code-review `HOME/home.loader.server.ts` against every row of [data-model.md §3](data-model.md) and the link rule.
  - Confirm that no section mixes published and backup text when its anchor is present.
  - Confirm that no list mixes published and backup items.
  - Confirm that before and after images resolve independently.
  - Confirm that whitespace-only strings count as empty.

  Fix any gaps in place.
- [X] T017 [US3] Run [quickstart.md §4](quickstart.md) in Studio, then restore each change. Record any row you can't run (for example, the hero heading, which Studio requires) and how you checked it instead. **2026-10-08:** Instead of editing live content, ran the real loader against fixture documents through a stubbed Sanity client: 13/13 checks pass, covering every quickstart §4 row, including the Studio-required hero heading. Re-running §4 in Studio is optional.

---

## Phase 6: User Story 4 - Home page has its own Google and link-preview text (Priority: P3)

**Goal**: Home's own `seo` overrides the site default field by field (FR-015–FR-017).

**Independent Test**: [quickstart.md §5](quickstart.md).

- [X] T018 [P] [US4] In `app/lib/seo.ts`, add `export function mergeSeo(defaults: SeoContent, page: PageSeo = {}): SeoContent`. It returns `defaults` with each defined `page` key (`title`, `description`, `image`) overriding it. Undefined keys MUST NOT overwrite. This file runs in the client bundle, so keep it pure with no `.server` imports.
- [X] T019 [US4] In `HOME/home.loader.server.ts`, add `mapPageSeo(seo, businessName): PageSeo`. It mirrors root's `mapSeo` rules but omits empty keys:
  - `title`: `withBusinessName(text(seo.title), text(businessName) ?? BACKUP_BUSINESS_NAME)`, only if the title is set. Import `BACKUP_BUSINESS_NAME` from `~/root.fallback.server`.
  - `description`: `text(..)?.replace(/\s*\n\s*/g, ' ')`.
  - `image`: `toShareImage(seo.image)`.

  Use it in `mapHome` for `seo`.
- [X] T020 [US4] In `HOME/index.tsx`, add `export const meta: Route.MetaFunction = ({ loaderData, matches, location }) => { const defaults = matches[0]?.loaderData?.seo; return defaults ? buildMeta(mergeSeo(defaults, loaderData?.seo), location.pathname) : []; };` and import from `~/lib/seo`. If `matches[0].loaderData` isn't typed as the root loader data under React Router 8, use a type guard. Don't use a cast. Depends on T018. **Done:** `matches[0].loaderData` is typed as root data under React Router 8, so no guard or cast is needed.
- [X] T021 [P] [US4] In `app/routes/constants/index.ts`, delete the `metaData` property of `PAGE_ROUTES_DATA.HOME` only (FR-017). Leave `BASE_META`, `getSocialMeta` and the other pages' `metaData` alone, since they're still used.

**Checkpoint**: Quickstart §5. `/` shows the site default today because Home `seo` is unset. `/services` is unaffected.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T022 Run [quickstart.md §1](quickstart.md): `npm run typecheck`, `npm run build`, and the `build/client` grep, which must print nothing. Fix any failures.
- [X] T023 Check for leftovers with `grep -rn "unsplash\|SLIDE_IMAGES\|processSteps\|beforeAfterItems\|console.log" app/routes/pages/home`. There should be no hits.
- [X] T024 Walk through [quickstart.md](quickstart.md) §2, §3 and §6 against `npm run dev`. Record results, and anything left for the user (for example, steps that need Studio publishing), under the task that owns them. **2026-10-08:** §2 verified with the live CMS (all six sections plus Home SEO are now published). §3 verified for "not configured" and "bad dataset". The network-off case is left for the user. §6 verified in the HTML: active hero slide alt, card alts, before/after alts, `aria-hidden` arrows. **Content issue found:** published testimonial `clientName` values include display punctuation ("— Sarah M.,"), so the attribution renders "— — Sarah M.,, McLean, VA". Fix this in Studio, not in code.
- [X] T025 [P] In `specs/COT-031-home-sanity-integration/plan.md` Scale/Scope, correct the file counts if implementation differed. Then mark completed tasks `[X]` in `specs/COT-031-home-sanity-integration/tasks.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none.
- **Foundational (Phase 2)**: after Setup. Blocks every story.
- **US2 (Phase 3)**: after Phase 2. It's the MVP and makes the route compile and render.
- **US1 (Phase 4)**: after US2, because it fills in `mapHome` in the loader US2 creates.
- **US3 (Phase 5)**: after US1, because it verifies US1's mappers.
- **US4 (Phase 6)**: after US2. T019 edits the loader, so run it after T015 to avoid conflicts. T018 and T021 can run any time after Phase 2.
- **Polish (Phase 7)**: after all stories.

### Within phases

- Phase 2: T003 → T004. T005, T006 and T008 in parallel. T007 after T005 and T006. T009 after T007. T010 after T006, but read the old copy for T009 first. T011 any time.
- US2: T012 and T013 together (index imports the loader).
- US1: T014 → T015.
- US4: T018 || T021 → T019 → T020.

### Parallel Opportunities

```text
# Phase 2
T003 → T004   ||   T005 || T006 || T008 || T011   → T007 → T009 ; T010 (6 component files, after T006)

# US4 pieces independent of the loader
T018 (lib/seo.ts) || T021 (constants/index.ts)
```

---

## Implementation Strategy

### MVP First

1. Phases 1–2, then **US2**. Home is prop-driven and renders its backup content in every case. It looks like today and survives any outage.
2. **US1**. Published hero, intro, services and process content goes live, and the other sections keep showing backup content.
3. **US3**. Verify the partial-content rules.
4. **US4**. Home's own search & sharing fields take effect. The output is unchanged until the owner fills them in.
5. Polish.

### Notes

- Commit per phase using Conventional Commits, prefixed with the ticket as in earlier work. For example:
  - `COT-031: refactor: share sanity mappers`
  - `COT-031: feat: home renders from fallback content`
  - `COT-031: feat: wire home page to sanity`
  - `COT-031: feat: home page seo`
- Include the untracked `app/assets/home_*.avif` files in the commit that adds `home.fallback.server.ts`. Don't stage `site_brand_img.png`, which this feature doesn't use, or the `studio/` package files.
- Visible changes to mention in the PR:
  - The hero, intro, services and process sections now show the published copy.
  - Backup images are now bundled rather than Unsplash.
  - The hero slides expose alt text.
