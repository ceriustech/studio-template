import './hero.css';
import type { HeroProps } from './Hero.types';

const Hero = ({ eyebrow, heading, body }: HeroProps) => {
	return (
		<section className="bookingHero">
			{eyebrow && <p className="sectionEyebrow">{eyebrow}</p>}
			<h1>{heading}</h1>
			{body && <p>{body}</p>}
		</section>
	);
};

export default Hero;
