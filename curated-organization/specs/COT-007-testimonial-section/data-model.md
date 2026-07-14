# Phase 1 Data Model: Testimonial section

No Sanity schema changes in this pass — content is a hardcoded placeholder array (see
plan.md Content Layer Decisions and research.md). This document defines the in-code shape
that stands in for the future Sanity `testimonial` document type.

## Entity: TestimonialItem

Represents a single client endorsement rendered by the carousel.

| Field             | Type     | Required | Notes                                                                                          |
| ------------------ | -------- | -------- | ------------------------------------------------------------------------------------------------ |
| `quote`           | `string` | Yes      | The testimonial body text. No length constraint enforced in code; layout must not overflow.    |
| `clientName`      | `string` | Yes      | Displayed in the attribution line (e.g., "Jane D.").                                            |
| `clientLocation`  | `string` | Yes      | Displayed alongside the client name (e.g., "Arlington, VA").                                    |
| `rating`          | `number` | Yes      | Star rating, integer 1–5. Renders that many filled stars and a text-equivalent `aria-label`.   |

No `id`/key field is required beyond the array index, since the placeholder list is static
and rendered in a fixed order; React's `key` prop can use the array index or a derived slug
(e.g., `clientName` if uniqueness is guaranteed within the placeholder set).

### Validation rules

- `rating` MUST be an integer between 1 and 5 inclusive.
- `quote`, `clientName`, and `clientLocation` MUST be non-empty strings.
- These are enforced by convention in the placeholder data (TypeScript `TestimonialItem`
  type + literal array), not runtime validation — there is no user input or external data
  source in this pass.

### State transitions

Not applicable to the entity itself. The carousel's *active index* (which `TestimonialItem`
is displayed) is transient UI state owned by `useTestimonialCarousel.ts`:

- Starts at `0` (first testimonial) on mount.
- `next()`: `(index + 1) % testimonials.length`.
- `previous()`: `(index - 1 + testimonials.length) % testimonials.length`.
- No persistence — resets to `0` on full page reload.

## Future migration note

When the Sanity `testimonial` document type is introduced, `TestimonialItem` in
`Testimonial.types.ts` is expected to be replaced by a type derived from
`sanity.types.ts` (per the constitution's Sanity Content Layer principle), and the
hardcoded array in `Testimonial.tsx` replaced by data passed in from the `home` route's
loader via a new colocated or shared GROQ query. `useTestimonialCarousel.ts` should need no
changes, since it operates on `testimonials.length` and array indices rather than the shape
of each item.
