import { buildMeta, mergeSeo } from '~/lib/seo';
import type { Route } from './+types/index';
import Hero from './components/hero';
import About from './components/about';
import Service from './components/service';
import Pricing from './components/pricing';

export { loader } from './services.loader.server';

// Replaces root's meta, so it emits the full set: the Services page's own values over the root default.
// Undefined root data means the root loader didn't run, matching root's own guard.
export const meta: Route.MetaFunction = ({ loaderData, matches, location }) => {
	const defaults = matches[0]?.loaderData?.seo;
	return defaults ? buildMeta(mergeSeo(defaults, loaderData?.seo), location.pathname) : [];
};

export default function Services({ loaderData }: Route.ComponentProps) {
	return (
		<main>
			<Hero {...loaderData.hero} />
			<About {...loaderData.about} />
			<Service items={loaderData.services} />
			<Pricing {...loaderData.pricing} />
		</main>
	);
}
