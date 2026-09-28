import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { getSanityClient } from './client.server';

export function urlFor(source: SanityImageSource) {
	const client = getSanityClient();
	if (!client) throw new Error('urlFor called without a configured Sanity client');
	const { projectId, dataset } = client.config();
	return createImageUrlBuilder({ projectId: projectId ?? '', dataset: dataset ?? '' }).image(source);
}
