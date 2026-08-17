# Data Model: Booking contact options & shortened intake

No Sanity schema changes. Everything below is transient client-side state and local TypeScript
types within `app/routes/pages/booking/`; nothing is persisted.

## Inquiry (revised)

Replaces the current, wider `Inquiry` shape in `booking/utils.ts`. Produced once per shortened-questionnaire submission; consumed by `Calendar` to prefill the Calendly widget.

| Field       | Type              | Required | Notes                                                                 |
| ----------- | ----------------- | -------- | ---------------------------------------------------------------------- |
| `firstName` | `string`          | Yes      | Non-empty after trim.                                                  |
| `lastName`  | `string`          | Yes      | Non-empty after trim.                                                  |
| `email`     | `string`          | Yes      | Must be a valid email shape.                                           |
| `phone`     | `string`          | No       | Digit-only auto-formatted to `(XXX) XXX-XXXX`, unchanged from COT-021. |
| `notes`     | `string` (≤2000)  | No       | Backs the single open-ended field, "Anything you'd like us to know?"   |

**Removed fields** (no longer part of `Inquiry`): `location`, `service`, `deadline`, `investmentTarget`, `decisionMakersReady`, `referral` — along with their associated `*_VALUES` enums and `*_LABELS` maps in `booking/utils.ts`, since the questions that produced them are removed per FR-005.

**Validation rule change**: `firstName`, `lastName`, `email` become required (block submission + show a field-specific error when missing/invalid); `phone`/`notes` remain optional. This narrows COT-021's blanket "no validation" to only the fields that still exist on the shortened form.

## BookingView (new)

A client-only enum in `booking/index.tsx` (or `booking.types.ts` if it grows beyond a single union) representing which single view, if any, renders below the Two Paths section.

| Value           | Meaning                                                              |
| ---------------- | --------------------------------------------------------------------- |
| `'none'`         | Default. Nothing renders below Two Paths except the (separately rendered) "What to Expect" section. |
| `'call'`         | The `CallInfo` view is shown (visitor chose "Call us").               |
| `'questionnaire'`| The shortened `Questionnaire` is shown (visitor chose "Email us", or switched over from `CallInfo`). |
| `'calendar'`     | The `Calendar` scheduling view is shown (reached via questionnaire submit, or directly via "Schedule now"). |

Replaces the current `inquiry`/`showCalendar` two-boolean state, which allows the "nothing chosen yet" case to accidentally fall through to showing the questionnaire — the regression FR-011 forbids.

## PathCardProps (revised)

`app/routes/pages/booking/components/two-paths/components/PathCard/PathCard.types.ts`. Discriminated on `kind` so a card is either a single-CTA card or an options card, never a mix of both shapes.

```ts
interface PathOption {
  icon: string;
  label: string;
  onClick: () => void;
}

type PathCardProps = {
  icon: string;
  title: string;
  description: string;
} & (
  | {
      kind: 'cta';
      ctaLabel: string;
      ctaHref: string;
      variant: 'primary' | 'secondary';
      onClick?: () => void;
    }
  | {
      kind: 'options';
      options: PathOption[];
    }
);
```

"Book again" uses `kind: 'cta'` (unchanged behavior). "Get started" uses `kind: 'options'` with two entries (`Call us`, `Email us`).

## TwoPathsProps (revised)

`app/routes/pages/booking/components/two-paths/TwoPaths.types.ts`.

```ts
interface TwoPathsProps {
  onSelectCall: () => void;
  onSelectEmail: () => void;
  onBookAgain: () => void;
}
```

Replaces the current single `onBookAgain` prop; `onSelectCall`/`onSelectEmail` back the two new "Get started" options.

## CallInfoProps (new)

`app/routes/pages/booking/components/CallInfo/CallInfo.types.ts`.

```ts
interface CallInfoProps {
  onPreferEmail: () => void;
}
```

Backs the "Prefer to write? Send us your details instead" control, which switches the view to `'questionnaire'` without returning to the Two Paths cards.
