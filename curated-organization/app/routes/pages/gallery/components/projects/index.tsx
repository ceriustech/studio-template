import { useSearchParams } from 'react-router';
import CategorySection from './components/CategorySection/CategorySection';
import FilteredCategory from './components/FilteredCategory/FilteredCategory';
import {
	CATEGORIES,
	getCategoryPieces,
	getSectionPieces,
	isValidCategory,
} from '../../utils';
import type { ProjectsProps } from './Projects.types';
import './projects.css';

const Projects = ({ pieces }: ProjectsProps) => {
	const [searchParams] = useSearchParams();
	const categoryParam = searchParams.get('category');

	if (!isValidCategory(categoryParam)) {
		return (
			<section className="projects">
				{CATEGORIES.map((category) => {
					const categoryPieces = getCategoryPieces(pieces, category.value);
					return (
						<CategorySection
							key={category.value}
							category={category.value}
							label={category.label}
							pieces={getSectionPieces(categoryPieces)}
							totalCount={categoryPieces.length}
						/>
					);
				})}
			</section>
		);
	}

	const pageParam = Number.parseInt(searchParams.get('page') ?? '1', 10);
	const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

	return (
		<section className="projects">
			<FilteredCategory
				category={categoryParam}
				page={page}
				pieces={getCategoryPieces(pieces, categoryParam)}
			/>
		</section>
	);
};

export default Projects;
