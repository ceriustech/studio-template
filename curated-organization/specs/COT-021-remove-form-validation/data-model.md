# Phase 1 Data Model: Remove Form Validation & Fast-Track Booking

No Sanity schema changes. This feature does not touch `studio/` or any content type — the `Inquiry` shape below is an in-application (code-only) contract defined in `app/routes/pages/booking/utils.ts`, not editorial content.

## Entity: `Inquiry`

The visitor's questionnaire answers, parsed from the questionnaire's `FormData` via `parseInquiry()`.

| Field                  | Type (after this feature)      | Required to reach Calendar? | Notes                                                                 |
| ---------------------- | ------------------------------- | ---------------------------- | ---------------------------------------------------------------------- |
| `firstName`             | `string` (default `''`)          | No                            | Previously required non-empty (`min(1)`); constraint removed.          |
| `lastName`              | `string` (default `''`)          | No                            | Previously required non-empty (`min(1)`); constraint removed.          |
| `email`                 | `string` (default `''`)          | No                            | Previously required valid email shape; format check removed.          |
| `phone`                 | `string` (default `''`)          | No                            | Now progressively auto-formatted client-side to `(XXX) XXX-XXXX` as digits are typed; still free-text on the wire. |
| `location`              | `string` (default `''`)          | No                            | Unchanged — was already optional.                                      |
| `service`               | enum (optional)                  | No                            | Unchanged — was already optional.                                      |
| `deadline`              | `string` (default `''`)          | No                            | Unchanged — was already optional.                                      |
| `investmentTarget`      | enum (optional)                  | No                            | Unchanged — was already optional.                                      |
| `decisionMakersReady`   | enum (optional)                  | No                            | Unchanged — was already optional.                                      |
| `referral`              | enum (optional)                  | No                            | Unchanged — was already optional.                                      |
| `notes`                 | `string` (default `''`, max 2000) | No                            | Length cap retained (it's a payload-size guard, not a blocking validation UX concern); still cannot fail submission since it is not surfaced as a field error anymore — the schema now truncates/accepts rather than rejecting. |

**State transitions**: `Inquiry` is produced at most once per questionnaire submission and passed to `Calendar`. After this feature, `Calendar` may also receive **no** `Inquiry` at all (`null`), representing the "Schedule now" bypass path where no questionnaire was ever shown.

## Entity: `CalendarProps.inquiry`

| Field     | Type (after this feature) | Notes                                                                                          |
| --------- | --------------------------- | ------------------------------------------------------------------------------------------------ |
| `inquiry` | `Inquiry \| null`            | `null` when reached via "Schedule now" bypass. `Calendar` must render its Calendly `prefill` with empty `name`/`email` and empty `customAnswers` strings when `inquiry` is `null`, rather than throwing or reading properties off `null`. |

No new entities, no relationships, no persistence — `Inquiry` remains a single in-memory value passed from `Questionnaire`/booking `index.tsx` to `Calendar` for the duration of one page view, per the existing (COT-018) design.
