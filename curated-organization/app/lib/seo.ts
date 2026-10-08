import type { MetaDescriptor } from 'react-router';
import { SITE_URL } from '~/constants';
import type { PageSeo, SeoContent } from '~/types/global';

// Field-by-field: a page's own value wins, anything it leaves empty uses the site default.
export function mergeSeo(defaults: SeoContent, page: PageSeo = {}): SeoContent {
	return {
		title: page.title ?? defaults.title,
		description: page.description ?? defaults.description,
		...((page.image ?? defaults.image) && { image: page.image ?? defaults.image }),
	};
}

// Charset and viewport are rendered once by Layout in root.tsx, so they aren't emitted here.
export function buildMeta(seo: SeoContent, pathname: string): MetaDescriptor[] {
	const { title, description, image } = seo;

	return [
		{ title },
		{ name: 'description', content: description },
		{ property: 'og:type', content: 'website' },
		{ property: 'og:url', content: `${SITE_URL}${pathname === '/' ? '' : pathname}` },
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: description },
		...(image
			? [
					{ property: 'og:image', content: image.src },
					{ property: 'og:image:width', content: String(image.width) },
					{ property: 'og:image:height', content: String(image.height) },
					...(image.alt ? [{ property: 'og:image:alt', content: image.alt }] : []),
					{ name: 'twitter:card', content: 'summary_large_image' },
				]
			: []),
	];
}
