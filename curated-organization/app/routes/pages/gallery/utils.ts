import type { Category, PortfolioPiece, VideoMedia } from './gallery.types';

const PIECES_PER_PAGE = 5;

export const CATEGORIES: { value: Category; label: string }[] = [
	{ value: 'kitchen', label: 'Kitchen' },
	{ value: 'closet', label: 'Closet' },
	{ value: 'pantry', label: 'Pantry' },
	{ value: 'office', label: 'Office' },
	{ value: 'living-space', label: 'Living space' },
	{ value: 'garage', label: 'Garage' },
];

const BEFORE_VIDEO_SRC = '/gallery/videos/before.mp4';
const AFTER_VIDEO_SRC = '/gallery/videos/after.mp4';
const BEFORE_VIDEO_DURATION = 9;
const AFTER_VIDEO_DURATION = 11;

const photo = (id: string) => `/gallery/photos/${id}.jpg`;

const beforeVideo = (poster: string, alt: string): VideoMedia => ({
	src: BEFORE_VIDEO_SRC,
	poster,
	posterOffset: 0,
	tag: 'before',
	duration: BEFORE_VIDEO_DURATION,
	alt,
});

const afterVideo = (poster: string, alt: string): VideoMedia => ({
	src: AFTER_VIDEO_SRC,
	poster,
	posterOffset: 0,
	tag: 'after',
	duration: AFTER_VIDEO_DURATION,
	alt,
});

