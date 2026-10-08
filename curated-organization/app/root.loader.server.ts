import { getSanityClient } from '~/lib/sanity/client.server';
import { urlFor } from '~/lib/sanity/image.server';
import {
	hotspotPosition,
	isValidLink,
	orFallback,
	text,
	toImage,
	toLinks,
	toShareImage,
	withBusinessName,
	type CmsImage,
	type CmsLink,
	type CmsSeo,
	type Maybe,
} from '~/lib/sanity/mappers.server';
import { GLOBAL_QUERY } from '~/lib/sanity/queries/global';
import type { CtaContent, FooterContent, GlobalContent, ImageItem, SeoContent } from '~/types/global';
import { PAGE_ROUTES_DATA } from './routes/constants';
import { BACKUP_BUSINESS_NAME, FALLBACK_GLOBAL_CONTENT as FALLBACK } from './root.fallback.server';

// Hand-written until the TypeGen ticket. GROQ returns null for any field an editor left blank.
type CmsHoursLine = { label?: Maybe<string>; value?: Maybe<string> };
type CmsCredential = { label?: Maybe<string>; image?: Maybe<CmsImage> };
type CmsSiteSettings = {
	brandName?: Maybe<string>;
	businessName?: Maybe<string>;
	brandTagline?: Maybe<string>;
	logo?: Maybe<CmsImage>;
	bookNowLabel?: Maybe<string>;
	navLinks?: Maybe<CmsLink[]>;
	footerBrandDescription?: Maybe<string>;
	footerLogos?: Maybe<CmsCredential[]>;
	footerNavLinks?: Maybe<CmsLink[]>;
	connectLinks?: Maybe<CmsLink[]>;
	footerHours?: Maybe<CmsHoursLine[]>;
	copyrightText?: Maybe<string>;
	defaultSeo?: Maybe<CmsSeo>;
};
type CmsSiteCta = {
	backgroundImage?: Maybe<CmsImage>;
	heading?: Maybe<string>;
	subheading?: Maybe<string>;
	buttonLabel?: Maybe<string>;
	buttonLink?: Maybe<string>;
};
type GlobalQueryResult = { settings: CmsSiteSettings | null; cta: CmsSiteCta | null };

function mapFooter(settings: CmsSiteSettings | null): FooterContent {
	const fallback = FALLBACK.footer;
	if (!settings) return fallback;

	const logos = (settings.footerLogos ?? [])
		.map((credential) =>
			toImage(credential.image, {
				height: 32,
				alt: text(credential.image?.alt) ?? text(credential.label) ?? '',
			}),
		)
		.filter((logo): logo is ImageItem => logo !== null);
	const hours = (settings.footerHours ?? []).flatMap((line) => {
		const label = text(line.label);
		const value = text(line.value);
		return label && value ? [{ label, value }] : [];
	});

	return {
		description: text(settings.footerBrandDescription) ?? fallback.description,
		logos: orFallback(logos, fallback.logos),
		navigateLinks: orFallback(toLinks(settings.footerNavLinks), fallback.navigateLinks),
		connectLinks: orFallback(toLinks(settings.connectLinks), fallback.connectLinks),
		hours: orFallback(hours, fallback.hours),
		copyright: text(settings.copyrightText) ?? fallback.copyright,
	};
}

function mapCta(cta: CmsSiteCta | null): CtaContent {
	const heading = text(cta?.heading);
	const buttonLabel = text(cta?.buttonLabel);
	if (!cta || !heading || !buttonLabel) return FALLBACK.cta;

	const buttonLink = { label: buttonLabel, url: cta.buttonLink };
	return {
		background: cta.backgroundImage?.asset
			? {
					src: urlFor(cta.backgroundImage).width(1800).auto('format').url(),
					position: hotspotPosition(cta.backgroundImage),
				}
			: FALLBACK.cta.background,
		heading,
		subheading: text(cta.subheading),
		buttonLabel,
		buttonHref: isValidLink(buttonLink) ? buttonLink.url : PAGE_ROUTES_DATA.BOOKING.path,
	};
}

function mapSeo(settings: CmsSiteSettings | null): SeoContent {
	const seo = settings?.defaultSeo;
	const businessName = text(settings?.businessName) ?? BACKUP_BUSINESS_NAME;
	const image = toShareImage(seo?.image);

	return {
		title: withBusinessName(text(seo?.title) ?? FALLBACK.seo.title, businessName),
		description: text(seo?.description)?.replace(/\s*\n\s*/g, ' ') ?? FALLBACK.seo.description,
		...(image && { image }),
	};
}

function mapGlobal(result: GlobalQueryResult | null): GlobalContent {
	const settings = result?.settings ?? null;
	const brandName = text(settings?.brandName);

	return {
		brand: brandName
			? {
					name: brandName,
					tagline: text(settings?.brandTagline) ?? FALLBACK.brand.tagline,
					logo: toImage(settings?.logo, { height: 40, alt: '', square: true }) ?? FALLBACK.brand.logo,
				}
			: FALLBACK.brand,
		navLinks: orFallback(toLinks(settings?.navLinks), FALLBACK.navLinks),
		bookNowLabel: text(settings?.bookNowLabel) ?? FALLBACK.bookNowLabel,
		footer: mapFooter(settings),
		cta: mapCta(result?.cta ?? null),
		seo: mapSeo(settings),
	};
}

export async function loader(): Promise<GlobalContent> {
	const client = getSanityClient();
	if (!client) return FALLBACK;

	try {
		const result = await client.fetch<GlobalQueryResult>(GLOBAL_QUERY);
		if (!result?.settings && !result?.cta) {
			console.warn('[global] siteSettings and siteCta not found, serving fallback content');
		}
		return mapGlobal(result);
	} catch (error) {
		console.error('[global] Sanity fetch failed, serving fallback content', error);
		return FALLBACK;
	}
}
