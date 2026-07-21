import { useState } from 'react';
import Hero from './components/hero';
import TwoPaths from './components/two-paths';
import Questionnaire from './components/Questionnaire/Questionnaire';
import Calendar from './components/Calendar/Calendar';
import type { Inquiry } from './utils';

const Booking = () => {
	const [inquiry, setInquiry] = useState<Inquiry | null>(null);
	const [showCalendar, setShowCalendar] = useState(false);

	return (
		<main>
			<Hero />
			<TwoPaths onBookAgain={() => setShowCalendar(true)} />
			{inquiry || showCalendar ? (
				<Calendar inquiry={inquiry} onScheduled={() => {}} />
			) : (
				<Questionnaire onSubmit={setInquiry} />
			)}
		</main>
	);
};

export default Booking;
