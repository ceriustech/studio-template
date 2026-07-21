import React from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { NAVBAR_DATA, QUERIES } from '../../../constants';
import type { NavigationProps } from './navigation.types';

const MOBILE_MENU_ID = 'mobile-nav-menu';

const Navigation: React.FC<NavigationProps> = ({ items = NAVBAR_DATA }) => {
	const location = useLocation();
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const navRef = React.useRef<HTMLElement>(null);
	const toggleRef = React.useRef<HTMLButtonElement>(null);

	const isActive = (url: string) => {
		if (url === '/') return location.pathname === '/';
		return location.pathname.startsWith(url);
	};

	const closeMenu = () => setIsMenuOpen(false);

	// Close on route change — covers link selection and browser back/forward.
	React.useEffect(() => {
		setIsMenuOpen(false);
	}, [location.pathname]);

	// Close if the viewport crosses from mobile into desktop/tablet width.
	React.useEffect(() => {
		const mediaQuery = window.matchMedia(QUERIES.minTablet);
		const handleChange = (event: MediaQueryListEvent) => {
			if (event.matches) setIsMenuOpen(false);
		};
		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, []);

	// Close on a tap/click outside the menu or toggle while open.
	React.useEffect(() => {
		if (!isMenuOpen) return;

		const handlePointerDown = (event: MouseEvent | TouchEvent) => {
			const target = event.target as Node;
			if (navRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
			setIsMenuOpen(false);
		};

		document.addEventListener('mousedown', handlePointerDown);
		document.addEventListener('touchstart', handlePointerDown);
		return () => {
			document.removeEventListener('mousedown', handlePointerDown);
			document.removeEventListener('touchstart', handlePointerDown);
		};
	}, [isMenuOpen]);

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

			<button
				ref={toggleRef}
				type="button"
				className="navToggle"
				aria-expanded={isMenuOpen}
				aria-controls={MOBILE_MENU_ID}
				aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
				onClick={() => setIsMenuOpen((open) => !open)}
			>
				{isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
			</button>

			<nav
				id={MOBILE_MENU_ID}
				ref={navRef}
				className="navLinks"
				aria-label="Main links"
				data-open={isMenuOpen}
			>
				{items
					.filter((item) => item.url !== '/booking')
					.map((item) => (
						<Link
							key={item.url}
							to={item.url}
							className={isActive(item.url) ? 'active' : undefined}
							aria-current={isActive(item.url) ? 'page' : undefined}
							onClick={closeMenu}
						>
							{item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}
						</Link>
					))}
				<Link to="/booking" className="navCta" aria-label="Book now" onClick={closeMenu}>
					Book now
				</Link>
			</nav>
		</header>
	);
};

export default Navigation;
