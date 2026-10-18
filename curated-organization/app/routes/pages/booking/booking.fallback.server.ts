import type { BookingContent, PathCardVariant } from './booking.types';

// Also backs up a published button card's blank label, bad destination or missing style.
export const BACKUP_CTA: { ctaLabel: string; ctaHref: string; variant: PathCardVariant } = {
	ctaLabel: 'Schedule now',
	ctaHref: '#calendly',
	variant: 'secondary',
};

// Backup Booking content: used when the CMS is unreachable or a section is missing its anchor.
// calendlyUrl isn't here: it comes from CALENDLY_URL, which doesn't depend on the CMS.
export const FALLBACK_BOOKING_CONTENT: Omit<BookingContent, 'calendlyUrl'> = {
	hero: {
		eyebrow: 'Book a consultation',
		heading: "Let's transform your space",
		body: 'Your complimentary 30-minute consultation starts here. Choose your path below.',
	},
	pathCards: [
		{
			kind: 'options',
			icon: 'plus',
			title: 'Get started',
			description: 'New to Curated? Reach out however works best for you.',
			options: [
				{ icon: 'phone', label: 'Call us' },
				{ icon: 'email', label: 'Email us' },
			],
		},
		{
			kind: 'cta',
			icon: 'refresh',
			title: 'Book again',
			description: 'Welcome back! Skip the intake and go straight to scheduling your next session.',
			...BACKUP_CTA,
		},
	],
	callInfo: {
		eyebrow: 'Give us a call',
		heading: "We'd love to hear from you",
		intro: "Call and we'll talk through your space, answer questions, and find a time that works — no forms required.",
		switchToEmailLabel: 'Prefer to write? Send us your details instead →',
		phone: { display: '(703) 555-0182', tel: '+17035550182' },
		hours: 'Mon-Fri, 9am-5pm ET · Sat by appointment',
	},
	questionnaire: {
		eyebrow: 'New client intake',
		heading: 'Tell us about your space',
		intro: "Just your contact details and anything you'd like us to know. We'll cover the rest during your consultation.",
		aboutYouLabel: 'About you',
		anythingElseLabel: 'Anything else',
		fields: {
			firstName: { label: 'First name', placeholder: 'First name' },
			lastName: { label: 'Last name', placeholder: 'Last name' },
			email: { label: 'Email', placeholder: 'youremail@example.com' },
			phone: { label: 'Phone', placeholder: '(555) 123-4567' },
			notes: {
				label: "Anything you'd like us to know?",
				placeholder: 'Goals, challenges, or anything that would help us prepare...',
			},
		},
		submitLabel: 'Continue to scheduling →',
		submitNote: "You'll choose a consultation time on the next step",
		messages: {
			firstNameRequired: 'Please enter your first name',
			lastNameRequired: 'Please enter your last name',
			emailRequired: 'Please enter your email',
			emailInvalid: 'Please enter a valid email',
		},
	},
	calendar: {
		eyebrow: 'Select a time',
		heading: 'Choose your consultation slot',
		unavailable: {
			icon: '📅',
			title: 'Calendly scheduling widget',
			description:
				'Embedded inline. Visitor selects a 30-minute consultation slot. Styled to match site colors as closely as Calendly allows.',
		},
	},
	whatToExpect: {
		eyebrow: 'What to Expect',
		heading: 'After you book',
		steps: [
			{
				number: '01',
				title: 'Confirmation email',
				description: "You'll receive a calendar invite with a Zoom or phone link within minutes",
			},
			{
				number: '02',
				title: '30-minute consultation',
				description: "We'll discuss your space, goals, timeline, and answer any questions you have",
			},
			{
				number: '03',
				title: 'Custom proposal',
				description:
					'Following our discussion, we’ll curate a custom project plan and detailed quote for your review',
			},
		],
	},
	seo: {},
};
