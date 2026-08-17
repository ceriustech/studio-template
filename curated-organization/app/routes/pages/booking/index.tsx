import { useEffect, useState } from 'react';
import Hero from './components/hero';
import TwoPaths from './components/two-paths';
import CallInfo from './components/CallInfo/CallInfo';
import Questionnaire from './components/Questionnaire/Questionnaire';
import Calendar from './components/Calendar/Calendar';
import type { Inquiry } from './utils';

type BookingView = 'none' | 'call' | 'questionnaire' | 'calendar';

const VIEW_SECTION_ID: Record<Exclude<BookingView, 'none'>, string> = {
	call: 'call',
	questionnaire: 'questionnaire',
	calendar: 'calendly',
};

const Booking = () => {
	const [view, setView] = useState<BookingView>('none');
	const [inquiry, setInquiry] = useState<Inquiry | null>(null);

	useEffect(() => {
		if (view === 'none') return;

		document
			.getElementById(VIEW_SECTION_ID[view])
			?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, [view]);

	return (
		<main>
			<Hero />
			<TwoPaths
				onSelectCall={() => setView('call')}
				onSelectEmail={() => setView('questionnaire')}
				onBookAgain={() => setView('calendar')}
			/>
			{view === 'call' && (
				<CallInfo onPreferEmail={() => setView('questionnaire')} />
			)}
			{view === 'questionnaire' && (
				<Questionnaire
					onSubmit={(data) => {
						setInquiry(data);
						setView('calendar');
					}}
				/>
			)}
			{view === 'calendar' && (
				<Calendar inquiry={inquiry} onScheduled={() => {}} />
			)}
		</main>
	);
};

export default Booking;
