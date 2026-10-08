import type { BackgroundImage, LinkItem } from '~/types/global';

export type ServiceCardItem = {
	title: string;
	description?: string;
	image: BackgroundImage;
};

export type ServiceCardProps = ServiceCardItem;

export type ServicesProps = {
	eyebrow?: string;
	heading: string;
	link?: LinkItem;
	cards: ServiceCardItem[];
};
