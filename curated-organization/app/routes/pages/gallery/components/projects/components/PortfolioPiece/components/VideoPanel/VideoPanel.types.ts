import type { VideoMedia } from '../../../../../../gallery.types';

export type VideoPanelProps = {
	media: VideoMedia;
	onOpen: () => void;
};
