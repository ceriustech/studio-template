# Data Model: Booking page

All types live in `booking.types.ts`, except component props, which live in each component's own types file. Every value is serializable, so icons are passed as keys rather than elements.

## BookingContent (loader → route; `whatToExpect` is also read by `Layout`)

| Field | Type | Source | Fallback |
|---|---|---|---|
| `hero` | `{ eyebrow?, heading, body? }` | `bookingPage.hero` | Backup when `heading` is empty |
| `pathCards` | `PathCardContent[]` | `bookingPage.twoPaths[]` | Backup pair when no card is usable |
| `callInfo` | `CallInfoContent` | `bookingPage.callInfo` and `siteSettings` contact fields | See below |
| `questionnaire` | `QuestionnaireContent` | `bookingPage.questionnaire` | See below |
| `calendar` | `CalendarContent` | `bookingPage.calendar` | See below |
| `calendlyUrl` | `string \| null` | `calendar.calendlyUrl` | `CALENDLY_URL`, then `null` |
| `whatToExpect` | `{ eyebrow?, heading, steps: Step[] }` | `bookingPage.whatToExpect` | Backup when `heading` is empty; steps fall back as a list |
| `seo` | `PageSeo` | `bookingPage.seo` | `{}`, which falls back field by field to the root default |

## PathCardContent

`{ icon: 'plus' | 'refresh'; title: string; description?: string }`, combined with one of:
- `{ kind: 'options'; options: { icon: 'phone' | 'email'; label: string }[] }` (at least one option required)
- `{ kind: 'cta'; ctaLabel: string; ctaHref: string; variant: 'primary' | 'secondary' }`. A blank `ctaLabel` falls back to the backup label, a blank or invalid `ctaHref` to `#calendly`, and a missing `variant` to `secondary`.

## CallInfoContent

`eyebrow?`, `heading`, `intro?`, `switchToEmailLabel` (field-level fallback), `phone: { display: string; tel: string }`, `hours?`.
- The section's own fields fall back as a whole when `heading` is empty.
- `phone` uses the `siteSettings` pair only when both values are present and `tel` matches `^\+?[0-9]+$`. Otherwise it uses the backup pair. `hours` is hidden when blank.

## QuestionnaireContent

- `eyebrow?`, `heading`, `intro?`.
- `aboutYouLabel`, `anythingElseLabel`, and `fields` for `firstName`, `lastName`, `email`, `phone` and `notes`, each `{ label: string; placeholder?: string }`.
- `submitLabel`, `submitNote?`.
- `messages: { firstNameRequired, lastNameRequired, emailRequired, emailInvalid }`, all strings.

When `heading` is empty, the whole object is the backup. Otherwise every label, `submitLabel` and every message falls back to its backup value one at a time, while blank placeholders and a blank `submitNote` are left out.

## CalendarContent

`eyebrow?`, `heading`, `unavailable: { icon?, title, description? }`.
- The header falls back as a whole when `heading` is empty.
- `unavailable` falls back as a whole when `errorTitle` is empty.

## Step

`number`, `title` (both required, otherwise the step is skipped), `description?`. This is the shared `step` Studio type.

## Studio change: `bookingPage.calendar.calendlyUrl`

Type `url`, optional. Validation: `https` only, host `calendly.com` or `www.calendly.com`.
