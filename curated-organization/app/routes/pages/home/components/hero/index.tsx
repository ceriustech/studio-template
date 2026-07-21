import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import './hero.css';

const SLIDE_IMAGES = [
	'https://images.unsplash.com/photo-1649361811423-a55616f7ab11?w=1800&q=80&auto=format',
	'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&q=80&auto=format',
	'https://images.unsplash.com/photo-1618236444721-4a8dba415c15?w=900&q=80&auto=format',
];

const SLIDE_INTERVAL_MS = 10000;

const Hero: React.FC = () => {
	const strapline = 'THE SANCTUARY OF SIMPLICITY';
	const headline = 'CURATED';
	const descriptor =
		'Your home curated to your lifestyle - because time is your biggest luxury';
	const ctaLabel = 'DISCOVER YOUR SPACE';
	const ctaUrl = '/booking';

	const [activeSlide, setActiveSlide] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setActiveSlide((current) => (current + 1) % SLIDE_IMAGES.length);
		}, SLIDE_INTERVAL_MS);

		return () => clearInterval(timer);
	}, []);

	return (
		<section className="hero" aria-labelledby="hero-headline">
			{SLIDE_IMAGES.map((image, index) => (
				<div
					key={image}
					className={
						index === activeSlide ? 'heroSlide heroSlideActive' : 'heroSlide'
					}
					style={{ backgroundImage: `url(${image})` }}
					aria-hidden="true"
				/>
			))}
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
