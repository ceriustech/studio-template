import './pathCard.css';
import type { PathCardProps } from './PathCard.types';

const PathCard = (props: PathCardProps) => {
	const { icon, title, description } = props;

	return (
		<div className="pathCard">
			<div className="pathIcon">{icon}</div>
			<div className="pathTitle">{title}</div>
			<p className="pathDesc">{description}</p>
			{props.kind === 'cta' ? (
				<a
					href={props.ctaHref}
					className={
						props.variant === 'primary'
							? 'pathBtn pathBtnPrimary'
							: 'pathBtn pathBtnSecondary'
					}
					onClick={
						props.onClick
							? (event) => {
									event.preventDefault();
									props.onClick?.();
								}
							: undefined
					}
				>
					{props.ctaLabel}
				</a>
			) : (
				<div className="pathOptions">
					{props.options.map((option) => (
						<a
							key={option.label}
							href="#"
							className="pathOption"
							onClick={(event) => {
								event.preventDefault();
								option.onClick();
							}}
						>
							<span className="pathOptionIcon">{option.icon}</span>
							<span className="pathOptionLabel">{option.label}</span>
						</a>
					))}
				</div>
			)}
		</div>
	);
};

export default PathCard;
