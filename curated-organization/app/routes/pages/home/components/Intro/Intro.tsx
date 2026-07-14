import React from 'react';
import { Link } from 'react-router';
import './intro.css';

const Intro: React.FC = () => {
	const eyebrow = 'Our approach';
	const heading = 'Functional Luxury';
	const body =
		'We believe an organized home is a form of self-care. Our approach merges refined aesthetics with practical systems — spaces that look beautiful and work effortlessly for the way you actually live.';
	const linkText = 'Learn more about us →';
	const linkHref = '/about';

	return (
		<section className="intro">
			<div className="introInner">
				<p className="sectionEyebrow">{eyebrow}</p>
				<h2 className="sectionHeading">{heading}</h2>
				<p className="introText">{body}</p>
				<Link className="textLink" to={linkHref}>
					{linkText}
				</Link>
			</div>
		</section>
	);
};

export default Intro;
