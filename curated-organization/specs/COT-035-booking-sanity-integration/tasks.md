---

description: "Task list for COT-035: Booking page from the content studio"
---

# Tasks: Booking page from the content studio

**Input**: Design documents from `/specs/COT-035-booking-sanity-integration/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/booking-query.md](contracts/booking-query.md), [quickstart.md](quickstart.md)

**Tests**: None requested. Verification is the static checks plus [quickstart.md](quickstart.md).

US2 (fallback) runs before US1, as in COT-031 to COT-033. Wiring in the backup content first gives a page that can ship and looks exactly like today.

## Path Conventions

- `BK` = `app/routes/pages/booking`.
- Code style: tabs, single quotes, semicolons in `app/`. `studio/` uses no semicolons.
- Templates to follow: `app/routes/pages/gallery/gallery.loader.server.ts`, `gallery.fallback.server.ts` and `gallery/index.tsx`.
- Helpers to reuse: `text`, `nonNull`, `orFallback`, `toPageSeo` and the `Maybe` type from `~/lib/sanity/mappers.server`, and `BACKUP_BUSINESS_NAME` from `~/root.fallback.server`.
- No `any`, `@ts-ignore` or `as`. Narrow CMS enums with type guards.
- In `studio/`, the only change allowed is `studio/schemaTypes/documents/bookingPage.ts`.

---

## Phase 1: Setup

- [X] T001 Confirm the branch is `COT-035-booking-sanity-integration` and `.specify/feature.json` points at `specs/COT-035-booking-sanity-integration`. Confirm `npm run typecheck` runs in `curated-organization/` (run `npm ci` if `node_modules` is incomplete).

## Phase 2: Foundational (blocks all stories)

- [X] T002 Create `BK/booking.types.ts` with the serializable content types from [data-model.md](data-model.md). They are:
  - `HeroContent`.
  - `PathCardIcon` (`'plus' | 'refresh'`) and `PathOptionIcon` (`'phone' | 'email'`).
  - `PathCardContent`, a union keyed by `kind`: `'options'` with `options: { icon: PathOptionIcon; label: string }[]`, and `'cta'` with `ctaLabel`, `ctaHref` and `variant: 'primary' | 'secondary'`. `description` is optional on both.
  - `CallInfoContent`, `QuestionnaireField` (`{ label; placeholder? }`), `QuestionnaireContent`, `InquiryMessages`, `CalendarContent` (with `unavailable: { icon?; title; description? }`), `WhatToExpectContent` (`{ eyebrow?; heading; steps: WhatToExpectStep[] }`).
  - `BookingContent`: `{ hero, pathCards, callInfo, questionnaire, calendar, calendlyUrl: string | null, whatToExpect, seo: PageSeo }`.
  - Import `WhatToExpectStep` from `~/routes/components/WhatToExpect/WhatToExpect.types` and `PageSeo` from `~/types/global`.
- [X] T003 [P] Create `BK/components/hero/Hero.types.ts` exporting `HeroProps = { eyebrow?: string; heading: string; body?: string }`. Make `HeroContent` in `BK/booking.types.ts` an alias of it, as Gallery does.
- [X] T004 Update `BK/utils.ts`:
  - Replace the module-level `InquirySchema` with `createInquirySchema(messages: InquiryMessages)`. The rules stay exactly the same; only the four message strings come from `messages` (`firstNameRequired`, `lastNameRequired`, `emailRequired`, `emailInvalid`).
  - Change `parseInquiry` to `parseInquiry(form: FormData, messages: InquiryMessages)`.
  - Set `export type Inquiry = z.infer<ReturnType<typeof createInquirySchema>>`.
  - Add `isCalendlyUrl(value: string): boolean`. It returns true only when `new URL(value)` parses, the protocol is `https:`, and the hostname is `calendly.com` or `www.calendly.com`, and it returns false on a parse error. Comment: "Mirrors the calendlyUrl validation in studio/schemaTypes/documents/bookingPage.ts; keep the two in sync."
  - Add `isPathCardIcon`, `isPathOptionIcon`, `isPathCardKind` and `isPathCardVariant` type guards.
  - Keep `formatPhoneNumber`.

## Phase 3: US2 — Complete Booking page when the content service is down (P1)

**Goal**: The page renders entirely from loader data built from backup content, and looks and behaves exactly as it does today.

**Independent test**: Run with `SANITY_PROJECT_ID=` and go through the call, email-form and "Schedule now" paths ([quickstart.md](quickstart.md) steps 2 and 5).

- [X] T005 [US2] Create `BK/booking.fallback.server.ts` exporting `FALLBACK_BOOKING_CONTENT: Omit<BookingContent, 'calendlyUrl'>`. Header comment: "Backup Booking content: used when the CMS is unreachable or a section is missing its anchor." Copy today's text exactly from the components:
  - **hero**: "Book a consultation" / "Let's transform your space" / "Your complimentary 30-minute consultation starts here. Choose your path below."
  - **pathCards**:
    - An options card: `plus`, "Get started", "New to Curated? Reach out however works best for you.", with options `phone` "Call us" and `email` "Email us".
    - A cta card: `refresh`, "Book again", "Welcome back! Skip the intake and go straight to scheduling your next session.", button "Schedule now", `#calendly`, `secondary`.
  - **callInfo**: "Give us a call", "We'd love to hear from you", the intro, and "Prefer to write? Send us your details instead →", with phone `{ display: '(703) 555-0182', tel: '+17035550182' }` and hours "Mon-Fri, 9am-5pm ET · Sat by appointment".
  - **questionnaire**: "New client intake", "Tell us about your space", the intro, "About you", "Anything else", every label and placeholder from `Questionnaire.tsx` (the notes label is "Anything you'd like us to know?"), "Continue to scheduling →", and "You'll choose a consultation time on the next step". Messages come from today's zod schema: "Please enter your first name", "Please enter your last name", "Please enter your email" and "Please enter a valid email".
  - **calendar**: "Select a time", "Choose your consultation slot", and `unavailable` `{ icon: '📅', title: 'Calendly scheduling widget', description: <today's text> }`.
  - **whatToExpect**: "What to Expect", "After you book", and the three steps from `app/routes/components/WhatToExpect/index.tsx`.
  - **seo**: `{}`.
