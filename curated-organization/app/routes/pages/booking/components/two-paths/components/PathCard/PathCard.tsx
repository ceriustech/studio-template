import './pathCard.css';
import type { PathCardProps } from './PathCard.types';

const PathCard = ({
	icon,
	title,
	description,
	ctaLabel,
	ctaHref,
	variant,
	onClick,
}: PathCardProps) => {
	return (
		<div className="pathCard">
			<div className="pathIcon">{icon}</div>
			<div className="pathTitle">{title}</div>
			<p className="pathDesc">{description}</p>
			<a
				href={ctaHref}
				className={
					variant === 'primary'
						? 'pathBtn pathBtnPrimary'
						: 'pathBtn pathBtnSecondary'
				}
				onClick={
					onClick
						? (event) => {
								event.preventDefault();
								onClick();
							}
						: undefined
				}
			>
				{ctaLabel}
			</a>
		</div>
	);
};

export default PathCard;
