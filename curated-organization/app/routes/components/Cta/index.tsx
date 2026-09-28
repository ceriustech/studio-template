import React from 'react';
import { Link } from 'react-router';
import './cta.css';
import type { CtaProps } from './Cta.types';

const Cta: React.FC<CtaProps> = ({ background, heading, subheading, buttonLabel, buttonHref }) => {
	const style: React.CSSProperties = {
		backgroundImage: `url(${background.src})`,
		backgroundPosition: background.position,
	};

	return (
		<section className="cta">
			<div className="ctaBg" style={style} />
			<div className="ctaOverlay" />
			<div className="ctaContent">
				<h2 className="sectionHeading">{heading}</h2>
				{subheading && <p className="ctaSub">{subheading}</p>}
				<Link className="ctaBtn" to={buttonHref}>
					{buttonLabel}
				</Link>
			</div>
		</section>
	);
};

export default Cta;
