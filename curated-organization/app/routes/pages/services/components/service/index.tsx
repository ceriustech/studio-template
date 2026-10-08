import React from 'react';
import ServiceItem from './components/ServiceItem/ServiceItem';
import type { ServiceProps } from './Service.types';

const Service: React.FC<ServiceProps> = ({ items }) => {
	return (
		<>
			{items.map((item, index) => (
				<ServiceItem key={index} {...item} reversed={index % 2 === 1} />
			))}
		</>
	);
};

export default Service;
