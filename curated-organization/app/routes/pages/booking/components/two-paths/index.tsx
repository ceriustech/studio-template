import './two-paths.css';
import PathCard from './components/PathCard/PathCard';
import type { TwoPathsProps } from './TwoPaths.types';
import type { PathCardIcon, PathOptionIcon } from '../../booking.types';
import { FaPhoneSquareAlt, FaEnvelope } from 'react-icons/fa';

const CARD_ICON: Record<PathCardIcon, string> = { plus: '+', refresh: '↻' };

const OPTION_ICON: Record<PathOptionIcon, React.ReactNode> = {
	phone: <FaPhoneSquareAlt />,
	email: <FaEnvelope />,
};

const TwoPaths = ({
	cards,
	onSelectCall,
	onSelectEmail,
	onBookAgain,
}: TwoPathsProps) => {
	// The option's icon decides which section it opens.
	const optionHandler: Record<PathOptionIcon, () => void> = {
		phone: onSelectCall,
		email: onSelectEmail,
	};

	return (
		<div className="twoPaths">
			{cards.map((card, index) =>
				card.kind === 'options' ? (
					<PathCard
						key={index}
						icon={CARD_ICON[card.icon]}
						title={card.title}
						description={card.description}
						kind="options"
						options={card.options.map((option) => ({
							icon: OPTION_ICON[option.icon],
							label: option.label,
							onClick: optionHandler[option.icon],
						}))}
					/>
				) : (
					<PathCard
						key={index}
						icon={CARD_ICON[card.icon]}
						title={card.title}
						description={card.description}
						kind="cta"
						ctaLabel={card.ctaLabel}
						ctaHref={card.ctaHref}
						variant={card.variant}
						onClick={onBookAgain}
					/>
				),
			)}
		</div>
	);
};

export default TwoPaths;
