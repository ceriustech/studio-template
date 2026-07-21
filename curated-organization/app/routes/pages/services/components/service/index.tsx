import React from 'react';
import ServiceItem from './components/ServiceItem/ServiceItem';
import type { ServiceItemProps } from './components/ServiceItem/ServiceItem.types';

const services: Omit<ServiceItemProps, 'reversed'>[] = [
	{
		eyebrow: '01',
		heading: 'Home organizing',
		description:
			'Full-service organizing for any room in your home. We sort, declutter, design custom systems, and style your space so it works for how you actually live.',
		imageUrl:
			'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=1000&q=80&auto=format',
		items: [
			'Decluttering and sorting',
			'Custom organization systems',
			'Product sourcing and shopping',
			'Labeling and styling',
			'Donation coordination',
		],
		ctaLabel: 'Get started',
	},
	{
		eyebrow: '02',
		heading: 'Unpacking + move-in',
		description:
			"Turn your new house into a home from day one. We unpack, set up systems, and organize every room so you're settled — not just moved in.",
		imageUrl:
			'https://images.unsplash.com/photo-1758523671826-d7f8217ffac3?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
		items: [
			'Full unpacking service',
			'Room-by-room system setup',
			'Product sourcing and shopping',
			'Box breakdown and removal',
			'Labeling and styling',
		],
		ctaLabel: 'Get started',
	},
	{
		eyebrow: '03',
		heading: 'Business + office',
		description:
			'Want to reword the description to “Organized workspaces drive productivity. We design systems for home-based businesses that reflect your brand and keep operations running efficiently.',
		imageUrl:
			'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1000&q=80&auto=format',
		items: [
			'Office layout optimization',
			'Filing and document systems',
			'Supply organization',
			'Brand-aligned workspace design',
		],
		ctaLabel: 'Get started',
	},
	{
		eyebrow: '04',
		heading: 'Legacy Transitions',
		description:
			'We guide families through major life transitions with absolute discretion, care and ease. Whether navigating a sensitive downsize or honoring the estate of a loved one, we manage the entire process by transforming overwhelming logistics into a peaceful, respectful transition.',
		imageUrl:
			'https://plus.unsplash.com/premium_photo-1733324428864-3450ea2da8bf?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		items: [
			'Compassionate discretionary sorting',
			'Responsible consignment & Donation curation',
			'Seamless Heirloom Logistics — ensuring family pieces reach their next home safely',
			'Digital decluttering and legacy protection',
		],
		ctaLabel: 'Get started',
	},
	{
		eyebrow: '05',
		heading: 'Executive Functioning Coach',
		description:
			'Executive functioning skills are the mental processes that help us plan, organize, manage time, stay focused, and follow through on tasks in everyday life.',
		imageUrl:
			'https://plus.unsplash.com/premium_photo-1661754876215-247b4db12e83?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		items: [
			'30-60 minute virtual coaching sessions',
			'Personalized strategies',
			'Compassionate accountability to help you build and maintain sustainable habits',
		],
		ctaLabel: 'Get started',
	},
];

const Service = () => {
	return (
		<>
			{services.map((service, index) => (
				<ServiceItem
					key={service.heading}
					{...service}
					reversed={index % 2 === 1}
				/>
			))}
		</>
	);
};

export default Service;
