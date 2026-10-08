import ceoImage from '~/assets/ceo_img_3.png';
import napoCircularLogo from '~/assets/napo-circular-logo.png';
import napoTitleLogo from '~/assets/napo-title-logo.png';
import type { ServicesContent } from './services.types';

// Backup Services page content: used when the CMS is unreachable or a section's anchor is missing.
// Service images stay on today's URLs so an outage looks exactly like the page before COT-032.
export const FALLBACK_SERVICES_CONTENT: ServicesContent = {
	hero: {
		eyebrow: 'Our services',
		heading: 'Tailored Flow, Elevated Living',
		body: 'Our all-inclusive organizing services are tailored to your lifestyle, your space, and your goals. Every project begins with listening.',
	},
	about: {
		eyebrow: 'About Curated',
		heading: 'Where order meets elegance',
		bio: 'Based in the DMV, Curated offers dedicated, highly personalized professional organizing. Grounded in 15 years of ER nursing precision and a degree in psychology, we view clutter as neurological friction that drains your daily energy. Whether you prefer a seamless, hands-off transformation or direct collaboration, we turn chaotic home and office environments into tailored, relapse-proof sanctuaries—delivering the ultimate feeling of relief and clarity that comes with true Consolidation Therapy.',
		signature: '— Rina, Founder and Lead Curator',
		photo: { src: ceoImage, alt: 'Rina, Founder and Lead Curator', width: 640, height: 640 },
		badges: [
			{
				label: 'CPO Certified',
				image: {
					src: napoCircularLogo,
					alt: 'The Board of Certification for Professional Organizers',
					width: 40,
					height: 40,
				},
			},
			{
				label: 'NAPO Member',
				image: {
					src: napoTitleLogo,
					alt: 'NAPO — National Association of Productivity and Organizing Professionals member',
					width: 80,
					height: 50,
				},
			},
		],
	},
	services: [
		{
			eyebrow: '01',
			heading: 'Home organizing',
			description:
				'Full-service organizing for any room in your home. We sort, declutter, design custom systems, and style your space so it works for how you actually live.',
			image: {
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=1000&q=80&auto=format',
				alt: 'Home organizing',
				position: '50% 50%',
			},
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
			image: {
				src: 'https://images.unsplash.com/photo-1758523671826-d7f8217ffac3?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
				alt: 'Unpacking + move-in',
				position: '50% 50%',
			},
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
				'An organized environment fuels focus and momentum. We design custom organizational systems for home offices and commercial spaces that reflect your brand identity and keep operations running effortlessly.',
			image: {
				src: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1000&q=80&auto=format',
				alt: 'Business + office',
				position: '50% 50%',
			},
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
			image: {
				src: 'https://plus.unsplash.com/premium_photo-1733324428864-3450ea2da8bf?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
				alt: 'Legacy Transitions',
				position: '50% 50%',
			},
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
			image: {
				src: 'https://plus.unsplash.com/premium_photo-1661754876215-247b4db12e83?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
				alt: 'Executive Functioning Coach',
				position: '50% 50%',
			},
			items: [
				'30-60 minute virtual coaching sessions',
				'Personalized strategies',
				'Compassionate accountability to help you build and maintain sustainable habits',
			],
			ctaLabel: 'Get started',
		},
	],
	pricing: {
		eyebrow: 'Investment',
		heading: 'Transparent pricing',
		note: 'Every product and space is unique. Services are based on an hourly rate. Your custom quote is built during your free consultation.',
		cards: [
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
		],
	},
	seo: {},
};
