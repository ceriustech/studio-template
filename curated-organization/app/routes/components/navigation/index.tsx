import React from 'react';
import { Link, useLocation } from 'react-router';
import { NAVBAR_DATA } from '../../../constants';
import type { NavigationProps } from './navigation.types';

const Navigation: React.FC<NavigationProps> = ({ items = NAVBAR_DATA }) => {
	const location = useLocation();

	const isActive = (url: string) => {
		if (url === '/') return location.pathname === '/';
		return location.pathname.startsWith(url);
	};

	return (
		<header className="nav" role="navigation" aria-label="Primary">
			<div className="navBrand">
				<div className="navBrandName">
					<Link to="/" aria-label="Curated Professional Organizing">
						CURATED
					</Link>
				</div>
				<div className="navBrandTagline">Professional Organizing</div>
			</div>

			<nav className="navLinks" aria-label="Main links">
				{items
					.filter((item) => item.url !== '/booking')
					.map((item) => (
						<Link
							key={item.url}
							to={item.url}
							className={isActive(item.url) ? 'active' : undefined}
							aria-current={isActive(item.url) ? 'page' : undefined}
						>
							{item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}
						</Link>
					))}
				<Link to="/booking" className="navCta" aria-label="Book now">
					Book now
				</Link>
			</nav>
		</header>
	);
};

export default Navigation;
