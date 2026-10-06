import type { MetaDescriptor } from 'react-router';
import { SITE_URL } from '~/constants';
import type { SeoContent } from '~/types/global';

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
