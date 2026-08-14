import type { VideoMedia } from '../../../../../../gallery.types';

export type VideoPairProps = {
	videos: readonly VideoMedia[];
	onOpenVideo: (index: number) => void;
};
