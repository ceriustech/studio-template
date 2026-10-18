import { Component, type ReactNode } from 'react';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import './calendar.css';
import type { CalendarProps } from './Calendar.types';
import type { CalendarUnavailableContent } from '../../booking.types';

const CalendlyUnavailable = ({ icon, title, description }: CalendarUnavailableContent) => (
	<div className="calendlyEmbed">
		{icon && <div className="calendlyIcon">{icon}</div>}
		<div className="calendlyEmbedTitle">{title}</div>
		{description && <p className="calendlyEmbedDesc">{description}</p>}
	</div>
);

class CalendlyErrorBoundary extends Component<
	{ children: ReactNode; unavailable: CalendarUnavailableContent },
	{ hasError: boolean }
> {
	state = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) return <CalendlyUnavailable {...this.props.unavailable} />;

		return this.props.children;
	}
}

const Calendar = ({ content, calendlyUrl, inquiry, onScheduled }: CalendarProps) => {
	useCalendlyEventListener({ onEventScheduled: onScheduled });

	const prefill = inquiry
		? {
				name: `${inquiry.firstName} ${inquiry.lastName}`.trim(),
				email: inquiry.email,
				customAnswers: {
					a1: inquiry.phone ? `Phone: ${inquiry.phone}` : '',
					a2: inquiry.notes ?? '',
				},
			}
		: undefined;

	return (
		<section className="calendarSection" id="calendly">
			{content.eyebrow && <p className="sectionEyebrow">{content.eyebrow}</p>}
			<h2 className="sectionHeading">{content.heading}</h2>
			{calendlyUrl ? (
				<CalendlyErrorBoundary unavailable={content.unavailable}>
					<InlineWidget
						url={calendlyUrl}
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
			) : (
				<CalendlyUnavailable {...content.unavailable} />
			)}
		</section>
	);
};

export default Calendar;
