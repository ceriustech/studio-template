import curatedLogo from '~/assets/curated-logo.png';
import napoCircularLogo from '~/assets/napo-circular-logo.png';
import napoTitleLogo from '~/assets/napo-title-logo.png';
import type { GlobalContent } from '~/types/global';

export const FALLBACK_GLOBAL_CONTENT: GlobalContent = {
	brand: {
		name: 'CURATED',
		tagline: 'Professional Organizing',
		logo: { src: curatedLogo, alt: '', width: 40, height: 40 },
	},
	navLinks: [
		{ label: 'Home', url: '/' },
		{ label: 'Services', url: '/services' },
		{ label: 'Gallery', url: '/gallery' },
		{ label: 'Booking', url: '/booking' },
	],
	bookNowLabel: 'Book now',
	footer: {
		description:
			'Your home curated to your lifestyle - because time is your biggest luxury.\nBased in the NOVA / DMV area.',
		logos: [
			{
				src: napoCircularLogo,
				alt: 'The Board of Certification for Professional Organizers',
				width: 32,
				height: 32,
			},
			{
				src: napoTitleLogo,
				alt: 'NAPO — National Association of Productivity and Organizing Professionals member',
				width: 64,
				height: 32,
			},
		],
		// Today's connect/social links are "#" placeholders, so the fallback omits them.
		connectLinks: [],
		socialLinks: [],
		hours: [
			{ label: 'Mon – Fri', value: '9am – 5pm' },
			{ label: 'Sat', value: 'By appointment' },
			{ label: 'Sun', value: 'Closed' },
		],
		copyright: '© 2026 Curated Organization. All rights reserved.',
	},
	cta: {
		background: {
			src: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1800&q=80&auto=format',
			position: '50% 50%',
		},
		heading: 'Ready to transform your space?',
		subheading: 'Your complimentary 30-minute consultation starts here',
		buttonLabel: 'Book a consultation',
		buttonHref: '/booking',
	},
};
