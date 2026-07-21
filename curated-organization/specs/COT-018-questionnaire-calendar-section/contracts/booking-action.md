# Contract: Booking route `action`

This is not an external/public API — it's the React Router `action` for the existing `/booking`
route, invoked by `Questionnaire`'s `<Form method="post">`. Documented as a contract because
`Questionnaire` and `Calendar` on the client, and the email/Calendly integrations on the server,
all depend on its shape staying stable.

## Request

`POST /booking`, `Content-Type: multipart/form-data` (native `<Form>` submission), fields:

| Form field  | Cardinality              | Notes                                                        |
| ----------- | ------------------------- | -------------------------------------------------------------- |
| `firstName` | one                        |                                                                  |
| `lastName`  | one                        |                                                                  |
| `email`     | one                        |                                                                  |
| `phone`     | zero or one                |                                                                  |
| `location`  | zero or one                |                                                                  |
| `service`   | zero or one                | One of `SERVICE_VALUES` (see `data-model.md`), or absent.        |
| `spaces`    | zero or more (repeated key) | Native multi-`<select>`/checkbox-group submits one `spaces` entry per selection. |
| `timeframe` | one                        | One of `TIMEFRAME_VALUES`.                                       |
| `referral`  | zero or one                | One of `REFERRAL_VALUES`, or absent.                              |
| `notes`     | zero or one                |                                                                  |

## Response (`useActionData()` shape)

**On validation failure** (any required field missing/invalid, per `data-model.md`):

```text
{
  ok: false
  fieldErrors: { [fieldName]: string }   // one human-readable message per invalid field
}
```

- No email is sent.
- No `prefill` is returned — the route re-renders `Questionnaire`, not `Calendar`.

**On success**:

```text
{
  ok: true
  prefill: Inquiry   // the fully validated Inquiry, see data-model.md
}
```

- Exactly one email has been sent to `BOOKING_INBOX` by the time this response is returned,
  *unless* sending failed — a send failure does not change `ok`/`prefill`; it is logged
  server-side and never surfaces to the visitor (FR-011: the visitor's path to `Calendar` is never
  blocked by an email delivery failure).
- The route re-renders `Calendar` (not `Questionnaire`) using `prefill`.

## Idempotency / double-submit

A second identical `POST` (e.g., a double-click before the button disables, or a resubmitted form)
is treated as a new, independent submission — it is validated and, if valid, sends a second email
and returns a fresh `prefill`. Preventing the double-click from firing a second request in the
first place (client-side submit-button disabling while the `action` is in flight) is the
mechanism relied on to keep this rare in practice — the contract itself has no dedupe/idempotency
key.
