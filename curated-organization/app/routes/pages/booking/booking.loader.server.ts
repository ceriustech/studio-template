import { getSanityClient } from '~/lib/sanity/client.server';
import { nonNull, orFallback, text, toPageSeo, type CmsSeo, type Maybe } from '~/lib/sanity/mappers.server';
import { BACKUP_BUSINESS_NAME } from '~/root.fallback.server';
import type { WhatToExpectStep } from '~/routes/components/WhatToExpect/WhatToExpect.types';
import { BACKUP_CTA, FALLBACK_BOOKING_CONTENT as FALLBACK } from './booking.fallback.server';
import { BOOKING_QUERY } from './booking.query';
import type {
	BookingContent,
	CalendarContent,
	CallInfoContent,
	HeroContent,
	PathCardContent,
	QuestionnaireContent,
	QuestionnaireField,
	WhatToExpectContent,
} from './booking.types';
import { isCalendlyUrl, isPathCardIcon, isPathCardKind, isPathCardVariant, isPathOptionIcon } from './utils';

// Hand-written until the TypeGen ticket. GROQ returns null for any field an editor left blank.
type CmsHero = { eyebrow?: Maybe<string>; heading?: Maybe<string>; body?: Maybe<string> };
type CmsPathOption = { icon?: Maybe<string>; label?: Maybe<string> };
type CmsPathCard = {
	kind?: Maybe<string>;
	icon?: Maybe<string>;
	title?: Maybe<string>;
	description?: Maybe<string>;
	options?: Maybe<Maybe<CmsPathOption>[]>;
	ctaLabel?: Maybe<string>;
	ctaHref?: Maybe<string>;
	variant?: Maybe<string>;
};
type CmsCallInfo = {
	eyebrow?: Maybe<string>;
	heading?: Maybe<string>;
	intro?: Maybe<string>;
	switchToEmailLabel?: Maybe<string>;
};
type CmsValidationMessages = {
	firstNameRequired?: Maybe<string>;
	lastNameRequired?: Maybe<string>;
	emailRequired?: Maybe<string>;
	emailInvalid?: Maybe<string>;
};
type CmsQuestionnaire = {
	eyebrow?: Maybe<string>;
	heading?: Maybe<string>;
	intro?: Maybe<string>;
	aboutYouSectionLabel?: Maybe<string>;
	firstNameLabel?: Maybe<string>;
	firstNamePlaceholder?: Maybe<string>;
	lastNameLabel?: Maybe<string>;
	lastNamePlaceholder?: Maybe<string>;
	emailLabel?: Maybe<string>;
	emailPlaceholder?: Maybe<string>;
	phoneLabel?: Maybe<string>;
	phonePlaceholder?: Maybe<string>;
	anythingElseSectionLabel?: Maybe<string>;
	notesLabel?: Maybe<string>;
	notesPlaceholder?: Maybe<string>;
	submitLabel?: Maybe<string>;
	submitNote?: Maybe<string>;
	validationMessages?: Maybe<CmsValidationMessages>;
};
type CmsCalendar = {
	eyebrow?: Maybe<string>;
	heading?: Maybe<string>;
	calendlyUrl?: Maybe<string>;
	errorIcon?: Maybe<string>;
	errorTitle?: Maybe<string>;
	errorDescription?: Maybe<string>;
};
type CmsStep = { number?: Maybe<string>; title?: Maybe<string>; description?: Maybe<string> };
type CmsWhatToExpect = { eyebrow?: Maybe<string>; heading?: Maybe<string>; steps?: Maybe<Maybe<CmsStep>[]> };
type CmsBookingPage = {
	hero?: Maybe<CmsHero>;
	twoPaths?: Maybe<Maybe<CmsPathCard>[]>;
	callInfo?: Maybe<CmsCallInfo>;
	questionnaire?: Maybe<CmsQuestionnaire>;
	calendar?: Maybe<CmsCalendar>;
	whatToExpect?: Maybe<CmsWhatToExpect>;
	seo?: Maybe<CmsSeo>;
};
type CmsBookingSettings = {
	businessName?: Maybe<string>;
	businessPhoneDisplay?: Maybe<string>;
	businessPhoneTel?: Maybe<string>;
	businessHours?: Maybe<string>;
};
type BookingQueryResult = { page: Maybe<CmsBookingPage>; settings: Maybe<CmsBookingSettings> };

