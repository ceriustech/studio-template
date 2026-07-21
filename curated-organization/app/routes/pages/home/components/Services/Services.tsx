import React from 'react';
import ServiceCard from './ServiceCard';
import './services.css';
import type { ServicesProps } from './Services.types';

const Services: React.FC<ServicesProps> = () => {
	const services = [
		{
			title: 'Home organizing',
			description:
				'Full-service sorting, decluttering, and custom systems for any room in your home.',
			imageUrl:
				'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=800&q=80&auto=format',
			altText: 'Organized closet with shelving and hanging clothes',
		},
		{
			title: 'Unpacking + move-in',
			description:
				'Turn your new house into a home from day one with complete unpacking and setup.',
			imageUrl:
				'https://plus.unsplash.com/premium_photo-1661286629847-22e62d832f3f?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0',
			altText: 'Couple unpacking boxes in a living room',
		},
		{
			title: 'Business + office',
			description:
				"Workspace organization that drives productivity and reflects your brand's standards.",
			imageUrl:
				'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80&auto=format',
			altText: 'Minimal office desk with computer and plant',
		},
	];

	return (
		<section className="services">
			<div className="servicesHeader">
				<p className="sectionEyebrow">Personalized services</p>
				<h2 className="sectionHeading">Tailored Flow, Elevated Living</h2>
			</div>

			<div className="servicesGrid">
				{services.map((s) => (
					<ServiceCard
						key={s.title}
						title={s.title}
						description={s.description}
						imageUrl={s.imageUrl}
						altText={s.altText}
					/>
				))}
			</div>

			<div className="servicesFooter">
				<a href="/services" className="textLink">
					View all services →
				</a>
			</div>
		</section>
	);
};

export default Services;
