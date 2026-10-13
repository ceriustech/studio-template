# Contract: `GALLERY_QUERY`

Defined in `app/routes/pages/gallery/gallery.query.ts`, fetched by `gallery.loader.server.ts` only.

```groq
{
	"page": *[_id == "galleryPage"][0]{
		hero{ eyebrow, heading, body },
		seo{ title, description, image{ asset, crop, hotspot, alt } }
	},
	"pieces": *[_type == "portfolioPiece"] | order(_createdAt desc){
		_id, title, category, location, description,
		videos[]{
			"src": video.asset->url,
			poster{ asset, crop, hotspot },
			posterOffset, tag, duration,
			"captionsSrc": captions.asset->url,
			alt
		},
		images[]{
			image{ asset, crop, hotspot, alt },
			caption,
			fullImage{ asset, crop, hotspot }
		}
	},
	"businessName": *[_id == "siteSettings"][0].businessName
}
```

Result shape: `{ page: CmsGalleryPage | null; pieces: CmsPortfolioPiece[] | null; businessName: string | null }`. Any field may be `null`. The client uses the published perspective, so drafts are excluded.