const TEL_PATTERN = /^\+?[0-9]+$/;
const CTA_HREF_PREFIXES = ['#', '/', 'https://'];

// Read on the server only, so the browser never sees process.env.
const envCalendlyUrl = () => text(process.env.CALENDLY_URL) ?? null;

// A valid Studio link wins; otherwise the developer's CALENDLY_URL.
function resolveCalendlyUrl(value: Maybe<string>): string | null {
	const url = text(value);
	if (url && isCalendlyUrl(url)) return url;
	if (url) console.warn('[booking] calendlyUrl is not a Calendly link, using CALENDLY_URL');
	return envCalendlyUrl();
}

// Without a heading the hero uses its backup in full; with one, empty optional fields are hidden.
function mapHero(hero: Maybe<CmsHero>): HeroContent {
	const heading = text(hero?.heading);
	if (!heading) return FALLBACK.hero;

	return { eyebrow: text(hero?.eyebrow), heading, body: text(hero?.body) };
}

// The click always opens scheduling on the page; the destination is only the link's address.
function toCtaHref(href: Maybe<string>): string {
	const trimmed = text(href);
	return trimmed && CTA_HREF_PREFIXES.some((prefix) => trimmed.startsWith(prefix)) ? trimmed : BACKUP_CTA.ctaHref;
}

// A card needs a title, a known type and icon; an options card also needs one usable option.
function mapPathCard(card: Maybe<CmsPathCard>): PathCardContent | null {
	const title = text(card?.title);
	const kind = card?.kind;
	const icon = card?.icon;
	if (!card || !title || !isPathCardKind(kind) || !isPathCardIcon(icon)) return null;

	const base = { icon, title, description: text(card.description) };

	if (kind === 'options') {
		const options = (card.options ?? []).flatMap((option) => {
			const label = text(option?.label);
			const optionIcon = option?.icon;
			return label && isPathOptionIcon(optionIcon) ? [{ icon: optionIcon, label }] : [];
		});
		return options.length > 0 ? { ...base, kind, options } : null;
	}

	return {
		...base,
		kind,
		ctaLabel: text(card.ctaLabel) ?? BACKUP_CTA.ctaLabel,
		ctaHref: toCtaHref(card.ctaHref),
		variant: isPathCardVariant(card.variant) ? card.variant : BACKUP_CTA.variant,
	};
}

// Backup and published cards never mix: one usable card means only the CMS list is shown.
function mapPathCards(cards: Maybe<Maybe<CmsPathCard>[]>): PathCardContent[] {
	return orFallback((cards ?? []).map(mapPathCard).filter(nonNull), FALLBACK.pathCards);
}

// Phone and hours live in Site settings; the phone falls back as a display/tel pair.
function mapPhone(settings: Maybe<CmsBookingSettings>): CallInfoContent['phone'] {
	const display = text(settings?.businessPhoneDisplay);
	const tel = text(settings?.businessPhoneTel);
	return display && tel && TEL_PATTERN.test(tel) ? { display, tel } : FALLBACK.callInfo.phone;
}

function mapCallInfo(callInfo: Maybe<CmsCallInfo>, settings: Maybe<CmsBookingSettings>): CallInfoContent {
	const backup = FALLBACK.callInfo;
	const heading = text(callInfo?.heading);
	const copy = heading
		? {
				eyebrow: text(callInfo?.eyebrow),
				heading,
				intro: text(callInfo?.intro),
				// Never blank: it's the only way from the call section to the form.
				switchToEmailLabel: text(callInfo?.switchToEmailLabel) ?? backup.switchToEmailLabel,
			}
		: {
				eyebrow: backup.eyebrow,
				heading: backup.heading,
				intro: backup.intro,
				switchToEmailLabel: backup.switchToEmailLabel,
			};

	return {
		...copy,
		phone: mapPhone(settings),
		hours: settings ? text(settings.businessHours) : backup.hours,
	};
}

const toField = (label: Maybe<string>, placeholder: Maybe<string>, backup: QuestionnaireField): QuestionnaireField => ({
	label: text(label) ?? backup.label,
	placeholder: text(placeholder),
});

