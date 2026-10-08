export interface Routes {
	id: string;
	path: string;
	name: string;
	component: string;
	layout?: string;
	metaData?: PageMetaData[];
}

const BASE_META = [
	{ httpEquiv: 'Content-type', content: 'text/html; charset=utf-8' },
	{
		name: 'viewport',
		content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0',
	},
];

const getSocialMeta = (
	title: string,
	description: string,
	path: string = '',
) => [
	{ title: `Curated Organization${title ? ` | ${title}` : ''}` },
	{ name: 'description', content: description },
	{ property: 'og:title', content: title || 'Curated Organization' },
	{ property: 'og:description', content: 'Professional organizing services' },
	{
		property: 'og:url',
		content: `https://curatedorganization.com${path ? `/${path}` : ''}`,
	},
];

const PAGE_ROUTES_DATA: Record<string, Routes> = {
	HOME: {
		id: 'home',
		path: '/',
		name: 'Home',
		component: 'routes/pages/home/index.tsx',
	},
	SERVICES: {
		id: 'services',
		path: '/services',
		name: 'Services',
		component: 'routes/pages/services/index.tsx',
	},
	GALLERY: {
		id: 'gallery',
		path: '/gallery',
		name: 'Gallery',
		component: 'routes/pages/gallery/index.tsx',
		metaData: [
			...BASE_META,
			...getSocialMeta(
				'Before & After Gallery | Curated Organization',
				'See real transformations from our professional organizing projects across Northern Virginia. Closets, kitchens, offices, and whole-home makeovers.',
				'gallery',
			),
			{
				name: 'keywords',
				content:
					'before and after organization, home organization transformation, closet makeover northern virginia, kitchen organization before after, professional organizer portfolio, organizing results NOVA DMV',
			},
		],
	},
	BOOKING: {
		id: 'booking',
		path: '/booking',
		name: 'Booking',
		component: 'routes/pages/booking/index.tsx',
		metaData: [
			...BASE_META,
			...getSocialMeta(
				'Book a Free Consultation | Curated Organization',
				"Schedule your complimentary 30-minute organizing consultation. Tell us about your space and goals, and we'll create a custom plan for your NOVA or DMV home.",
				'booking',
			),
			{
				name: 'keywords',
				content:
					'book professional organizer, free organizing consultation, schedule home organizer northern virginia, professional organizer consultation DMV, home organization quote NOVA',
			},
		],
	},
};

export { PAGE_ROUTES_DATA };
