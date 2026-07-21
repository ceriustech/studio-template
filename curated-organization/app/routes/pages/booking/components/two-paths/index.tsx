import './two-paths.css';
import PathCard from './components/PathCard/PathCard';
import type { PathCardProps } from './components/PathCard/PathCard.types';

const cards: PathCardProps[] = [
	{
		icon: '+',
		title: 'Get started',
		description:
			'New to Curated? Tell us about your space and goals, then pick a time to meet. Takes about 3 minutes.',
		ctaLabel: 'Start questionnaire',
		ctaHref: '#questionnaire',
		variant: 'primary',
	},
	{
		icon: '↻',
		title: 'Book again',
		description:
			'Welcome back! Skip the intake and go straight to scheduling your next session.',
		ctaLabel: 'Schedule now',
		ctaHref: '#calendly',
		variant: 'secondary',
	},
];

const TwoPaths = () => {
	return (
		<div className="twoPaths">
			{cards.map((card) => (
				<PathCard key={card.title} {...card} />
			))}
		</div>
	);
};

export default TwoPaths;
