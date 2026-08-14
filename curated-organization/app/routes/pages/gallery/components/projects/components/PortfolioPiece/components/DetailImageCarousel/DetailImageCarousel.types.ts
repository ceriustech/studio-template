import type { ImageMedia } from '../../../../../../gallery.types';

export type DetailImageCarouselProps = {
	images: ImageMedia[];
	onOpenImage: (index: number) => void;
};
