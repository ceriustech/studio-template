# Quickstart: verifying COT-033

Run from `curated-organization/`.

1. **Static checks**: `npm run typecheck` and `npm run build` pass. `build/client` contains no `gallery.fallback` copy or `GALLERY_QUERY` text (`grep -r "portfolioPiece" build/client` finds nothing).
2. **Published content**: `npm run dev`, open `/gallery`. Hero shows "Your Transformation / See the difference". Tab title is "Gallery | Curated Organization". With no published pieces, the backup pieces show with the Unsplash image.
3. **Published pieces**: publish a portfolio piece in Studio (title, category, location, ≥1 image, optionally before/after videos). Reload: only published pieces show; other categories are hidden on "All" and say "No projects in this category yet." when filtered. The lightbox opens the full-size image or the override.
4. **Outage**: set `SANITY_PROJECT_ID=` (or an invalid ID) and restart. The page renders the backup hero and all six categories; the server logs a `[sanity]` or `[gallery]` warning.
5. **Partial content**: clear the hero heading and publish (restore it afterwards). The hero falls back to its backup copy in full. A piece with no images and no videos doesn't appear.
6. **No refetch on filter**: with the network tab open, click filter pills and pagination; no `__data`/`.data` request for the gallery route fires.
