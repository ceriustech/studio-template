import { useState } from 'react';

export const useTestimonialCarousel = (count: number) => {
	const [activeIndex, setActiveIndex] = useState(0);

	const next = () => setActiveIndex((index) => (index + 1) % count);
	const previous = () => setActiveIndex((index) => (index - 1 + count) % count);

	console.log('useTestimonialCarousel activeIndex:', activeIndex);

	return { activeIndex, next, previous };
};
