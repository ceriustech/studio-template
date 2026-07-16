# Phase 1 Data Model: Services Pricing section

No Sanity schema changes in this pass, and no runtime/persisted data entities — all three
pricing cards' copy is a fixed value hardcoded in a module-level data array in `pricing/index.tsx`
(see plan.md Content Layer Decisions and research.md). There is no per-instance configuration
beyond that fixed array, no user input, and no state that varies over the component's lifetime.
The one shape worth documenting is the **prop contract** consumed by the `PricingCard`
sub-component, since it is reused three times with two different content shapes.

## PricingCard (prop contract, not a persisted entity)

Represents one card rendered by `Pricing`. Defined in `PricingCard.types.ts`.

| Field         | Type       | Description                                                                                                          |
| ------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| `eyebrow`     | `string`   | Small label above the title, e.g. `"Lead"`, `"Associate"`, `"Fine print"`.                                            |
| `title`       | `string`   | Card heading (`<h3>`), e.g. `"Lead Organizer"`, `"Fees"`.                                                             |
| `price`       | `string?`  | Rate line shown below the title on the two organizer cards, e.g. `"$100 / hour"`. Omitted on the fees card.          |
| `description` | `string?`  | Prose paragraph shown on the two organizer cards. Omitted on the fees card.                                          |
| `features`    | `string[]?`| Checkmark list of fee notes, used only by the fees card. Omitted on the two organizer cards.                          |
| `featured`    | `boolean?` | When `true`, the card renders with the contrasting/teal styling. Only the Lead Organizer card sets this; default `false`. |
| `ctaLabel`    | `string?`  | Call-to-action label, e.g. `"Book consultation"`. Omitted on the fees card (no CTA per spec Assumptions).             |

## Fixed content (for reference, not a data entity)

| # | Eyebrow       | Title               | Featured | Price                                | Description / Features                                                                                                                                                                                                                                    | CTA                |
| - | ------------- | -------------------- | -------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| 1 | `Lead`        | Lead Organizer        | Yes      | `$100 / hour`                          | "Strategist that focuses on deep space conceptualization, system architect, consolidation therapy approach (managing the emotional decluttering process) and overall project creative direction."                                                       | Book consultation   |
| 2 | `Associate`   | Associate Organizer   | No       | `$75 / hour per additional organizer`  | "Specialist that focuses on independent space execution, high efficiency system implementation, inventory cataloging, labeling, and collaborative team organizing."                                                                                     | Book consultation   |
| 3 | `Fine print`  | Fees                  | No       | —                                       | Features: "Donation fee — $30 per trip"; "Products billed separately from organizing time"; "*Travel fees may apply"                                                                                                                                     | (none)               |

Section header/tagline (rendered by `Pricing/index.tsx` directly, not by `PricingCard`):

- Eyebrow: `Investment` (unchanged from mockup)
- Heading: `Transparent pricing` (unchanged from mockup)
- Tagline: "Every product and space is unique. Services are based on an hourly rate. Your custom
  quote is built during your free consultation."

## Future migration note

If this copy is later moved into Sanity as page-level editorial content, `Pricing` would accept
the header/tagline and the three-card array as props (typed from `sanity.types.ts`) from a
`servicesPage` document query, and `PricingCard`'s prop contract above would become the shape of
each array entry. No other part of `PricingCard` (layout, CSS) would need to change.
