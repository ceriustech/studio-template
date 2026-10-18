import { useEffect, useState } from 'react';
import { buildMeta, mergeSeo } from '~/lib/seo';
import type { RouteHandle } from '~/types/global';
import type { Route } from './+types/index';
import Hero from './components/hero';
import TwoPaths from './components/two-paths';
import CallInfo from './components/CallInfo/CallInfo';
import Questionnaire from './components/Questionnaire/Questionnaire';
import Calendar from './components/Calendar/Calendar';
import type { Inquiry } from './utils';

export { loader } from './booking.loader.server';

// Root's Layout shows "What to expect" (from this route's loader data) in place of the site CTA.
export const handle: RouteHandle = { hideSiteCta: true };

// Replaces root's meta, so it emits the full set: the Booking page's own values over the root default.
// Undefined root data means the root loader didn't run, matching root's own guard.
export const meta: Route.MetaFunction = ({ loaderData, matches, location }) => {
	const defaults = matches[0]?.loaderData?.seo;
	return defaults ? buildMeta(mergeSeo(defaults, loaderData?.seo), location.pathname) : [];
};

type BookingView = 'none' | 'call' | 'questionnaire' | 'calendar';

const VIEW_SECTION_ID: Record<Exclude<BookingView, 'none'>, string> = {
	call: 'call',
	questionnaire: 'questionnaire',
	calendar: 'calendly',
};

const Booking = ({ loaderData }: Route.ComponentProps) => {
	const { hero, pathCards, callInfo, questionnaire, calendar, calendlyUrl } = loaderData;
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
			<Hero {...hero} />
			<TwoPaths
				cards={pathCards}
				onSelectCall={() => setView('call')}
				onSelectEmail={() => setView('questionnaire')}
				onBookAgain={() => setView('calendar')}
			/>
			{view === 'call' && (
				<CallInfo content={callInfo} onPreferEmail={() => setView('questionnaire')} />
			)}
			{view === 'questionnaire' && (
				<Questionnaire
					content={questionnaire}
					onSubmit={(data) => {
						setInquiry(data);
						setView('calendar');
					}}
				/>
			)}
			{view === 'calendar' && (
				<Calendar content={calendar} calendlyUrl={calendlyUrl} inquiry={inquiry} onScheduled={() => {}} />
			)}
		</main>
	);
};

export default Booking;
