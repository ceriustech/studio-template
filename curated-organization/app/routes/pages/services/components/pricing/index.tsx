import React from 'react';
import './pricing.css';
import PricingCard from './components/PricingCard/PricingCard';
import type { PricingCardProps } from './components/PricingCard/PricingCard.types';

const cards: PricingCardProps[] = [
	{
		eyebrow: 'Associate',
		title: 'Associate Organizer',
		price: '$75 / hour per additional organizer',
		description:
			'Specialist that focuses on independent space execution, high efficiency system implementation, inventory cataloging, labeling, and collaborative team organizing.',
		ctaLabel: 'Book consultation',
	},
	{
		eyebrow: 'Lead',
		title: 'Lead Organizer',
		price: '$100 / hour',
		description:
			'Strategist that focuses on deep space conceptualization, system architect, consolidation therapy approach (managing the emotional decluttering process) and overall project creative direction.',
		featured: true,
		ctaLabel: 'Book consultation',
	},
	{
		eyebrow: 'Fine print',
		title: 'Fees',
		features: [
			'Donation fee — $30 per trip',
			'Products billed separately from organizing time',
			'*Travel fees may apply',
		],
	},
];

const Pricing = () => {
	return (
		<section className="pricing">
			<div className="pricingHeader">
				<p className="sectionEyebrow">Investment</p>
				<h2>Transparent pricing</h2>
			</div>
			<p className="pricingNote">
				Every product and space is unique. Services are based on an hourly rate.
				Your custom quote is built during your free consultation.
			</p>
			<div className="pricingGrid">
				{cards.map((card) => (
					<PricingCard key={card.title} {...card} />
				))}
			</div>
		</section>
	);
};

export default Pricing;
