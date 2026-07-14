# Data Model: Home Page Intro Section

**Feature**: COT-003 Intro Section | **Date**: 2026-07-13 | **Status**: N/A

## Summary

This feature does not introduce any data model, schema changes, or content entities. All text content is hardcoded brand messaging (not editable post-deploy), and no new Sanity schema types are required.

## Content Model

**N/A** — No new content types required.

### Hardcoded Content (Functional)

The following text is hardcoded in the Intro component and not managed via CMS:

| Field | Value | Classification |
| ----- | ----- | --------------- |
| Eyebrow | "Our approach" | Functional (brand messaging) |
| Heading | "Functional luxury" | Functional (brand messaging) |
| Body copy | "We believe an organized home is a form of self-care. Our approach merges refined aesthetics with practical systems — spaces that look beautiful and work effortlessly for the way you actually live." | Functional (brand messaging) |
| Link text | "Learn more about us →" | Functional (brand messaging) |
| Link destination | `/about` | Functional (route reference) |

### Future Content Decisions

If client-editable brand messaging becomes a requirement in the future:
- Create a new Sanity document type (e.g., `homepageIntroSection`) with fields for eyebrow, heading, body, and link text
- This would be a separate feature ("Make intro section editable") — not part of the current implementation
- When that feature is built, the Intro component would query Sanity instead of using hardcoded values

## Database Changes

**N/A** — No database tables, migrations, or schema modifications required.

## API/Interface Changes

**N/A** — No new API endpoints or external interfaces.

## Conclusion

This feature is purely presentational. Implementation can proceed directly to component development (Phase 2).