- [X] T006 [P] [US2] Make `BK/components/hero/index.tsx` take `HeroProps` and render the eyebrow and body only when present.
- [X] T007 [P] [US2] Update `BK/components/two-paths/components/PathCard/PathCard.types.ts` and `PathCard.tsx`:
  - Make `description` optional and render it only when present.
  - Key options by index instead of `label`.
  - Rendering otherwise stays the same.
- [X] T008 [US2] Update `BK/components/two-paths/TwoPaths.types.ts` (add `cards: PathCardContent[]`) and `BK/components/two-paths/index.tsx`:
  - Map each card to `PathCard`.
  - Card icon: `plus` → `'+'`, `refresh` → `'↻'`.
  - Option icon and click handler: `phone` → `<FaPhoneSquareAlt />` with `onSelectCall`, `email` → `<FaEnvelope />` with `onSelectEmail`.
  - A cta card gets `onClick={onBookAgain}`.
  - Use the card index as its key.
- [X] T009 [P] [US2] Update `BK/components/CallInfo/CallInfo.types.ts` (add `content: CallInfoContent`) and `CallInfo.tsx`:
  - Remove the `BUSINESS_PHONE*` and `BUSINESS_HOURS` constants.
  - Render from `content`: the link `href` is `` `tel:${content.phone.tel}` ``, and the eyebrow, intro and hours render only when present.
- [X] T010 [P] [US2] Update `BK/components/Questionnaire/Questionnaire.types.ts` (add `content: QuestionnaireContent`) and `Questionnaire.tsx`:
  - Render every heading, label, placeholder (pass `undefined` when absent), button label and note from `content`. The eyebrow, intro and note render only when present.
  - Call `parseInquiry(formData, content.messages)`.
  - Field names, ids, ARIA wiring and phone formatting stay unchanged.
- [X] T011 [P] [US2] Update `BK/components/Calendar/Calendar.types.ts` (add `content: CalendarContent`) and `Calendar.tsx`:
  - The eyebrow and heading come from `content`, with the eyebrow rendered only when present.
  - `CalendlyUnavailable` takes `content.unavailable` and renders its icon and description only when present. Pass it through `CalendlyErrorBoundary` as a prop.
  - The widget's `styles`, `pageSettings` and prefill stay unchanged.
- [X] T012 [P] [US2] Update the shared `app/routes/components/WhatToExpect/WhatToExpect.types.ts` (`WhatToExpectProps = { eyebrow?: string; heading: string; steps: WhatToExpectStep[] }`) and `index.tsx`:
  - Remove the hardcoded `steps` and render from props. The eyebrow renders only when present.
  - Use the step index as the key.
  - Keep the connector between steps.
