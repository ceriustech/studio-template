# Quickstart: verifying COT-036

Run these checks from `curated-organization/` unless a step says otherwise.

1. **Static checks**:
   - `npm run typecheck` and `npm run build` pass, and `npm run build` in `studio/` passes.
   - `grep -r "Working with Rina" build/client` finds nothing, which shows the backup copy stays on the server.
2. **Studio layout** (`npm run dev` in `studio/`):
   - The top level reads: Pages, divider, Portfolio pieces, divider, **Testimonials**, divider, Site settings, Site CTA.
   - Testimonials appears once and isn't inside Portfolio pieces.
   - Home page has no Testimonials tab.
   - Client name shows the "Name only…" help text.
3. **Migration** (in `studio/`, logged in):
   - Run `npx sanity migration run testimonials-to-documents`. The dry run lists 3 creates and 1 unset on `homePage`.
   - Run it again with `--no-dry-run`.
   - Testimonials now lists Client name, Sarah M. and James T., with no dashes or commas, and locations as subtitles.
   - Run it once more: nothing changes.
4. **Home page** (`npm run dev`):
   - The carousel shows the 3 quotes in the same order as before.
   - Each attribution reads "— Sarah M., McLean, VA", with a single dash and a single comma.
5. **New, edited and deleted testimonials**:
   - Publish a new testimonial without a location and reload. It's the first slide, and its attribution has no trailing comma.
   - Delete it and reload: it's gone.
   - Save a testimonial as a draft only: it doesn't appear on the site.
   - Try publishing with an empty quote: the Studio blocks it.
6. **Fallbacks**:
   - **Outage**: set `SANITY_PROJECT_ID=` (or an invalid ID) and restart. The carousel shows the 3 backup testimonials, every other section shows its backup, and the server logs a warning.
   - **Empty collection**: unpublish all testimonials. The carousel shows the backup testimonials. Republish them afterwards.
   - **Mixed**: publish one usable testimonial while the others are unpublished. Only that one shows, with no backup items mixed in and no arrows.
   - **Missing Home page** (optional, for example on a test dataset): with `homePage` unpublished, the page shows backup copy but the published testimonials.
7. **No other changes**: every other Home section and the Services, Gallery and Booking pages look the same as on `main`.
