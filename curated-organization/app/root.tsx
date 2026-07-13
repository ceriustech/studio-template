import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from 'react-router';

import type { Route } from './+types/root';
import Navigation from './routes/components/navigation';
import './app.css';

const META_DATA = [
	{ httpEquiv: 'Content-type', content: 'text/html; charset=utf-8' },
	{
		name: 'viewport',
		content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0',
	},
	{ title: 'Curated Organization' },
	{ name: 'description', content: 'Professional organizing services' },
	{
		name: 'keywords',
		content:
			'curated organization, professional organizing, home organization, office organization, home office organization, decluttering, space optimization, time management, productivity, efficiency, organization tips, organization services, organization solutions, organization strategies, organization techniques, organization tools, organization resources, organization guides, organization checklists, organization templates, organization apps, organization software, organization systems, organization methods, organization principles, organization best practices',
	},
	{ property: 'og:url', content: 'https://curatedorganization.com' },
	{ property: 'og:title', content: 'Curated Organization' },
	{ property: 'og:description', content: 'Professional organizing services' },
];

export const meta: Route.MetaFunction = () => META_DATA;

export const links: Route.LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500&display=swap',
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Navigation />
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error';
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
