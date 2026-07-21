import React from 'react';
import { Link } from 'react-router';
import type { ServiceCardProps } from './Services.types';

const ServiceCard: React.FC<ServiceCardProps> = ({
	title,
	description,
	imageUrl,
	altText,
}) => {
	return (
		<div className="serviceCard">
			<Link
				to="/services"
				className="serviceCardImgLink"
				aria-label={`View all services — ${title}`}
			>
				<div
					className="serviceCardImg"
					role={altText ? 'img' : undefined}
					aria-label={altText}
					style={{ backgroundImage: `url('${imageUrl}')` }}
				/>
			</Link>
			<div className="serviceCardBody">
				<h3 className="serviceCardTitle">{title}</h3>
				<p className="serviceCardDesc">{description}</p>
			</div>
		</div>
	);
};

export default ServiceCard;
