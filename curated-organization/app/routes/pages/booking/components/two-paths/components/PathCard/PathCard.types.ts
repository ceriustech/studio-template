export interface PathCardProps {
	icon: string;
	title: string;
	description: string;
	ctaLabel: string;
	ctaHref: string;
	variant: 'primary' | 'secondary';
	onClick?: () => void;
}
