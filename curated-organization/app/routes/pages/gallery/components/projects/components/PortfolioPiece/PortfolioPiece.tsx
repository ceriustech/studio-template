import VideoPair from './components/VideoPair/VideoPair';
import DetailImageCarousel from './components/DetailImageCarousel/DetailImageCarousel';
import { getCategoryLabel } from '../../../../utils';
import type { PortfolioPieceProps } from './PortfolioPiece.types';
import './portfolioPiece.css';

const PortfolioPiece = ({ piece, headerControls, footer }: PortfolioPieceProps) => {
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
			<VideoPair before={piece.beforeMedia} after={piece.afterMedia} />
			<DetailImageCarousel images={piece.detailImages} />
			<div className="projectFooter">
				<p className="projectCaption">{piece.description}</p>
				{footer}
			</div>
		</article>
	);
};

export default PortfolioPiece;
