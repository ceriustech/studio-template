import { defineQuery } from 'groq';

export const HOME_QUERY = defineQuery(`{
	"page": *[_id == "homePage"][0]{
		hero{ eyebrow, heading, body, linkLabel, linkHref, images[]{ asset, crop, hotspot, alt } },
		intro{ eyebrow, heading, body, linkLabel, linkHref },
		servicesTeaser{
			eyebrow,
			heading,
			linkLabel,
			linkHref,
			cards[]{ title, description, image{ asset, crop, hotspot, alt } }
		},
		process{ eyebrow, heading, steps[]{ number, title, description } },
		beforeAfter{
			eyebrow,
			heading,
			caption,
			linkLabel,
			linkHref,
			beforeImage{ image{ asset, crop, hotspot, alt } },
			afterImage{ image{ asset, crop, hotspot, alt } }
		},
		seo{ title, description, image{ asset, crop, hotspot, alt } }
	},
	"testimonials": *[_type == "testimonial"] | order(_createdAt desc, _id asc){ quote, clientName, clientLocation },
	"businessName": *[_id == "siteSettings"][0].businessName
}`);
