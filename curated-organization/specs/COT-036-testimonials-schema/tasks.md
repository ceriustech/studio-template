---

description: "Task list for COT-036: Testimonials as their own content studio section"
---

# Tasks: Testimonials as their own content studio section

**Input**: Design documents from `/specs/COT-036-testimonials-schema/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/home-query.md](contracts/home-query.md), [quickstart.md](quickstart.md)

**Tests**: None requested. Verification is the static checks plus [quickstart.md](quickstart.md).

## Path Conventions

- `ST` = `studio/`, `HM` = `app/routes/pages/home`.
- Code style: `app/` uses tabs, single quotes and semicolons. `studio/` uses tabs, single quotes and **no** semicolons.
- Templates to follow:
  - `ST/migrations/footer-link-columns/index.ts` for the migration.
  - `ST/schemaTypes/documents/portfolioPiece.ts` for a document type.
  - The `portfolioPiece` entry in `ST/structure/index.ts` for the Studio list item.
- No `any`, `@ts-ignore` or `as` casts. `CmsTestimonial` stays hand-written (TypeGen exception, see plan Complexity Tracking).
- Do not change `HM/home.types.ts`. `HM/components/Testimonial/*` and `HM/home.fallback.server.ts` change only for T016.

---

## Phase 1: Setup

- [X] T001 Confirm the branch is `COT-036-testimonials-schema` and `.specify/feature.json` points at `specs/COT-036-testimonials-schema`. Confirm `npm run typecheck` runs in the repo root and `npm run build` runs in `ST/` (run `npm ci` in either if `node_modules` is incomplete).

## Phase 2: Foundational (blocks all stories)

- [X] T002 Move `ST/schemaTypes/objects/testimonial.ts` to `ST/schemaTypes/documents/testimonial.ts` with `git mv`, then change `type: 'object'` to `type: 'document'`. Keep `name: 'testimonial'`, `title: 'Testimonial'`, `icon: icons.comment`, all four fields with their titles and validation, and the preview (`title: 'clientName'`, `subtitle: 'clientLocation'`) unchanged.
- [X] T003 Update `ST/schemaTypes/index.ts`:
  - Import `testimonial` from `./documents/testimonial`.
  - Remove `testimonial` from the `// objects` part of `schemaTypes`.
  - Add it to the `// documents` part, after `portfolioPiece`.

**Checkpoint**: `npm run build` in `ST/` passes. The Studio still lists Home page testimonials and also shows a catch-all "Testimonial" list at the bottom. Both are fixed in US1.

## Phase 3: US1: Owner manages testimonials from the top level (P1) 🎯 MVP

**Goal**: "Testimonials" is its own top-level Studio item, a sibling of Portfolio pieces. Each testimonial is its own entry, and the Home page has no Testimonials tab.

**Independent test**: [quickstart.md](quickstart.md) step 2. Also create and publish one testimonial, and confirm that publishing with an empty quote is blocked.

- [X] T004 [P] [US1] In `ST/structure/index.ts`:
  - After `S.documentTypeListItem('portfolioPiece').title('Portfolio pieces'),` and its `S.divider(),`, add `S.documentTypeListItem('testimonial').title('Testimonials').icon(icons.comment),` followed by another `S.divider(),`.
  - The resulting top level must read: Pages, divider, Portfolio pieces, divider, Testimonials, divider, Site settings, Site CTA, divider, catch-all.
  - Change the catch-all filter so it also excludes `'testimonial'`. Replace the `listItem.getId() !== 'portfolioPiece'` check with a `COLLECTIONS = ['portfolioPiece', 'testimonial']` constant next to `SINGLETONS`, and filter with `!COLLECTIONS.includes(...)`.
- [X] T005 [P] [US1] In `ST/schemaTypes/documents/homePage.ts`, remove the `{name: 'testimonials', title: 'Testimonials'}` group and the `testimonials` `defineField`. Leave every other field and group unchanged.
- [X] T006 [P] [US1] In `ST/schemaTypes/documents/testimonial.ts`, add `description: 'Name only. The site adds the dash before it and the comma before the location.'` to the `clientName` field (FR-004).

**Checkpoint**: `npm run build` in `ST/` passes. In `npm run dev`, the Studio matches quickstart step 2. The published `homePage` may show `testimonials` as an unknown field until T010 runs; that's expected.

## Phase 4: US2: Visitors see the owner's testimonials on the Home page (P1)

**Goal**: The Home carousel reads published `testimonial` documents, newest first, and the carousel itself is unchanged.

**Independent test**: Publish a new testimonial in the Studio and reload `/`. It's the first slide. Delete it and it's gone ([quickstart.md](quickstart.md) step 5).

- [X] T007 [US2] In `HM/home.query.ts`, apply [contracts/home-query.md](contracts/home-query.md):
  - Remove `testimonials[]{ quote, clientName, clientLocation, rating },` from the `"page"` projection.
  - Add a top-level key between `"page"` and `"businessName"`: `"testimonials": *[_type == "testimonial"] | order(_createdAt desc, _id asc){ quote, clientName, clientLocation, rating },`.
- [X] T008 [US2] In `HM/home.loader.server.ts`:
  - Remove `testimonials` from `CmsHomePage`.
  - Change `HomeQueryResult` to `{ page: CmsHomePage | null; testimonials: Maybe<Maybe<CmsTestimonial>[]>; businessName: Maybe<string> }`.
  - Make `mapHome` take the whole result and call `mapTestimonials(testimonials)` instead of `mapTestimonials(page.testimonials)`.
  - Keep `mapTestimonials` and `toRating` exactly as they are.

**Checkpoint**: `npm run typecheck` passes. Before the migration, `/` shows the backup testimonials, which have the same text as today's published ones (research R1/R7).

## Phase 5: US3: Existing testimonials carry over, and the Home page keeps working when content can't load (P1)

**Goal**: The 3 published testimonials become documents with clean names and keep their order. The loader also serves CMS testimonials when `homePage` is missing, and backup testimonials when nothing usable loads.

**Independent test**: [quickstart.md](quickstart.md) steps 3, 4 and 6.

- [X] T009 [P] [US3] In `HM/home.loader.server.ts`, change the `!result?.page` branch of `loader()`:
  - When `result` exists but `result.page` is null, keep the `console.warn('[home] homePage not found, serving fallback content')` and return `{ ...FALLBACK, testimonials: mapTestimonials(result.testimonials) }` (FR-012).
  - When `result` itself is falsy, keep returning `FALLBACK`.
  - Leave the missing-client and `catch` branches unchanged: they return the full `FALLBACK` with backup testimonials (FR-010).
- [X] T010 [P] [US3] Create `ST/migrations/testimonials-to-documents/index.ts`, following `footer-link-columns`. Use `defineMigration` and `transaction`, `createIfNotExists`, `patch`, `at` and `unset` from `sanity/migrate`:
  - `title: 'Move Home page testimonials into their own Testimonial documents'`, `documentTypes: ['homePage']`.
  - Add a JSDoc block explaining what the migration does, and that the single transaction gives the new documents one shared `_createdAt`. The Home page orders by `_createdAt desc, _id asc`, so the shared timestamp keeps the current order.
  - Add a local type `type TestimonialItem = {_key: string; _type: string; quote?: string; clientName?: string; clientLocation?: string; rating?: number}`.
  - Add `cleanName(name: string)`: `name.trim().replace(/^[—–-]+\s*/, '').replace(/[\s,]+$/, '')`, with a comment noting that names were saved as e.g. "— Sarah M.,".
  - In `document(doc)`:
    - If `doc.testimonials === undefined`, return nothing (already migrated).
    - Otherwise build `const removeList = patch(doc._id, at('testimonials', unset()))`.
    - If `doc._id.startsWith('drafts.')`, return `removeList` only, so documents aren't created twice.
    - Otherwise map `(doc.testimonials ?? []) as TestimonialItem[]` to `createIfNotExists({_id: \`testimonial-migrated-${index + 1}\`, _type: 'testimonial', quote, clientName: cleanName(clientName ?? ''), clientLocation, rating})`, leaving out keys that are `undefined`.
    - Return `transaction([...creates, removeList])`.
  - If the `doc.testimonials` cast clashes with the "no `as`" rule, follow the existing `footer-link-columns` precedent, which uses the same cast.
- [ ] T011 [US3] **Owner action (cannot be run by the agent; needs a Sanity CLI login).** After T002 to T006 are deployed to the Studio (`npm run deploy` in `ST/`):
  - Run `npx sanity migration run testimonials-to-documents` in `ST/` and confirm the dry run shows 3 creates and 1 unset on `homePage`.
  - Then run it again with `--no-dry-run`.
  - Then run it a third time and confirm nothing changes (FR-009).
  - Check with the public CDN: `count(*[_type == "testimonial"]) == 3`, `*[_id == "homePage"][0].testimonials == null`, and the names read "Client name", "Sarah M." and "James T.".

**Checkpoint**: `/` shows the 3 quotes in the original order with "— Sarah M., McLean, VA" attributions. The outage, empty and mixed fallbacks behave as in quickstart step 6.

## Phase 6: Polish and cross-cutting

- [X] T012 [P] Run `npm run typecheck` and `npm run build` in the repo root, and `npm run build` in `ST/`. Fix anything they report.
- [X] T013 [P] Run `grep -rn "objects/testimonial\|page.testimonials\|testimonials\[\]" app studio/schemaTypes studio/structure`. Expect no matches; any match is a stale reference to fix.
- [X] T014 [P] Confirm the backup copy stays server-only: `grep -r "Working with Rina" build/client` finds nothing.
- [ ] T015 Walk through [quickstart.md](quickstart.md) steps 2 to 7. Steps 3 and 4 depend on T011, so mark them pending if the owner hasn't run the migration yet. Record the outcome here.
  - **Outcome (2026-10-19, agent)**:
    - Done and passing: typecheck and build (app and Studio); Studio `tsc` (covers the migration); T013 and T014 greps find nothing.
    - Migration run offline against the live published `homePage`: it produces 3 `createIfNotExists` (`testimonial-migrated-1..3`, names "Client name", "Sarah M.", "James T.") plus the `homePage` unset in one transaction. A draft gets only the unset; a re-run returns nothing.
    - Built app before the migration: `/` shows the backup testimonials with the attribution "— Client name, Arlington, VA". With `SANITY_PROJECT_ID=` it shows the backups and logs `[sanity]`.
    - **Pending (owner)**: step 2 (visual Studio check in `npm run dev`), steps 3–4 (needs T011), and steps 5–6 with real documents.

## Phase 7: Follow-up: remove the Rating field (2026-10-19)

- [X] T016 Remove `rating` everywhere; the site always shows 5 stars:
  - `ST/schemaTypes/documents/testimonial.ts`: delete the `rating` field.
  - `ST/migrations/testimonials-to-documents/index.ts`: don't copy `rating`.
  - `HM/home.query.ts`: drop `rating` from the projection.
  - `HM/home.loader.server.ts`: drop `rating` from `CmsTestimonial`, delete `toRating`.
  - `HM/home.fallback.server.ts`: drop `rating: 5` from the backup items.
  - `HM/components/Testimonial/Testimonial.types.ts`: drop `rating`.
  - `HM/components/Testimonial/Testimonial.tsx`: render `★ ★ ★ ★ ★` with `role="img"` and `aria-label="5 out of 5 stars"`.
  - Re-run typecheck, both builds and the offline migration check.

---

## Dependencies

- **Setup (T001)**, then **Foundational (T002, T003)**, then the stories.
- **US1 (T004 to T006)** depends only on Foundational.
- **US2 (T007, T008)** depends only on Foundational (`testimonial` must be a document type for the query to match anything). It is independent of US1.
- **US3**:
  - T009 depends on T008 (same file, and it uses the new `HomeQueryResult`).
  - T010 depends on T002.
  - T011 depends on T004 to T006 being deployed and T010 existing.
- **Polish** comes after every story.
- **Release order** (research R7): deploy the Studio (T002 to T006), run the migration (T011), then deploy the app (T007 to T009). Any order is visually safe.

```text
T001 → T002 → T003 ─┬→ US1: T004 ∥ T005 ∥ T006 ───────────┐
                    ├→ US2: T007 → T008 → (US3) T009 ─────┤
                    └→ US3: T010 ──────→ T011 (needs US1) ┴→ T012 ∥ T013 ∥ T014 → T015
```

## Parallel Execution Examples

- **US1**: T004 (`structure/index.ts`), T005 (`homePage.ts`) and T006 (`testimonial.ts`) touch different files and can run together.
- **US2 with US3**: T007 and T010 can run together (`home.query.ts` and the new migration file). T008, then T009, run in sequence in `home.loader.server.ts`.
- **Polish**: T012, T013 and T014 are independent checks.

## Implementation Strategy

1. **MVP = Foundational + US1.** The Studio shows Testimonials at the top level, which is the ticket's main ask. It can be deployed alone, because the app still reads `homePage.testimonials` until US2 ships.
2. **Add US2.** The app reads testimonial documents. Until the migration runs, visitors see the backup testimonials, which are the same quotes.
3. **Add US3.** The page-missing fallback goes in, the owner runs the migration, and the live carousel shows the owner's own quotes with clean names.
4. **Polish**: static checks and the quickstart walkthrough.
