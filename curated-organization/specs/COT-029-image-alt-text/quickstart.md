# Quickstart: Validate COT-029

See [data-model.md](data-model.md) for the full list of changes.

## Prerequisites

- `studio/` dependencies installed (`npm install` in `studio/`)
- Logged in to Sanity CLI (`npx sanity login`) for steps 1 and 5

## 1. Schema validates

```bash
cd studio
npx sanity schema validate
```

Expected: no errors.

## 2. Studio type-checks and builds

```bash
cd studio
npx tsc --noEmit
npm run build
```

Expected: both pass.

## 3. Studio behaviour (`npm run dev` in `studio/`)

| Check | Expected |
|-------|----------|
| Open each of the 8 locations in data-model.md and add an image | An "Alt text" field with guidance appears inside the image panel |
| Leave alt empty and try to publish | Publishing is blocked with a required error |
| Enter 126+ characters | Yellow warning, publishing allowed |
| Leave an optional image (logo, founder photo, social image) empty | Publishes fine |
| Open Site CTA background | No alt field |
| Gallery image list preview | Subtitle shows the alt text |

## 4. Site unchanged

```bash
npm run typecheck
npm run dev
```

Expected: typecheck passes. Nav logo, footer badges and the CTA render as before (SC-005).

## 5. Draft content check

```bash
cd studio
npx sanity documents query '*[_type in ["homePage", "servicesPage", "portfolioPiece"]]{_id}' --dataset production
```

These are the only document types that use the 3 objects whose `alt` moves. The CLI reads drafts too.

Expected: `[]`. If any documents come back, their old `alt` values will show as "unknown field" in the Studio. Re-enter them in the new field before publishing.
