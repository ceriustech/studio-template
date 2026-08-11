import React from 'react';
import './pricing.css';
import PricingCard from './components/PricingCard/PricingCard';
import type { PricingCardProps } from './components/PricingCard/PricingCard.types';

const cards: PricingCardProps[] = [
	{
		eyebrow: 'COACHING',
		title: 'Executive Functioning Coaching',
		price: '$150 / hour ($75 per 30-min session)',
		description:
			'Virtual 1-on-1 coaching designed to help you build routines, manage clutter, and follow through on everyday tasks. Includes a free 15-minute phone consultation to discuss your goals and choose the right session length for your needs.',
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
			'Donation Removal: $30 per trip for small donation drop-offs.',
			'Donation Pick-Up: We can assist with scheduling third-party pickup services (fees discussed ahead of time).',
			'Travel Fees: Live outside the DMV? Curated travels! Travel fees may apply.',
			'Products: Billed separately from organizing time.',
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
