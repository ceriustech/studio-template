import type { BackgroundImage } from '~/types/global';

export type ServiceEntry = {
	eyebrow?: string;
	heading: string;
	description?: string;
	image: BackgroundImage;
	items: string[];
	ctaLabel?: string;
};

export type ServiceItemProps = ServiceEntry & {
	reversed?: boolean;
};
