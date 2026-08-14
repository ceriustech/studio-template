import VideoPanel from '../VideoPanel/VideoPanel';
import type { VideoPairProps } from './VideoPair.types';
import './videoPair.css';

const VideoPair = ({ videos, onOpenVideo }: VideoPairProps) => {
	if (videos.length === 0) return null;

	return (
		<div className="baPair">
			{videos.map((media, index) => (
				<VideoPanel key={media.tag} media={media} onOpen={() => onOpenVideo(index)} />
			))}
		</div>
	);
};

export default VideoPair;
