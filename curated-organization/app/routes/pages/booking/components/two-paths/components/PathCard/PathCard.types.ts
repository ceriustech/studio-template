export interface PathOption {
	icon: string;
	label: string;
	onClick: () => void;
}

export type PathCardProps = {
	icon: string;
	title: string;
	description: string;
} & (
	| {
			kind: 'cta';
			ctaLabel: string;
			ctaHref: string;
			variant: 'primary' | 'secondary';
			onClick?: () => void;
	  }
	| {
			kind: 'options';
			options: PathOption[];
	  }
);
