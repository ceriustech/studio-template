import type { BackgroundImage, LinkItem } from '~/types/global';

export type HeroProps = {
	eyebrow?: string;
	heading: string;
	body?: string;
	link?: LinkItem;
	slides: BackgroundImage[];
};
