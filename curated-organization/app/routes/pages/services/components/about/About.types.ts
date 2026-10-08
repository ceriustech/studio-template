import type { ImageItem } from '~/types/global';

export type CredentialBadge = {
	label?: string;
	image: ImageItem;
};

export type AboutProps = {
	eyebrow?: string;
	heading: string;
	bio: string;
	signature?: string;
	photo: ImageItem;
	badges: CredentialBadge[];
};
