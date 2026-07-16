import React from 'react';
import { Link } from 'react-router';
import './serviceItem.css';
import type { ServiceItemProps } from './ServiceItem.types';

const ServiceItem: React.FC<ServiceItemProps> = ({
	eyebrow,
	heading,
	description,
	imageUrl,
	items,
	ctaLabel,
	reversed = false,
}) => {
	return (
		<section className={reversed ? 'serviceItem reversed' : 'serviceItem'}>
			<div
				className="serviceImg"
				style={{ backgroundImage: `url('${imageUrl}')` }}
			>
				<div className="serviceImgOverlay" />
			</div>
			<div className="serviceText">
				<p className="sectionEyebrow">{eyebrow}</p>
				<h2>{heading}</h2>
				<p>{description}</p>
				<ul className="serviceIncludes">
					{items.map((item) => (
						<li key={item}>
							<span className="serviceDash" />
							{item}
						</li>
					))}
				</ul>
				<Link to="/booking" className="serviceCta">
					{ctaLabel}
				</Link>
			</div>
		</section>
	);
};

export default ServiceItem;
