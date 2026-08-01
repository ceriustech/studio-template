import React from 'react';
import { Link } from 'react-router';
import './footer.css';
import type { FooterProps } from './Footer.types';
import { PAGE_ROUTES_DATA } from '../../constants';
import napoCircularLogo from '~/assets/napo-circular-logo.png';
import napoTitleLogo from '~/assets/napo-title-logo.png';

const Footer: React.FC<FooterProps> = () => {
	return (
		<footer className="footer">
			<div className="footerGrid">
				<div>
					<div className="footerBrandName">CURATED</div>
					<p className="footerBrandDesc">
						Your home curated to your lifestyle - because time is your biggest
						luxury.
						<br />
						Serving the NOVA / DMV area.
					</p>
					<div className="footerLogos">
						<img
							src={napoCircularLogo}
							alt="The Board of Certification for Professional Organizers"
							width={32}
							height={32}
						/>
						<img
							src={napoTitleLogo}
							alt="NAPO — National Association of Productivity and Organizing Professionals member"
							width={64}
							height={32}
						/>
					</div>
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
