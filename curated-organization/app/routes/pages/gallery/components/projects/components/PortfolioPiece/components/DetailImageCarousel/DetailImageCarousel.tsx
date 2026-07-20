import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DetailImageCarouselProps } from './DetailImageCarousel.types';
import './detailImageCarousel.css';

const WINDOW_SIZE = 3;

const DetailImageCarousel = ({ images }: DetailImageCarouselProps) => {
	const [startIndex, setStartIndex] = useState(0);
	const total = images.length;

	if (total === 0) return null;

	const canScroll = total > WINDOW_SIZE;
	const maxStartIndex = Math.max(total - WINDOW_SIZE, 0);
	const visibleImages = images.slice(startIndex, startIndex + WINDOW_SIZE);

	return (
		<div className="detailCarousel">
			{canScroll && (
				<button
					type="button"
					className="detailNav detailNavPrev"
					aria-label="Previous detail image"
					disabled={startIndex === 0}
					onClick={() => setStartIndex((current) => Math.max(current - 1, 0))}
				>
					<ChevronLeft aria-hidden="true" size={18} />
				</button>
			)}
			<div className="detailGrid">
				{visibleImages.map((image) => (
					<div
						key={image.src}
						className="detailCell"
						style={{ backgroundImage: `url('${image.src}')` }}
					>
						<img className="srOnly" src={image.src} alt={image.alt} />
					</div>
				))}
			</div>
			{canScroll && (
				<button
					type="button"
					className="detailNav detailNavNext"
					aria-label="Next detail image"
					disabled={startIndex >= maxStartIndex}
					onClick={() =>
						setStartIndex((current) => Math.min(current + 1, maxStartIndex))
					}
				>
					<ChevronRight aria-hidden="true" size={18} />
				</button>
			)}
		</div>
	);
};

export default DetailImageCarousel;
