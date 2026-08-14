import { useEffect, useRef, useState, type RefObject } from 'react';
import type { LightboxSet, LightboxTarget } from './Lightbox.types';

export const useIsMounted = (): boolean => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return isMounted;
};

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const SWIPE_THRESHOLD_PX = 50;

type UseLightboxBehaviorArgs = {
	isOpen: boolean;
	activeSet: LightboxSet | null;
	activeIndex: number;
	total: number;
	preloadSrcs: [string | null, string | null];
	onClose: () => void;
	onNavigate: (target: LightboxTarget) => void;
	returnFocusRef: RefObject<HTMLElement | null>;
};

export const useLightboxBehavior = ({
	isOpen,
	activeSet,
	activeIndex,
	total,
	preloadSrcs,
	onClose,
	onNavigate,
	returnFocusRef,
}: UseLightboxBehaviorArgs) => {
	const dialogRef = useRef<HTMLDivElement>(null);
	const touchStart = useRef<{ x: number; y: number } | null>(null);

	const goToOffset = (offset: number) => {
		if (!activeSet || total <= 1) return;
		const nextIndex = (activeIndex + offset + total) % total;
		onNavigate({ set: activeSet, index: nextIndex });
	};

	// Escape closes, Left/Right cycle, Tab/Shift+Tab stay trapped inside the dialog.
	useEffect(() => {
		if (!isOpen) return undefined;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				event.preventDefault();
				onClose();
				return;
			}
			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				goToOffset(-1);
				return;
			}
			if (event.key === 'ArrowRight') {
				event.preventDefault();
				goToOffset(1);
				return;
			}
			if (event.key === 'Tab' && dialogRef.current) {
				const focusable = Array.from(
					dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
				);
				if (focusable.length === 0) return;
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				if (event.shiftKey && document.activeElement === first) {
					event.preventDefault();
					last.focus();
				} else if (!event.shiftKey && document.activeElement === last) {
					event.preventDefault();
					first.focus();
				}
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, activeSet, activeIndex, total, onClose, onNavigate]);

	// Horizontal swipe cycles on touch devices.
	useEffect(() => {
		const node = dialogRef.current;
		if (!isOpen || !node) return undefined;

		const handleTouchStart = (event: TouchEvent) => {
			const touch = event.touches[0];
			touchStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
		};

		const handleTouchEnd = (event: TouchEvent) => {
			const start = touchStart.current;
			touchStart.current = null;
			if (!start) return;
			const touch = event.changedTouches[0];
			if (!touch) return;
			const deltaX = touch.clientX - start.x;
			const deltaY = touch.clientY - start.y;
			if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) < Math.abs(deltaY)) {
				return;
			}
			goToOffset(deltaX > 0 ? -1 : 1);
		};

		node.addEventListener('touchstart', handleTouchStart);
		node.addEventListener('touchend', handleTouchEnd);
		return () => {
			node.removeEventListener('touchstart', handleTouchStart);
			node.removeEventListener('touchend', handleTouchEnd);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, activeSet, activeIndex, total]);

	// Move focus into the dialog on open; restore it to the trigger on close.
	useEffect(() => {
		if (isOpen) {
			const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
			firstFocusable?.focus();
		} else {
			returnFocusRef.current?.focus();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	// Lock background scroll without shifting layout when the scrollbar disappears.
	useEffect(() => {
		if (!isOpen) return undefined;
		const root = document.documentElement;
		const previousOverflow = document.body.style.overflow;
		const previousGutter = root.style.scrollbarGutter;
		document.body.style.overflow = 'hidden';
		root.style.scrollbarGutter = 'stable';
		return () => {
			document.body.style.overflow = previousOverflow;
			root.style.scrollbarGutter = previousGutter;
		};
	}, [isOpen]);

	// Preload the adjacent images so cycling never flashes an empty frame.
	useEffect(() => {
		preloadSrcs.forEach((src) => {
			if (!src) return;
			const preloadImage = new Image();
			preloadImage.src = src;
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preloadSrcs[0], preloadSrcs[1]]);

	return { dialogRef, goToOffset };
};
