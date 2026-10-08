import React from 'react';
import './hero.css';
import type { HeroProps } from './Hero.types';

const Hero: React.FC<HeroProps> = ({ eyebrow, heading, body }) => {
	return (
		<section className="servicesHero">
			{eyebrow && <p className="sectionEyebrow">{eyebrow}</p>}
			<h1>{heading}</h1>
			{body && <p>{body}</p>}
		</section>
	);
};

export default Hero;
