import type { ShouldRevalidateFunctionArgs } from 'react-router';
import { buildMeta, mergeSeo } from '~/lib/seo';
import type { Route } from './+types/index';
import Hero from './components/hero';
import FilterBar from './components/filter-bar';
import Projects from './components/projects';

export { loader } from './gallery.loader.server';

// Filters and pagination only change search params; the content is already loaded.
export function shouldRevalidate({
	currentUrl,
	nextUrl,
	formMethod,
	defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
	if (!formMethod && currentUrl.pathname === nextUrl.pathname) return false;
	return defaultShouldRevalidate;
}

// Replaces root's meta, so it emits the full set: the Gallery page's own values over the root default.
// Undefined root data means the root loader didn't run, matching root's own guard.
export const meta: Route.MetaFunction = ({ loaderData, matches, location }) => {
	const defaults = matches[0]?.loaderData?.seo;
	return defaults ? buildMeta(mergeSeo(defaults, loaderData?.seo), location.pathname) : [];
};

export default function Gallery({ loaderData }: Route.ComponentProps) {
	return (
		<main>
			<Hero {...loaderData.hero} />
			<FilterBar />
			<Projects pieces={loaderData.pieces} />
		</main>
	);
}
