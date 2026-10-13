import type { Category, PortfolioPiece } from './gallery.types';

const PIECES_PER_PAGE = 5;

export const CATEGORIES: { value: Category; label: string }[] = [
	{ value: 'kitchen', label: 'Kitchen' },
	{ value: 'closet', label: 'Closet' },
	{ value: 'pantry', label: 'Pantry' },
	{ value: 'office', label: 'Office' },
	{ value: 'living-space', label: 'Living space' },
	{ value: 'garage', label: 'Garage' },
];

export const isValidCategory = (value: string | null | undefined): value is Category =>
	CATEGORIES.some((entry) => entry.value === value);

export const getCategoryLabel = (category: Category): string =>
	CATEGORIES.find((entry) => entry.value === category)?.label ?? category;

export const getCategoryPieces = (
	pieces: PortfolioPiece[],
	category: Category,
): PortfolioPiece[] => pieces.filter((piece) => piece.category === category);

export const getSectionPieces = (pieces: PortfolioPiece[]): PortfolioPiece[] =>
	pieces.slice(0, PIECES_PER_PAGE);

export const getTotalPages = (pieceCount: number): number =>
	Math.max(Math.ceil(pieceCount / PIECES_PER_PAGE), 1);

export const paginate = (
	pieces: PortfolioPiece[],
	page: number,
): PortfolioPiece[] =>
	pieces.slice((page - 1) * PIECES_PER_PAGE, page * PIECES_PER_PAGE);

export const clampPage = (page: number, totalPages: number): number =>
	Math.min(Math.max(page, 1), Math.max(totalPages, 1));
