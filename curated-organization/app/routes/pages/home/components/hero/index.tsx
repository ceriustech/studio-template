import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { HeroProps } from './Hero.types';
import './hero.css';

const SLIDE_INTERVAL_MS = 10000;

const Hero: React.FC<HeroProps> = ({ eyebrow, heading, body, link, slides }) => {
	const [activeSlide, setActiveSlide] = useState(0);
	const slideCount = slides.length;

	useEffect(() => {
		if (slideCount < 2) return;

		const timer = setInterval(() => {
			setActiveSlide((current) => (current + 1) % slideCount);
		}, SLIDE_INTERVAL_MS);

		return () => clearInterval(timer);
	}, [slideCount]);

	return (
		<section className="hero" aria-labelledby="hero-headline">
			{slides.map((slide, index) => {
				const isActive = index === activeSlide % slideCount;
				// Only the visible slide is exposed to assistive tech, and only when it has alt text.
				const a11y =
					isActive && slide.alt
						? { role: 'img', 'aria-label': slide.alt }
						: { 'aria-hidden': true };

				return (
					<div
						key={slide.src}
						className={isActive ? 'heroSlide heroSlideActive' : 'heroSlide'}
						style={{
							backgroundImage: `url(${slide.src})`,
							backgroundPosition: slide.position,
						}}
						{...a11y}
					/>
				);
			})}
			<div className="heroOverlay" />
			<div className="heroContent">
				{eyebrow && <div className="heroStrapline">{eyebrow}</div>}
				<h1 id="hero-headline" className="heroHeadline">
					{heading}
				</h1>
				{body && <div className="heroDescriptor">{body}</div>}
				{link && (
					<Link className="heroCta" to={link.url}>
						{link.label}
					</Link>
				)}
			</div>
			<div className="heroScroll"></div>
		</section>
	);
};

export default Hero;
