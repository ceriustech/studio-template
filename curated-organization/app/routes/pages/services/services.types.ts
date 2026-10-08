import type { PageSeo } from '~/types/global';
import type { AboutProps } from './components/about/About.types';
import type { HeroProps } from './components/hero/Hero.types';
import type { PricingProps } from './components/pricing/Pricing.types';
import type { ServiceEntry } from './components/service/components/ServiceItem/ServiceItem.types';

export type ServicesContent = {
	hero: HeroProps;
	about: AboutProps;
	services: ServiceEntry[];
	pricing: PricingProps;
	// {} when the page has no search & sharing values of its own, or the fetch failed.
	seo: PageSeo;
};
