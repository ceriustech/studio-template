import { useEffect, useState } from 'react';

// Reads the length from the file itself; preload="metadata" fetches only the header, not the video.
export const useVideoDuration = (src: string): number | null => {
	const [duration, setDuration] = useState<number | null>(null);

	useEffect(() => {
		setDuration(null);
		const video = document.createElement('video');
		video.preload = 'metadata';
		video.muted = true;

		const handleLoadedMetadata = () => {
			if (Number.isFinite(video.duration) && video.duration > 0) setDuration(video.duration);
		};

		video.addEventListener('loadedmetadata', handleLoadedMetadata);
		video.src = src;

		return () => {
			video.removeEventListener('loadedmetadata', handleLoadedMetadata);
			video.removeAttribute('src');
			video.load();
		};
	}, [src]);

	return duration;
};