- [X] T013 [US2] Create `BK/booking.loader.server.ts` (fallback path only for now):
  - `getSanityClient()`. If it returns null, return `{ ...FALLBACK, calendlyUrl: envCalendlyUrl() }`, where `envCalendlyUrl()` returns `text(process.env.CALENDLY_URL) ?? null`.
  - Wrap the fetch in try/catch with the same fallback on error and log `console.error('[booking] Sanity fetch failed, serving fallback content', error)`.
- [X] T014 [US2] Update `BK/index.tsx`:
  - Replace the inline `loader` with `export { loader } from './booking.loader.server'`.
  - Use `Route.ComponentProps` `loaderData` to pass `hero`, `pathCards`, `callInfo`, `questionnaire`, `calendar` and `calendlyUrl` to the components.
  - Keep `handle`, the view state and the scroll effect unchanged.
- [X] T015 [US2] Update `app/root.tsx`:
  - Add `import type { loader as bookingLoader } from './routes/pages/booking/booking.loader.server'` and `const BOOKING_ROUTE_ID = 'routes/pages/booking/index'`.
  - In `Layout`, `const booking = useRouteLoaderData<typeof bookingLoader>(BOOKING_ROUTE_ID)`.
  - Render `hideSiteCta ? booking && <WhatToExpect {...booking.whatToExpect} /> : <Cta {...global.cta} />` (research R3).

**Checkpoint**: the page looks like today, and every string on `/booking` now comes from loader data.

## Phase 4: US1 — Owner edits the Booking page wording (P1)

**Goal**: Published `bookingPage` content renders in every section.

**Independent test**: [quickstart.md](quickstart.md) step 3.

- [X] T016 [US1] Create `BK/booking.query.ts` exporting `BOOKING_QUERY` with `defineQuery`, exactly as in [contracts/booking-query.md](contracts/booking-query.md).
- [X] T017 [US1] In `BK/booking.loader.server.ts`, add the hand-written `Cms*` types (comment: "Hand-written until the TypeGen ticket. GROQ returns null for any field an editor left blank.") and `BookingQueryResult = { page; settings }`. Fetch `BOOKING_QUERY`, and log `console.warn('[booking] bookingPage not found, serving fallback content')` when `page` is null. Map each section with the per-section anchors in research R2:
  - `mapHero`: `heading` is the anchor.
  - `mapPathCards`: build each card with the type guards from T004, then `orFallback` against the backup cards.
  - `mapCallInfo`: `heading` is the anchor for the section's own fields. The phone comes from `settings` (T019).
  - `mapQuestionnaire` and `mapCalendar`: field-level rules in T018.
  - `mapWhatToExpect`: `heading` is the anchor. Map steps (skip any without `number` or `title`), then `orFallback` against the backup steps.
- [X] T018 [US1] In `BK/booking.loader.server.ts`:
  - **`mapQuestionnaire`**: an empty `heading` returns the backup. Otherwise every label, `submitLabel` and message is `text(cms) ?? FALLBACK.x`, while placeholders and `submitNote` are `text(cms)` (left out when blank).
  - **`mapCalendar`**: the header falls back as a whole on an empty `heading`. `unavailable` falls back as a whole on an empty `errorTitle`, and otherwise its icon and description are `text()` (hidden when blank).
- [X] T019 [US1] In `BK/booking.loader.server.ts`, phone and hours come from `settings`. Use `{ display, tel }` only when `text(businessPhoneDisplay)` and `text(businessPhoneTel)` are both set and the tel value matches `/^\+?[0-9]+$/`; otherwise use the backup phone. `hours` is `text(businessHours)`, hidden when blank. This applies even when `bookingPage` itself is missing.

**Checkpoint**: publishing a fully filled Booking page shows all of its wording.

## Phase 5: US3 — Owner updates the Booking page's search listing (P2)

**Independent test**: [quickstart.md](quickstart.md) step 3 (tab title).

- [X] T020 [US3] In `BK/booking.loader.server.ts`, set `seo: toPageSeo(page?.seo, text(settings?.businessName) ?? BACKUP_BUSINESS_NAME)`.
- [X] T021 [US3] Export `meta` from `BK/index.tsx`, copied from `app/routes/pages/gallery/index.tsx` (`buildMeta(mergeSeo(matches[0]?.loaderData?.seo, loaderData?.seo), location.pathname)`, guarded on the root defaults).
- [X] T022 [US3] Remove `BOOKING.metaData` from `app/routes/constants/index.ts`, along with `BASE_META`, `getSocialMeta`, the optional `metaData` field on `Routes`, and its `PageMetaData` import or type if nothing else uses it (research R7).

