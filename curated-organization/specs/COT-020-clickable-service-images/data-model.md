# Data Model: Clickable Service Images on Home Page

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This feature introduces no Sanity content types, schema changes, or GROQ queries (see [research.md](./research.md) and the plan's Content Layer Decisions — "N/A"). No new persisted or fetched data is involved. This document records the shape of the one existing entity this feature touches, for completeness.

## Existing entity, unchanged: Service Card

Sourced from the hardcoded `services` array in `app/routes/pages/home/components/Services/Services.tsx`; typed by `ServiceCardProps` in `Services.types.ts`.

| Field         | Type     | Description                                                                 |
| ------------- | -------- | ----------------------------------------------------------------------------- |
| `title`       | `string` | Service name (e.g. "Home organizing"). Unchanged by this feature.            |
| `description` | `string` | Short body copy. Unchanged by this feature.                                  |
| `imageUrl`    | `string` | Background-image URL for the card. Unchanged by this feature.                |
| `altText`     | `string?`| Optional description of the image's visual content. Unchanged by this feature — remains distinct from the new link's accessible name (see research.md). |

**No new fields are added.** This feature adds a fixed navigation destination (`/services`, the same constant already used by the section's "View all services →" link) around the existing image element — not a new per-card data field. Every card links to the same destination, so no `href`/`to` field is introduced onto `ServiceCardProps`.
