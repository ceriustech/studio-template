import React from 'react';
import './testimonial.css';
import type { TestimonialProps } from './Testimonial.types';
import { useTestimonialCarousel } from './useTestimonialCarousel';

const Testimonial: React.FC<TestimonialProps> = ({ items }) => {
	const { activeIndex, next, previous } = useTestimonialCarousel(items.length);
	// Guards against an index left over from a longer list.
	const active = items[activeIndex] ?? items[0];
	const showNavigation = items.length > 1;

	return (
		<section className="testimonial">
			<div
				className="testimonialStars"
				aria-label={`${active.rating} out of 5 stars`}
			>
				{'★ '.repeat(active.rating).trim()}
			</div>
			<div className="testimonialQuoteMark" aria-hidden="true">
				"
			</div>

			<div aria-live="polite">
				<p className="testimonialText">{active.quote}</p>
				<p className="testimonialAttr">
					— {active.clientName}
					{active.clientLocation && `, ${active.clientLocation}`}
				</p>
			</div>

			{showNavigation && (
				<div className="testimonialNav">
					<button
						type="button"
						className="testimonialNavBtn"
						aria-label="Previous testimonial"
						onClick={previous}
					>
						←
					</button>
					<button
						type="button"
						className="testimonialNavBtn"
						aria-label="Next testimonial"
						onClick={next}
					>
						→
					</button>
				</div>
			)}
		</section>
	);
};

export default Testimonial;
