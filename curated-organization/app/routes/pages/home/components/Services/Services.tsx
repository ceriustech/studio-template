import React from 'react';
import { Link } from 'react-router';
import ServiceCard from './ServiceCard';
import './services.css';
import type { ServicesProps } from './Services.types';

const Services: React.FC<ServicesProps> = ({ eyebrow, heading, link, cards }) => {
	return (
		<section className="services">
			<div className="servicesHeader">
				{eyebrow && <p className="sectionEyebrow">{eyebrow}</p>}
				<h2 className="sectionHeading">{heading}</h2>
			</div>

			<div className="servicesGrid">
				{cards.map((card) => (
					<ServiceCard key={card.title} {...card} />
				))}
			</div>

			{link && (
				<div className="servicesFooter">
					<Link to={link.url} className="textLink">
						{link.label} <span aria-hidden="true">→</span>
					</Link>
				</div>
			)}
		</section>
	);
};

export default Services;
