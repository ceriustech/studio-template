---

description: "Task list for COT-030: plain-language SEO fields and a site-wide default"
---

# Tasks: Plain-language SEO fields and a site-wide default

**Input**: Design documents from `/specs/COT-030-seo-schema-integration/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/global-seo.md](contracts/global-seo.md), [quickstart.md](quickstart.md)

**Tests**: The spec doesn't ask for automated tests, so none are included. Checks are static checks plus the manual steps in [quickstart.md](quickstart.md).

**Organization**: Tasks are grouped by user story. US1 = Studio editing experience; US2 = live site reads the default.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2)

## Path Conventions

- Studio paths are under `studio/`. App paths are under `app/`. Both are relative to `curated-organization/`.
- Studio code style: tabs, single quotes, no semicolons, `bracketSpacing: false` (see the prettier config in `studio/package.json`).
- App code style: tabs, single quotes, semicolons, `{ spaced }` braces (match `app/root.loader.server.ts`).
- `app/routes/constants/index.ts` MUST NOT be edited. It's the starting copy for later per-page tickets, and it has the user's uncommitted changes.

---

## Phase 1: Setup

**Purpose**: Branch and dependency declaration.

- [X] T001 Create and switch to branch `COT-030-seo-schema-integration` from `main`, carrying over the user's uncommitted change in `app/routes/constants/index.ts` untouched. Don't commit or stash it.
- [X] T002 [P] In `studio/package.json`, add `"@sanity/ui": "^4.2.4"` to `dependencies`. It's already installed as a dependency of `sanity`, so no `npm install` is needed for the code to run. Then run `npm install` in `studio/` so `package-lock.json` records it as a direct dependency. **Deviation 2026-10-05: not declared.** Declaring it at any version makes npm re-resolve `react` to 19.3.0 while `react-dom` stays 19.2.7, and the Studio refuses to run with mismatched versions. Package files were left untouched; `SeoInput` imports `@sanity/ui` through `sanity`'s copy (4.2.4). Declare it in a separate dependency-upgrade ticket that aligns `react` and `react-dom`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Reshape the stored fields both stories depend on: the field names the app reads (US2) and the Studio edits (US1). See [data-model.md](data-model.md).

- [X] T003 In `studio/schemaTypes/objects/seo.ts`:
  - Rename field `metaTitle` → `title` and `metaDescription` → `description`.
  - Rename `ogImage` → `image`. Keep `options: {hotspot: true}` and `fields: [altTextField]`.
  - Delete the `keywords` field.
  - Remove the existing `rule.required().max(70)` and `rule.required().max(200)` validation; US1 adds the warnings.
  - Leave titles as-is for now (US1 changes them).
- [X] T004 [P] In `studio/schemaTypes/documents/siteSettings.ts`, add a new field directly after `brandName`: `defineField({name: 'businessName', title: 'Business name', description: 'Your full business name, e.g. "Curated Organization". It\'s added to the end of every page title in Google and the browser tab.', type: 'string', group: 'brand'})`. No validation; the field is optional (FR-012a).

**Checkpoint**: `cd studio && npx sanity schema validate` passes. The stored shape matches [data-model.md](data-model.md).

---

## Phase 3: User Story 1 - Client understands and fills in search & sharing text (Priority: P1) 🎯 MVP

**Goal**: Plain-language labels, help text, non-blocking length warnings, required-only-on-default, clearer section names and a live Google-result preview.

**Independent Test**: Run quickstart steps S1–S8 in `npx sanity dev`.

### Implementation for User Story 1

- [X] T005 [US1] In `studio/schemaTypes/objects/seo.ts`, set:
  - Type `title`: `'Search & sharing'`.
  - Field `title`: title `'Page title'`; description `'Shown in the browser tab and as the blue headline in Google. The business name is added automatically.'`; `validation: (rule) => rule.max(60).warning('Google usually shows about 60 characters; longer titles may be cut off.')`.
  - Field `description`: title `'Page summary'`, keep `type: 'text', rows: 3`; description `'The 1–2 sentences under the headline in Google, and in link previews when the page is shared.'`; `validation: (rule) => rule.max(160).warning('Google usually shows about 160 characters; longer summaries may be cut off.')`.
  - Field `image`: title `'Share image'`; description `"The picture shown when this page's link is shared on social media or in a text message. Best size: 1200×630."`.
- [X] T006 [US1] In `studio/schemaTypes/documents/siteSettings.ts`:
  - Change group `{name: 'seo', title: 'Default SEO'}` → `title: 'Default search & sharing'`.
  - On the `defaultSeo` field, set title `'Default search & sharing'` and description `"Used on any page that doesn't have its own."`.
  - Add object-level validation `rule.custom((value: {title?: string; description?: string} | undefined) => { ... })`. It returns an array of `{message: 'Add a default page title.', path: ['title']}` and/or `{message: 'Add a default page summary.', path: ['description']}` for each value that's empty after `.trim()`, and `true` when both are set. This blocks publishing (FR-007). Don't make `seo` itself required.
- [X] T007 [P] [US1] In each of `studio/schemaTypes/documents/homePage.ts`, `servicesPage.ts`, `galleryPage.ts` and `bookingPage.ts`, change group `{name: 'seo', title: 'SEO'}` → `title: 'Search & sharing'` and field `seo`'s `title: 'SEO'` → `'Search & sharing'`. Add no validation (FR-008, FR-010).
- [X] T008 [P] [US1] Create `studio/components/seoTitle.ts`. It exports:
  - `BACKUP_BUSINESS_NAME = 'Curated Organization'`.
  - `composeTitle(title: string, businessName: string): string`, which returns `title` when `title.toLowerCase().includes(businessName.toLowerCase())`, otherwise `` `${title} | ${businessName}` ``.

  Add a one-line comment: `// Mirrors mapSeo() in app/root.loader.server.ts; keep the two in sync.`
