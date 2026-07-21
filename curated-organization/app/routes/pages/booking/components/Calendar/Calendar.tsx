import { Component, type ReactNode } from 'react';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import './calendar.css';
import type { CalendarProps } from './Calendar.types';
import {
	SERVICE_LABELS,
	INVESTMENT_LABELS,
	DECISION_LABELS,
	REFERRAL_LABELS,
} from '../../utils';

const CALENDLY_URL = 'https://calendly.com/lifengineered-bilalmasters/30min';

class CalendlyErrorBoundary extends Component<
	{ children: ReactNode },
	{ hasError: boolean }
> {
	state = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="calendlyEmbed">
					<div className="calendlyIcon">📅</div>
					<div className="calendlyEmbedTitle">Calendly scheduling widget</div>
					<p className="calendlyEmbedDesc">
						Embedded inline. Visitor selects a 30-minute consultation slot.
						Styled to match site colors as closely as Calendly allows.
					</p>
				</div>
			);
		}

		return this.props.children;
	}
}

const Calendar = ({ inquiry, onScheduled }: CalendarProps) => {
	useCalendlyEventListener({ onEventScheduled: onScheduled });

	const prefill = inquiry
		? {
				name: `${inquiry.firstName} ${inquiry.lastName}`.trim(),
				email: inquiry.email,
				customAnswers: {
					a1: inquiry.service ? SERVICE_LABELS[inquiry.service] : '',
					a2: inquiry.deadline ?? '',
					a3: inquiry.investmentTarget
						? INVESTMENT_LABELS[inquiry.investmentTarget]
						: '',
					a4: inquiry.decisionMakersReady
						? DECISION_LABELS[inquiry.decisionMakersReady]
						: '',
					a5: inquiry.referral ? REFERRAL_LABELS[inquiry.referral] : '',
					a6: [
						inquiry.phone && `Phone: ${inquiry.phone}`,
						inquiry.location && `Location: ${inquiry.location}`,
						inquiry.notes && `Notes: ${inquiry.notes}`,
					]
						.filter(Boolean)
						.join('\n'),
				},
			}
		: undefined;

	return (
		<section className="calendarSection" id="calendly">
			<p className="sectionEyebrow">Select a time</p>
			<h2 className="sectionHeading">Choose your consultation slot</h2>
			<CalendlyErrorBoundary>
				<InlineWidget
					url={CALENDLY_URL}
					styles={{ minWidth: '320px', height: '700px' }}
					prefill={prefill}
					pageSettings={{
						backgroundColor: 'fdfbf7',
						primaryColor: '2c2c2a',
						textColor: '2c2c2a',
						hideEventTypeDetails: false,
						hideGdprBanner: true,
					}}
				/>
			</CalendlyErrorBoundary>
		</section>
	);
};

export default Calendar;
