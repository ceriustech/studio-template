import { defineQuery } from 'groq';

export const GALLERY_QUERY = defineQuery(`{
	"page": *[_id == "galleryPage"][0]{
		hero{ eyebrow, heading, body },
		seo{ title, description, image{ asset, crop, hotspot, alt } }
	},
	"pieces": *[_type == "portfolioPiece"] | order(_createdAt desc){
		_id,
		title,
		category,
		location,
		description,
		videos[]{
			"src": video.asset->url,
			poster{ asset, crop, hotspot },
			posterOffset,
			tag,
			duration,
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
}`);
