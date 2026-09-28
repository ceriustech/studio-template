import type { FooterContent, LinkItem } from '~/types/global';

export type FooterProps = {
	brandName: string;
	content: FooterContent;
	navLinks: LinkItem[];
};

export type FooterLinkProps = { link: LinkItem };
