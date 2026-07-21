import type { Inquiry } from '../../utils';

export interface QuestionnaireProps {
	onSubmit: (inquiry: Inquiry) => void;
}
