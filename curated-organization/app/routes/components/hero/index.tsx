import React from 'react';
import { Link } from 'react-router';
import './hero.css';

const Hero: React.FC = () => {
	const strapline = 'THE SANCTUARY OF SIMPLICITY';
	const headline = 'CURATED';
	const descriptor = 'Professional organizing for the discerning home';
	const ctaLabel = 'DISCOVER YOUR SPACE';
	const ctaUrl = '/services';
	const backgroundImage =
		'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=1800&q=80&auto=format';

	const style: React.CSSProperties = {
		backgroundImage: `url(${backgroundImage})`,
	};

	return (
		<section className="hero" style={style} aria-labelledby="hero-heading">
			<div className="heroOverlay" />
			<div className="heroContent">
				<div className="heroStrapline">{strapline}</div>
				<h1 id="hero-headline" className="heroHeadline">
					{headline}
				</h1>
				<div className="heroDescriptor">{descriptor}</div>
				<Link className="heroCta" to={ctaUrl}>
					{ctaLabel}
				</Link>
			</div>
			<div className="heroScroll"></div>
		</section>
	);
};

export default Hero;
