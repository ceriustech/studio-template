import { defineQuery } from 'groq';

export const SERVICES_QUERY = defineQuery(`{
	"page": *[_id == "servicesPage"][0]{
		hero{ eyebrow, heading, body },
		about{
			eyebrow,
			heading,
			bio,
			signature,
			photo{ asset, crop, hotspot, alt, "dimensions": asset->metadata.dimensions }
		},
		services[]{ eyebrow, heading, description, items, ctaLabel, image{ asset, crop, hotspot, alt } },
		pricing{
			eyebrow,
			heading,
			note,
			tiers[]{ eyebrow, title, price, description, features, featured, ctaLabel }
		},
		seo{ title, description, image{ asset, crop, hotspot, alt } }
	},
	"badges": *[_id == "siteSettings"][0].credentialBadges[]{
		label,
		image{ asset, crop, hotspot, alt, "dimensions": asset->metadata.dimensions }
	},
	"businessName": *[_id == "siteSettings"][0].businessName
}`);
