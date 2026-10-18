import type { PathCardContent } from '../../booking.types';

export interface TwoPathsProps {
	cards: PathCardContent[];
	onSelectCall: () => void;
	onSelectEmail: () => void;
	onBookAgain: () => void;
}
