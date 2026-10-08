import React from 'react';
import { Link } from 'react-router';
import type { IntroProps } from './Intro.types';
import './intro.css';

const Intro: React.FC<IntroProps> = ({ eyebrow, heading, body, link }) => {
	return (
		<section className="intro">
			<div className="introInner">
				{eyebrow && <p className="sectionEyebrow">{eyebrow}</p>}
				<h2 className="sectionHeading">{heading}</h2>
				{body && <p className="introText">{body}</p>}
				{link && (
					<Link className="textLink" to={link.url}>
						{link.label} <span aria-hidden="true">→</span>
					</Link>
				)}
			</div>
		</section>
	);
};

export default Intro;
