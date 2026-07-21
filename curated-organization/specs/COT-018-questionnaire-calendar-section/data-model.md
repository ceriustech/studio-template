# Phase 1 Data Model: Questionnaire and Calendar sections

No Sanity content type is introduced (see spec Assumptions / plan Content Layer Decisions). The
only data shape this feature introduces is **Inquiry** — transient request data produced by one
questionnaire submission. It is never persisted; it lives only for the duration of the request
that produces it, and then travels forward as `action` return data (`prefill`) for the lifetime of
the page.

## Inquiry

| Field       | Type                              | Required | Source (mockup field)                  | Notes                                                                 |
| ----------- | ---------------------------------- | -------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| `firstName` | string, 1–100 chars, trimmed       | Yes      | "First name"                             |                                                                        |
| `lastName`  | string, 1–100 chars, trimmed       | Yes      | "Last name"                               |                                                                        |
| `email`     | string, valid email, trimmed        | Yes      | "Email"                                   |                                                                        |
| `phone`     | string, 0–30 chars, trimmed         | No       | "Phone"                                   | Free-text; no format enforced beyond a max length (intl formats vary). |
| `location`  | string, 0–200 chars, trimmed        | No       | "Your location (city or zip code)"        |                                                                        |
| `service`   | enum, one of `SERVICE_VALUES`       | No       | "Which service are you interested in?"    | Placeholder ("Select a service") maps to `undefined`, not an enum value. |
| `spaces`    | array of enum `SPACE_VALUES`, min 1 required-when-provided | Yes (≥1 selected) | "Which spaces need attention?" | Multi-select, per FR-003 — not limited to one value despite the mockup's static single-`<select>` rendering. |
| `timeframe` | enum, one of `TIMEFRAME_VALUES`     | Yes      | "What is your ideal timeframe?"           |                                                                        |
| `referral`  | enum, one of `REFERRAL_VALUES`      | No       | "How did you hear about us?"              |                                                                        |
| `notes`     | string, 0–2000 chars, trimmed        | No       | "Anything else you'd like us to know?"    | FR/Edge case: submissions exceeding 2000 chars are rejected with a field-specific error, not silently truncated. |

Required fields match spec FR-004: name (`firstName`+`lastName`), a valid `email`, and at least one
`spaces` selection are the strict minimum; `timeframe` is additionally required here because the
mockup's dropdown has no neutral/"no preference" option — every real option commits to a stance,
so a placeholder-only submission is not a meaningful answer.

### Enumerated option values

Per spec Assumption ("the mockup's option wording is authoritative for visible copy"), values below
use the mockup's actual dropdown option text; short internal slugs are assigned for the `enum`
values themselves (used in code, emails, and Calendly custom answers — never shown to the visitor
directly, the label text is what renders).

**`SERVICE_VALUES`** (labels from `<!-- QUESTIONNAIRE -->`, "Which service are you interested in?"):

| Value              | Label                  |
| ------------------- | ----------------------- |
| `home-organizing`   | Home organizing         |
| `unpacking-move-in` | Unpacking + move-in      |
| `business-office`   | Business + office        |
| `not-sure`          | Not sure yet             |

**`SPACE_VALUES`** ("Which spaces need attention?"):

| Value              | Label              |
| ------------------- | -------------------- |
| `kitchen-pantry`    | Kitchen / Pantry      |
| `closet-wardrobe`   | Closet / Wardrobe     |
| `garage`            | Garage                |
| `office`            | Office                |
| `living-areas`      | Living areas          |
| `whole-home`        | Whole home            |

**`TIMEFRAME_VALUES`** ("What is your ideal timeframe?"):

| Value               | Label                    |
| -------------------- | -------------------------- |
| `asap`               | As soon as possible        |
| `within-2-weeks`     | Within 2 weeks             |
| `within-a-month`     | Within a month              |
| `flexible`           | Flexible / no rush          |

**`REFERRAL_VALUES`** ("How did you hear about us?"):

| Value               | Label                        |
| -------------------- | ------------------------------ |
| `instagram`          | Instagram                       |
| `google-search`      | Google search                   |
| `referral-friend`    | Referral from a friend           |
| `other`              | Other                            |

## Action result

The route `action` returns one of two shapes (used by `useActionData()` to decide which section to
render — see `contracts/booking-action.md` for the full request/response contract):

- **Validation failure**: field-level error messages, no `Inquiry` produced, no email sent, no
  `prefill` — `Questionnaire` stays rendered, re-populated with the visitor's prior entries and the
  new error messages (FR-005; visitor's other already-entered answers are not discarded).
- **Success**: a fully-validated `Inquiry`, exposed as `prefill` — `Calendar` renders in
  `Questionnaire`'s place (FR-007), using `prefill.firstName`/`lastName`/`email` for the widget's
  own `prefill.name`/`prefill.email`, and `spaces`/`timeframe`/`notes` (rendered as their labels,
  not raw slugs) for `prefill.customAnswers` (FR-010). The email sent to `BOOKING_INBOX` (FR-006)
  includes every field in the table above that the visitor actually provided.
