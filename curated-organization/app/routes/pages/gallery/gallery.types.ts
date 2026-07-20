export type Category =
	| 'kitchen'
	| 'closet'
	| 'pantry'
	| 'office'
	| 'living-space'
	| 'garage';

export type MediaSource = {
	src: string;
	poster: string;
	alt: string;
};

export type DetailImage = {
	src: string;
	alt: string;
};

export type PortfolioPiece = {
	id: string;
	title: string;
	category: Category;
	location: string;
	description: string;
	beforeMedia: MediaSource;
	afterMedia: MediaSource;
	detailImages: DetailImage[];
};
