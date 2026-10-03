import { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import Hero from './components/hero';
import TwoPaths from './components/two-paths';
import CallInfo from './components/CallInfo/CallInfo';
import Questionnaire from './components/Questionnaire/Questionnaire';
import Calendar from './components/Calendar/Calendar';
import type { Inquiry } from './utils';
import type { RouteHandle } from '~/types/global';

export const handle: RouteHandle = { hideSiteCta: true };

// Runs on the server only, so the browser never reads process.env.
export function loader() {
	return { calendlyUrl: process.env.CALENDLY_URL || null };
}

type BookingView = 'none' | 'call' | 'questionnaire' | 'calendar';

const VIEW_SECTION_ID: Record<Exclude<BookingView, 'none'>, string> = {
	call: 'call',
	questionnaire: 'questionnaire',
	calendar: 'calendly',
};

const Booking = () => {
	const { calendlyUrl } = useLoaderData<typeof loader>();
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
				<Calendar calendlyUrl={calendlyUrl} inquiry={inquiry} onScheduled={() => {}} />
			)}
		</main>
	);
};

export default Booking;
