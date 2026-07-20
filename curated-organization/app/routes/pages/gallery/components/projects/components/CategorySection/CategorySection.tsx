import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import PortfolioPiece from '../PortfolioPiece/PortfolioPiece';
import type { CategorySectionProps } from './CategorySection.types';
import './categorySection.css';

const CategorySection = ({
	category,
	label,
	pieces,
	totalCount,
}: CategorySectionProps) => {
	const [index, setIndex] = useState(0);

	if (pieces.length === 0) return null;

	const activePiece = pieces[index];
	const hasMultiple = pieces.length > 1;
	const showViewAll = totalCount > 5;

	const headerControls = hasMultiple ? (
		<div className="sectionNav">
			<button
				type="button"
				className="sectionNavButton"
				aria-label="Previous project"
				disabled={index === 0}
				onClick={() => setIndex((current) => current - 1)}
			>
				<ChevronLeft aria-hidden="true" size={16} />
			</button>
			<span className="sectionIndicator">
				{index + 1} / {pieces.length}
			</span>
			<button
				type="button"
				className="sectionNavButton"
				aria-label="Next project"
				disabled={index === pieces.length - 1}
				onClick={() => setIndex((current) => current + 1)}
			>
				<ChevronRight aria-hidden="true" size={16} />
			</button>
		</div>
	) : undefined;

	const footer = showViewAll ? (
		<Link className="viewAllLink" to={`/gallery?category=${category}`}>
			View all {totalCount} {label} projects →
		</Link>
	) : undefined;

	return (
		<section className="categorySection">
			<PortfolioPiece
				key={activePiece.id}
				piece={activePiece}
				headerControls={headerControls}
				footer={footer}
			/>
		</section>
	);
};

export default CategorySection;
