import type { PageSeo } from '~/types/global';
import type { HeroProps } from './components/hero/Hero.types';

export type Category =
	| 'kitchen'
	| 'closet'
	| 'pantry'
	| 'office'
	| 'living-space'
	| 'garage';

export type VideoTag = 'before' | 'after';

export type VideoMedia = {
	src: string;
	poster: string;
	tag: VideoTag;
	alt: string;
};

export type ImageMedia = {
	src: string;
	alt: string;
	caption?: string;
	fullSrc?: string;
};

export type PortfolioPiece = {
	id: string;
	title: string;
	category: Category;
	location?: string;
	description?: string;
	// At most one before and one after video, before first (enforced by the loader).
	videos: readonly VideoMedia[];
	images: ImageMedia[];
};

export type GalleryContent = {
	hero: HeroProps;
	pieces: PortfolioPiece[];
	// {} when the page has no search & sharing values of its own, or the fetch failed.
	seo: PageSeo;
};
