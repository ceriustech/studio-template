# Quickstart: Validate Home page content from the content studio

## Prerequisites

- `.env` with `SANITY_PROJECT_ID` (and optionally `SANITY_DATASET`). See `.env.example`.
- `npm install` done in the repo root.
- Access to the Studio (`studio/`, `npm run dev`) for the partial-content checks.

## 1. Static checks

```sh
npm run typecheck      # react-router typegen + tsc, no errors
npm run build          # succeeds
grep -rl --include=*.js "homePage not found\|Functional Luxury\|servicesTeaser" build/client   # no output (FR-014a)
```

Backup copy and the query live only in `.server` modules, so no client chunk should contain them. Backup images are still emitted as assets, the same as root's fallback logos. Confirm one loads at its hashed URL in step 3.

## 2. Published content (US1)

`npm run dev`, then open `/`. Compare with the published document (research R1):

| Section | Expected |
|---|---|
| Hero | "THE SANCTUARY OF SIMPLICITY" / "CURATED" / body / "DISCOVER YOUR SPACE" → `/booking`. Three Sanity-hosted slides (`cdn.sanity.io`, AVIF/WebP) rotate every 10 s |
| Intro | "Our Approach" / "Functional Luxury" / "Learn more about us →" → `/services` |
| Services | Published heading and three cards with Sanity images, "View all services →" |
| Process | Four published steps with connectors between them |
| Before/after | **Backup**: today's heading, images, caption, link (section not set in CMS) |
| Testimonials | **Backup**: today's three testimonials (not set in CMS) |
| `<head>` | Site-default title, description and og tags (Home `seo` not set) |

Edit one hero field in Studio, publish, and reload `/`. The change shows within about a minute (CDN) with no deploy (SC-001).

## 3. Outages (US2, SC-002, SC-003)

Run each, then load `/`. Every section must render with backup copy, the hero and cards must show the bundled AVIFs, there must be no error page, and the server log must show the expected line.

| Simulation | Expected log |
|---|---|
| Remove `SANITY_PROJECT_ID` from `.env`, restart | `[sanity] Sanity is not configured …` |
| `SANITY_DATASET=does-not-exist`, restart | `[home] Sanity fetch failed …` |
| Disconnect network, reload | `[home] Sanity fetch failed …`. Page responds within about 2 s plus render time |

Nav, footer and CTA show their own backups in these runs (they fail for the same reason), but they're unaffected by Home-only failures (FR-014b).

## 4. Partial content (US3)

Use Studio, and restore each change afterwards (or use a non-production dataset).

| Change | Expected on `/` |
|---|---|
| Clear hero `eyebrow`, `body`, `linkLabel` | Hero shows only the published headline over the published slides. No small line, supporting line or button |
| Hero `heading` empty | Studio won't publish an empty heading (required), so check this anchor in code review. Expected: hero text shows backup copy and slides stay published |
| Remove all hero images | Bundled backup slides; text stays published |
| Set intro `linkHref` to `foo` | "Learn more about us →" points to `/services` |
| Add one testimonial (quote + name, no location) | Carousel shows only it, no nav buttons, attribution has no trailing comma |
| Fill only before/after `heading` | Published heading, both backup images, no caption, no link |

## 5. Search & sharing (US4)

| Home `seo` | Expected `<head>` on `/` |
|---|---|
| Empty (current) | Same tags as `/services` apart from `og:url` |
| Only summary set | Home description in `description` and `og:description`; title from default |
| Title "Home organizing in NOVA" | `<title>Home organizing in NOVA \| Curated Organization</title>` |
| Title "Curated Organization" | No duplicated suffix |

Confirm that `/services`, `/gallery` and `/booking` still show the site default (not Home's values).

## 6. Accessibility spot-check

- Screen reader or devtools accessibility tree: the active hero slide exposes its alt ("walk in closet"), service cards expose their alt, and the before/after hidden images have alt.
- Link arrows aren't announced (`aria-hidden`).
- Keyboard: all links reachable with visible focus, unchanged from today.
