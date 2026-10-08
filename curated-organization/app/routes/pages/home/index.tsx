import { buildMeta, mergeSeo } from '~/lib/seo';
import type { Route } from './+types/index';
import Hero from './components/hero';
import Intro from './components/Intro/Intro';
import Services from './components/Services/Services';
import Process from './components/Process/Process';
import BeforeAfter from './components/BeforeAfter/BeforeAfter';
import Testimonial from './components/Testimonial/Testimonial';

export { loader } from './home.loader.server';

// Replaces root's meta, so it emits the full set: Home's own values over the root default.
// Undefined root data means the root loader didn't run, matching root's own guard.
export const meta: Route.MetaFunction = ({ loaderData, matches, location }) => {
	const defaults = matches[0]?.loaderData?.seo;
	return defaults ? buildMeta(mergeSeo(defaults, loaderData?.seo), location.pathname) : [];
};

export default function Home({ loaderData }: Route.ComponentProps) {
	return (
		<main>
			<Hero {...loaderData.hero} />
			<Intro {...loaderData.intro} />
			<Services {...loaderData.services} />
			<Process {...loaderData.process} />
			<BeforeAfter {...loaderData.beforeAfter} />
			<Testimonial items={loaderData.testimonials} />
		</main>
	);
}
