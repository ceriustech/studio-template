import React from 'react';
import './testimonial.css';
import type { TestimonialItem, TestimonialProps } from './Testimonial.types';
import { useTestimonialCarousel } from './useTestimonialCarousel';

const testimonials: TestimonialItem[] = [
	{
		quote:
			'Client testimonial will go here. One or two sentences about the transformation experience and how it changed their daily life.',
		clientName: 'Client name',
		clientLocation: 'Arlington, VA',
		rating: 5,
	},
	{
		quote:
			'Working with Rina completely transformed our kitchen. Everything has a home now, and mornings are so much calmer.',
		clientName: 'Sarah M.',
		clientLocation: 'McLean, VA',
		rating: 5,
	},
	{
		quote:
			'From the first consultation to the final label, the process was seamless. Our home office finally works for us.',
		clientName: 'James T.',
		clientLocation: 'Washington, DC',
		rating: 5,
	},
];

const Testimonial: React.FC<TestimonialProps> = () => {
	const { activeIndex, next, previous } = useTestimonialCarousel(
		testimonials.length,
	);
	const active = testimonials[activeIndex];
	const showNavigation = testimonials.length > 1;

	console.log('Testimonial rendering');

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
					— {active.clientName}, {active.clientLocation}
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
