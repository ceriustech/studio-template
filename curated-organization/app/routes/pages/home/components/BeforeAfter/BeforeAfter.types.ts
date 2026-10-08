import type { BackgroundImage, LinkItem } from '~/types/global';

export type BeforeAfterProps = {
	eyebrow?: string;
	heading: string;
	before: BackgroundImage;
	after: BackgroundImage;
	caption?: string;
	link?: LinkItem;
};
