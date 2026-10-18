import type { CalendarContent } from '../../booking.types';
import type { Inquiry } from '../../utils';

export interface CalendarProps {
	content: CalendarContent;
	calendlyUrl: string | null;
	inquiry: Inquiry | null;
	onScheduled: () => void;
}