- [X] T009 [US1] Create `studio/components/SeoInput.tsx`. It exports `SeoInput(props: ObjectInputProps)` (types from `sanity`) and returns `<Stack space={4}>{preview card}{props.renderDefault(props)}</Stack>`.

  Data:
  - `const {draft, published} = useEditState('siteSettings', 'siteSettings')`, then `const settings = (draft ?? published) as {businessName?: string; defaultSeo?: {title?: string; description?: string}} | null`.
  - Own values: `props.value?.title` and `props.value?.description`.
  - `displayTitle` = trimmed own title, else trimmed `settings?.defaultSeo?.title`, else `BACKUP_BUSINESS_NAME`.
  - `displayDescription` = own, else default, else `'Professional organizing services'`.
  - `businessName` = trimmed `settings?.businessName`, else `BACKUP_BUSINESS_NAME`.

  Card (`@sanity/ui`): a `Card padding={3} radius={2} border tone="default"` containing a `Stack space={2}` with:
  - a muted `Text size={1}` reading `curatedorganization.com`;
  - a `Text size={2} weight="medium"` with `style={{color: '#1a0dab'}}` showing `composeTitle(displayTitle, businessName)`;
  - a `Text size={1}` with the description;
  - a muted `Text size={0}` reading `` `Title ${composedTitle.length} / 60 · Summary ${displayDescription.length} / 160` ``.

  Above the card, add a `Text size={1} weight="semibold"` label: `'Preview in Google'`. Use the type-safe readers above; no `any`. **As built**: `@sanity/ui` v4 renamed Stack's `space` to `gap`; values are read with an `isRecord`/`readText` guard instead of an `as` cast (constitution V).
- [X] T010 [US1] In `studio/schemaTypes/objects/seo.ts`, import `SeoInput` from `'../../components/SeoInput'` and add `components: {input: SeoInput}` to the `defineType` call.

**Checkpoint**: `npx tsc --noEmit`, `npx sanity schema validate` and `npx sanity build` pass in `studio/`. Quickstart S1–S8 pass.

---

## Phase 4: User Story 2 - Site-wide default drives every page's search & sharing info (Priority: P1)

**Goal**: The root layout outputs title, description and Open Graph tags from `siteSettings.defaultSeo` + `businessName`, with per-field backups, replacing `META_DATA`.

**Independent Test**: Run quickstart steps L1–L6 with `npm run dev`.

### Implementation for User Story 2

- [X] T011 [P] [US2] In `app/constants/index.ts`, append `export const SITE_URL = 'https://curatedorganization.com';`.
- [X] T012 [P] [US2] In `app/types/global.ts`, add `export type SeoContent = { title: string; description: string; image?: ImageItem };` and add `seo: SeoContent;` to `GlobalContent`.
- [X] T013 [P] [US2] In `app/lib/sanity/queries/global.ts`, add these to the `settings` projection (after `copyrightText`), per [contracts/global-seo.md §1](contracts/global-seo.md):
  - `businessName,`
  - `defaultSeo{ title, description, image{ asset, crop, hotspot, alt } }`
- [X] T014 [US2] In `app/root.fallback.server.ts`:
  - Add `export const BACKUP_BUSINESS_NAME = 'Curated Organization';`, with comment `// Mirrors studio/components/seoTitle.ts`.
  - Add `seo: { title: 'Curated Organization', description: 'Professional organizing services' },` to `FALLBACK_GLOBAL_CONTENT`.

  Depends on T012.
