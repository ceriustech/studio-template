import './two-paths.css';
import PathCard from './components/PathCard/PathCard';
import type { TwoPathsProps } from './TwoPaths.types';

const TwoPaths = ({ onSelectCall, onSelectEmail, onBookAgain }: TwoPathsProps) => {
	return (
		<div className="twoPaths">
			<PathCard
				icon="+"
				title="Get started"
				description="New to Curated? Reach out however works best for you."
				kind="options"
				options={[
					{ icon: '☎', label: 'Call us', onClick: onSelectCall },
					{ icon: '✉', label: 'Email us', onClick: onSelectEmail },
				]}
			/>
			<PathCard
				icon="↻"
				title="Book again"
				description="Welcome back! Skip the intake and go straight to scheduling your next session."
				kind="cta"
				ctaLabel="Schedule now"
				ctaHref="#calendly"
				variant="secondary"
				onClick={onBookAgain}
			/>
		</div>
	);
};

export default TwoPaths;
