import React from 'react';
import './pricing.css';
import PricingCard from './components/PricingCard/PricingCard';
import type { PricingProps } from './Pricing.types';

const Pricing: React.FC<PricingProps> = ({ eyebrow, heading, note, cards }) => {
	return (
		<section className="pricing">
			<div className="pricingHeader">
				{eyebrow && <p className="sectionEyebrow">{eyebrow}</p>}
				<h2>{heading}</h2>
			</div>
			{note && <p className="pricingNote">{note}</p>}
			<div className="pricingGrid">
				{cards.map((card, index) => (
					<PricingCard key={index} {...card} />
				))}
			</div>
		</section>
	);
};

export default Pricing;
