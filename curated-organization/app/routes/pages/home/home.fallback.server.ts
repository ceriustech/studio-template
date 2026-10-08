import heroSlide1 from '~/assets/home_hero_slide_img_1.avif';
import heroSlide2 from '~/assets/home_hero_slide_img_2.avif';
import heroSlide3 from '~/assets/home_hero_slide_img_3.avif';
import servicesImg1 from '~/assets/home_services_img_1.avif';
import servicesImg2 from '~/assets/home_services_img_2.avif';
import servicesImg3 from '~/assets/home_services_img_3.avif';
import beforeImg from '~/assets/home_beforeandafter_img_1.avif';
import afterImg from '~/assets/home_beforeandafter_img_2.avif';
import type { HomeContent } from './home.types';

const CENTER = '50% 50%';

// Today's hardcoded Home copy. Link arrows are rendered by the components, so labels omit them.
export const FALLBACK_HOME_CONTENT: HomeContent = {
	hero: {
		eyebrow: 'THE SANCTUARY OF SIMPLICITY',
		heading: 'CURATED',
		body: 'Your home curated to your lifestyle - because time is your biggest luxury',
		link: { label: 'DISCOVER YOUR SPACE', url: '/booking' },
		slides: [heroSlide1, heroSlide2, heroSlide3].map((src) => ({ src, alt: '', position: CENTER })),
	},
	intro: {
		eyebrow: 'Our approach',
		heading: 'Functional Luxury',
		body: 'We believe an organized home is a form of self-care. Our approach merges refined aesthetics with practical systems — spaces that look beautiful and work effortlessly for the way you actually live.',
		link: { label: 'Learn more about us', url: '/services' },
	},
	services: {
		eyebrow: 'Personalized services',
		heading: 'Tailored Flow, Elevated Living',
		link: { label: 'View all services', url: '/services' },
		cards: [
			{
				title: 'Home organizing',
				description: 'Full-service sorting, decluttering, and custom systems for any room in your home.',
				image: { src: servicesImg1, alt: 'Organized closet with shelving and hanging clothes', position: CENTER },
			},
			{
				title: 'Unpacking + move-in',
				description: 'Turn your new house into a home from day one with complete unpacking and setup.',
				image: { src: servicesImg2, alt: 'Couple unpacking boxes in a living room', position: CENTER },
			},
			{
				title: 'Business + office',
				description: "Workspace organization that drives productivity and reflects your brand's standards.",
				image: { src: servicesImg3, alt: 'Minimal office desk with computer and plant', position: CENTER },
			},
		],
	},
	process: {
		eyebrow: 'Our process',
		heading: 'How it works',
		steps: [
			{
				number: '01',
				title: 'Consultation',
				description: 'Free 30-minute video or in-person assessment of your space and goals',
			},
			{
				number: '02',
				title: 'Design + curate personalized plan',
				description: 'Custom plan, product sourcing, and everything you need before we arrive',
			},
			{
				number: '03',
				title: 'Edit + Organizing',
				description: 'We sort, declutter, build systems, label, and style your space to perfection',
			},
			{
				number: '04',
				title: 'Ongoing Support',
				description: 'Options for regular check-ins and scheduled maintenance/ maintenance packages',
			},
		],
	},
	beforeAfter: {
		eyebrow: 'The transformation',
		heading: 'See the difference',
		before: {
			src: beforeImg,
			alt: 'Before view of master closet transformation in Arlington, Virginia',
			position: CENTER,
		},
		after: {
			src: afterImg,
			alt: 'After view of master closet transformation with custom storage systems',
			position: CENTER,
		},
		caption:
			'Master closet transformation — Arlington, VA. Complete reorganization with custom storage systems, labeled bins, and seasonal rotation.',
		link: { label: 'View full gallery', url: '/gallery' },
	},
	testimonials: [
		{
			quote: 'Client testimonial will go here. One or two sentences about the transformation experience and how it changed their daily life.',
			clientName: 'Client name',
			clientLocation: 'Arlington, VA',
			rating: 5,
		},
		{
			quote: 'Working with Rina completely transformed our kitchen. Everything has a home now, and mornings are so much calmer.',
			clientName: 'Sarah M.',
			clientLocation: 'McLean, VA',
			rating: 5,
		},
		{
			quote: 'From the first consultation to the final label, the process was seamless. Our home office finally works for us.',
			clientName: 'James T.',
			clientLocation: 'Washington, DC',
			rating: 5,
		},
	],
	seo: {},
};
