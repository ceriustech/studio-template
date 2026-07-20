import type { ReactNode } from 'react';
import type { PortfolioPiece as PortfolioPieceEntity } from '../../../../gallery.types';

export type PortfolioPieceProps = {
	piece: PortfolioPieceEntity;
	/** Section-carousel prev/counter/next controls, rendered beside the title. Only `CategorySection` supplies this. */
	headerControls?: ReactNode;
	/** "View all" link, baseline-aligned with the description. Only `CategorySection` supplies this. */
	footer?: ReactNode;
};
