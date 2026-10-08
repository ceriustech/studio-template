# Quickstart: Validate Services page content from the content studio

## Prerequisites

- `.env` with `SANITY_PROJECT_ID` (and optionally `SANITY_DATASET`). See `.env.example`.
- `npm install` done in the repo root.
- Access to the Studio (`studio/`, `npm run dev`) for the partial-content checks.

## 1. Static checks

```sh
npm run typecheck      # react-router typegen + tsc, no errors
npm run build          # succeeds
grep -rl --include=*.js "servicesPage not found\|Legacy Transitions\|Transparent pricing" build/client   # no output (FR-014a)
```

Backup copy and the query live only in `.server` modules, so no client chunk should contain them.

## 2. Published content (US1)

`npm run dev`, then open `/services`. Compare with the published document (research R1):

| Section | Expected |
|---|---|
| Hero | "Our services" / "Tailored Flow, Elevated Living" / body |
| About | Sanity-hosted founder photo (`cdn.sanity.io`), "About Curated" / "Where order meets elegance", bio, signature. Same on mobile and desktop |
| Badges | Two Sanity-hosted logos at the same height, labelled with the published wording, NAPO first |
| Services | Five blocks 01–05, alternating sides, Sanity images, published bullets, "Get started" → `/booking` |
| Pricing | "Investment" / "Transparent pricing", note, three cards. **No card highlighted** (studio `featured: false`). Lead Organizer CTA reads "Book Consultation" with no trailing space |
| `<head>` | `<title>Services \| {businessName}</title>`, published description, 1200×630 JPG `og:image` |

Edit one service bullet in Studio, publish, and reload. The change shows within about a minute with no deploy (SC-001). Tick "Featured" on Lead Organizer and confirm the highlight returns.

## 3. Outages (US2, SC-002–SC-004)

Run each, then load `/services`. Every section must render with backup copy and show no error page, and the server log must show the expected line. Compare against `main` side by side: the page must look identical (SC-004), including the Unsplash service images, "CPO Certified" / "NAPO Member" badges and the highlighted Lead Organizer card.

| Simulation | Expected log |
|---|---|
| Remove `SANITY_PROJECT_ID` from `.env`, restart | `[sanity] Sanity is not configured …` |
| `SANITY_DATASET=does-not-exist`, restart | `[services] Sanity fetch failed …` |
| Disconnect network, reload | `[services] Sanity fetch failed …`. Page responds within about 2 s plus render time |

## 4. Partial content (US3)

Every section is published, so use temporary Studio edits (restore each afterwards) or a non-production dataset.

| Change | Expected on `/services` |
|---|---|
| Clear hero `eyebrow` and `body` | Only the published headline |
| Clear about `bio` | About text uses backup copy in full; the published photo and badges stay |
| Remove the founder photo | Backup photo; published About text stays |
| Remove one service's image | That service is dropped; the others keep their numbers (e.g. 01, 02, 04, 05) and keep alternating |
| Clear all bullets on one service | That block shows no bullet list |
| Clear `ctaLabel` on one service | No button on that block |
| Remove all pricing tiers | Backup cards (Lead Organizer highlighted); published heading and note stay |
| Clear pricing `note` | No note; cards unaffected |
| Remove all credential badges in Site Settings | Backup badges and labels |

Required fields (`hero.heading`, service `heading`/`image`, tier `title`) can't be published empty from the Studio. Check those anchors in code review.

## 5. Search & sharing (US4)

| Services `seo` | Expected `<head>` on `/services` |
|---|---|
| Fully set (current) | Services title, summary and image |
| Clear the summary | `description` and `og:description` from the site default; title and image stay Services' |
| Title "Curated Organization services" | No duplicated suffix |

Confirm `/` keeps Home's values, and `/gallery` and `/booking` show the site default.

## 6. Accessibility spot-check

- Accessibility tree: each service image exposes its alt ("home organizing" etc.), the founder photo exposes "founder photo", and badges expose their alt.
- Keyboard: all buttons are reachable with visible focus, unchanged from today.
