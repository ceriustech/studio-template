import type { PageSeo } from '~/types/global';
import type { BeforeAfterProps } from './components/BeforeAfter/BeforeAfter.types';
import type { HeroProps } from './components/hero/Hero.types';
import type { IntroProps } from './components/Intro/Intro.types';
import type { ProcessProps } from './components/Process/Process.types';
import type { ServicesProps } from './components/Services/Services.types';
import type { TestimonialItem } from './components/Testimonial/Testimonial.types';

export type HomeContent = {
	hero: HeroProps;
	intro: IntroProps;
	services: ServicesProps;
	process: ProcessProps;
	beforeAfter: BeforeAfterProps;
	testimonials: TestimonialItem[];
	// {} when the page has no search & sharing values of its own, or the fetch failed.
	seo: PageSeo;
};
