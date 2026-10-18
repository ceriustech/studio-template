# Quickstart: verifying COT-035

Run these checks from `curated-organization/`.

1. **Static checks**:
   - `npm run typecheck` and `npm run build` pass, and `npm run build` in `studio/` passes.
   - `build/client` contains none of the backup copy or query text: `grep -r "bookingPage\|Tell us about your space" build/client` finds nothing.
2. **Release state** (no `bookingPage` published):
   - `npm run dev`, then open `/booking`. The page looks exactly as it does today: phone "(703) 555-0182", the hours line, all three "What to expect" steps.
   - The tab title is the site default.
   - "Schedule now" opens the `CALENDLY_URL` widget.
3. **Published content**:
   - Fill in every Booking page tab in the Studio and publish.
   - Reload, then go through the call, email-form and "Schedule now" paths. Each section shows the published copy.
   - Submit an empty form: the published messages appear.
   - The tab title reads "{SEO title} | Curated Organization".
4. **Calendly link**:
   - Publish a different Calendly link and reload: the widget loads it.
   - Enter `https://example.com`: the Studio blocks publishing.
   - Clear the field and publish: the widget loads the `CALENDLY_URL` link.
   - Also unset `CALENDLY_URL` and restart: the "can't load" message shows.
5. **Outage**:
   - Set `SANITY_PROJECT_ID=` (or an invalid ID) and restart.
   - Every section renders its backup copy, the widget uses `CALENDLY_URL`, and the server logs a `[sanity]` or `[booking]` warning.
6. **Partial content**:
   - Clear the Questionnaire's first-name label and a validation message, then publish: both use their backup wording.
   - Clear a placeholder: it disappears.
   - Clear the Call info heading: the whole section uses backup copy.
   - Clear every path card title: both backup cards show.
   - Restore the content afterwards.
7. **No refetch**: with the network tab open, switch between call, form and scheduling. No `.data` request fires.
