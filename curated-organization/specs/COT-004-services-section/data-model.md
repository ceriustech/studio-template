# Data Model: COT-004 Services section

## Entities

- ServiceCard
  - `title` (string) — card title displayed in serif font
  - `description` (string) — short descriptive copy in muted text
  - `imageUrl` (string) — hero image for the card (used as background)
  - `altText` (string) — accessible alt text for the image (empty if decorative)

Notes: For the initial static implementation these fields map to hard-coded values in the component. If content migration to Sanity is requested later, create an editorial content type with these fields and update the route loader.
