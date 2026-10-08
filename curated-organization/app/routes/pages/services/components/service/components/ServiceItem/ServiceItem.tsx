import React from 'react';
import { Link } from 'react-router';
import './serviceItem.css';
import type { ServiceItemProps } from './ServiceItem.types';

const ServiceItem: React.FC<ServiceItemProps> = ({
	eyebrow,
	heading,
	description,
	image,
	items,
	ctaLabel,
	reversed = false,
}) => {
	return (
		<section className={reversed ? 'serviceItem reversed' : 'serviceItem'}>
			<div
				className="serviceImg"
				role="img"
				aria-label={image.alt}
				style={{
					backgroundImage: `url('${image.src}')`,
					backgroundPosition: image.position,
				}}
			>
				<div className="serviceImgOverlay" />
			</div>
			<div className="serviceText">
				{eyebrow && <p className="sectionEyebrow">{eyebrow}</p>}
				<h2>{heading}</h2>
				{description && <p>{description}</p>}
				{items.length > 0 && (
					<ul className="serviceIncludes">
						{items.map((item, index) => (
							<li key={index}>
								<span className="serviceDash" />
								{item}
							</li>
						))}
					</ul>
				)}
				{ctaLabel && (
					<Link to="/booking" className="serviceCta">
						{ctaLabel}
					</Link>
				)}
			</div>
		</section>
	);
};

export default ServiceItem;
