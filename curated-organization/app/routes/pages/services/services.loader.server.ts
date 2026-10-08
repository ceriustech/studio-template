import { getSanityClient } from '~/lib/sanity/client.server';
import {
	nonNull,
	orFallback,
	text,
	toBackground,
	toImage,
	toPageSeo,
	type CmsImage,
	type CmsSeo,
	type Maybe,
} from '~/lib/sanity/mappers.server';
import { BACKUP_BUSINESS_NAME } from '~/root.fallback.server';
import type { CredentialBadge } from './components/about/About.types';
import { FALLBACK_SERVICES_CONTENT as FALLBACK } from './services.fallback.server';
import { SERVICES_QUERY } from './services.query';
import type { ServicesContent } from './services.types';

// Hand-written until the TypeGen ticket. GROQ returns null for any field an editor left blank.
type CmsHero = { eyebrow?: Maybe<string>; heading?: Maybe<string>; body?: Maybe<string> };
type CmsAbout = {
	eyebrow?: Maybe<string>;
	heading?: Maybe<string>;
	bio?: Maybe<string>;
	signature?: Maybe<string>;
	photo?: Maybe<CmsImage>;
};
type CmsService = {
	eyebrow?: Maybe<string>;
	heading?: Maybe<string>;
	description?: Maybe<string>;
	items?: Maybe<Maybe<string>[]>;
	ctaLabel?: Maybe<string>;
	image?: Maybe<CmsImage>;
};
type CmsPricingTier = {
	eyebrow?: Maybe<string>;
	title?: Maybe<string>;
	price?: Maybe<string>;
	description?: Maybe<string>;
	features?: Maybe<Maybe<string>[]>;
	featured?: Maybe<boolean>;
	ctaLabel?: Maybe<string>;
};
type CmsPricing = {
	eyebrow?: Maybe<string>;
	heading?: Maybe<string>;
	note?: Maybe<string>;
	tiers?: Maybe<Maybe<CmsPricingTier>[]>;
};
type CmsBadge = { label?: Maybe<string>; image?: Maybe<CmsImage> };
type CmsServicesPage = {
	hero?: Maybe<CmsHero>;
	about?: Maybe<CmsAbout>;
	services?: Maybe<Maybe<CmsService>[]>;
	pricing?: Maybe<CmsPricing>;
	seo?: Maybe<CmsSeo>;
};
type ServicesQueryResult = {
	page: CmsServicesPage | null;
	badges: Maybe<Maybe<CmsBadge>[]>;
	businessName: Maybe<string>;
};

const toStrings = (values: Maybe<Maybe<string>[]>) => (values ?? []).map(text).filter(nonNull);

// Each section has an anchor. Without it the section's text uses its backup in full;
// with it, empty optional fields are hidden. Lists and images fall back on their own.

function mapHero(hero: Maybe<CmsHero>): ServicesContent['hero'] {
	const heading = text(hero?.heading);
	if (!heading) return FALLBACK.hero;

	return { eyebrow: text(hero?.eyebrow), heading, body: text(hero?.body) };
}

function mapBadges(badges: Maybe<Maybe<CmsBadge>[]>): CredentialBadge[] {
	return orFallback(
		(badges ?? []).flatMap((badge) => {
			const label = text(badge?.label);
			const image = toImage(badge?.image, { height: 48, alt: text(badge?.image?.alt) ?? label ?? '' });
			return image ? [{ label, image }] : [];
		}),
		FALLBACK.about.badges,
	);
}

// The text needs both heading and bio: a heading over an empty column would look broken.
function mapAbout(about: Maybe<CmsAbout>, badges: Maybe<Maybe<CmsBadge>[]>): ServicesContent['about'] {
	const fallback = FALLBACK.about;
	const heading = text(about?.heading);
	const bio = text(about?.bio);
	const resolvedText =
		heading && bio
			? { eyebrow: text(about?.eyebrow), heading, bio, signature: text(about?.signature) }
			: { eyebrow: fallback.eyebrow, heading: fallback.heading, bio: fallback.bio, signature: fallback.signature };

	const alt = text(about?.photo?.alt) ?? text(resolvedText.signature?.replace(/^[—–-]\s*/, '')) ?? '';
	const photo = toImage(about?.photo, { height: 640, alt }) ?? fallback.photo;

	return { ...resolvedText, photo, badges: mapBadges(badges) };
}

function mapServiceList(services: Maybe<Maybe<CmsService>[]>): ServicesContent['services'] {
	return orFallback(
		(services ?? []).flatMap((service) => {
			const heading = text(service?.heading);
			const image = toBackground(service?.image, 1400);
			if (!heading || !image) return [];
			return [
				{
					eyebrow: text(service?.eyebrow),
					heading,
					description: text(service?.description),
					image: { ...image, alt: image.alt || heading },
					items: toStrings(service?.items),
					ctaLabel: text(service?.ctaLabel),
				},
			];
		}),
		FALLBACK.services,
	);
}

function mapPricing(pricing: Maybe<CmsPricing>): ServicesContent['pricing'] {
	const fallback = FALLBACK.pricing;
	const cards = orFallback(
		(pricing?.tiers ?? []).flatMap((tier) => {
			const title = text(tier?.title);
			if (!title) return [];
			const features = toStrings(tier?.features);
			return [
				{
					eyebrow: text(tier?.eyebrow),
					title,
					price: text(tier?.price),
					description: text(tier?.description),
					features: features.length > 0 ? features : undefined,
					featured: tier?.featured === true,
					ctaLabel: text(tier?.ctaLabel),
				},
			];
		}),
		fallback.cards,
	);
	const heading = text(pricing?.heading);
	if (!heading) return { ...fallback, cards };

	return { eyebrow: text(pricing?.eyebrow), heading, note: text(pricing?.note), cards };
}

function mapServicesPage({
	page,
	badges,
	businessName,
}: ServicesQueryResult & { page: CmsServicesPage }): ServicesContent {
	return {
		hero: mapHero(page.hero),
		about: mapAbout(page.about, badges),
		services: mapServiceList(page.services),
		pricing: mapPricing(page.pricing),
		seo: toPageSeo(page.seo, text(businessName) ?? BACKUP_BUSINESS_NAME),
	};
}

export async function loader(): Promise<ServicesContent> {
	const client = getSanityClient();
	if (!client) return FALLBACK;

	try {
		const result = await client.fetch<ServicesQueryResult>(SERVICES_QUERY);
		if (!result?.page) {
			console.warn('[services] servicesPage not found, serving fallback content');
			return FALLBACK;
		}
		return mapServicesPage({ ...result, page: result.page });
	} catch (error) {
		console.error('[services] Sanity fetch failed, serving fallback content', error);
		return FALLBACK;
	}
}
