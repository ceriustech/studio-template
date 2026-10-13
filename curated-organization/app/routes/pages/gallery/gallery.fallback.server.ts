import type { GalleryContent, PortfolioPiece, VideoMedia } from './gallery.types';

// Backup Gallery content: used when the CMS is unreachable, the hero has no heading,
// or no portfolio piece is usable. Every backup photo and poster uses this one image.
const FALLBACK_IMAGE_URL =
	'https://plus.unsplash.com/premium_photo-1700672863747-4934c195133a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const BEFORE_VIDEO_SRC = '/gallery/videos/before.mp4';
const AFTER_VIDEO_SRC = '/gallery/videos/after.mp4';
const BEFORE_VIDEO_DURATION = 9;
const AFTER_VIDEO_DURATION = 11;

const beforeVideo = (alt: string): VideoMedia => ({
	src: BEFORE_VIDEO_SRC,
	poster: FALLBACK_IMAGE_URL,
	posterOffset: 0,
	tag: 'before',
	duration: BEFORE_VIDEO_DURATION,
	alt,
});

const afterVideo = (alt: string): VideoMedia => ({
	src: AFTER_VIDEO_SRC,
	poster: FALLBACK_IMAGE_URL,
	posterOffset: 0,
	tag: 'after',
	duration: AFTER_VIDEO_DURATION,
	alt,
});

const FALLBACK_PIECES: PortfolioPiece[] = [
	{
		id: 'closet-1',
		title: 'Master closet transformation',
		category: 'closet',
		location: 'Arlington, VA',
		description:
			'Complete wardrobe reorganization with custom shelf dividers, coordinated hangers, and a seasonal rotation system. The client went from dreading their morning routine to looking forward to it.',
		videos: [
			beforeVideo('Master closet transformation — before'),
			afterVideo('Master closet transformation — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Custom shelf dividers in the master closet',
				caption: 'Custom shelf dividers in the master closet',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Coordinated hangers and folded linens',
				caption: 'Coordinated hangers and folded linens',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Seasonal rotation storage bins',
				caption: 'Seasonal rotation storage bins',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Custom shelf dividers in the master closet',
				caption: 'Custom shelf dividers in the master closet',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Coordinated hangers and folded linens',
				caption: 'Coordinated hangers and folded linens',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Reach-in closet refresh — before'),
			afterVideo('Reach-in closet refresh — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Double-hang rods in the reach-in closet',
				caption: 'Double-hang rods in the reach-in closet',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Labeled accessory bins',
				caption: 'Labeled accessory bins',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Kids closet system — before'),
			afterVideo('Kids closet system — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Adjustable-height closet rods',
				caption: 'Adjustable-height closet rods',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Labeled bins within reach of a child',
				caption: 'Labeled bins within reach of a child',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Kitchen + pantry overhaul — before'),
			afterVideo('Kitchen + pantry overhaul — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Clear storage containers on kitchen shelves',
				caption: 'Clear storage containers on kitchen shelves',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Labeled pantry zones',
				caption: 'Labeled pantry zones',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Weekly meal prep staging area',
				caption: 'Weekly meal prep staging area',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Clear storage containers on kitchen shelves',
				caption: 'Clear storage containers on kitchen shelves',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Labeled pantry zones',
				caption: 'Labeled pantry zones',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Galley kitchen reset — before'),
			afterVideo('Galley kitchen reset — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Deep drawer organizers',
				caption: 'Deep drawer organizers',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Small-appliance storage zone',
				caption: 'Small-appliance storage zone',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Open-concept kitchen edit — before'),
			afterVideo('Open-concept kitchen edit — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Coffee station on the kitchen counter',
				caption: 'Coffee station on the kitchen counter',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Hidden charging drawer',
				caption: 'Hidden charging drawer',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Baking-focused pantry build — before'),
			afterVideo('Baking-focused pantry build — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Labeled baking canisters',
				caption: 'Labeled baking canisters',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Pull-out cutting board station',
				caption: 'Pull-out cutting board station',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Family command center kitchen — before'),
			afterVideo('Family command center kitchen — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Wall-mounted mail sorter and calendar',
				caption: 'Wall-mounted mail sorter and calendar',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Family charging station',
				caption: 'Family charging station',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Small-space kitchen maximization — before'),
			afterVideo('Small-space kitchen maximization — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Vertical storage shelving',
				caption: 'Vertical storage shelving',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Fold-down prep surface',
				caption: 'Fold-down prep surface',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Walk-in pantry relabel — before'),
			afterVideo('Walk-in pantry relabel — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Matching pantry canisters',
				caption: 'Matching pantry canisters',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Pantry zone map',
				caption: 'Pantry zone map',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Butler pantry buildout — before'),
			afterVideo('Butler pantry buildout — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Open shelving for entertaining essentials',
				caption: 'Open shelving for entertaining essentials',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Serveware staged near the dining room',
				caption: 'Serveware staged near the dining room',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Home office setup — before'),
			afterVideo('Home office setup — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Built-in file systems in the home office',
				caption: 'Built-in file systems in the home office',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Cable management under the desk',
				caption: 'Cable management under the desk',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Living room media reset — before'),
			afterVideo('Living room media reset — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Labeled remote and cord storage',
				caption: 'Labeled remote and cord storage',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Board games organized on the console shelf',
				caption: 'Board games organized on the console shelf',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Playroom-to-living room edit — before'),
			afterVideo('Playroom-to-living room edit — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Toy storage that doubles as an end table',
				caption: 'Toy storage that doubles as an end table',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Shared living and play space',
				caption: 'Shared living and play space',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Built-in bookshelf edit — before'),
			afterVideo('Built-in bookshelf edit — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Bookshelf edited by color',
				caption: 'Bookshelf edited by color',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Built-ins organized by category',
				caption: 'Built-ins organized by category',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Entryway drop-zone build — before'),
			afterVideo('Entryway drop-zone build — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Entryway hooks and bench',
				caption: 'Entryway hooks and bench',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Labeled entryway cubbies',
				caption: 'Labeled entryway cubbies',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Two-car garage system — before'),
			afterVideo('Two-car garage system — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Wall-mounted slat panels in the garage',
				caption: 'Wall-mounted slat panels in the garage',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Labeled garage storage bins',
				caption: 'Labeled garage storage bins',
			},
			{
				src: FALLBACK_IMAGE_URL,
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
			beforeVideo('Workshop corner buildout — before'),
			afterVideo('Workshop corner buildout — after'),
		],
		images: [
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Pegboard tool storage',
				caption: 'Pegboard tool storage',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Fold-out workbench',
				caption: 'Fold-out workbench',
			},
			{
				src: FALLBACK_IMAGE_URL,
				alt: 'Finished garage workshop corner',
				caption: 'Finished garage workshop corner',
			},
		],
	},
];

export const FALLBACK_GALLERY_CONTENT: GalleryContent = {
	hero: {
		eyebrow: 'YOUR TRANSFORMATION',
		heading: 'See the difference',
		body: 'Real spaces, Real results. From Dysfunction to Function.',
	},
	pieces: FALLBACK_PIECES,
	seo: {},
};
