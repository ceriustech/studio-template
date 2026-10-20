# Data model: Testimonials as their own content studio section

## `testimonial` (document, new; was an object)

`studio/schemaTypes/documents/testimonial.ts` (moved from `objects/`).

| Field | Title | Type | Rules | Change |
|---|---|---|---|---|
| `quote` | Quote | `text` (3 rows) | required | — |
| `clientName` | Client name | `string` | required | New description: "Name only. The site adds the dash before it and the comma before the location." |
| `clientLocation` | Client location | `string` | optional | — |
| ~~`rating`~~ | Rating | — | — | **Removed**. The site always shows 5 stars. |

- **Preview**: title is `clientName`, subtitle is `clientLocation` (unchanged).
- **Icon**: `icons.comment` (unchanged).
- **Studio list**: a top-level "Testimonials" item with its own dividers, after Portfolio pieces (see [research.md](research.md#r2-studio-placement)).

## `homePage` (document, edited)

- Remove the `testimonials` field (`array` of `testimonial`).
- Remove the `testimonials` group ("Testimonials" tab).
- All other fields and groups are unchanged.

## Migration `testimonials-to-documents`

`studio/migrations/testimonials-to-documents/index.ts`, `documentTypes: ['homePage']`.

| Input | Output |
|---|---|
| Published `homePage` with `testimonials[i]` | `createIfNotExists` `testimonial-migrated-{i+1}` with `quote`, cleaned `clientName`, `clientLocation` (no `rating`) |
| Any `homePage` / `drafts.homePage` with `testimonials` defined | `unset` `testimonials` |
| `testimonials` already `undefined` | No-op |

**Client name clean-up**: trim, remove leading `—` / `–` / `-` and whitespace, then remove trailing `,` and whitespace. For example, `"— Sarah M.,"` becomes `"Sarah M."`.

Expected result in `production`: 3 `testimonial` documents (`-1` "Client name", `-2` "Sarah M.", `-3` "James T."), and `homePage.testimonials` undefined.

## Frontend shapes

`TestimonialItem` becomes `{ quote; clientName; clientLocation? }` (`rating` removed). `HomeContent.testimonials: TestimonialItem[]` is unchanged. The `Testimonial` component always renders 5 stars with `role="img"` and `aria-label="5 out of 5 stars"`.

Loader-only (hand-written, TypeGen exception):

```ts
type HomeQueryResult = {
	page: CmsHomePage | null;          // CmsHomePage loses `testimonials`
	testimonials: Maybe<Maybe<CmsTestimonial>[]>;
	businessName: Maybe<string>;
};
```

## Validation and state rules

- **A usable testimonial**: its quote and client name are non-blank after trimming.
- **Stars**: always 5. Any old `rating` value is ignored.
- **List**: usable CMS items, or the backup list if there are none. The two are never mixed.
- **Drafts**: never shown. The public client reads the `published` perspective.
