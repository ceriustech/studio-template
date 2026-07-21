import type { Inquiry } from '../../utils';

export interface CalendarProps {
	inquiry: Inquiry;
	onScheduled: () => void;
}
