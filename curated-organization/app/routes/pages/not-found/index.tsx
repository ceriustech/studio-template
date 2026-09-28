import { data } from 'react-router';
import type { Route } from './+types/index';

// A matched catch-all (instead of an unmatched URL) makes the root loader run,
// so the 404 page keeps the CMS-driven header and footer.
export async function loader() {
	return data(null, { status: 404 });
}

export const meta: Route.MetaFunction = () => [
	{ title: 'Page not found | Curated Organization' },
	{ name: 'robots', content: 'noindex' },
];

export default function NotFound() {
	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>404</h1>
			<p>The requested page could not be found.</p>
		</main>
	);
}
