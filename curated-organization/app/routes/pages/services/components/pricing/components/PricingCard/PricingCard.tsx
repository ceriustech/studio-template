import React from 'react';
import { Link } from 'react-router';
import './pricingCard.css';
import type { PricingCardProps } from './PricingCard.types';

const PricingCard: React.FC<PricingCardProps> = ({
	eyebrow,
	title,
	price,
	description,
	features,
	featured = false,
	ctaLabel,
}) => {
	return (
		<div className={featured ? 'pricingCard featured' : 'pricingCard'}>
			<div className="pricingCardEyebrow">{eyebrow}</div>
			<h3 className="pricingCardName">{title}</h3>
			{price && <div className="pricingCardPrice">{price}</div>}
			<div className="pricingCardDivider" />
			{description && <p className="pricingCardDescription">{description}</p>}
			{features && (
				<ul className="pricingCardFeatures">
					{features.map((feature) => (
						<li key={feature}>
							<span className="pricingCheck">✓</span>
							{feature}
						</li>
					))}
				</ul>
			)}
			{ctaLabel && (
				<Link to="/booking" className="pricingCardCta">
					{ctaLabel}
				</Link>
			)}
		</div>
	);
};

export default PricingCard;
