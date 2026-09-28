---

description: "Task list for COT-029: alt text for every CMS image"
---

# Tasks: Alt text for every CMS image

**Input**: Design documents from `/specs/COT-029-image-alt-text/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/image-alt.md](contracts/image-alt.md), [quickstart.md](quickstart.md)

**Tests**: The spec doesn't ask for automated tests, so none are included. Checks are manual (see [quickstart.md](quickstart.md)).

**Organization**: Tasks are grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

- Only `studio/` changes. All schema paths are under `studio/schemaTypes/`.
- `app/` MUST NOT be edited (FR-007).
- Studio code style: tabs, single quotes, no semicolons, `bracketSpacing: false` (see `studio/package.json` prettier config).

---

## Phase 1: Setup

**Purpose**: Confirm no draft content would lose existing alt values before any sibling `alt` field is removed.

- [ ] T001 From `studio/`, run `npx sanity documents query '*[_type in ["homePage", "servicesPage", "portfolioPiece"]]{_id}' --dataset production`. If it returns `[]`, continue. If it returns documents, stop and tell the user: those documents hold `alt` values that T008–T010 would orphan. **Status 2026-09-28: partly done.** The CLI isn't logged in, so drafts couldn't be read. The public API shows only `siteSettings` published, with no alt values. Rerun after `npx sanity login`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the one shared alt field that every image uses (FR-002, FR-003).

- [X] T002 Create `studio/schemaTypes/fields/altText.ts` exporting `altTextField = defineField({name: 'alt', title: 'Alt text', type: 'string', description: 'Describe what the image shows for people who can\'t see it. Leave out "image of".'})`, importing `defineField` from `sanity`. Don't register it in `studio/schemaTypes/index.ts`; it's a field, not a schema type. Validation is added in T012.

**Checkpoint**: `altTextField` can be imported. User story work can begin.

---

## Phase 3: User Story 1 - Editor adds alt text to any image (Priority: P1) 🎯 MVP

**Goal**: Every meaningful image shows an "Alt text" field inside its own panel. The value saves as `<image>.alt`.

**Independent Test**: In `npm run dev` (in `studio/`), open each of the 8 locations in [data-model.md](data-model.md), add an image, and confirm the alt field appears inside the image and saves. Confirm Site CTA's background image has no alt field.

### Implementation for User Story 1

Each task below imports `altTextField` from `../fields/altText` and adds `fields: [altTextField]` to the image field definition, keeping any existing `options` and `validation`.

- [X] T003 [P] [US1] In `studio/schemaTypes/objects/heroSection.ts`, change the `images` array member from `{type: 'image', options: {hotspot: true}}` to `{type: 'image', options: {hotspot: true}, fields: [altTextField]}`.
- [X] T004 [P] [US1] In `studio/schemaTypes/documents/servicesPage.ts`, add `fields: [altTextField]` to the `about.photo` field.
- [X] T005 [P] [US1] In `studio/schemaTypes/documents/siteSettings.ts`, add `fields: [altTextField]` to the `logo` field.
- [X] T006 [P] [US1] In `studio/schemaTypes/objects/credentialBadge.ts`, add `fields: [altTextField]` to the `image` field.
- [X] T007 [P] [US1] In `studio/schemaTypes/objects/seo.ts`, add `fields: [altTextField]` to the `ogImage` field.
- [X] T008 [P] [US1] In `studio/schemaTypes/objects/imageMedia.ts`, add `fields: [altTextField]` to the `image` field. Delete the sibling `alt` field definition. Change preview `subtitle: 'alt'` to `subtitle: 'image.alt'`. Leave `fullImage` without an alt field (it reuses `image.alt`).
- [X] T009 [P] [US1] In `studio/schemaTypes/objects/serviceCard.ts`, add `fields: [altTextField]` to the `image` field and delete the sibling `alt` field definition.
- [X] T010 [P] [US1] In `studio/schemaTypes/objects/servicesPageItem.ts`, add `fields: [altTextField]` to the `image` field and delete the sibling `alt` field definition.
- [X] T011 [US1] Confirm no sibling alt fields remain and nothing else changed. `studio/schemaTypes/documents/siteCta.ts` and `studio/schemaTypes/objects/videoMedia.ts` must be untouched. `grep -rn "name: 'alt'" studio/schemaTypes` must match only `fields/altText.ts` and `objects/videoMedia.ts`.

**Checkpoint**: All 8 locations show alt text. Editors can enter it; it's not required yet.

---

## Phase 4: User Story 2 - Editor is stopped from publishing without a description (Priority: P2)

**Goal**: A set image can't be published with empty alt text. Long alt text gets a warning.

**Independent Test**: Add an image with empty alt and try to publish (blocked). Enter 126+ characters (warning, publish allowed). Leave an optional image (logo) empty (publishes).

### Implementation for User Story 2

- [X] T012 [US2] In `studio/schemaTypes/fields/altText.ts`, add `validation: (rule) => [rule.required().error('Add alt text describing this image.'), rule.max(125).warning('Keep alt text under 125 characters; some screen readers cut off longer text.')]` to `altTextField` (FR-004, FR-006).
- [ ] T013 [US2] Run `npm run dev` in `studio/` and check the 4 rows of the validation table in [data-model.md](data-model.md#validation-behaviour) on at least one required image (e.g. a service card) and one optional image (e.g. the site logo).

**Checkpoint**: Validation works on every image via the shared field.

---

## Phase 5: User Story 3 - Alt text is ready for the site to use (Priority: P3)

**Goal**: Fetched image data includes `alt`, at the paths in [contracts/image-alt.md](contracts/image-alt.md).

**Independent Test**: In the Studio's Vision tool, a query for an image with alt set returns its `alt` key.

### Implementation for User Story 3

- [ ] T014 [US3] In the Studio (`npm run dev` in `studio/`), set alt text on the site logo in a draft of Site settings. In the Vision tab, with the `drafts` perspective, run `*[_type == "siteSettings"][0]{logo{alt}}` and confirm it returns the entered value. Discard the draft afterwards unless the user wants to keep it; don't publish test content.

**Checkpoint**: The contract in `contracts/image-alt.md` matches real data.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T015 [P] In `studio/`, run `npx sanity schema validate` and fix any errors.
- [X] T016 [P] In `studio/`, run `npx tsc --noEmit` and `npx eslint schemaTypes` and fix any errors in changed files.
- [X] T017 In `studio/`, run `npm run build` and confirm it succeeds.
- [X] T018 [P] At the app root, run `npm run typecheck`. Confirm `git status` shows no changes under `app/` (FR-007, SC-005).
- [ ] T019 Run the rest of [quickstart.md](quickstart.md) (sections 3–4) and tick off any remaining rows.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (T001)**: Must pass before T008–T010, which remove the sibling `alt` fields. It doesn't block T002–T007.
- **Foundational (T002)**: Blocks all user stories.
- **US1 (T003–T011)**: Depends on T002.
- **US2 (T012–T013)**: Depends on T002. Checking it (T013) needs at least one US1 location done.
- **US3 (T014)**: Depends on T005 (logo field).
- **Polish (T015–T019)**: After all stories.

### Parallel Opportunities

- T003–T010 each edit a different file and can run together.
- T012 edits a different file from US1 tasks and can run alongside them.
- T015, T016 and T018 are independent checks.

## Parallel Example: User Story 1

```text
Run together after T002 (and T001 for the last three):
T003 heroSection.ts   T004 servicesPage.ts   T005 siteSettings.ts   T006 credentialBadge.ts
T007 seo.ts           T008 imageMedia.ts     T009 serviceCard.ts    T010 servicesPageItem.ts
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. T001–T002.
2. T003–T011. Every image now has an alt field.
3. Stop and validate in the Studio.

### Incremental Delivery

1. US1: fields exist.
2. US2: validation added (one-file change).
3. US3: data confirmed readable.
4. Polish: validate, build, confirm the app is unchanged.

The whole ticket is small enough to ship as one commit: `feat: add alt text to all sanity image fields`.

## Notes

- Don't set up TypeGen or edit `app/`. Both are out of scope (plan Complexity Tracking, FR-007).
- Don't add an alt field to `siteCta.backgroundImage`, `imageMedia.fullImage` or `videoMedia.poster` (research R4).
- Don't pre-fill badge alt text from the label (research R5).
