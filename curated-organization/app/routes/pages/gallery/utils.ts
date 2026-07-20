import type { Category, PortfolioPiece } from './gallery.types';

const PIECES_PER_PAGE = 5;

export const CATEGORIES: { value: Category; label: string }[] = [
	{ value: 'kitchen', label: 'Kitchen' },
	{ value: 'closet', label: 'Closet' },
	{ value: 'pantry', label: 'Pantry' },
	{ value: 'office', label: 'Office' },
	{ value: 'living-space', label: 'Living space' },
	{ value: 'garage', label: 'Garage' },
];

const BEFORE_VIDEO =
	'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const AFTER_VIDEO =
	'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

export const PORTFOLIO_PIECES: PortfolioPiece[] = [
	{
		id: 'closet-1',
		title: 'Master closet transformation',
		category: 'closet',
		location: 'Arlington, VA',
		description:
			'Complete wardrobe reorganization with custom shelf dividers, coordinated hangers, and a seasonal rotation system. The client went from dreading their morning routine to looking forward to it.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1742453161018-73e39a241541?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
			alt: 'Master closet transformation — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1618236444721-4a8dba415c15?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
			alt: 'Master closet transformation — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=600&q=80&auto=format',
				alt: 'Custom shelf dividers in the master closet',
			},
			{
				src: 'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=600&q=80&auto=format',
				alt: 'Coordinated hangers and folded linens',
			},
			{
				src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
				alt: 'Seasonal rotation storage bins',
			},
			{
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=600&q=80&auto=format',
				alt: 'Custom shelf dividers in the master closet',
			},
			{
				src: 'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=600&q=80&auto=format',
				alt: 'Coordinated hangers and folded linens',
			},
			{
				src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
				alt: 'Seasonal rotation storage bins',
			},
		],
	},
	{
		id: 'closet-2',
		title: 'Reach-in closet refresh',
		category: 'closet',
		location: 'Vienna, VA',
		description:
			'A cramped reach-in closet reimagined with double-hang rods, slim velvet hangers, and labeled bins for accessories. Everything now has a visible, dedicated home.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=900&q=80&auto=format',
			alt: 'Reach-in closet refresh — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1618236444721-4a8dba415c15?w=900&q=80&auto=format',
			alt: 'Reach-in closet refresh — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=600&q=80&auto=format',
				alt: 'Double-hang rods in the reach-in closet',
			},
			{
				src: 'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=600&q=80&auto=format',
				alt: 'Labeled accessory bins',
			},
			{
				src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
				alt: 'Slim velvet hangers evenly spaced',
			},
		],
	},
	{
		id: 'closet-3',
		title: 'Kids closet system',
		category: 'closet',
		location: 'Fairfax, VA',
		description:
			'A growable closet system with adjustable-height rods and clearly labeled bins the kids can use themselves. Mornings are calmer and cleanup takes minutes.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1618236444721-4a8dba415c15?w=900&q=80&auto=format',
			alt: 'Kids closet system — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1742453161018-73e39a241541?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
			alt: 'Kids closet system — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=600&q=80&auto=format',
				alt: 'Adjustable-height closet rods',
			},
			{
				src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
				alt: 'Labeled bins within reach of a child',
			},
			{
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=600&q=80&auto=format',
				alt: 'Finished kids closet system',
			},
		],
	},
	{
		id: 'kitchen-1',
		title: 'Kitchen + pantry overhaul',
		category: 'kitchen',
		location: 'Alexandria, VA',
		description:
			'A family kitchen transformed with clear storage containers, labeled zones, and a pantry system designed around their weekly meal prep routine. Cooking went from stressful to streamlined.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format',
			alt: 'Kitchen + pantry overhaul — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=900&q=80&auto=format',
			alt: 'Kitchen + pantry overhaul — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=600&q=80&auto=format',
				alt: 'Clear storage containers on kitchen shelves',
			},
			{
				src: 'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=600&q=80&auto=format',
				alt: 'Labeled pantry zones',
			},
			{
				src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
				alt: 'Weekly meal prep staging area',
			},
			{
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=600&q=80&auto=format',
				alt: 'Clear storage containers on kitchen shelves',
			},
			{
				src: 'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=600&q=80&auto=format',
				alt: 'Labeled pantry zones',
			},
			{
				src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
				alt: 'Weekly meal prep staging area',
			},
		],
	},
	{
		id: 'kitchen-2',
		title: 'Galley kitchen reset',
		category: 'kitchen',
		location: 'Reston, VA',
		description:
			'Deep drawer organizers and a dedicated small-appliance zone freed up counter space in this narrow galley kitchen without any renovation.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=900&q=80&auto=format',
			alt: 'Galley kitchen reset — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format',
			alt: 'Galley kitchen reset — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=600&q=80&auto=format',
				alt: 'Deep drawer organizers',
			},
			{
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=600&q=80&auto=format',
				alt: 'Small-appliance storage zone',
			},
			{
				src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
				alt: 'Cleared galley kitchen counter space',
			},
		],
	},
	{
		id: 'kitchen-3',
		title: 'Open-concept kitchen edit',
		category: 'kitchen',
		location: 'McLean, VA',
		description:
			'An open-concept kitchen edited for a cleaner sightline into the living room, with a dedicated coffee station and hidden charging drawer.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format',
			alt: 'Open-concept kitchen edit — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=900&q=80&auto=format',
			alt: 'Open-concept kitchen edit — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=600&q=80&auto=format',
				alt: 'Coffee station on the kitchen counter',
			},
			{
				src: 'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=600&q=80&auto=format',
				alt: 'Hidden charging drawer',
			},
			{
				src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
				alt: 'Clear sightline from kitchen to living room',
			},
		],
	},
	{
		id: 'kitchen-4',
		title: 'Baking-focused pantry build',
		category: 'kitchen',
		location: 'Great Falls, VA',
		description:
			'A dedicated baking zone within the pantry, with labeled canisters and a pull-out cutting board station for a home baker who ran out of room.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=900&q=80&auto=format',
			alt: 'Baking-focused pantry build — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format',
			alt: 'Baking-focused pantry build — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=600&q=80&auto=format',
				alt: 'Labeled baking canisters',
			},
			{
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=600&q=80&auto=format',
				alt: 'Pull-out cutting board station',
			},
			{
				src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
				alt: 'Finished baking zone in the pantry',
			},
		],
	},
	{
		id: 'kitchen-5',
		title: 'Family command center kitchen',
		category: 'kitchen',
		location: 'Falls Church, VA',
		description:
			'A wall-mounted family command center — mail sorter, calendar, and charging station — installed alongside a full cabinet reorganization.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format',
			alt: 'Family command center kitchen — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=900&q=80&auto=format',
			alt: 'Family command center kitchen — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=600&q=80&auto=format',
				alt: 'Wall-mounted mail sorter and calendar',
			},
			{
				src: 'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=600&q=80&auto=format',
				alt: 'Family charging station',
			},
			{
				src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
				alt: 'Reorganized kitchen cabinets',
			},
		],
	},
	{
		id: 'kitchen-6',
		title: 'Small-space kitchen maximization',
		category: 'kitchen',
		location: 'Arlington, VA',
		description:
			'Vertical storage and a fold-down prep surface gave this small apartment kitchen room to breathe without losing an inch of floor space.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=900&q=80&auto=format',
			alt: 'Small-space kitchen maximization — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format',
			alt: 'Small-space kitchen maximization — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=600&q=80&auto=format',
				alt: 'Vertical storage shelving',
			},
			{
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=600&q=80&auto=format',
				alt: 'Fold-down prep surface',
			},
			{
				src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
				alt: 'Small apartment kitchen with clear floor space',
			},
		],
	},
	{
		id: 'pantry-1',
		title: 'Walk-in pantry relabel',
		category: 'pantry',
		location: 'Alexandria, VA',
		description:
			'Every shelf in this walk-in pantry was reset with matching canisters, a zone map, and legible labels the whole family follows.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=900&q=80&auto=format',
			alt: 'Walk-in pantry relabel — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=900&q=80&auto=format',
			alt: 'Walk-in pantry relabel — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=600&q=80&auto=format',
				alt: 'Matching pantry canisters',
			},
			{
				src: 'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=600&q=80&auto=format',
				alt: 'Pantry zone map',
			},
			{
				src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
				alt: 'Legible pantry shelf labels',
			},
		],
	},
	{
		id: 'pantry-2',
		title: 'Butler pantry buildout',
		category: 'pantry',
		location: 'McLean, VA',
		description:
			'A butler pantry fitted with open shelving for entertaining essentials, keeping serveware within arm’s reach of the dining room.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=900&q=80&auto=format',
			alt: 'Butler pantry buildout — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=900&q=80&auto=format',
			alt: 'Butler pantry buildout — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=600&q=80&auto=format',
				alt: 'Open shelving for entertaining essentials',
			},
			{
				src: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
				alt: 'Serveware staged near the dining room',
			},
			{
				src: 'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=600&q=80&auto=format',
				alt: 'Finished butler pantry buildout',
			},
		],
	},
	{
		id: 'office-1',
		title: 'Home office setup',
		category: 'office',
		location: 'McLean, VA',
		description:
			'A spare bedroom converted into a focused workspace with built-in file systems, cable management, and a minimalist desk setup. Remote work, finally organized.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1772157361267-bf6fe2100dd2?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
			alt: 'Home office setup — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80&auto=format',
			alt: 'Home office setup — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80&auto=format',
				alt: 'Built-in file systems in the home office',
			},
			{
				src: 'https://images.unsplash.com/photo-1591382696684-38c427c7547a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
				alt: 'Cable management under the desk',
			},
			{
				src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&auto=format',
				alt: 'Minimalist desk setup',
			},
		],
	},
	{
		id: 'living-space-1',
		title: 'Living room media reset',
		category: 'living-space',
		location: 'Arlington, VA',
		description:
			'A media console cleared of tangled cables and mismatched boxes, replaced with a labeled system for remotes, games, and cords.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=80&auto=format',
			alt: 'Living room media reset — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80&auto=format',
			alt: 'Living room media reset — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80&auto=format',
				alt: 'Labeled remote and cord storage',
			},
			{
				src: 'https://images.unsplash.com/photo-1591382696684-38c427c7547a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
				alt: 'Board games organized on the console shelf',
			},
			{
				src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&auto=format',
				alt: 'Cleared living room media console',
			},
		],
	},
	{
		id: 'living-space-2',
		title: 'Playroom-to-living room edit',
		category: 'living-space',
		location: 'Vienna, VA',
		description:
			'Toy bins that double as end tables let this shared living/play space reset in minutes at the end of the day.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=900&q=80&auto=format',
			alt: 'Playroom-to-living room edit — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=80&auto=format',
			alt: 'Playroom-to-living room edit — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1591382696684-38c427c7547a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
				alt: 'Toy storage that doubles as an end table',
			},
			{
				src: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80&auto=format',
				alt: 'Shared living and play space',
			},
			{
				src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&auto=format',
				alt: 'Reset living room at the end of the day',
			},
		],
	},
	{
		id: 'living-space-3',
		title: 'Built-in bookshelf edit',
		category: 'living-space',
		location: 'Fairfax, VA',
		description:
			'Floor-to-ceiling built-ins edited by color and category, turning a cluttered shelf wall into a considered display.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1591382696684-38c427c7547a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
			alt: 'Built-in bookshelf edit — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80&auto=format',
			alt: 'Built-in bookshelf edit — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&auto=format',
				alt: 'Bookshelf edited by color',
			},
			{
				src: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80&auto=format',
				alt: 'Built-ins organized by category',
			},
			{
				src: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80&auto=format',
				alt: 'Considered shelf-wall display',
			},
		],
	},
	{
		id: 'living-space-4',
		title: 'Entryway drop-zone build',
		category: 'living-space',
		location: 'Reston, VA',
		description:
			'A dedicated drop zone by the front door — hooks, a bench, and labeled cubbies — so shoes, bags, and mail stop migrating into the living room.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=900&q=80&auto=format',
			alt: 'Entryway drop-zone build — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1591382696684-38c427c7547a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
			alt: 'Entryway drop-zone build — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&auto=format',
				alt: 'Entryway hooks and bench',
			},
			{
				src: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80&auto=format',
				alt: 'Labeled entryway cubbies',
			},
			{
				src: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80&auto=format',
				alt: 'Clear living room after the entryway edit',
			},
		],
	},
	{
		id: 'garage-1',
		title: 'Two-car garage system',
		category: 'garage',
		location: 'Great Falls, VA',
		description:
			'Wall-mounted slat panels and labeled bins gave this two-car garage a place for tools, sports gear, and seasonal decor — and room to park both cars again.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1591382696684-38c427c7547a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
			alt: 'Two-car garage system — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=80&auto=format',
			alt: 'Two-car garage system — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80&auto=format',
				alt: 'Wall-mounted slat panels in the garage',
			},
			{
				src: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80&auto=format',
				alt: 'Labeled garage storage bins',
			},
			{
				src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&auto=format',
				alt: 'Both cars parked in the organized garage',
			},
		],
	},
	{
		id: 'garage-2',
		title: 'Workshop corner buildout',
		category: 'garage',
		location: 'Falls Church, VA',
		description:
			'A dedicated workshop corner with pegboard tool storage and a fold-out workbench, carved out of unused garage floor space.',
		beforeMedia: {
			src: BEFORE_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=900&q=80&auto=format',
			alt: 'Workshop corner buildout — before',
		},
		afterMedia: {
			src: AFTER_VIDEO,
			poster:
				'https://images.unsplash.com/photo-1591382696684-38c427c7547a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format',
			alt: 'Workshop corner buildout — after',
		},
		detailImages: [
			{
				src: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80&auto=format',
				alt: 'Pegboard tool storage',
			},
			{
				src: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80&auto=format',
				alt: 'Fold-out workbench',
			},
			{
				src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&auto=format',
				alt: 'Finished garage workshop corner',
			},
		],
	},
];

export const isValidCategory = (value: string | null): value is Category => {
	if (value === null) return false;
	return CATEGORIES.some((entry) => entry.value === value);
};

export const getCategoryLabel = (category: Category): string =>
	CATEGORIES.find((entry) => entry.value === category)?.label ?? category;

export const getCategoryPieces = (category: Category): PortfolioPiece[] =>
	PORTFOLIO_PIECES.filter((piece) => piece.category === category);

export const getSectionPieces = (category: Category): PortfolioPiece[] =>
	getCategoryPieces(category).slice(0, PIECES_PER_PAGE);

export const categoryHasMoreThanFive = (category: Category): boolean =>
	getCategoryPieces(category).length > PIECES_PER_PAGE;

export const getTotalPages = (category: Category): number =>
	Math.max(Math.ceil(getCategoryPieces(category).length / PIECES_PER_PAGE), 1);

export const paginate = (
	pieces: PortfolioPiece[],
	page: number,
): PortfolioPiece[] =>
	pieces.slice((page - 1) * PIECES_PER_PAGE, page * PIECES_PER_PAGE);

export const clampPage = (page: number, totalPages: number): number =>
	Math.min(Math.max(page, 1), Math.max(totalPages, 1));
