import React from 'react';
import { Link } from 'react-router';
import './footer.css';
import type { FooterLinkProps, FooterProps } from './Footer.types';
import { isInternalUrl } from '~/lib/utils';

const FooterLink = ({ link }: FooterLinkProps) =>
	isInternalUrl(link.url) ? <Link to={link.url}>{link.label}</Link> : <a href={link.url}>{link.label}</a>;

const Footer: React.FC<FooterProps> = ({ brandName, content, navLinks }) => {
	const descriptionLines = content.description?.split('\n') ?? [];

	return (
		<footer className="footer">
			<div className="footerGrid">
				<div>
					<div className="footerBrandName">{brandName}</div>
					{descriptionLines.length > 0 && (
						<p className="footerBrandDesc">
							{descriptionLines.map((line, index) => (
								<React.Fragment key={index}>
									{index > 0 && <br />}
									{line}
								</React.Fragment>
							))}
						</p>
					)}
					<div className="footerLogos">
						{content.logos.map((logo) => (
							<img key={logo.src} src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />
						))}
					</div>
				</div>
				<div>
					<h3 className="footerHeading">Navigate</h3>
					<ul className="footerLinks">
						{navLinks.map((link) => (
							<li key={link.url}>
								<FooterLink link={link} />
							</li>
						))}
					</ul>
				</div>
				{content.connectLinks.length > 0 && (
					<div>
						<h3 className="footerHeading">Connect</h3>
						<ul className="footerLinks">
							{content.connectLinks.map((link) => (
								<li key={link.url}>
									<FooterLink link={link} />
								</li>
							))}
						</ul>
					</div>
				)}
				<div>
					<h3 className="footerHeading">Hours</h3>
					<ul className="footerLinks">
						{content.hours.map((line) => (
							<li key={line.label}>
								<span>
									{line.label}: {line.value}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="footerDivider" />
			<div className="footerBottom">
				{content.copyright && <span>{content.copyright}</span>}
				{content.socialLinks.length > 0 && (
					<div className="footerSocial">
						{content.socialLinks.map((link) => (
							<FooterLink key={link.url} link={link} />
						))}
					</div>
				)}
			</div>
		</footer>
	);
};

export default Footer;
