import type { Inquiry } from '../../utils';

export interface CalendarProps {
	inquiry: Inquiry | null;
	onScheduled: () => void;
}
