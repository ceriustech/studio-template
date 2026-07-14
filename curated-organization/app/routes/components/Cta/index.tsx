import React from 'react';
import { Link } from 'react-router';
import './cta.css';
import type { CtaProps } from './Cta.types';
import { PAGE_ROUTES_DATA } from '../../constants';

const backgroundImage =
	'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1800&q=80&auto=format';

const Cta: React.FC<CtaProps> = () => {
	const style: React.CSSProperties = {
		backgroundImage: `url(${backgroundImage})`,
	};

	return (
		<section className="cta">
			<div className="ctaBg" style={style} />
			<div className="ctaOverlay" />
			<div className="ctaContent">
				<h2 className="sectionHeading">Ready to transform your space?</h2>
				<p className="ctaSub">
					Your complimentary 30-minute consultation starts here
				</p>
				<Link className="ctaBtn" to={PAGE_ROUTES_DATA.BOOKING.path}>
					Book a consultation
				</Link>
			</div>
		</section>
	);
};

export default Cta;
