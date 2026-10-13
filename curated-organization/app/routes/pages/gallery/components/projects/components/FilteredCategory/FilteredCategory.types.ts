import type { Category, PortfolioPiece } from '../../../../gallery.types';

export type FilteredCategoryProps = {
	category: Category;
	page: number;
	/** Every piece in `category`, already filtered. */
	pieces: PortfolioPiece[];
};