// Labels, the button and messages fall back one by one so the form always works;
// placeholders and the note under the button are hidden when blank.
function mapQuestionnaire(questionnaire: Maybe<CmsQuestionnaire>): QuestionnaireContent {
	const heading = text(questionnaire?.heading);
	if (!questionnaire || !heading) return FALLBACK.questionnaire;

	const backup = FALLBACK.questionnaire;
	const messages = questionnaire.validationMessages;

	return {
		eyebrow: text(questionnaire.eyebrow),
		heading,
		intro: text(questionnaire.intro),
		aboutYouLabel: text(questionnaire.aboutYouSectionLabel) ?? backup.aboutYouLabel,
		anythingElseLabel: text(questionnaire.anythingElseSectionLabel) ?? backup.anythingElseLabel,
		fields: {
			firstName: toField(questionnaire.firstNameLabel, questionnaire.firstNamePlaceholder, backup.fields.firstName),
			lastName: toField(questionnaire.lastNameLabel, questionnaire.lastNamePlaceholder, backup.fields.lastName),
			email: toField(questionnaire.emailLabel, questionnaire.emailPlaceholder, backup.fields.email),
			phone: toField(questionnaire.phoneLabel, questionnaire.phonePlaceholder, backup.fields.phone),
			notes: toField(questionnaire.notesLabel, questionnaire.notesPlaceholder, backup.fields.notes),
		},
		submitLabel: text(questionnaire.submitLabel) ?? backup.submitLabel,
		submitNote: text(questionnaire.submitNote),
		messages: {
			firstNameRequired: text(messages?.firstNameRequired) ?? backup.messages.firstNameRequired,
			lastNameRequired: text(messages?.lastNameRequired) ?? backup.messages.lastNameRequired,
			emailRequired: text(messages?.emailRequired) ?? backup.messages.emailRequired,
			emailInvalid: text(messages?.emailInvalid) ?? backup.messages.emailInvalid,
		},
	};
}

// The header and the "can't load" message each fall back as a whole.
function mapCalendar(calendar: Maybe<CmsCalendar>): CalendarContent {
	const backup = FALLBACK.calendar;
	const heading = text(calendar?.heading);
	const errorTitle = text(calendar?.errorTitle);

	return {
		...(heading ? { eyebrow: text(calendar?.eyebrow), heading } : { eyebrow: backup.eyebrow, heading: backup.heading }),
		unavailable: errorTitle
			? { icon: text(calendar?.errorIcon), title: errorTitle, description: text(calendar?.errorDescription) }
			: backup.unavailable,
	};
}

function mapStep(step: Maybe<CmsStep>): WhatToExpectStep | null {
	const number = text(step?.number);
	const title = text(step?.title);
	return number && title ? { number, title, description: text(step?.description) } : null;
}

// Backup and published steps never mix.
function mapWhatToExpect(whatToExpect: Maybe<CmsWhatToExpect>): WhatToExpectContent {
	const heading = text(whatToExpect?.heading);
	if (!heading) return FALLBACK.whatToExpect;

	return {
		eyebrow: text(whatToExpect?.eyebrow),
		heading,
		steps: orFallback((whatToExpect?.steps ?? []).map(mapStep).filter(nonNull), FALLBACK.whatToExpect.steps),
	};
}

// Site settings are a separate document, so a missing bookingPage still uses its phone and hours.
function mapBooking({ page, settings }: BookingQueryResult): BookingContent {
	return {
		hero: mapHero(page?.hero),
		pathCards: mapPathCards(page?.twoPaths),
		callInfo: mapCallInfo(page?.callInfo, settings),
		questionnaire: mapQuestionnaire(page?.questionnaire),
		calendar: mapCalendar(page?.calendar),
		calendlyUrl: resolveCalendlyUrl(page?.calendar?.calendlyUrl),
		whatToExpect: mapWhatToExpect(page?.whatToExpect),
		seo: toPageSeo(page?.seo, text(settings?.businessName) ?? BACKUP_BUSINESS_NAME),
	};
}

// CALENDLY_URL doesn't depend on the CMS, so scheduling keeps working when the fetch fails.
const fallbackContent = (): BookingContent => ({ ...FALLBACK, calendlyUrl: envCalendlyUrl() });

export async function loader(): Promise<BookingContent> {
	const client = getSanityClient();
	if (!client) return fallbackContent();

	try {
		const result = await client.fetch<BookingQueryResult | null>(BOOKING_QUERY);
		if (!result?.page) console.warn('[booking] bookingPage not found, serving fallback content');
		return mapBooking({ page: result?.page, settings: result?.settings });
	} catch (error) {
		console.error('[booking] Sanity fetch failed, serving fallback content', error);
		return fallbackContent();
	}
}
