import { useSearchParams } from 'react-router';
import { CATEGORIES } from '../../utils';
import './filterBar.css';

const FilterBar = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const activeCategory = searchParams.get('category');

	const handleSelect = (value: string | null) => {
		if (value === null) {
			setSearchParams({});
			return;
		}
		setSearchParams({ category: value });
	};

	return (
		<div className="filterBar">
			<button
				type="button"
				className={
					activeCategory === null ? 'filterPill active' : 'filterPill'
				}
				onClick={() => handleSelect(null)}
			>
				All
			</button>
			{CATEGORIES.map((category) => (
				<button
					key={category.value}
					type="button"
					className={
						activeCategory === category.value
							? 'filterPill active'
							: 'filterPill'
					}
					onClick={() => handleSelect(category.value)}
				>
					{category.label}
				</button>
			))}
		</div>
	);
};

export default FilterBar;
