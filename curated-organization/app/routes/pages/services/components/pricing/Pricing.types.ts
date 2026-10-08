import type { PricingCardProps } from './components/PricingCard/PricingCard.types';

export type PricingProps = {
	eyebrow?: string;
	heading: string;
	note?: string;
	cards: PricingCardProps[];
};
