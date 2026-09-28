---

description: "Task list for COT-028: Connect global components to Sanity"
---

# Tasks: Connect global components to Sanity

**Input**: Design documents from `/specs/COT-028-global-sanity-content/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/global-query.md](./contracts/global-query.md), [quickstart.md](./quickstart.md)

**Tests**: The spec does not request automated tests, and the repo has no test suite. Each story is verified with the manual scenarios in quickstart.md.

**Organization**: Tasks are grouped by user story.
- The Foundational phase moves the components onto props and wires up a root loader that returns the built-in fallback, so the site looks the same as today. Every story then builds on it.
- US1 turns on the Sanity content.
- US2 hardens the failure paths.
- US3 swaps the pathname check for a route handle.
- US4 guards against navigation regressions.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: can run in parallel (different files, no dependency on an unfinished task)
- **[Story]**: US1–US4, from spec.md
- All paths are relative to the repository root.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependencies and environment config (research R1 and R2).

- [X] T001 Install `@sanity/client@^8.7.0`, `@sanity/image-url@^2.1.1` and `groq@^6.16.0` as app `dependencies` by running `npm install @sanity/client@^8.7.0 @sanity/image-url@^2.1.1 groq@^6.16.0` at the repo root (not in `studio/`). Confirm `package.json` and `package-lock.json` update.
- [X] T002 [P] Create `.env.example` at the repo root with two lines, `SANITY_PROJECT_ID=` and `SANITY_DATASET=production`, each preceded by a one-line comment saying it is server-only. Confirm `.gitignore` still lists `.env`. Create a local, uncommitted `.env` with `SANITY_PROJECT_ID=o2hxhkt0` and `SANITY_DATASET=production` (the values from `studio/sanity.config.ts`).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared Sanity foundation, the global prop types, the fallback content, the components moved onto props, and a root loader that returns the fallback. At the checkpoint the site renders from loader data and looks like today, apart from the expected fallback differences listed there.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T003 [P] Create `app/types/global.ts` exporting `LinkItem`, `ImageItem`, `BrandContent`, `FooterContent`, `CtaContent`, `GlobalContent` and `RouteHandle`, exactly as in data-model.md §2 and §6. Types only, no runtime code.
- [X] T004 [P] Create `app/lib/sanity/client.server.ts` exporting `getSanityClient(): SanityClient | null` (research R2, R3, R4):
  - When `import.meta.env.DEV` is true, call `process.loadEnvFile()` once inside try/catch, so a missing `.env` is ignored.
  - Read `process.env.SANITY_PROJECT_ID` and `process.env.SANITY_DATASET`, defaulting the dataset to `'production'`.
  - If the project ID is missing, log `[sanity] Sanity is not configured (SANITY_PROJECT_ID missing), serving fallback content` once (module-level flag) and return `null`.
  - Otherwise create, cache (module-level) and return the client with `createClient({ projectId, dataset, apiVersion: '2026-09-01', useCdn: true, perspective: 'published', timeout: 2000 })`.
  - Never throw.
- [X] T005 [P] Create `app/lib/sanity/image.server.ts` exporting `urlFor(source: SanityImageSource)` (research R6). Build it with the named export `createImageUrlBuilder` from `@sanity/image-url` (not the deprecated default), using `projectId` and `dataset` from `getSanityClient()?.config()`. If the client is `null`, throw an `Error`; callers only use it on CMS data, which can't exist without a client.
- [X] T006 [P] Create `app/lib/sanity/queries/global.ts` exporting `GLOBAL_QUERY = defineQuery(...)` (from `groq`), with the GROQ copied exactly from contracts/global-query.md.
- [X] T007 Create `app/root.fallback.server.ts` exporting `FALLBACK_GLOBAL_CONTENT: GlobalContent`, with every value from data-model.md §4 (depends on T003):
  - Import `~/assets/curated-logo.png`, `~/assets/napo-circular-logo.png` and `~/assets/napo-title-logo.png` for the image `src` values.
  - Copy the NAPO alt text verbatim from `app/routes/components/Footer/index.tsx`.
  - `connectLinks` and `socialLinks` are `[]`.
  - The CTA `background.src` is the current Unsplash URL from `app/routes/components/Cta/index.tsx`, with `position: '50% 50%'`.
- [X] T008 [P] Add `isInternalUrl(url: string): boolean` (returns `url.startsWith('/')`) to `app/lib/utils.ts`, next to the existing `cn`. It is used by Navigation and Footer to choose between `Link` and `<a>` (research R8).
- [X] T009 [P] Move Navigation onto props, in `app/routes/components/navigation/navigation.types.ts` and `app/routes/components/navigation/index.tsx`:
  - `NavigationProps` becomes `{ brand: BrandContent; links: LinkItem[]; bookNowLabel: string }`. Delete `NavItem` and `NavItems`.
  - In the component, render `brand.logo.src`/`width`/`height`/`alt`, `brand.name` and `brand.tagline` (only if present) in place of the hardcoded values and the `curatedLogo` import.
  - Render `links` filtered to exclude `PAGE_ROUTES_DATA.BOOKING.path` (FR-012a), using `isInternalUrl` to pick `<Link to>` or `<a href>`.
  - Render the label exactly as given; remove the `charAt(0).toUpperCase()` reformatting.
  - The "Book now" `Link` keeps `to={PAGE_ROUTES_DATA.BOOKING.path}` and `aria-label`, and renders `{bookNowLabel}`.
  - Keep every hook, effect, class name, `aria-*` attribute and `MOBILE_MENU_ID` unchanged (FR-014).
  - Remove the `NAVBAR_DATA` import.
- [X] T010 [P] Move Footer onto props, in `app/routes/components/Footer/Footer.types.ts` and `app/routes/components/Footer/index.tsx`:
  - `FooterProps` becomes `{ brandName: string; content: FooterContent; navLinks: LinkItem[] }`.
  - **Brand name**: render `brandName` in place of "CURATED".
  - **Description**: split `content.description` on `\n` and join with `<br />` using keyed fragments (research R10). Skip the `<p>` if the description is absent.
  - **Logos**: map `content.logos` to `<img src alt width height>`.
  - **"Navigate" column**: render all `navLinks` (Booking included), using `isInternalUrl` to pick `Link` or `<a>`.
  - **"Connect" column and the bottom social links**: render only when their arrays are non-empty (FR-018a), with each link through `isInternalUrl`.
  - **"Hours" column**: render `{label}: {value}` as plain text in a `<span>` inside the existing `li` (FR-019), not an `<a>`. Check `app/routes/components/Footer/footer.css`: if `.footerLinks a` carries the color or size, add an equivalent `.footerLinks span` rule so hours look the same as before.
  - **Copyright**: render only if present.
  - Remove the NAPO asset imports and the `PAGE_ROUTES_DATA` import if unused.
- [X] T011 [P] Move Cta onto props, in `app/routes/components/Cta/Cta.types.ts` and `app/routes/components/Cta/index.tsx`:
  - `CtaProps` becomes `CtaContent`.
  - Set the style to `{ backgroundImage: \`url(${background.src})\`, backgroundPosition: background.position }` (research R6).
  - Render `heading`, `subheading` (only if present), and the `Link` with `to={buttonHref}` and label `{buttonLabel}`.
  - Remove the hardcoded constant and the `PAGE_ROUTES_DATA` import.
- [X] T012 Create `app/root.loader.server.ts` exporting `async function loader(): Promise<GlobalContent>` that, for now, returns `FALLBACK_GLOBAL_CONTENT` (depends on T007). US1 replaces the body.
- [X] T013 Wire up the root in `app/root.tsx` (depends on T009–T012):
  - Add `export { loader } from './root.loader.server';` and `import type { loader } from './root.loader.server'` for typing.
  - Add `export function shouldRevalidate() { return false; }` (FR-003, research R12).
  - In `Layout`, read `const global = useRouteLoaderData<typeof loader>('root');`.
  - Render `<Navigation brand={global.brand} links={global.navLinks} bookNowLabel={global.bookNowLabel} />`, `<Cta {...global.cta} />` and `<Footer brandName={global.brand.name} content={global.footer} navLinks={global.navLinks} />`.
  - Keep the existing `isBookingRoute` CTA/WhatToExpect switch for now (US3 replaces it).
  - If `global` is `undefined`, render only `{children}` between `<body>` and the scripts, with no Navigation, Cta, WhatToExpect or Footer (research R5 defensive case).
- [X] T014 Remove dead code:
  - Delete `NAVBAR_DATA` and its export from `app/constants/index.ts`.
  - Delete the `NAVIGATION` interface from `app/index.d.ts`.
  - Grep `app/` for `NAVBAR_DATA`, `NAVIGATION`, `NavItems` and `curatedLogo` to confirm no references remain outside `app/root.fallback.server.ts`.

**Checkpoint**: `npm run typecheck` passes, and `npm run dev` renders every page. Compared with today, only these changes are expected:
- The footer "Navigate" column lists Home, Services, Gallery and Booking.
- The Connect and social columns are hidden, because their fallbacks are empty.
- Hours are plain text.

Everything else looks identical.

---

## Phase 3: User Story 1 - Editor updates site-wide content without a deploy (Priority: P1) 🎯 MVP

**Goal**: The header, footer and CTA render published `siteSettings` and `siteCta` content, falling back one section at a time when a field is blank.

**Independent Test**: quickstart.md scenarios 1 and 6. Publish content in Studio, load any page and see it; clear individual fields and see only that section fall back.

- [X] T015 [US1] In `app/root.loader.server.ts`, add private hand-written types `CmsImage`, `CmsLink`, `CmsHoursLine`, `CmsCredential`, `CmsSiteSettings`, `CmsSiteCta` and `GlobalQueryResult`, exactly as in data-model.md §1. Every field is optional, with no `any` and no `as` casts.
- [X] T016 [US1] In `app/root.loader.server.ts`, add these pure mapping helpers:
  - `isValidLink(link: CmsLink): link is Required<CmsLink>`: the label is non-empty after trimming, and the URL starts with `/`, `http://`, `https://`, `mailto:` or `tel:` (research R8, which rejects `#`).
  - `toLinks(links?: CmsLink[]): LinkItem[]`: keeps only valid links.
  - `hotspotPosition(image?: CmsImage): string`: returns `${x*100}% ${y*100}%` from the hotspot, or `'50% 50%'`.
  - `toImage(image, { height, alt, crop? }): ImageItem | null`: returns `null` without an `asset._ref`. It builds `src` with `urlFor(image).height(height*2).auto('format')`, adding `.width(height*2).fit('crop')` when `crop` is set. Rendered width is `height * (dimensions?.aspectRatio ?? 1)`, rounded, and rendered height is `height` (research R6).
- [X] T017 [US1] In `app/root.loader.server.ts`, add `mapGlobal(result: GlobalQueryResult | null): GlobalContent`, which implements the per-section table in data-model.md §3 against `FALLBACK_GLOBAL_CONTENT`:
  - **brand**: use CMS only if `brandName` is non-empty; the tagline and logo then fall back individually. The logo uses `toImage(logo, { height: 40, alt: '', crop: true })`.
  - **navLinks**: use `toLinks`; if the result is empty, use the fallback.
  - **bookNowLabel**: use CMS if non-empty.
  - **footer.description**: use CMS if non-empty.
  - **footer.logos**: use credentials that have an image, via `toImage(c.image, { height: 32, alt: c.label ?? '' })`; if there are none, use the fallback (FR-016).
  - **footer.connectLinks / footer.socialLinks**: use `toLinks`; if empty, use the fallback's `[]`.
  - **footer.hours**: keep items that have both label and value; if none, use the fallback.
  - **footer.copyright**: use CMS if non-empty.
  - **cta**: use CMS only when `heading`, `buttonLabel` and `backgroundImage.asset` are all present. The background `src` is `urlFor(bg).width(1800).auto('format').url()`, with the position from `hotspotPosition`. `buttonHref` is `buttonLink` if it passes link validation, otherwise `PAGE_ROUTES_DATA.BOOKING.path`.

  A `null` result, or a `null` document, maps that document's sections to the fallback.
- [X] T018 [US1] Replace the `loader()` body in `app/root.loader.server.ts`:
  1. `const client = getSanityClient();`
  2. If the client is `null`, return `mapGlobal(null)`.
  3. Otherwise, `const result = await client.fetch<GlobalQueryResult>(GLOBAL_QUERY);` and return `mapGlobal(result)`.

  For now the fetch sits inside a basic try/catch that returns `mapGlobal(null)`; US2 adds logging and verification.
- [X] T019 [US1] Validate quickstart.md scenarios 1 and 6 against the populated `production` dataset: publish test content in Studio, check each header, footer and CTA field, and clear the brand name, the CTA heading and one nav link URL in turn. Fix any mapping issues in `app/root.loader.server.ts`.

**Checkpoint**: Editors control all global content. Blank fields fall back per section.

---

## Phase 4: User Story 2 - Visitors always see a complete layout (Priority: P1)

**Goal**: No outage, misconfiguration, empty dataset or real 404 can remove the header, footer or CTA, or turn into an error page.

**Independent Test**: quickstart.md scenarios 3, 4 and 5, plus `/nope` on each.

- [X] T020 [US2] In `app/root.loader.server.ts`, finish error handling:
  - The catch logs `console.error('[global] Sanity fetch failed, serving fallback content', error)` and returns `mapGlobal(null)`. Timeouts from the client's 2s limit land here too.
  - When the fetch succeeds but both `settings` and `cta` are `null`, log a single `console.warn('[global] siteSettings and siteCta not found, serving fallback content')` and return `mapGlobal(result)`.
  - Confirm no code path in `loader` can throw (FR-007).
- [X] T021 [P] [US2] Create `app/routes/pages/not-found/index.tsx` (research R5):
  - `export async function loader() { return data(null, { status: 404 }); }` (import `data` from `react-router`). *Implemented as a return, not a throw; see research R5.*
  - `export const meta: Route.MetaFunction = () => [{ title: 'Page not found | Curated Organization' }, { name: 'robots', content: 'noindex' }];`, using `Route` from `./+types/index`.
  - A default export rendering the 404 message (`<h1>404</h1>` and "The requested page could not be found.").
- [X] T022 [US2] In `app/routes.ts`, append `route('*', 'routes/pages/not-found/index.tsx')` after the mapped `PAGE_ROUTES_DATA` routes, without editing `PAGE_ROUTES_DATA` (depends on T021). Run `npm run typecheck` so React Router regenerates `+types` for the new route.
- [X] T023 [US2] Validate:
  - quickstart.md scenario 3 (set `SANITY_PROJECT_ID=invalid000`), including `/nope` showing the root `ErrorBoundary` 404 message with the full header and footer.
  - Scenario 4 (remove both `SANITY_` lines; the server starts and logs once).
  - Scenario 5 (`empty-test` dataset).

  Time each page load under scenario 3 and confirm it is under 3 seconds (SC-004). Restore `.env` afterwards.

**Checkpoint**: The site is fully usable with Sanity down, unconfigured or empty, and real 404s keep the global chrome.

---

## Phase 5: User Story 3 - The Booking page shows What to Expect instead of the CTA (Priority: P2)

**Goal**: Whether the CTA is hidden is declared by each route (FR-022), not by the pathname.

**Independent Test**: quickstart.md scenario 7.

- [X] T024 [P] [US3] In `app/routes/pages/booking/index.tsx`, add `export const handle: RouteHandle = { hideSiteCta: true };`, importing `RouteHandle` from `~/types/global`.
- [X] T025 [US3] In `app/root.tsx`, replace the `useLocation()`/`isBookingRoute` pathname check (depends on T024):
  - Add a local type guard: `const hidesSiteCta = (handle: unknown): boolean => typeof handle === 'object' && handle !== null && 'hideSiteCta' in handle && handle.hideSiteCta === true;`. This follows constitution V, which rules out `as` casts.
  - Compute `const hideSiteCta = useMatches().some((match) => hidesSiteCta(match.handle));` and render `hideSiteCta ? <WhatToExpect /> : <Cta {...global.cta} />`.
  - Remove the now-unused `useLocation` and `PAGE_ROUTES_DATA` imports from `app/root.tsx`.
- [X] T026 [US3] Validate quickstart.md scenario 7: the CTA appears on `/`, `/services` and `/gallery`; What to Expect appears on `/booking`; and they swap correctly during client-side navigation.

**Checkpoint**: The CTA/What to Expect behavior is unchanged, but it is now driven by `handle`.

---

## Phase 6: User Story 4 - Navigation keeps working exactly as today (Priority: P2)

**Goal**: No regressions in the header's current-page highlight, mobile menu, keyboard use or accessibility attributes (FR-014, SC-007).

**Independent Test**: quickstart.md scenario 8.

- [X] T027 [US4] Diff `app/routes/components/navigation/index.tsx` against `git show HEAD:app/routes/components/navigation/index.tsx`. Confirm that every `useEffect`, `isActive`, `closeMenu`, `ref`, `aria-*` attribute, `data-open`, `role`, `id` and class name is unchanged, and that the only changes are the prop sources, the Booking filter, `Link` vs `<a>`, and label casing. Restore anything that changed unintentionally.
- [ ] T028 [US4] Validate quickstart.md scenario 8 with CMS links:
  - `active` and `aria-current="page"` on each page
  - at ≤430px, the menu opens, closes on link selection, closes on an outside tap, and closes when widened past 768px
  - keyboard-only tab order with a visible focus ring on the brand, each link, the toggle and "Book now"

  Also add an external `https://` nav link in Studio and confirm it renders as `<a>` and does not break `isActive`. Fix issues in `app/routes/components/navigation/index.tsx`.

**Checkpoint**: The header behaves as it did before this ticket.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [X] T029 Run `npm run typecheck` and `npm run build`, and fix any errors.
- [X] T030 Check the browser bundle (SC-008, research R13) by running `grep -rl "o2hxhkt0\|SANITY_PROJECT_ID\|createClient\|All rights reserved" build/client/ || echo "clean"`. If it prints anything other than `clean`, trace which client module imports a `*.server.ts` file or the fallback, and fix the import.
- [X] T031 [P] Clean up: remove any `console.log` added during the work, confirm no unused imports or exports remain in the touched files, and confirm the NAPO and curated-logo assets are still referenced (from `app/root.fallback.server.ts`). Constitution: no dead code.
- [ ] T032 Run quickstart.md scenarios 1–9 end-to-end once more on the final build (`npm run build && npm run start`), then tick the acceptance checkboxes in the COT-028 ticket.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: none.
- **Foundational (Phase 2)**: depends on Setup (T001 for the packages). It blocks every story.
- **US1 (Phase 3)**: depends on Foundational.
- **US2 (Phase 4)**:
  - T020 depends on T018, because it edits the same loader body.
  - T021 and T022 depend only on Foundational.
- **US3 (Phase 5)**: depends on Foundational (T013). It is independent of US1 and US2.
- **US4 (Phase 6)**: depends on Foundational (T009). It is most meaningful after US1, so CMS links are live.
- **Polish (Phase 7)**: depends on every story being done.

### Within Phases

- **Foundational**:
  - T003–T006 and T008 run in parallel.
  - T007 needs T003.
  - T009–T011 need T003 and T008.
  - T012 needs T007.
  - T013 needs T009–T012.
  - T014 comes last.
- **US1**: T015 → T016 → T017 → T018 → T019. They are sequential because they all edit the same file.
- **US3**: T024 → T025 → T026.

### Parallel Opportunities

- **Setup**: T002 alongside T001.
- **Foundational**:
  - T003, T004, T005, T006 and T008 together.
  - Then T009, T010 and T011, one per component folder.
- **Across stories**: once Foundational is done, US3 (T024–T026) and US2's T021–T022 can proceed alongside US1.

---

## Parallel Example: Foundational

```bash
# Batch 1 — independent new files
Task: "T003 Create app/types/global.ts"
Task: "T004 Create app/lib/sanity/client.server.ts"
Task: "T005 Create app/lib/sanity/image.server.ts"
Task: "T006 Create app/lib/sanity/queries/global.ts"
Task: "T008 Add isInternalUrl to app/lib/utils.ts"

# Batch 2 — one component each
Task: "T009 Navigation onto props"
Task: "T010 Footer onto props"
Task: "T011 Cta onto props"
```

---

## Implementation Strategy

### MVP (Foundational, then US1 and US2)

US1 and US2 are both P1, and US1 without US2 would let a Sanity outage break every page. The MVP is therefore Setup, Foundational, US1 and US2. Stop after T023 and validate scenarios 1 and 3–6.

### Incremental Delivery

1. **Foundational**: the site renders from the loader and looks like today (safe to merge on its own).
2. **US1**: editors control content (demo from Studio).
3. **US2**: resilience proven, with 404 chrome.
4. **US3 and US4**: behavior-preserving refactor and regression guard.
5. **Polish**: build, bundle check and full quickstart.

---

## Validation notes (implementation run, 2026-09-27)

What was verified:
- **T019**: against the live `production` dataset (`siteSettings` published, no `siteCta`). The brand, logo (Sanity CDN, hotspot crop) and nav links rendered from the CMS, while the CTA fell back on its own, which exercises the per-section fallback. **Not done**: editing and republishing content in Studio, since that would change the owner's shared content.
- **T023**:
  - Scenario 3 (invalid project) passed: every page returned 200 in about 0.25s with fallback content, `/nope` returned 404 with the header and footer, and the error was logged.
  - Scenario 4 (no config) passed: the one-time log appeared and every page used the fallback.
  - **Not done**: scenario 5 (empty dataset), because it needs a dataset created in the shared Sanity project. The same code path (both documents `null`) is covered by the null-handling in `mapGlobal`.
- **T030**: the production build was smoke-tested both with and without `SANITY_*` set. The fallback logo assets are served from `build/client/assets`.

Still open:
- **T028**: the mobile-menu and keyboard checks need an interactive browser. The navigation diff (T027) confirms that every effect, `aria-*` attribute and class is unchanged.
- **T032**: the final end-to-end quickstart pass on the owner's machine.

## Notes

- There are no test tasks; the spec didn't request them and the repo has no test runner.
- Hand-written `Cms*` types and the `*.server.ts` naming are approved exceptions (plan.md, Complexity Tracking). Don't "fix" them in this ticket.
- `studio/` is not touched by any task.
- Commit after each phase checkpoint, using Conventional Commits (for example `feat(global): …`).
