import type { Inquiry } from '../../utils';

export interface CalendarProps {
	calendlyUrl: string | null;
	inquiry: Inquiry | null;
	onScheduled: () => void;
}
