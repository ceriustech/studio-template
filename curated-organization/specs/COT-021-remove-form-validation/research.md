# Phase 0 Research: Remove Form Validation & Fast-Track Booking

The spec left no `[NEEDS CLARIFICATION]` markers, so this phase resolves implementation-approach decisions rather than product-scope unknowns.

## Decision 1: How to remove questionnaire validation

- **Decision**: Relax `InquirySchema` in `app/routes/pages/booking/utils.ts` so every field is optional with a safe default (drop `.min(1, ...)` on `firstName`/`lastName` and `.email(...)` on `email`), then delete the `fieldErrors` state, its population from `parsed.error.issues`, and the associated `aria-invalid`/`aria-describedby`/`<p className="formError">` blocks in `Questionnaire.tsx`, since `parseInquiry(...).safeParse` can no longer fail in a way the visitor needs to correct.
- **Rationale**: The constitution's "No dead code" workflow rule and AC 1.1 ("strict form validation rules... are removed") both point the same direction — relaxing the schema alone would leave an error-rendering code path that can never execute. Removing it keeps the component honest about what it actually does.
- **Alternatives considered**: Keep the schema strict but stop calling `onSubmit` conditionally (i.e., always advance regardless of `parsed.success`). Rejected — this would silently discard invalid data instead of accepting it, and would leave misleading strict-looking validation code in `utils.ts` that no longer reflects the intended behavior.

## Decision 2: How "Schedule now" reaches the Calendar without an Inquiry

- **Decision**: Replace the single `inquiry: Inquiry | null` gate in `booking/index.tsx` with two independent pieces of state — keep `inquiry` (still set by `Questionnaire`'s `onSubmit`), and add a `showCalendar` boolean (or equivalent `stage` union) that "Schedule now" can set directly. Render `Calendar` when either `inquiry` is set or `showCalendar` is true; pass `inquiry` through as-is (now typed `Inquiry | null`). Widen `CalendarProps.inquiry` to `Inquiry | null` and make the Calendly `prefill` fall back to empty/undefined values when `inquiry` is `null`.
- **Rationale**: This preserves the existing same-page swap pattern (Questionnaire ↔ Calendar) from COT-018 instead of introducing routing/navigation, matches the Assumptions in `spec.md`, and keeps `Calendar` a single component that already knows how to render with partial `Inquiry` data (most fields were already optional) — it just needs to tolerate a fully-absent one.
- **Alternatives considered**: Fabricate an empty `Inquiry` object (all fields `''`/`undefined`) and pass it through the existing non-null `inquiry` prop unchanged. Rejected — it works but hides the "no questionnaire was ever submitted" case behind data that looks like a real (blank) submission, which is a less honest signal for anyone reading the component later and makes `Calendar`'s "was this a real submission" question implicit rather than typed.

## Decision 3: How the "Schedule now" click is wired without breaking the anchor

- **Decision**: Give `PathCardProps` an optional `onClick?: () => void`. In `PathCard.tsx`, keep the existing `<a href={ctaHref}>` markup (so it stays a real, keyboard-operable link with a visible `href`), but when `onClick` is provided, call `event.preventDefault()` and invoke it instead of following the href. `two-paths/index.tsx` gains an `onBookAgain: () => void` prop (documented in a new `TwoPaths.types.ts`) and passes it as `onClick` only to the "Book again" card entry; the "Get started" card is untouched and keeps its plain anchor-scroll behavior to the questionnaire.
- **Rationale**: Minimal, targeted change — only the one card that needs new behavior gets it. Keeping the `<a>` tag (rather than swapping to a `<button>`) preserves existing styling (`pathBtn`/`pathBtnSecondary` classes) and avoids an accessibility regression risk from swapping element semantics under time pressure.
- **Alternatives considered**: Convert both `PathCard` instances to `<button>` elements. Rejected as broader than needed — "Get started" has no reason to stop being a real anchor link to `#questionnaire`, and touching it would widen the diff without a corresponding requirement.

## Decision 4: Phone number auto-formatting implementation

- **Decision**: Add `formatPhoneNumber(value: string): string` to `utils.ts` — strip non-digits, cap at 10 digits, and progressively format as `(XXX`, `(XXX) XXX`, `(XXX) XXX-XXXX` depending on how many digits are present. Make the Phone `<input>` in `Questionnaire.tsx` controlled (`value` + `onChange`) using this formatter, replacing its current uncontrolled state.
- **Rationale**: A pure string-in/string-out function is trivial to reason about and keeps the formatting logic out of the JSX. Controlled `value`+`onChange` is the standard React pattern for "reformat what the user just typed" and correctly participates in the form's native `FormData` on submit, same as before.
- **Alternatives considered**: Format only on blur (uncontrolled input, transform on `onBlur`). Rejected — AC 3.1 explicitly requires the format to appear "dynamically" as the visitor types, not after they leave the field. A masking library (e.g., `react-number-format`) was also considered and rejected as an unnecessary new dependency for a single, simple 10-digit US pattern.
