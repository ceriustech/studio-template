import React from 'react';
import { Link } from 'react-router';
import './footer.css';
import type { FooterProps } from './Footer.types';
import { PAGE_ROUTES_DATA } from '../../constants';

const Footer: React.FC<FooterProps> = () => {
	return (
		<footer className="footer">
			<div className="footerGrid">
				<div>
					<div className="footerBrandName">CURATED</div>
					<p className="footerBrandDesc">
						Professional organizing for the discerning home.
						<br />
						Serving the NOVA / DMV area.
					</p>
				</div>
				<div>
					<h3 className="footerHeading">Navigate</h3>
					<ul className="footerLinks">
						<li>
							<Link to={PAGE_ROUTES_DATA.SERVICES.path}>Services</Link>
						</li>
						<li>
							<Link to={PAGE_ROUTES_DATA.GALLERY.path}>Gallery</Link>
						</li>
						<li>
							<Link to={PAGE_ROUTES_DATA.BOOKING.path}>Book</Link>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="footerHeading">Connect</h3>
					<ul className="footerLinks">
						<li>
							<a href="#">Email</a>
						</li>
						<li>
							<a href="#">Phone</a>
						</li>
						<li>
							<a href="#">Instagram</a>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="footerHeading">Hours</h3>
					<ul className="footerLinks">
						<li>
							<a href="#">Mon – Fri: 9am – 5pm</a>
						</li>
						<li>
							<a href="#">Sat: By appointment</a>
						</li>
						<li>
							<a href="#">Sun: Closed</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="footerDivider" />
			<div className="footerBottom">
				<span>© 2026 Curated Organization. All rights reserved.</span>
				<div className="footerSocial">
					<a href="#">Instagram</a>
					<a href="#">Facebook</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
