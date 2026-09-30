import { getSanityClient } from '~/lib/sanity/client.server';
import { urlFor } from '~/lib/sanity/image.server';
import { GLOBAL_QUERY } from '~/lib/sanity/queries/global';
import type { CtaContent, FooterContent, GlobalContent, ImageItem, LinkItem } from '~/types/global';
import { PAGE_ROUTES_DATA } from './routes/constants';
import { FALLBACK_GLOBAL_CONTENT as FALLBACK } from './root.fallback.server';

// Hand-written until the TypeGen ticket. GROQ returns null for any field an editor left blank.
type Maybe<T> = T | null | undefined;
type CmsImage = {
	asset?: Maybe<{ _ref: string }>;
	crop?: Maybe<{ top: number; bottom: number; left: number; right: number }>;
	hotspot?: Maybe<{ x: number; y: number; width: number; height: number }>;
	dimensions?: Maybe<{ width: number; height: number; aspectRatio: number }>;
	alt?: Maybe<string>;
};
type CmsLink = { label?: Maybe<string>; url?: Maybe<string> };
type CmsHoursLine = { label?: Maybe<string>; value?: Maybe<string> };
type CmsCredential = { label?: Maybe<string>; image?: Maybe<CmsImage> };
type CmsSiteSettings = {
	brandName?: Maybe<string>;
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
};
type CmsSiteCta = {
	backgroundImage?: Maybe<CmsImage>;
	heading?: Maybe<string>;
	subheading?: Maybe<string>;
	buttonLabel?: Maybe<string>;
	buttonLink?: Maybe<string>;
};
type GlobalQueryResult = { settings: CmsSiteSettings | null; cta: CmsSiteCta | null };

const LINK_PREFIXES = ['/', 'http://', 'https://', 'mailto:', 'tel:'];

const text = (value: Maybe<string>) => value?.trim() || undefined;

const isValidLink = (link: CmsLink): link is { label: string; url: string } =>
	Boolean(text(link.label)) && LINK_PREFIXES.some((prefix) => link.url?.startsWith(prefix));

const toLinks = (links: Maybe<CmsLink[]>): LinkItem[] =>
	(links ?? []).filter(isValidLink).map((link) => ({ label: link.label.trim(), url: link.url }));

const hotspotPosition = (image: CmsImage) =>
	image.hotspot ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` : '50% 50%';

type ImageOptions = { height: number; alt: string; square?: boolean };

// Requests 2× pixels for high-density screens; renders at the given height.
const toImage = (image: Maybe<CmsImage>, { height, alt, square }: ImageOptions): ImageItem | null => {
	if (!image?.asset?._ref) return null;
	const aspectRatio = square ? 1 : (image.dimensions?.aspectRatio ?? 1);
	const width = Math.round(height * aspectRatio);
	const builder = urlFor(image).height(height * 2).auto('format');
	const src = (square ? builder.width(width * 2).fit('crop') : builder).url();
	return { src, alt, width, height };
};

const orFallback = <T>(items: T[], fallback: T[]) => (items.length > 0 ? items : fallback);

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
