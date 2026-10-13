import { Play } from 'lucide-react';
import type { VideoPanelProps } from './VideoPanel.types';
import { useVideoDuration } from './useVideoDuration';
import './videoPanel.css';

const TAG_LABEL: Record<VideoPanelProps['media']['tag'], string> = {
	before: 'Before',
	after: 'After',
};

const formatDuration = (seconds: number): string => {
	const whole = Math.max(0, Math.round(seconds));
	const minutes = Math.floor(whole / 60);
	const remainingSeconds = whole % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const VideoPanel = ({ media, onOpen }: VideoPanelProps) => {
	const label = TAG_LABEL[media.tag];
	const duration = useVideoDuration(media.src);

	return (
		<button
			type="button"
			className="videoPanel"
			onClick={onOpen}
			aria-label={`Open ${label} video — ${media.alt}`}
		>
			<img className="videoPanelPoster" src={media.poster} alt="" aria-hidden="true" />
			<span className="videoPanelTag">{label}</span>
			<span className="videoPanelPlay" aria-hidden="true">
				<Play size={20} fill="currentColor" />
			</span>
			{duration !== null && <span className="videoPanelDuration">{formatDuration(duration)}</span>}
		</button>
	);
};

export default VideoPanel;
