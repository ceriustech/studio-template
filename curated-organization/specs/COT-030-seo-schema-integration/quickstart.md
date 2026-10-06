# Quickstart: Validate COT-030

## Prerequisites

- `.env` in `curated-organization/` with `SANITY_PROJECT_ID=o2hxhkt0` (and `SANITY_DATASET=production`).
- `npm install` in both `curated-organization/` and `curated-organization/studio/`.

## 1. Static checks

```sh
# studio/
npx sanity schema validate
npx tsc --noEmit
npx sanity build

# app root
npm run typecheck
```

All four must pass.

## 2. Studio checks (`cd studio && npx sanity dev`)

| # | Steps | Expected |
|---|---|---|
| S1 | Open **Site settings → Default search & sharing** | Section description: "Used on any page that doesn't have its own." Fields: Page title, Page summary, Share image (+ Alt text). No Keywords. Each field shows the help text from [data-model.md](data-model.md). |
| S2 | Look above the fields | Google-style preview: title, `curatedorganization.com`, summary. With empty fields it shows the backup text. |
| S3 | Type a title | Preview updates as you type, with " \| Curated Organization" added, and shows a count like "42 / 60". |
| S4 | Fill **Brand & navigation → Business name** with "Curated Org" | Preview suffix changes to " \| Curated Org". Clear it and the suffix returns to "Curated Organization". |
| S5 | Type a title of 61+ characters, then a summary of 161+ | Yellow warnings on each. Publish is still enabled. |
| S6 | Clear title and summary, then try to publish | Publish is blocked; "Add a default page title." / "Add a default page summary." show on the fields. |
| S7 | Set title to "Curated Organization" | Preview title reads "Curated Organization" (no duplicate suffix). |
| S8 | Open **Home page → Search & sharing** with empty fields | Same three fields and preview. The preview shows the Site Settings default values. The document can be published with everything empty. |

## 3. Live-site checks (`npm run dev`, view page source)

Publish Site Settings with a title, summary, share image (with alt) and business name first.

| # | Steps | Expected |
|---|---|---|
| L1 | View source on `/`, `/services`, `/gallery`, `/booking` | Head matches [contracts/global-seo.md §5](contracts/global-seo.md). `og:url` matches each path. |
| L2 | Count charset and viewport tags | Exactly one `<meta charset>` and one viewport tag, with no `maximum-scale`. No `keywords` tag. |
| L3 | Remove the share image and republish | No `og:image*` or `twitter:card` tags. |
| L4 | Open `/does-not-exist` | Title "Page not found \| Curated Organization" and `robots: noindex`. No default description. |
| L5 | Stop with `SANITY_PROJECT_ID` unset | Title "Curated Organization", description "Professional organizing services". |
| L6 | Change the default summary in Studio and publish, then reload (allow for CDN delay) | New summary appears with no code change or deploy (SC-003). |

## 4. After deploy

- Paste a page URL into the Facebook Sharing Debugger and the LinkedIn Post Inspector. Both should show the default title, summary and image (SC-005).
