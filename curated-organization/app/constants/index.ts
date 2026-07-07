export const BREAKPOINTS = {
	mobileS: '320px',
	mobileM: '375px',
	mobileL: '430px',
	tablet: '768px',
	laptop: '1024px',
	desktop: '1440px',
	desktopL: '2560px',
} as const;

export const QUERIES = {
	// Max-width queries
	mobileS: `(max-width: ${BREAKPOINTS.mobileS})`,
	mobileM: `(max-width: ${BREAKPOINTS.mobileM})`,
	mobileL: `(max-width: ${BREAKPOINTS.mobileL})`,
	tablet: `(max-width: ${BREAKPOINTS.tablet})`,
	laptop: `(max-width: ${BREAKPOINTS.laptop})`,
	desktopL: `(max-width: ${BREAKPOINTS.desktop})`,

	// Min-width queries
	minTablet: `(min-width: ${BREAKPOINTS.tablet})`,
	minLaptop: `(min-width: ${BREAKPOINTS.laptop})`,
	minDesktop: `(min-width: ${BREAKPOINTS.desktop})`,

	// Range queries
	mobileOnly: `(max-width: ${BREAKPOINTS.mobileL})`,
	tabletOnly: `(min-width: ${BREAKPOINTS.tablet}) and (max-width: ${BREAKPOINTS.laptop})`,
	desktopOnly: `(min-width: ${BREAKPOINTS.laptop})`,
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;
type QueryKey = keyof typeof QUERIES;

const NAVBAR_DATA: NAVIGATION[] = [
	{
		url: '/',
		name: 'HOME',
	},
	{
		url: '/services',
		name: 'SERVICES',
	},
	{
		url: '/gallery',
		name: 'GALLERY',
	},
	{
		url: '/booking',
		name: 'BOOKING',
	},
];

export { NAVBAR_DATA };
export type { BreakpointKey, QueryKey };
