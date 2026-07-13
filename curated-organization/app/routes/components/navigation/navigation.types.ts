export interface NavItem {
	url: string;
	name: string;
}

export type NavItems = NavItem[];

export interface NavigationProps {
	items?: NavItems;
}
