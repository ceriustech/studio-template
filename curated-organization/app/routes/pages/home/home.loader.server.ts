import { getSanityClient } from '~/lib/sanity/client.server';
import {
	nonNull,
	orFallback,
	text,
	toBackground,
	toLink,
	toPageSeo,
	type CmsImage,
	type CmsSeo,
	type Maybe,
} from '~/lib/sanity/mappers.server';
import { BACKUP_BUSINESS_NAME } from '~/root.fallback.server';
import type { BackgroundImage } from '~/types/global';
import { FALLBACK_HOME_CONTENT as FALLBACK } from './home.fallback.server';
import { HOME_QUERY } from './home.query';
import type { HomeContent } from './home.types';

// Hand-written until the TypeGen ticket. GROQ returns null for any field an editor left blank.
type CmsSectionText = {
	eyebrow?: Maybe<string>;
	heading?: Maybe<string>;
	body?: Maybe<string>;
	linkLabel?: Maybe<string>;
	linkHref?: Maybe<string>;
};
type CmsHero = CmsSectionText & { images?: Maybe<Maybe<CmsImage>[]> };
type CmsServiceCard = { title?: Maybe<string>; description?: Maybe<string>; image?: Maybe<CmsImage> };
type CmsServicesTeaser = CmsSectionText & { cards?: Maybe<Maybe<CmsServiceCard>[]> };
type CmsStep = { number?: Maybe<string>; title?: Maybe<string>; description?: Maybe<string> };
type CmsProcess = CmsSectionText & { steps?: Maybe<Maybe<CmsStep>[]> };
type CmsImageMedia = { image?: Maybe<CmsImage> };
type CmsBeforeAfter = CmsSectionText & {
	caption?: Maybe<string>;
	beforeImage?: Maybe<CmsImageMedia>;
	afterImage?: Maybe<CmsImageMedia>;
};
type CmsTestimonial = {
	quote?: Maybe<string>;
	clientName?: Maybe<string>;
	clientLocation?: Maybe<string>;
	rating?: Maybe<number>;
};
type CmsHomePage = {
	hero?: Maybe<CmsHero>;
	intro?: Maybe<CmsSectionText>;
	servicesTeaser?: Maybe<CmsServicesTeaser>;
	process?: Maybe<CmsProcess>;
	beforeAfter?: Maybe<CmsBeforeAfter>;
	testimonials?: Maybe<Maybe<CmsTestimonial>[]>;
	seo?: Maybe<CmsSeo>;
};
type HomeQueryResult = { page: CmsHomePage | null; businessName: Maybe<string> };

// Each section has an anchor (its heading). Without it the section's text uses its backup in full;
// with it, empty optional fields are hidden. Lists and images fall back on their own.

function mapHero(hero: Maybe<CmsHero>): HomeContent['hero'] {
	const fallback = FALLBACK.hero;
	const slides = orFallback(
		(hero?.images ?? []).map((image) => toBackground(image, 1800)).filter(nonNull),
		fallback.slides,
	);
	const heading = text(hero?.heading);
	if (!heading) return { ...fallback, slides };

	return {
		eyebrow: text(hero?.eyebrow),
		heading,
		body: text(hero?.body),
		link: toLink(hero?.linkLabel, hero?.linkHref, '/booking'),
		slides,
	};
}

function mapIntro(intro: Maybe<CmsSectionText>): HomeContent['intro'] {
	const heading = text(intro?.heading);
	if (!heading) return FALLBACK.intro;

	return {
		eyebrow: text(intro?.eyebrow),
		heading,
		body: text(intro?.body),
		link: toLink(intro?.linkLabel, intro?.linkHref, '/services'),
	};
}

function mapServices(teaser: Maybe<CmsServicesTeaser>): HomeContent['services'] {
	const fallback = FALLBACK.services;
	const cards = orFallback(
		(teaser?.cards ?? []).flatMap((card) => {
			const title = text(card?.title);
			const image = toBackground(card?.image, 800);
			if (!title || !image) return [];
			return [{ title, description: text(card?.description), image: { ...image, alt: image.alt || title } }];
		}),
		fallback.cards,
	);
	const heading = text(teaser?.heading);
	if (!heading) return { ...fallback, cards };

	return {
		eyebrow: text(teaser?.eyebrow),
		heading,
		link: toLink(teaser?.linkLabel, teaser?.linkHref, '/services'),
		cards,
	};
}

function mapProcess(process: Maybe<CmsProcess>): HomeContent['process'] {
	const fallback = FALLBACK.process;
	const steps = orFallback(
		(process?.steps ?? []).flatMap((step) => {
			const number = text(step?.number);
			const title = text(step?.title);
			return number && title ? [{ number, title, description: text(step?.description) }] : [];
		}),
		fallback.steps,
	);
	const heading = text(process?.heading);
	if (!heading) return { ...fallback, steps };

	return { eyebrow: text(process?.eyebrow), heading, steps };
}

function mapBeforeAfter(section: Maybe<CmsBeforeAfter>): HomeContent['beforeAfter'] {
	const fallback = FALLBACK.beforeAfter;
	const heading = text(section?.heading);
	const resolvedText = heading
		? {
				eyebrow: text(section?.eyebrow),
				heading,
				caption: text(section?.caption),
				link: toLink(section?.linkLabel, section?.linkHref, '/gallery'),
			}
		: { eyebrow: fallback.eyebrow, heading: fallback.heading, caption: fallback.caption, link: fallback.link };

	const toCell = (media: Maybe<CmsImageMedia>, tag: string, backup: BackgroundImage) => {
		const image = toBackground(media?.image, 1100);
		return image ? { ...image, alt: image.alt || `${tag} — ${resolvedText.heading}` } : backup;
	};

	return {
		...resolvedText,
		before: toCell(section?.beforeImage, 'Before', fallback.before),
		after: toCell(section?.afterImage, 'After', fallback.after),
	};
}

const toRating = (rating: Maybe<number>) =>
	typeof rating === 'number' && Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 5;

function mapTestimonials(items: Maybe<Maybe<CmsTestimonial>[]>): HomeContent['testimonials'] {
	return orFallback(
		(items ?? []).flatMap((item) => {
			const quote = text(item?.quote);
			const clientName = text(item?.clientName);
			if (!quote || !clientName) return [];
			return [{ quote, clientName, clientLocation: text(item?.clientLocation), rating: toRating(item?.rating) }];
		}),
		FALLBACK.testimonials,
	);
}

function mapHome({ page, businessName }: HomeQueryResult & { page: CmsHomePage }): HomeContent {
	return {
		hero: mapHero(page.hero),
		intro: mapIntro(page.intro),
		services: mapServices(page.servicesTeaser),
		process: mapProcess(page.process),
		beforeAfter: mapBeforeAfter(page.beforeAfter),
		testimonials: mapTestimonials(page.testimonials),
		seo: toPageSeo(page.seo, text(businessName) ?? BACKUP_BUSINESS_NAME),
	};
}

export async function loader(): Promise<HomeContent> {
	const client = getSanityClient();
	if (!client) return FALLBACK;

	try {
		const result = await client.fetch<HomeQueryResult>(HOME_QUERY);
		if (!result?.page) {
			console.warn('[home] homePage not found, serving fallback content');
			return FALLBACK;
		}
		return mapHome({ ...result, page: result.page });
	} catch (error) {
		console.error('[home] Sanity fetch failed, serving fallback content', error);
		return FALLBACK;
	}
}
