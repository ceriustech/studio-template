# Quickstart: validating COT-028

These are manual checks that prove the spec's success criteria. There is no automated test suite in this repo; see plan.md.

## Prerequisites

1. Install dependencies with `npm install`. After this ticket, the app includes `@sanity/client`, `@sanity/image-url` and `groq`.
2. Copy `.env.example` to `.env`, and set `SANITY_PROJECT_ID=o2hxhkt0` and `SANITY_DATASET=production`.
3. In Studio (`cd studio && npm run dev`), publish **Site settings** and **Site CTA** with every field filled in:
   - at least 4 nav links
   - 2 footer logos
   - connect and social links with real `mailto:`, `tel:` and `https:` URLs
   - 3 hours lines
   - a CTA background image with a hotspot set away from the centre
4. Start the app with `npm run dev`.

## Scenario 1: Published content shows everywhere (User Story 1, SC-001)

1. Load `/`, `/services`, `/gallery` and `/booking`.
2. **Expect**:
   - The header shows the Studio brand name, tagline and logo.
   - The nav links appear in Studio order, with no Booking link in the header list; "Book now" shows the Studio label.
   - The footer shows every Studio value, and its "Navigate" column includes Booking.
   - Hours are plain text, not links.
   - No `href="#"` exists anywhere in the page source.
3. In Studio, reorder two nav links, change the tagline, and move the CTA hotspot. Publish.
4. Hard-reload the site within 5 minutes. **Expect** all three changes to appear, and the CTA background to shift its focal point.

## Scenario 2: No refetch on navigation (FR-003, SC-005)

1. Open the network tab, hard-load `/`, then click through to Services, then Gallery, then Home using the nav.
2. **Expect**:
   - No request to `*.apicdn.sanity.io` from the browser at any point, because all fetching is server-side.
   - The client-navigation data requests (`*.data`) do not include root data after the first load.

## Scenario 3: Sanity unreachable (User Story 2, SC-002–SC-004)

1. Set `SANITY_PROJECT_ID=invalid000` in `.env` and restart.
2. Load every page and a made-up URL such as `/nope`.
3. **Expect**:
   - Every page renders with today's brand, links, footer and CTA.
   - The fallback footer has no Connect or social columns.
   - No error page appears, except the intended 404 on `/nope`, which still shows the header and footer.
   - The server log contains a `[global]` fallback message.
   - Each page renders in under 3 seconds.

## Scenario 4: Configuration missing

1. Remove both `SANITY_` lines from `.env` and restart.
2. **Expect**:
   - The server starts.
   - A single "Sanity is not configured" log appears.
   - The result is otherwise the same as Scenario 3.

## Scenario 5: Empty dataset

1. Create an empty dataset once with `cd studio && npx sanity dataset create empty-test --visibility public`.
2. Set `SANITY_DATASET=empty-test` and restart.
3. **Expect** the same result as Scenario 3, with no error log. The query succeeds and returns `null` for both documents.
4. When you're done, delete the dataset with `npx sanity dataset delete empty-test`.

## Scenario 6: Partial content (FR-008)

1. Using the populated dataset, clear **Brand name** in Site settings and publish. Reload.
   - **Expect** the header brand to show `CURATED` and `Professional Organizing` with the local logo, while nav links, the footer and the CTA still show Studio content.
2. Restore the brand name, clear the **CTA heading**, and publish. Reload.
   - **Expect** the fallback CTA while everything else stays on Studio content.
3. Add a nav link with a blank URL.
   - **Expect** it to be skipped while the others render.

## Scenario 7: CTA and What to Expect (User Story 3)

1. On `/`, **expect** the CTA above the footer and no What to Expect.
2. On `/booking`, **expect** What to Expect and no CTA.
3. Navigate back and forth between the two pages. **Expect** the sections to swap each time.

## Scenario 8: Navigation regressions (User Story 4, SC-007)

1. **Current-page highlight**: on each page, the matching link has the `active` class and `aria-current="page"`.
2. **Mobile menu** (≤430px): open the menu, then pick a link. The menu closes. Tapping outside the menu closes it. Widening past 768px closes it.
3. **Keyboard**: tabbing reaches the brand, every link, the toggle and "Book now", each with a visible focus ring.

## Scenario 9: Build and bundle checks (SC-008)

```bash
npm run typecheck
npm run build
grep -rl "o2hxhkt0\|SANITY_PROJECT_ID\|createClient\|All rights reserved" build/client/ || echo "clean"
```

**Expect** both commands to pass and the grep to print `clean`.
