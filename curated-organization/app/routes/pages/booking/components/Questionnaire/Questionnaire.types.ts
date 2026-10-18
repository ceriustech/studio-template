import type { QuestionnaireContent } from '../../booking.types';
import type { Inquiry } from '../../utils';

export interface QuestionnaireProps {
	content: QuestionnaireContent;
	onSubmit: (inquiry: Inquiry) => void;
}
