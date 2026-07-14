import React from 'react';
import type { ServiceCardProps } from './Services.types';

const ServiceCard: React.FC<ServiceCardProps> = ({
	title,
	description,
	imageUrl,
	altText,
}) => {
	return (
		<div className="serviceCard">
			<div
				className="serviceCardImg"
				role={altText ? 'img' : undefined}
				aria-label={altText}
				style={{ backgroundImage: `url('${imageUrl}')` }}
			/>
			<div className="serviceCardBody">
				<h3 className="serviceCardTitle">{title}</h3>
				<p className="serviceCardDesc">{description}</p>
			</div>
		</div>
	);
};

export default ServiceCard;
