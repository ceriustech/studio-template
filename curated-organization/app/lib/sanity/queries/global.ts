import { defineQuery } from 'groq';

export const GLOBAL_QUERY = defineQuery(`{
	"settings": *[_id == "siteSettings"][0]{
		brandName,
		brandTagline,
		logo{ asset, crop, hotspot, "dimensions": asset->metadata.dimensions },
		bookNowLabel,
		navLinks[]{ label, url },
		footerBrandDescription,
		footerLogos[]{ label, image{ asset, crop, hotspot, alt, "dimensions": asset->metadata.dimensions } },
		footerNavLinks[]{ label, url },
		connectLinks[]{ label, url },
		footerHours[]{ label, value },
		copyrightText,
		businessName,
		defaultSeo{ title, description, image{ asset, crop, hotspot, alt } }
	},
	"cta": *[_id == "siteCta"][0]{
		backgroundImage{ asset, crop, hotspot, "dimensions": asset->metadata.dimensions },
		heading,
		subheading,
		buttonLabel,
		buttonLink
	}
}`);
