import type { RefObject } from 'react';
import type { ImageMedia, VideoMedia } from '../../../../../../gallery.types';

export type LightboxSet = 'video' | 'image';

export type LightboxTarget = {
	set: LightboxSet;
	index: number;
};

export type LightboxProps = {
	videos: readonly VideoMedia[];
	images: ImageMedia[];
	open: LightboxTarget | null;
	onClose: () => void;
	onNavigate: (next: LightboxTarget) => void;
	returnFocusRef: RefObject<HTMLElement | null>;
};
