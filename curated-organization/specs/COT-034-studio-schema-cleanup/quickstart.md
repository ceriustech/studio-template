# Quickstart: verifying COT-034

## Static checks

From `studio/`:

1. `npx tsc --noEmit` reports no errors.
2. `npx sanity schema validate` reports no errors.

From the repo root (`curated-organization/`):

3. `npm run typecheck` and `npm run build` pass.

## Studio checks

Run `npx sanity dev` in `studio/`, open the local Studio, and check the expected outcomes against [data-model.md](data-model.md):

| Open | Expected form fields |
|---|---|
| Services page → Hero | Eyebrow, Heading, Body only |
| Gallery page → Hero | Eyebrow, Heading, Body only |
| Booking page → Hero (create the document if it doesn't exist, then discard it) | Eyebrow, Heading, Body only |
| Home page → Hero | Eyebrow, Heading, Body, Slide images (3 existing), Link/button label ("Discover Your Space"), Link/button destination |
| Home page → Intro | Eyebrow, Heading, Body, Link/button label ("Learn more about us"), Link/button destination; **no** Slide images |
| Home page → Hero, clear the link label (don't publish) | Destination field hides, as before |
| Portfolio piece → Create new | No Slug field. Publishing works with title, category, location and one image (discard afterwards) |
| Portfolio piece → add a before/after video | Video file, Poster image, Before/after, Alt/description text; **no** Duration, Poster focal offset or Captions |
| Portfolio piece → add an image | Image (with Alt text), Caption; **no** Full-resolution override |

Also check that the hero help text no longer mentions leaving images or the CTA empty.

## No content changes

Run the COT-033 public CDN query (see [research.md](research.md) R1) before and after. The results are identical, since no document is touched.

## Live site

Run `npm run dev` from the repo root. Home, Services, Gallery and Booking render exactly as before, except:

- On `/gallery` (backup projects today), each video panel shows its length shortly after load: Before **0:09** and After **0:11** for the backup videos. In the network tab, each video request is a partial or range request, not a full download.
- Opening a photo in the viewer still shows it large.
- If a video fails to load (for example, block `/gallery/videos/before.mp4` in devtools), its panel shows no length and still opens.

## Known edge

If an unpublished draft hides an image without alt text inside a now-hidden field, publishing that draft shows a validation error. R1 found none in published content. The fix is to temporarily add that page to the allow-list so the field shows, then clear it, or to unset the value via the API.

## Release

Deploy the Studio with `npx sanity deploy` from `studio/` after merge.
