import { useSearchParams } from 'react-router';
import CategorySection from './components/CategorySection/CategorySection';
import FilteredCategory from './components/FilteredCategory/FilteredCategory';
import {
	CATEGORIES,
	getCategoryPieces,
	getSectionPieces,
	isValidCategory,
} from '../../utils';
import './projects.css';

const Projects = () => {
	const [searchParams] = useSearchParams();
	const categoryParam = searchParams.get('category');

	if (!isValidCategory(categoryParam)) {
		return (
			<section className="projects">
				{CATEGORIES.map((category) => (
					<CategorySection
						key={category.value}
						category={category.value}
						label={category.label}
						pieces={getSectionPieces(category.value)}
						totalCount={getCategoryPieces(category.value).length}
					/>
				))}
			</section>
		);
	}

	const pageParam = Number.parseInt(searchParams.get('page') ?? '1', 10);
	const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

	return (
		<section className="projects">
			<FilteredCategory category={categoryParam} page={page} />
		</section>
	);
};

export default Projects;
