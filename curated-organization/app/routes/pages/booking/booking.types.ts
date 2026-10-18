import type { WhatToExpectStep } from '~/routes/components/WhatToExpect/WhatToExpect.types';
import type { PageSeo } from '~/types/global';
import type { HeroProps } from './components/hero/Hero.types';

export type HeroContent = HeroProps;

export type PathCardIcon = 'plus' | 'refresh';
export type PathOptionIcon = 'phone' | 'email';
export type PathCardKind = 'options' | 'cta';
export type PathCardVariant = 'primary' | 'secondary';

// Icons are keys, not elements, so the content survives loader-data serialization.
export type PathCardContent = {
	icon: PathCardIcon;
	title: string;
	description?: string;
} & (
	| { kind: 'options'; options: { icon: PathOptionIcon; label: string }[] }
	| { kind: 'cta'; ctaLabel: string; ctaHref: string; variant: PathCardVariant }
);

export type CallInfoContent = {
	eyebrow?: string;
	heading: string;
	intro?: string;
	switchToEmailLabel: string;
	phone: { display: string; tel: string };
	hours?: string;
};

export type QuestionnaireField = { label: string; placeholder?: string };

export type InquiryMessages = {
	firstNameRequired: string;
	lastNameRequired: string;
	emailRequired: string;
	emailInvalid: string;
};

export type QuestionnaireContent = {
	eyebrow?: string;
	heading: string;
	intro?: string;
	aboutYouLabel: string;
	anythingElseLabel: string;
	fields: Record<'firstName' | 'lastName' | 'email' | 'phone' | 'notes', QuestionnaireField>;
	submitLabel: string;
	submitNote?: string;
	messages: InquiryMessages;
};

export type CalendarUnavailableContent = { icon?: string; title: string; description?: string };

export type CalendarContent = {
	eyebrow?: string;
	heading: string;
	unavailable: CalendarUnavailableContent;
};

export type WhatToExpectContent = {
	eyebrow?: string;
	heading: string;
	steps: WhatToExpectStep[];
};

export type BookingContent = {
	hero: HeroContent;
	pathCards: PathCardContent[];
	callInfo: CallInfoContent;
	questionnaire: QuestionnaireContent;
	calendar: CalendarContent;
	// Studio link, else CALENDLY_URL, else null (the "can't load" message).
	calendlyUrl: string | null;
	whatToExpect: WhatToExpectContent;
	// {} when the page has no search & sharing values of its own, or the fetch failed.
	seo: PageSeo;
};
