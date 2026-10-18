export interface Routes {
	id: string;
	path: string;
	name: string;
	component: string;
	layout?: string;
}

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
	},
	BOOKING: {
		id: 'booking',
		path: '/booking',
		name: 'Booking',
		component: 'routes/pages/booking/index.tsx',
	},
};

export { PAGE_ROUTES_DATA };
