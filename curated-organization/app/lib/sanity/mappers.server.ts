import type { BackgroundImage, ImageItem, LinkItem, PageSeo } from '~/types/global';
import { urlFor } from './image.server';

// Hand-written until the TypeGen ticket. GROQ returns null for any field an editor left blank.
export type Maybe<T> = T | null | undefined;
export type CmsImage = {
	asset?: Maybe<{ _ref: string }>;
	crop?: Maybe<{ top: number; bottom: number; left: number; right: number }>;
	hotspot?: Maybe<{ x: number; y: number; width: number; height: number }>;
	dimensions?: Maybe<{ width: number; height: number; aspectRatio: number }>;
	alt?: Maybe<string>;
};
export type CmsLink = { label?: Maybe<string>; url?: Maybe<string> };
export type CmsSeo = { title?: Maybe<string>; description?: Maybe<string>; image?: Maybe<CmsImage> };

const LINK_PREFIXES = ['/', 'http://', 'https://', 'mailto:', 'tel:'];

export const text = (value: Maybe<string>) => value?.trim() || undefined;

export const nonNull = <T>(value: T | null | undefined): value is T => value != null;

const isLinkUrl = (url: Maybe<string>): url is string =>
	LINK_PREFIXES.some((prefix) => url?.startsWith(prefix));

export const isValidLink = (link: CmsLink): link is { label: string; url: string } =>
	Boolean(text(link.label)) && isLinkUrl(link.url);

export const toLinks = (links: Maybe<CmsLink[]>): LinkItem[] =>
	(links ?? []).filter(isValidLink).map((link) => ({ label: link.label.trim(), url: link.url }));

export const toHref = (url: Maybe<string>, backup: string) => (isLinkUrl(url) ? url : backup);

// No label means no link; a labelled link with a bad destination keeps its label and uses the backup.
export const toLink = (label: Maybe<string>, url: Maybe<string>, backupUrl: string): LinkItem | undefined => {
	const trimmed = text(label);
	return trimmed ? { label: trimmed, url: toHref(url, backupUrl) } : undefined;
};

export const hotspotPosition = (image: CmsImage) =>
	image.hotspot ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` : '50% 50%';

export type ImageOptions = { height: number; alt: string; square?: boolean };

// Requests 2× pixels for high-density screens; renders at the given height.
export const toImage = (image: Maybe<CmsImage>, { height, alt, square }: ImageOptions): ImageItem | null => {
	if (!image?.asset?._ref) return null;
	const aspectRatio = square ? 1 : (image.dimensions?.aspectRatio ?? 1);
	const width = Math.round(height * aspectRatio);
	const builder = urlFor(image).height(height * 2).auto('format');
	const src = (square ? builder.width(width * 2).fit('crop') : builder).url();
	return { src, alt, width, height };
};

// For CSS background images: the URL applies the editor's crop, the position applies their hotspot.
export const toBackground = (image: Maybe<CmsImage>, width: number): BackgroundImage | null => {
	if (!image?.asset?._ref) return null;
	return {
		src: urlFor(image).width(width).auto('format').url(),
		alt: text(image.alt) ?? '',
		position: hotspotPosition(image),
	};
};

export const toShareImage = (image: Maybe<CmsImage>): ImageItem | undefined => {
	if (!image?.asset?._ref) return undefined;
	return {
		// JPEG rather than auto format: some link-preview scrapers can't read WebP/AVIF.
		src: urlFor(image).width(1200).height(630).fit('crop').format('jpg').url(),
		alt: text(image.alt) ?? '',
		width: 1200,
		height: 630,
	};
};

export const orFallback = <T>(items: T[], fallback: T[]) => (items.length > 0 ? items : fallback);

// Mirrors composeTitle() in studio/components/seoTitle.ts so the Studio preview matches the live title.
export const withBusinessName = (title: string, businessName: string) =>
	title.toLowerCase().includes(businessName.toLowerCase()) ? title : `${title} | ${businessName}`;

// Same rules as the root default (COT-030), but empty keys are left out so they fall back to it.
export function toPageSeo(seo: Maybe<CmsSeo>, businessName: string): PageSeo {
	const title = text(seo?.title);
	const description = text(seo?.description)?.replace(/\s*\n\s*/g, ' ');
	const image = toShareImage(seo?.image);

	return {
		...(title && { title: withBusinessName(title, businessName) }),
		...(description && { description }),
		...(image && { image }),
	};
}
