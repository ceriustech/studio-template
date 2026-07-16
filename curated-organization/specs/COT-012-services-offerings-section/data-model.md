# Phase 1 Data Model: Services Offerings section

No Sanity schema changes in this pass, and no runtime/persisted data entities — all five
service items' copy, images, and list entries are fixed values hardcoded in a module-level data
array in `service/index.tsx` (see plan.md Content Layer Decisions and research.md). There is no
per-instance configuration beyond that fixed array, no user input, and no state that varies over
the component's lifetime. The one shape worth documenting is the **prop contract** consumed by
the `ServiceItem` sub-component, since it is reused five times with different values.

## ServiceItem (prop contract, not a persisted entity)

Represents one entry rendered by `Service`. Defined in `ServiceItem.types.ts`.

| Field         | Type       | Description                                                                                     |
| ------------- | ---------- | ------------------------------------------------------------------------------------------------- |
| `eyebrow`     | `string`   | Zero-padded two-digit order label, e.g. `"01"`.                                                  |
| `heading`     | `string`   | Service title, e.g. `"Home organizing"`.                                                        |
| `description` | `string`   | Descriptive paragraph shown below the heading.                                                  |
| `imageUrl`    | `string`   | Background-image URL for the item's photo panel.                                                |
| `items`       | `string[]` | Bulleted list of included services/inclusions; length varies per item (3–5 entries).             |
| `ctaLabel`    | `string`   | Call-to-action link label, e.g. `"Get started"`.                                                 |
| `reversed`    | `boolean`  | When `true`, text renders left / image renders right (mockup's `.reverse` variant); default `false` (image left / text right). |

## Fixed content (for reference, not a data entity)

| # | Eyebrow | Heading                     | Image URL                                                                                                                                                                                                                    | List entries                                                                                                                                                                                     | Reversed |
| - | ------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1 | `01`    | Home organizing               | `https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=1000&q=80&auto=format`                                                                                                                                       | Decluttering and sorting; Custom organization systems; Product sourcing and shopping; Labeling and styling; Donation coordination                                                                    | No       |
| 2 | `02`    | Unpacking + move-in            | `https://images.unsplash.com/photo-1758523671826-d7f8217ffac3?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format`                                          | Full unpacking service; Room-by-room system setup; Product sourcing and shopping; Box breakdown and removal; Labeling and styling                                                                     | Yes      |
| 3 | `03`    | Business + office              | `https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1000&q=80&auto=format`                                                                                                                                        | Office layout optimization; Filing and document systems; Supply organization; Brand-aligned workspace design                                                                                         | No       |
| 4 | `04`    | Legacy Transitions              | `https://plus.unsplash.com/premium_photo-1733324428864-3450ea2da8bf?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`                                               | Compassionate discretionary sorting; Responsible consignment & Donation curation; Seamless Heirloom Logistics — ensuring family pieces reach their next home safely; Digital decluttering and legacy protection | Yes      |
| 5 | `05`    | Executive Functioning Coach    | `https://plus.unsplash.com/premium_photo-1661754876215-247b4db12e83?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`                                               | 30-60 minute virtual coaching sessions; Personalized strategies; Compassionate accountability to help you build and maintain sustainable habits                                                       | No       |

Descriptions for items 4–5 (items 1–3's descriptions are in the table above's source mockup and
omitted here for brevity — see FR-004):

- **Legacy Transitions**: "We guide families through major life transitions with absolute
  discretion, care and ease. Whether navigating a sensitive downsize or honoring the estate of
  a loved one, we manage the entire process by transforming overwhelming logistics into a
  peaceful, respectful transition."
- **Executive Functioning Coach**: "Executive functioning skills are the mental processes that
  help us plan, organize, manage time, stay focused, and follow through on tasks in everyday
  life."

## Future migration note

If this copy/image data is later moved into Sanity as page-level editorial content, `Service`
would accept the five-item array as a prop (typed from `sanity.types.ts`, with each `imageUrl`
sourced via `app/lib/sanity/image.ts`'s `urlFor()`) from a `servicesPage` document query, and
`ServiceItem`'s prop contract above would become the shape of each array entry. No other part
of `ServiceItem` (layout, CSS) would need to change.