## Phase 6: US4 — Owner changes the Calendly scheduling link (P2)

**Independent test**: [quickstart.md](quickstart.md) step 4.

- [X] T023 [P] [US4] In `studio/schemaTypes/documents/bookingPage.ts`:
  - Add the `calendlyUrl` field as the first field of the `calendar` object, exactly as in [contracts/booking-query.md](contracts/booking-query.md).
  - Add a local `isCalendlyUrl` helper with the same rule as T004 and the comment "Mirrors isCalendlyUrl() in app/routes/pages/booking/utils.ts; keep the two in sync."
  - Change the document `description` to: "Business phone/hours live in Site Settings so they stay consistent with the rest of the site. The Calendly link is set on the Calendar tab; the embed styling stays code-defined."
  - Change the `errorIcon` and `errorTitle` descriptions only if they mention code-defined links (they don't today, so normally no change).
- [X] T024 [US4] In `BK/booking.loader.server.ts`, set `calendlyUrl`: if `text(page?.calendar?.calendlyUrl)` passes `isCalendlyUrl`, use it; otherwise `envCalendlyUrl()`. A studio value that is present but invalid also logs `console.warn('[booking] calendlyUrl is not a Calendly link, using CALENDLY_URL')`.

## Phase 7: US5 — Partially filled content never looks broken (P3)

**Independent test**: [quickstart.md](quickstart.md) step 6.

- [X] T025 [US5] Check the card rules in `BK/booking.loader.server.ts` against spec US5 scenario 6 and research R2, and fix any gaps:
  - A card is skipped without a title, a known `kind` or a known `icon`.
  - An options card is skipped when none of its options has both a label and a known icon.
  - A cta card uses the backup `ctaLabel` when its label is blank, `ctaHref` falls back to `#calendly` unless it starts with `#`, `/` or `https://`, and `variant` falls back to `secondary`.
- [X] T026 [US5] Check that `CallInfo.switchToEmailLabel` falls back to its backup value on its own (spec US5 scenario 4), and that a missing `bookingPage` with a reachable `siteSettings` still uses the Site settings phone and hours (spec US2 scenario 3).

## Phase 8: Polish

- [X] T027 Run `npm run typecheck` and `npm run build` in `curated-organization/`, and `npm run build` in `studio/`. All three must pass.
- [X] T028 Confirm `grep -rn "bookingPage\|Tell us about your space\|CALENDLY_URL" build/client` finds nothing, so the backup copy, the query and the environment variable stay server-only.
- [X] T029 Smoke test:
  - With no Sanity project ID, `/booking` renders all backup content and the `CALENDLY_URL` widget.
  - With the real project and no published `bookingPage`, the page looks exactly as it does today.
  - Going through call → "switch to email" → submit with empty fields shows the backup messages, and then scheduling opens with the prefill.
- [X] T030 Tell the user to deploy the Studio after merging so the new Calendly field appears for the owner. Do not deploy it yourself.

- [X] T031 Follow-up (2026-10-18): in `studio/schemaTypes/objects/heroSection.ts`, hide slide images and the link fields on pages that don't use them only while they're empty, so leftover hidden data (here, Booking hero slide images without alt text) can be seen and cleared instead of blocking publishing.

---

## Dependencies

- Setup (T001) → Foundational (T002–T004) → US2 (T005–T015) → US1 (T016–T019) → US3, US4 and US5. US3 (T020–T022), US4 (T023–T024) and US5 (T025–T026) are independent of each other, apart from all editing `booking.loader.server.ts`.
- T023 (Studio) only touches `studio/`, so it can run any time after T001.
- Within US2: T005 and T006–T012 come before T013–T015. T008 depends on T007.

## Parallel opportunities

- T003 can run alongside T002 and T004.
- The US2 component edits T006, T007, T009, T010, T011 and T012 touch different files.
- T023 (Studio) can run alongside any `app/` task.
- Tasks that edit `booking.loader.server.ts` (T013, T017–T020, T024–T026) run one after another.

## Implementation strategy

1. **MVP (ships safely)**: Phases 1–3. The page is driven by loader data and looks the same as today, with the Calendly link from `CALENDLY_URL`.
2. **Phase 4 (US1)**: the owner's wording goes live.
3. **Phases 5–7**: SEO, the Studio-editable Calendly link, then the partial-content hardening.
4. **Phase 8**: checks, smoke test, and a reminder to deploy the Studio.
