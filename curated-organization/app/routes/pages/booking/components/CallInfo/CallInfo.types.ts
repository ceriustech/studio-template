import type { CallInfoContent } from '../../booking.types';

export interface CallInfoProps {
	content: CallInfoContent;
	onPreferEmail: () => void;
}
