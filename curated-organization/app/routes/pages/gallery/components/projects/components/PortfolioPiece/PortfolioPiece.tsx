import { useRef, useState } from 'react';
import VideoPair from './components/VideoPair/VideoPair';
import DetailImageCarousel from './components/DetailImageCarousel/DetailImageCarousel';
import Lightbox from './components/Lightbox/Lightbox';
import type { LightboxTarget } from './components/Lightbox/Lightbox.types';
import { getCategoryLabel } from '../../../../utils';
import type { PortfolioPieceProps } from './PortfolioPiece.types';
import './portfolioPiece.css';

const PortfolioPiece = ({ piece, headerControls, footer }: PortfolioPieceProps) => {
	const [open, setOpen] = useState<LightboxTarget | null>(null);
	const returnFocusRef = useRef<HTMLElement | null>(null);

	const openLightbox = (target: LightboxTarget) => {
		returnFocusRef.current = document.activeElement as HTMLElement | null;
		setOpen(target);
	};

	return (
		<article className="project">
			<div className="projectHeader">
				<div className="projectTitleGroup">
					<h3 className="projectTitle" title={piece.title}>
						{piece.title}
					</h3>
					{headerControls}
				</div>
				<div className="projectMeta">
					<span className="projectTag">{getCategoryLabel(piece.category)}</span>
					<span className="projectLocation">{piece.location}</span>
				</div>
			</div>
			<VideoPair
				videos={piece.videos}
				onOpenVideo={(index) => openLightbox({ set: 'video', index })}
			/>
			<DetailImageCarousel
				images={piece.images}
				onOpenImage={(index) => openLightbox({ set: 'image', index })}
			/>
			<div className="projectFooter">
				<p className="projectCaption">{piece.description}</p>
				{footer}
			</div>
			<Lightbox
				videos={piece.videos}
				images={piece.images}
				open={open}
				onClose={() => setOpen(null)}
				onNavigate={setOpen}
				returnFocusRef={returnFocusRef}
			/>
		</article>
	);
};

export default PortfolioPiece;
