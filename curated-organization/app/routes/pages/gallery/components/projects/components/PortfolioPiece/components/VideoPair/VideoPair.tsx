import { useRef, useState, type RefObject } from 'react';
import { Pause, Play } from 'lucide-react';
import type { VideoPairProps } from './VideoPair.types';
import type { MediaSource } from '../../../../../../gallery.types';
import './videoPair.css';

type VideoKey = 'before' | 'after';

const VideoPair = ({ before, after }: VideoPairProps) => {
	const [playing, setPlaying] = useState<VideoKey | null>(null);
	const beforeRef = useRef<HTMLVideoElement>(null);
	const afterRef = useRef<HTMLVideoElement>(null);

	const refs: Record<VideoKey, RefObject<HTMLVideoElement | null>> = {
		before: beforeRef,
		after: afterRef,
	};

	const handleToggle = (key: VideoKey) => {
		const targetVideo = refs[key].current;
		if (!targetVideo) return;

		if (playing === key) {
			targetVideo.pause();
			setPlaying(null);
			return;
		}

		const otherKey: VideoKey = key === 'before' ? 'after' : 'before';
		refs[otherKey].current?.pause();
		targetVideo.play();
		setPlaying(key);
	};

	const items: { key: VideoKey; tag: string; media: MediaSource }[] = [
		{ key: 'before', tag: 'Before', media: before },
		{ key: 'after', tag: 'After', media: after },
	];

	return (
		<div className="baPair">
			{items.map((item) => (
				<div className="baCell" key={item.key}>
					<video
						ref={refs[item.key]}
						className="baVideo"
						poster={item.media.poster}
						aria-label={item.media.alt}
						onEnded={() => setPlaying(null)}
					>
						<source src={item.media.src} type="video/mp4" />
					</video>
					<span className="baTag">{item.tag}</span>
					<button
						type="button"
						className="baPlayToggle"
						aria-label={
							playing === item.key
								? `Pause ${item.media.alt}`
								: `Play ${item.media.alt}`
						}
						onClick={() => handleToggle(item.key)}
					>
						{playing === item.key ? (
							<Pause aria-hidden="true" size={20} />
						) : (
							<Play aria-hidden="true" size={20} />
						)}
					</button>
					<span className="baStatus">
						{playing === item.key ? 'playing' : 'paused · poster'}
					</span>
				</div>
			))}
		</div>
	);
};

export default VideoPair;
