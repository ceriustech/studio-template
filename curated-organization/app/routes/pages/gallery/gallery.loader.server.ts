import { getSanityClient } from '~/lib/sanity/client.server';
import { urlFor } from '~/lib/sanity/image.server';
import {
	nonNull,
	orFallback,
	text,
	toPageSeo,
	type CmsImage,
	type CmsSeo,
	type Maybe,
} from '~/lib/sanity/mappers.server';
import { BACKUP_BUSINESS_NAME } from '~/root.fallback.server';
import { FALLBACK_GALLERY_CONTENT as FALLBACK } from './gallery.fallback.server';
import { GALLERY_QUERY } from './gallery.query';
import type {
	GalleryContent,
	ImageMedia,
	PortfolioPiece,
	VideoMedia,
	VideoTag,
} from './gallery.types';
import { isValidCategory } from './utils';

// Hand-written until the TypeGen ticket. GROQ returns null for any field an editor left blank.
type CmsHero = { eyebrow?: Maybe<string>; heading?: Maybe<string>; body?: Maybe<string> };
type CmsVideo = {
	src?: Maybe<string>;
	poster?: Maybe<CmsImage>;
	posterOffset?: Maybe<number>;
	tag?: Maybe<string>;
	duration?: Maybe<number>;
	captionsSrc?: Maybe<string>;
	alt?: Maybe<string>;
};
type CmsImageMedia = {
	image?: Maybe<CmsImage>;
	caption?: Maybe<string>;
	fullImage?: Maybe<CmsImage>;
};
type CmsPortfolioPiece = {
	_id: string;
	title?: Maybe<string>;
	category?: Maybe<string>;
	location?: Maybe<string>;
	description?: Maybe<string>;
	videos?: Maybe<Maybe<CmsVideo>[]>;
	images?: Maybe<Maybe<CmsImageMedia>[]>;
};
type CmsGalleryPage = { hero?: Maybe<CmsHero>; seo?: Maybe<CmsSeo> };
type GalleryQueryResult = {
	page: Maybe<CmsGalleryPage>;
	pieces: Maybe<Maybe<CmsPortfolioPiece>[]>;
	businessName: Maybe<string>;
};

const TAG_LABEL: Record<VideoTag, string> = { before: 'Before', after: 'After' };

const isVideoTag = (value: Maybe<string>): value is VideoTag => value === 'before' || value === 'after';

const hasAsset = (image: Maybe<CmsImage>): image is CmsImage => Boolean(image?.asset?._ref);

// Detail photos render at most ~360×220 and posters ~550×400; both are requested at about 2×,
// cropped to the editor's hotspot. The lightbox gets a larger, uncropped copy.
const thumbnailUrl = (image: CmsImage) => urlFor(image).width(720).height(540).fit('crop').auto('format').url();
const posterUrl = (image: CmsImage) => urlFor(image).width(1200).height(800).fit('crop').auto('format').url();
const fullUrl = (image: CmsImage) => urlFor(image).width(1600).fit('max').auto('format').url();

// Without a heading the hero uses its backup in full; with one, empty optional fields are hidden.
function mapHero(hero: Maybe<CmsHero>): GalleryContent['hero'] {
	const heading = text(hero?.heading);
	if (!heading) return FALLBACK.hero;

	return { eyebrow: text(hero?.eyebrow), heading, body: text(hero?.body) };
}

function mapVideo(video: Maybe<CmsVideo>, title: string): VideoMedia | null {
	const src = text(video?.src);
	const tag = video?.tag;
	const poster = video?.poster;
	const duration = video?.duration;
	if (!src || !isVideoTag(tag) || !hasAsset(poster) || !duration || duration <= 0) return null;

	return {
		src,
		poster: posterUrl(poster),
		posterOffset: video?.posterOffset ?? 0,
		tag,
		duration,
		captionsSrc: text(video?.captionsSrc),
		alt: text(video?.alt) ?? `${title} — ${TAG_LABEL[tag]}`,
	};
}

// The video pair shows at most one before and one after video, in that order.
function toVideoPair(videos: VideoMedia[]): VideoMedia[] {
	const before = videos.find((video) => video.tag === 'before');
	const after = videos.find((video) => video.tag === 'after');
	if (before && after) return [before, after];
	const single = before ?? after;
	return single ? [single] : [];
}

function mapImages(images: Maybe<Maybe<CmsImageMedia>[]>, title: string): ImageMedia[] {
	return (images ?? [])
		.flatMap((entry) => (entry && hasAsset(entry.image) ? [{ ...entry, image: entry.image }] : []))
		.map(({ image, caption: rawCaption, fullImage }, index) => {
			const caption = text(rawCaption);
			return {
				src: thumbnailUrl(image),
				alt: text(image.alt) ?? caption ?? `${title} photo ${index + 1}`,
				caption,
				fullSrc: fullUrl(hasAsset(fullImage) ? fullImage : image),
			};
		});
}

// A piece needs a title, a known category and something to show; otherwise it is skipped.
function mapPiece(piece: Maybe<CmsPortfolioPiece>): PortfolioPiece | null {
	const title = text(piece?.title);
	const category = text(piece?.category);
	if (!piece || !title || !isValidCategory(category)) return null;

	const videos = toVideoPair((piece.videos ?? []).map((video) => mapVideo(video, title)).filter(nonNull));
	const images = mapImages(piece.images, title);
	if (videos.length === 0 && images.length === 0) return null;

	return {
		id: piece._id,
		title,
		category,
		location: text(piece.location),
		description: text(piece.description),
		videos,
		images,
	};
}

// Backup and published pieces never mix: one usable piece means only the CMS list is shown.
function mapPieces(pieces: Maybe<Maybe<CmsPortfolioPiece>[]>): PortfolioPiece[] {
	return orFallback((pieces ?? []).map(mapPiece).filter(nonNull), FALLBACK.pieces);
}

// Portfolio pieces are their own documents, so a missing galleryPage only affects the hero and SEO.
function mapGallery({ page, pieces, businessName }: GalleryQueryResult): GalleryContent {
	return {
		hero: mapHero(page?.hero),
		pieces: mapPieces(pieces),
		seo: toPageSeo(page?.seo, text(businessName) ?? BACKUP_BUSINESS_NAME),
	};
}

export async function loader(): Promise<GalleryContent> {
	const client = getSanityClient();
	if (!client) return FALLBACK;

	try {
		const result = await client.fetch<GalleryQueryResult | null>(GALLERY_QUERY);
		if (!result?.page) console.warn('[gallery] galleryPage not found, serving fallback hero');
		return mapGallery({
			page: result?.page,
			pieces: result?.pieces,
			businessName: result?.businessName,
		});
	} catch (error) {
		console.error('[gallery] Sanity fetch failed, serving fallback content', error);
		return FALLBACK;
	}
}
