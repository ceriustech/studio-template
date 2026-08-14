import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { useIsMounted, useLightboxBehavior } from './useLightbox';
import type { LightboxProps } from './Lightbox.types';
import './lightbox.css';

const TAG_LABEL = { before: 'Before', after: 'After' } as const;

const Lightbox = ({ videos, images, open, onClose, onNavigate, returnFocusRef }: LightboxProps) => {
	const isMounted = useIsMounted();
	const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	const openKey = open ? `${open.set}:${open.index}` : null;
	const activeSet = open?.set ?? null;
	const activeIndex = open?.index ?? 0;
	const total = activeSet === 'video' ? videos.length : activeSet === 'image' ? images.length : 0;

	const preloadSrcs: [string | null, string | null] =
		activeSet === 'image' && total > 1
			? (() => {
					const prevIndex = (activeIndex - 1 + total) % total;
					const nextIndex = (activeIndex + 1) % total;
					return [
						images[prevIndex]?.fullSrc ?? images[prevIndex]?.src ?? null,
						images[nextIndex]?.fullSrc ?? images[nextIndex]?.src ?? null,
					];
				})()
			: [null, null];

	const { dialogRef, goToOffset } = useLightboxBehavior({
		isOpen: isMounted && open !== null,
		activeSet,
		activeIndex,
		total,
		preloadSrcs,
		onClose,
		onNavigate,
		returnFocusRef,
	});

	useEffect(() => {
		setHasStartedPlaying(false);
	}, [openKey]);

	if (!isMounted || !open) return null;

	const activeVideo = open.set === 'video' ? videos[open.index] : undefined;
	const activeImage = open.set === 'image' ? images[open.index] : undefined;
	const caption = activeVideo?.alt ?? activeImage?.caption ?? '';
	const positionLabel =
		open.set === 'video' && activeVideo
			? `${TAG_LABEL[activeVideo.tag]} video, item ${open.index + 1} of ${total}`
			: `Photo, item ${open.index + 1} of ${total}`;

	const filmstripItems =
		open.set === 'video'
			? videos.map((video, index) => ({
					index,
					thumbSrc: video.poster,
					thumbAlt: video.alt,
					label: TAG_LABEL[video.tag] as string | null,
				}))
			: images.map((image, index) => ({
					index,
					thumbSrc: image.src,
					thumbAlt: image.alt,
					label: null as string | null,
				}));

	const handlePlayOverlayClick = () => {
		videoRef.current?.play();
	};

	const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) onClose();
	};

	return createPortal(
		<div
			ref={dialogRef}
			className="lightboxBackdrop"
			role="dialog"
			aria-modal="true"
			aria-label={positionLabel}
			onClick={handleBackdropClick}
		>
			<div className="lightboxTopBar">
				<span className="lightboxCounter">
					{open.index + 1} / {total}
				</span>
				<button type="button" className="lightboxClose" aria-label="Close" onClick={onClose}>
					<X size={22} aria-hidden="true" />
				</button>
			</div>
			{total > 1 && (
				<button
					type="button"
					className="lightboxNav lightboxNavPrev"
					aria-label="Previous"
					onClick={() => goToOffset(-1)}
				>
					<ChevronLeft size={28} aria-hidden="true" />
				</button>
			)}
			<div className="lightboxMedia">
				{activeImage && (
					<img
						className="lightboxImage"
						src={activeImage.fullSrc ?? activeImage.src}
						alt={activeImage.alt}
					/>
				)}
				{activeVideo && (
					<div className="lightboxVideoWrap">
						<span className="lightboxVideoTag">{TAG_LABEL[activeVideo.tag]}</span>
						<video
							ref={videoRef}
							key={openKey}
							className="lightboxVideo"
							poster={activeVideo.poster}
							autoPlay
							playsInline
							controlsList="nodownload"
							controls={hasStartedPlaying}
							onPlay={() => setHasStartedPlaying(true)}
							aria-label={`${TAG_LABEL[activeVideo.tag]} video — ${activeVideo.alt}`}
						>
							<source src={activeVideo.src} type="video/mp4" />
							{activeVideo.captionsSrc && (
								<track kind="captions" src={activeVideo.captionsSrc} />
							)}
						</video>
						{!hasStartedPlaying && (
							<button
								type="button"
								className="lightboxPlayOverlay"
								aria-label={`Play ${activeVideo.alt}`}
								onClick={handlePlayOverlayClick}
							>
								<Play size={28} fill="currentColor" aria-hidden="true" />
							</button>
						)}
					</div>
				)}
			</div>
			{total > 1 && (
				<button
					type="button"
					className="lightboxNav lightboxNavNext"
					aria-label="Next"
					onClick={() => goToOffset(1)}
				>
					<ChevronRight size={28} aria-hidden="true" />
				</button>
			)}
			{caption && <p className="lightboxCaption">{caption}</p>}
			{total > 1 && (
				<div className="lightboxFilmstrip">
					{filmstripItems.map((item) => (
						<div className="lightboxFilmstripItem" key={item.index}>
							<button
								type="button"
								className={
									item.index === open.index
										? 'lightboxFilmstripThumb isActive'
										: 'lightboxFilmstripThumb'
								}
								aria-current={item.index === open.index}
								aria-label={`Go to ${item.thumbAlt}`}
								onClick={() => onNavigate({ set: open.set, index: item.index })}
							>
								<img src={item.thumbSrc} alt="" aria-hidden="true" />
							</button>
							{item.label && <span className="lightboxFilmstripLabel">{item.label}</span>}
						</div>
					))}
				</div>
			)}
			{total > 1 && (
				<div className="lightboxDots">
					{filmstripItems.map((item) => (
						<button
							type="button"
							key={item.index}
							className={item.index === open.index ? 'lightboxDot isActive' : 'lightboxDot'}
							aria-current={item.index === open.index}
							aria-label={`Go to item ${item.index + 1} of ${total}`}
							onClick={() => onNavigate({ set: open.set, index: item.index })}
						/>
					))}
				</div>
			)}
		</div>,
		document.body,
	);
};

export default Lightbox;
