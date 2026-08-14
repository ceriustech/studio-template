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
	posterOffset: number;
	tag: VideoTag;
	duration: number;
	captionsSrc?: string;
	alt: string;
};

export type ImageMedia = {
	src: string;
	alt: string;
	caption: string;
	fullSrc?: string;
};

export type PortfolioPiece = {
	id: string;
	title: string;
	category: Category;
	location: string;
	description: string;
	videos: readonly [] | readonly [VideoMedia] | readonly [VideoMedia, VideoMedia];
	images: ImageMedia[];
};
