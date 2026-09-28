import type { BrandContent, LinkItem } from '~/types/global';

export interface NavigationProps {
	brand: BrandContent;
	links: LinkItem[];
	bookNowLabel: string;
}
