import type { Category, PortfolioPiece } from '../../../../gallery.types';

export type CategorySectionProps = {
	category: Category;
	label: string;
	pieces: PortfolioPiece[];
	totalCount: number;
};