- [X] T015 [US2] In `app/root.loader.server.ts`:
  1. Add the hand-written type `type CmsSeo = { title?: Maybe<string>; description?: Maybe<string>; image?: Maybe<CmsImage> };`. Add `businessName?: Maybe<string>;` and `defaultSeo?: Maybe<CmsSeo>;` to `CmsSiteSettings`.
  2. Import `BACKUP_BUSINESS_NAME` from `./root.fallback.server`.
  3. Add `function mapSeo(settings: CmsSiteSettings | null): SeoContent`:
     - `base = text(settings?.defaultSeo?.title) ?? FALLBACK.seo.title`.
     - `businessName = text(settings?.businessName) ?? BACKUP_BUSINESS_NAME`.
     - `title` = `base` when `base.toLowerCase().includes(businessName.toLowerCase())`, else `` `${base} | ${businessName}` ``. Add a comment that this mirrors `studio/components/seoTitle.ts`.
     - `description` = `text(settings?.defaultSeo?.description)?.replace(/\s*\n\s*/g, ' ') ?? FALLBACK.seo.description`.
     - `image` = when `settings?.defaultSeo?.image?.asset?._ref` exists, `{ src: urlFor(image).width(1200).height(630).fit('crop').format('jpg').url(), alt: text(image.alt) ?? '', width: 1200, height: 630 }`; otherwise omit the key.
  4. In `mapGlobal`, add `seo: mapSeo(settings),`.
  5. Import `SeoContent` from `~/types/global`.

  Depends on T012–T014.
- [X] T016 [P] [US2] Create `app/lib/seo.ts`. It exports `buildMeta(seo: SeoContent, pathname: string): MetaDescriptor[]` (`MetaDescriptor` from `react-router`), returning exactly the descriptors in [contracts/global-seo.md §3](contracts/global-seo.md), in that order.
  - `og:url` is `` `${SITE_URL}${pathname === '/' ? '' : pathname}` ``.
  - Image descriptors are included only when `seo.image` exists. `og:image:alt` is included only when `seo.image.alt` is non-empty.

  Depends on T011, T012.
- [X] T017 [US2] In `app/root.tsx`:
  - Delete the `META_DATA` constant. It holds the duplicate charset, the `maximum-scale` viewport and the keywords (R7).
  - Replace `export const meta: Route.MetaFunction = () => META_DATA;` with `export const meta: Route.MetaFunction = ({ loaderData, location }) => loaderData ? buildMeta(loaderData.seo, location.pathname) : [];`.
  - Import `buildMeta` from `~/lib/seo`.
  - Leave the `<meta charSet>` and viewport tags in `Layout` unchanged.

  Depends on T015, T016.

**Checkpoint**: `npm run typecheck` passes. Quickstart L1–L6 pass.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T018 Run all static checks in [quickstart.md §1](quickstart.md): `npx sanity schema validate`, `npx tsc --noEmit` and `npx sanity build` in `studio/`, and `npm run typecheck` in the app root. Fix any failures.
- [X] T019 Search for leftover references with `grep -rn "metaTitle\|metaDescription\|ogImage\|keywords\|META_DATA" app studio/schemaTypes studio/components`. The only allowed hits are in `app/routes/constants/index.ts` (out of scope). Remove any others.
- [X] T020 **Partly done 2026-10-05**: L1, L2 and L4 verified against the dev server (CMS configured, empty default, so backup text). `buildMeta` verified with sample image data, including alt omission. S1–S8, L3, L5 and L6 need a logged-in Studio session and publishing, so they're left for the user. Walk through [quickstart.md](quickstart.md) S1–S8 and L1–L6. Record any failures in this file under the task that owns them.
- [X] T021 Update `specs/COT-029-image-alt-text/contracts/image-alt.md`: change `seo.ogImage.alt` / `defaultSeo.ogImage.alt` → `seo.image.alt` / `defaultSeo.image.alt`, so later page tickets read the right path.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none.
- **Foundational (Phase 2)**: after Setup. Blocks both stories (field names).
- **US1 (Phase 3)** and **US2 (Phase 4)**: both start after Phase 2 and are independent of each other. US1 touches only `studio/`; US2 touches only `app/`.
- **Polish (Phase 5)**: after both stories.

### Within stories

- US1: T005 → T006 (both edit schema files; T006 relies on T005's validated fields) → T010 after T008 and T009. T007 and T008 can run alongside T005.
- US2: T011, T012 and T013 in parallel → T014 → T015. T016 runs after T011 and T012 → T017 runs after T015 and T016.

### Parallel Opportunities

```text
# Phase 2
T003 (seo.ts)  ||  T004 (siteSettings.ts)

# US1 and US2 can proceed side by side (studio/ vs app/)
US1: T005 → T006 ; T007 || T008 → T009 → T010
US2: T011 || T012 || T013 → T014 → T015 ; T016 → T017
```

---

## Implementation Strategy

### MVP First

1. Phases 1–2, then **US1**. The client gets understandable fields and the preview, and can enter the default before the site reads it.
2. **US2**. The live site switches from `META_DATA` to the CMS default. Because the published default is still empty, the backup text keeps today's title and description until the client fills it in.
3. Polish.

### Notes

- Commit per phase using Conventional Commits, for example: `chore(studio): reshape seo object`, `feat(studio): plain-language search & sharing fields with Google preview`, `feat: drive root meta from Sanity default SEO`.
- The live-site visible changes are titles (now with the suffix once a default title is set), new `og:*` tags, and restored pinch-zoom. Mention all three in the PR description.
