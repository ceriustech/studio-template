import { Link } from 'react-router';
import PortfolioPiece from '../PortfolioPiece/PortfolioPiece';
import {
	clampPage,
	getCategoryPieces,
	getTotalPages,
	paginate,
} from '../../../../utils';
import type { FilteredCategoryProps } from './FilteredCategory.types';
import './filteredCategory.css';

const FilteredCategory = ({ category, page }: FilteredCategoryProps) => {
	const allPieces = getCategoryPieces(category);
	const totalPages = getTotalPages(category);
	const currentPage = clampPage(page, totalPages);
	const pieces = paginate(allPieces, currentPage);
	const showPagination = allPieces.length > 5;

	if (allPieces.length === 0) {
		return (
			<p className="filteredCategoryEmpty">No projects in this category yet.</p>
		);
	}

	return (
		<div className="filteredCategory">
			{pieces.map((piece) => (
				<PortfolioPiece key={piece.id} piece={piece} />
			))}
			{showPagination && (
				<div className="pagination">
					{currentPage > 1 ? (
						<Link
							className="paginationButton"
							to={`/gallery?category=${category}&page=${currentPage - 1}`}
						>
							Previous page
						</Link>
					) : (
						<span className="paginationButton paginationButtonDisabled">
							Previous page
						</span>
					)}
					<span className="paginationLabel">
						Page {currentPage} of {totalPages}
					</span>
					{currentPage < totalPages ? (
						<Link
							className="paginationButton"
							to={`/gallery?category=${category}&page=${currentPage + 1}`}
						>
							Next page
						</Link>
					) : (
						<span className="paginationButton paginationButtonDisabled">
							Next page
						</span>
					)}
				</div>
			)}
		</div>
	);
};

export default FilteredCategory;