export const PORTFOLIO_PIECES: PortfolioPiece[] = [
	{
		id: 'closet-1',
		title: 'Master closet transformation',
		category: 'closet',
		location: 'Arlington, VA',
		description:
			'Complete wardrobe reorganization with custom shelf dividers, coordinated hangers, and a seasonal rotation system. The client went from dreading their morning routine to looking forward to it.',
		videos: [
			beforeVideo(photo('photo-1742453161018-73e39a241541'), 'Master closet transformation — before'),
			afterVideo(photo('photo-1618236444721-4a8dba415c15'), 'Master closet transformation — after'),
		],
		images: [
			{
				src: photo('photo-1614631446501-abcf76949eca'),
				alt: 'Custom shelf dividers in the master closet',
				caption: 'Custom shelf dividers in the master closet',
			},
			{
				src: photo('photo-1649361811423-a55616f7ab11'),
				alt: 'Coordinated hangers and folded linens',
				caption: 'Coordinated hangers and folded linens',
			},
			{
				src: photo('photo-1600585152220-90363fe7e115'),
				alt: 'Seasonal rotation storage bins',
				caption: 'Seasonal rotation storage bins',
			},
			{
				src: photo('photo-1614631446501-abcf76949eca'),
				alt: 'Custom shelf dividers in the master closet',
				caption: 'Custom shelf dividers in the master closet',
			},
			{
				src: photo('photo-1649361811423-a55616f7ab11'),
				alt: 'Coordinated hangers and folded linens',
				caption: 'Coordinated hangers and folded linens',
			},
			{
				src: photo('photo-1600585152220-90363fe7e115'),
				alt: 'Seasonal rotation storage bins',
				caption: 'Seasonal rotation storage bins',
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
		videos: [
			beforeVideo(photo('photo-1600585152220-90363fe7e115'), 'Reach-in closet refresh — before'),
			afterVideo(photo('photo-1618236444721-4a8dba415c15'), 'Reach-in closet refresh — after'),
		],
		images: [
			{
				src: photo('photo-1614631446501-abcf76949eca'),
				alt: 'Double-hang rods in the reach-in closet',
				caption: 'Double-hang rods in the reach-in closet',
			},
			{
				src: photo('photo-1649361811423-a55616f7ab11'),
				alt: 'Labeled accessory bins',
				caption: 'Labeled accessory bins',
			},
			{
				src: photo('photo-1600585152220-90363fe7e115'),
				alt: 'Slim velvet hangers evenly spaced',
				caption: 'Slim velvet hangers evenly spaced',
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
		videos: [
			beforeVideo(photo('photo-1618236444721-4a8dba415c15'), 'Kids closet system — before'),
			afterVideo(photo('photo-1742453161018-73e39a241541'), 'Kids closet system — after'),
		],
		images: [
			{
				src: photo('photo-1649361811423-a55616f7ab11'),
				alt: 'Adjustable-height closet rods',
				caption: 'Adjustable-height closet rods',
			},
			{
				src: photo('photo-1600585152220-90363fe7e115'),
				alt: 'Labeled bins within reach of a child',
				caption: 'Labeled bins within reach of a child',
			},
			{
				src: photo('photo-1614631446501-abcf76949eca'),
				alt: 'Finished kids closet system',
				caption: 'Finished kids closet system',
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
		videos: [
			beforeVideo(photo('photo-1556909114-f6e7ad7d3136'), 'Kitchen + pantry overhaul — before'),
			afterVideo(photo('photo-1600585152220-90363fe7e115'), 'Kitchen + pantry overhaul — after'),
		],
		images: [
			{
				src: photo('photo-1614631446501-abcf76949eca'),
				alt: 'Clear storage containers on kitchen shelves',
				caption: 'Clear storage containers on kitchen shelves',
			},
			{
				src: photo('photo-1649361811423-a55616f7ab11'),
				alt: 'Labeled pantry zones',
				caption: 'Labeled pantry zones',
			},
			{
				src: photo('photo-1600585152220-90363fe7e115'),
				alt: 'Weekly meal prep staging area',
				caption: 'Weekly meal prep staging area',
			},
			{
				src: photo('photo-1614631446501-abcf76949eca'),
				alt: 'Clear storage containers on kitchen shelves',
				caption: 'Clear storage containers on kitchen shelves',
			},
			{
				src: photo('photo-1649361811423-a55616f7ab11'),
				alt: 'Labeled pantry zones',
				caption: 'Labeled pantry zones',
			},
			{
				src: photo('photo-1600585152220-90363fe7e115'),
				alt: 'Weekly meal prep staging area',
				caption: 'Weekly meal prep staging area',
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
		videos: [
			beforeVideo(photo('photo-1600585152220-90363fe7e115'), 'Galley kitchen reset — before'),
			afterVideo(photo('photo-1556909114-f6e7ad7d3136'), 'Galley kitchen reset — after'),
		],
		images: [
			{
				src: photo('photo-1649361811423-a55616f7ab11'),
				alt: 'Deep drawer organizers',
				caption: 'Deep drawer organizers',
			},
			{
				src: photo('photo-1614631446501-abcf76949eca'),
				alt: 'Small-appliance storage zone',
				caption: 'Small-appliance storage zone',
			},
			{
				src: photo('photo-1600585152220-90363fe7e115'),
				alt: 'Cleared galley kitchen counter space',
				caption: 'Cleared galley kitchen counter space',
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
		videos: [
			beforeVideo(photo('photo-1556909114-f6e7ad7d3136'), 'Open-concept kitchen edit — before'),
			afterVideo(photo('photo-1600585152220-90363fe7e115'), 'Open-concept kitchen edit — after'),
		],
		images: [
			{
				src: photo('photo-1614631446501-abcf76949eca'),
				alt: 'Coffee station on the kitchen counter',
				caption: 'Coffee station on the kitchen counter',
			},
			{
				src: photo('photo-1649361811423-a55616f7ab11'),
				alt: 'Hidden charging drawer',
				caption: 'Hidden charging drawer',
			},
			{
				src: photo('photo-1600585152220-90363fe7e115'),
				alt: 'Clear sightline from kitchen to living room',
				caption: 'Clear sightline from kitchen to living room',
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
		videos: [
			beforeVideo(photo('photo-1600585152220-90363fe7e115'), 'Baking-focused pantry build — before'),
			afterVideo(photo('photo-1556909114-f6e7ad7d3136'), 'Baking-focused pantry build — after'),
		],
		images: [
			{
				src: photo('photo-1649361811423-a55616f7ab11'),
				alt: 'Labeled baking canisters',
				caption: 'Labeled baking canisters',
			},
			{
				src: photo('photo-1614631446501-abcf76949eca'),
				alt: 'Pull-out cutting board station',
				caption: 'Pull-out cutting board station',
			},
			{
				src: photo('photo-1600585152220-90363fe7e115'),
				alt: 'Finished baking zone in the pantry',
				caption: 'Finished baking zone in the pantry',
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
		videos: [
			beforeVideo(photo('photo-1556909114-f6e7ad7d3136'), 'Family command center kitchen — before'),
			afterVideo(photo('photo-1600585152220-90363fe7e115'), 'Family command center kitchen — after'),
		],
		images: [
			{
				src: photo('photo-1614631446501-abcf76949eca'),
				alt: 'Wall-mounted mail sorter and calendar',
				caption: 'Wall-mounted mail sorter and calendar',
			},
			{
				src: photo('photo-1649361811423-a55616f7ab11'),
				alt: 'Family charging station',
				caption: 'Family charging station',
			},
			{
				src: photo('photo-1600585152220-90363fe7e115'),
				alt: 'Reorganized kitchen cabinets',
				caption: 'Reorganized kitchen cabinets',
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
		videos: [
			beforeVideo(photo('photo-1600585152220-90363fe7e115'), 'Small-space kitchen maximization — before'),
			afterVideo(photo('photo-1556909114-f6e7ad7d3136'), 'Small-space kitchen maximization — after'),
		],
		images: [
			{
				src: photo('photo-1649361811423-a55616f7ab11'),
				alt: 'Vertical storage shelving',
				caption: 'Vertical storage shelving',
			},
			{
				src: photo('photo-1614631446501-abcf76949eca'),
				alt: 'Fold-down prep surface',
				caption: 'Fold-down prep surface',
			},
			{
				src: photo('photo-1600585152220-90363fe7e115'),
				alt: 'Small apartment kitchen with clear floor space',
				caption: 'Small apartment kitchen with clear floor space',
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
		videos: [
			beforeVideo(photo('photo-1600585152220-90363fe7e115'), 'Walk-in pantry relabel — before'),
			afterVideo(photo('photo-1649361811423-a55616f7ab11'), 'Walk-in pantry relabel — after'),
		],
		images: [
			{
				src: photo('photo-1614631446501-abcf76949eca'),
				alt: 'Matching pantry canisters',
				caption: 'Matching pantry canisters',
			},
			{
				src: photo('photo-1649361811423-a55616f7ab11'),
				alt: 'Pantry zone map',
				caption: 'Pantry zone map',
			},
			{
				src: photo('photo-1600585152220-90363fe7e115'),
				alt: 'Legible pantry shelf labels',
				caption: 'Legible pantry shelf labels',
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
		videos: [
			beforeVideo(photo('photo-1649361811423-a55616f7ab11'), 'Butler pantry buildout — before'),
			afterVideo(photo('photo-1600585152220-90363fe7e115'), 'Butler pantry buildout — after'),
		],
		images: [
			{
				src: photo('photo-1614631446501-abcf76949eca'),
				alt: 'Open shelving for entertaining essentials',
				caption: 'Open shelving for entertaining essentials',
			},
			{
				src: photo('photo-1600585152220-90363fe7e115'),
				alt: 'Serveware staged near the dining room',
				caption: 'Serveware staged near the dining room',
			},
			{
				src: photo('photo-1649361811423-a55616f7ab11'),
				alt: 'Finished butler pantry buildout',
				caption: 'Finished butler pantry buildout',
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
		videos: [
			beforeVideo(photo('photo-1772157361267-bf6fe2100dd2'), 'Home office setup — before'),
			afterVideo(photo('photo-1518455027359-f3f8164ba6bd'), 'Home office setup — after'),
		],
		images: [
			{
				src: photo('photo-1593062096033-9a26b09da705'),
				alt: 'Built-in file systems in the home office',
				caption: 'Built-in file systems in the home office',
			},
			{
				src: photo('photo-1591382696684-38c427c7547a'),
				alt: 'Cable management under the desk',
				caption: 'Cable management under the desk',
			},
			{
				src: photo('photo-1611532736597-de2d4265fba3'),
				alt: 'Minimalist desk setup',
				caption: 'Minimalist desk setup',
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
		videos: [
			beforeVideo(photo('photo-1611532736597-de2d4265fba3'), 'Living room media reset — before'),
			afterVideo(photo('photo-1518455027359-f3f8164ba6bd'), 'Living room media reset — after'),
		],
		images: [
			{
				src: photo('photo-1593062096033-9a26b09da705'),
				alt: 'Labeled remote and cord storage',
				caption: 'Labeled remote and cord storage',
			},
			{
				src: photo('photo-1591382696684-38c427c7547a'),
				alt: 'Board games organized on the console shelf',
				caption: 'Board games organized on the console shelf',
			},
			{
				src: photo('photo-1611532736597-de2d4265fba3'),
				alt: 'Cleared living room media console',
				caption: 'Cleared living room media console',
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
		videos: [
			beforeVideo(photo('photo-1518455027359-f3f8164ba6bd'), 'Playroom-to-living room edit — before'),
			afterVideo(photo('photo-1611532736597-de2d4265fba3'), 'Playroom-to-living room edit — after'),
		],
		images: [
			{
				src: photo('photo-1591382696684-38c427c7547a'),
				alt: 'Toy storage that doubles as an end table',
				caption: 'Toy storage that doubles as an end table',
			},
			{
				src: photo('photo-1593062096033-9a26b09da705'),
				alt: 'Shared living and play space',
				caption: 'Shared living and play space',
			},
			{
				src: photo('photo-1611532736597-de2d4265fba3'),
				alt: 'Reset living room at the end of the day',
				caption: 'Reset living room at the end of the day',
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
		videos: [
			beforeVideo(photo('photo-1591382696684-38c427c7547a'), 'Built-in bookshelf edit — before'),
			afterVideo(photo('photo-1593062096033-9a26b09da705'), 'Built-in bookshelf edit — after'),
		],
		images: [
			{
				src: photo('photo-1611532736597-de2d4265fba3'),
				alt: 'Bookshelf edited by color',
				caption: 'Bookshelf edited by color',
			},
			{
				src: photo('photo-1518455027359-f3f8164ba6bd'),
				alt: 'Built-ins organized by category',
				caption: 'Built-ins organized by category',
			},
			{
				src: photo('photo-1593062096033-9a26b09da705'),
				alt: 'Considered shelf-wall display',
				caption: 'Considered shelf-wall display',
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
		videos: [
			beforeVideo(photo('photo-1593062096033-9a26b09da705'), 'Entryway drop-zone build — before'),
			afterVideo(photo('photo-1591382696684-38c427c7547a'), 'Entryway drop-zone build — after'),
		],
		images: [
			{
				src: photo('photo-1611532736597-de2d4265fba3'),
				alt: 'Entryway hooks and bench',
				caption: 'Entryway hooks and bench',
			},
			{
				src: photo('photo-1518455027359-f3f8164ba6bd'),
				alt: 'Labeled entryway cubbies',
				caption: 'Labeled entryway cubbies',
			},
			{
				src: photo('photo-1593062096033-9a26b09da705'),
				alt: 'Clear living room after the entryway edit',
				caption: 'Clear living room after the entryway edit',
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
		videos: [
			beforeVideo(photo('photo-1591382696684-38c427c7547a'), 'Two-car garage system — before'),
			afterVideo(photo('photo-1611532736597-de2d4265fba3'), 'Two-car garage system — after'),
		],
		images: [
			{
				src: photo('photo-1518455027359-f3f8164ba6bd'),
				alt: 'Wall-mounted slat panels in the garage',
				caption: 'Wall-mounted slat panels in the garage',
			},
			{
				src: photo('photo-1593062096033-9a26b09da705'),
				alt: 'Labeled garage storage bins',
				caption: 'Labeled garage storage bins',
			},
			{
				src: photo('photo-1611532736597-de2d4265fba3'),
				alt: 'Both cars parked in the organized garage',
				caption: 'Both cars parked in the organized garage',
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
		videos: [
			beforeVideo(photo('photo-1611532736597-de2d4265fba3'), 'Workshop corner buildout — before'),
			afterVideo(photo('photo-1591382696684-38c427c7547a'), 'Workshop corner buildout — after'),
		],
		images: [
			{
				src: photo('photo-1518455027359-f3f8164ba6bd'),
				alt: 'Pegboard tool storage',
				caption: 'Pegboard tool storage',
			},
			{
				src: photo('photo-1593062096033-9a26b09da705'),
				alt: 'Fold-out workbench',
				caption: 'Fold-out workbench',
			},
			{
				src: photo('photo-1611532736597-de2d4265fba3'),
				alt: 'Finished garage workshop corner',
				caption: 'Finished garage workshop corner',
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
