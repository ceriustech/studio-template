export type LinkItem = { label: string; url: string };

export type ImageItem = { src: string; alt: string; width: number; height: number };

export type BrandContent = { name: string; tagline?: string; logo: ImageItem };

export type HoursItem = { label: string; value: string };

export type FooterContent = {
	description?: string;
	logos: ImageItem[];
	navigateLinks: LinkItem[];
	connectLinks: LinkItem[];
	hours: HoursItem[];
	copyright?: string;
};

export type CtaContent = {
	background: { src: string; position: string };
	heading: string;
	subheading?: string;
	buttonLabel: string;
	buttonHref: string;
};

export type SeoContent = { title: string; description: string; image?: ImageItem };

export type GlobalContent = {
	brand: BrandContent;
	navLinks: LinkItem[];
	bookNowLabel: string;
	footer: FooterContent;
	cta: CtaContent;
	seo: SeoContent;
};

export type RouteHandle = { hideSiteCta?: boolean };
