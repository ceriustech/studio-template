import React from 'react';
import Hero from './components/hero';
import Intro from './components/Intro/Intro';
import Services from './components/Services/Services';
import Process from './components/Process/Process';
import BeforeAfter from './components/BeforeAfter/BeforeAfter';
import Testimonial from './components/Testimonial/Testimonial';

const Home: React.FC = () => {
	return (
		<main>
			<Hero />
			<Intro />
			<Services />
			<BeforeAfter />
			<Process />
			<Testimonial />
		</main>
	);
};

export default Home;
