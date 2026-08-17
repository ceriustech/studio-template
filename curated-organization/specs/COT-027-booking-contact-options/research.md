# Research: Booking contact options & shortened intake

## Design source of truth

**Decision**: The three screenshots attached to the ticket (shortened questionnaire, call-info view, updated "Get started" two-option card) are the authoritative visual reference for this feature, not `.specify/site-design/curated-book-mockup.html`.

**Rationale**: The mockup file's `<!-- TWO PATHS -->` markup (lines 1048–1064) still shows the old single `Start questionnaire` button, and the file contains no markup for a call-info view or a shortened questionnaire (confirmed by searching the file for `CALL`, `tel:`, `Anything you`, and related strings — no matches). This mirrors the precedent already recorded in COT-018's spec, where the mockup file was similarly out of date relative to the actual design source for that feature.

**Alternatives considered**: Treat the stale mockup markup as authoritative and only add the two-option layout as an extension of it. Rejected — the mockup has no basis for the call-info view's copy, layout, or the shortened questionnaire's reduced field set, so it can't serve as a structural reference for those two new views; the screenshots are the only complete source.

## Current architecture of the Booking flow (as implemented today)

**Decision**: Continue the existing fully client-side state pattern in `app/routes/pages/booking/index.tsx` — no route `action`, no server round-trip, no outbound email.

**Rationale**: COT-018's plan originally proposed a React Router `action`-based flow (zod validation + Resend email notification on submit) but the code actually shipped (and left in place by COT-021, which explicitly removed validation) is a plain client component: `Booking` holds `inquiry`/`showCalendar` state, `Questionnaire` parses `FormData` client-side via `parseInquiry` and calls an `onSubmit` prop, and `Calendar` receives `inquiry` as a prop to build Calendly's `prefill`. There is no `resend` dependency, no `action` export, and no server-side email sending anywhere in the codebase today (confirmed by search). Introducing a server action/email pipeline is out of scope for this ticket, which only asks to change the client-side navigation flow and trim form fields.

**Alternatives considered**: Introduce a route `action` now to match COT-018's original (unbuilt) plan. Rejected — no ticket requirement calls for it, it would be a large unrelated scope addition, and the existing client-side pattern already satisfies every acceptance criterion in this ticket (same-page swap, no navigation, keyboard operable).

## View-state model for the area below Two Paths

**Decision**: Replace the current two-boolean (`inquiry`/`showCalendar`) state in `Booking` with a single explicit view enum — `'none' | 'call' | 'questionnaire' | 'calendar'` — defaulting to `'none'`.

**Rationale**: The current default (no state set) falls through to rendering `Questionnaire`, which is exactly the regression FR-011 forbids ("no option chosen" must render nothing below Two Paths). An explicit `'none'` state, plus one state slot per possible view, makes "nothing chosen yet" a real, representable state instead of an accidental fallthrough, and cleanly adds the new `'call'` view alongside the two existing ones.

**Alternatives considered**: Keep two booleans and add a third (`showCall`). Rejected — three independent booleans allow invalid combinations (e.g., both `showCall` and `showCalendar` true) that a single enum makes structurally impossible.

## Extending PathCard for the "Get started" two-option layout

**Decision**: Extend `PathCardProps` to a discriminated union on a new `kind` field — `kind: 'cta'` (today's single button, used by "Book again") or `kind: 'options'` (a small set of icon+label buttons, used by "Get started") — rather than creating a second, near-duplicate card component.

**Rationale**: Both cards share identical chrome (icon circle, title, description, centered layout, hover treatment on the card itself) per both the existing CSS and the new screenshot; only the action area at the bottom differs. A discriminated union keeps that shared chrome in one component and lets TypeScript strict mode statically rule out mixing `ctaLabel`/`ctaHref` with `options` on the same card.

**Alternatives considered**: A new parallel `ContactOptionsCard` component duplicating the icon/title/description markup. Rejected — duplicates markup and styling that already exists in `PathCard`/`pathCard.css` for no behavioral benefit, and this route has only one place (`TwoPaths`) that ever renders either shape.

## Business phone number and hours copy

**Decision**: Hardcode the business phone number and supporting hours copy as functional constants co-located with the new `CallInfo` component, matching the precedent already set for the Calendly URL (hardcoded in `Calendar.tsx`) and the questionnaire's option-label maps (hardcoded in `booking/utils.ts`).

**Rationale**: No Sanity content type or query for business contact information exists anywhere in this codebase today — the Footer's own "Phone" link (`app/routes/components/Footer/index.tsx`) is itself an unimplemented `href="#"` placeholder, not real editorial content. Introducing a new Sanity schema field for a single phone number, on a ticket that is scoped to a UI/flow rework, would be scope creep the ticket does not request.

**Alternatives considered**: Add a `phoneNumber`/`callHours` field to a `siteSettings`-style Sanity document. Rejected for this ticket — no such document type exists yet, and creating one is a content-modeling decision better made deliberately (with the client) rather than as a side effect of this flow change; can be revisited in a future ticket if the business wants to self-edit this value.

## Validation for the shortened questionnaire

**Decision**: Reintroduce required-field validation — first name, last name, and email — scoped only to the shortened questionnaire's contact fields, implemented client-side with the existing `zod` schema in `booking/utils.ts` plus inline error state and `aria-live`/`aria-describedby`/`aria-invalid` wiring in `Questionnaire.tsx`. Phone and the open-ended note stay optional. The "Book again" → "Schedule now" path continues to require no fields at all.

**Rationale**: COT-021 removed all validation from the (then-longer) questionnaire so returning clients could bypass it entirely via "Schedule now." This ticket explicitly asks for required-field validation with accessible error messaging on the new, shorter form — a narrower, intentional reversal that only applies to the fields that remain, not a re-expansion of the form itself.

**Alternatives considered**: Leave validation off, matching COT-021. Rejected — directly contradicts this ticket's explicit acceptance criterion ("Required fields are validated before submission, with accessible error messaging").

## Calendar prefill mapping after the field reduction

**Decision**: Update `Calendar.tsx`'s Calendly `customAnswers` mapping to carry only `phone` and `notes` from `Inquiry`, removing the `service`/`deadline`/`investmentTarget`/`decisionMakersReady`/`referral`/`location` mappings and their label-map imports (`SERVICE_LABELS`, `INVESTMENT_LABELS`, `DECISION_LABELS`, `REFERRAL_LABELS`), since those fields no longer exist on the reduced `Inquiry` shape.

**Rationale**: `Inquiry` is being reduced to `firstName`, `lastName`, `email`, `phone`, `notes` per FR-005; `Calendar`'s prefill construction reads fields directly off `Inquiry` and would otherwise reference removed properties, which strict TypeScript will not allow to pass silently.

**Alternatives considered**: Keep the wider `Inquiry` type and simply stop collecting the removed fields in the form (leaving them always empty). Rejected — this leaves dead types/fields around contrary to the "no dead code" workflow rule, and defeats the point of "all other existing questions are removed."
