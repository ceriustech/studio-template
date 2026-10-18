import './callInfo.css';
import type { CallInfoProps } from './CallInfo.types';

const CallInfo = ({ content, onPreferEmail }: CallInfoProps) => {
	const { eyebrow, heading, intro, switchToEmailLabel, phone, hours } = content;

	return (
		<section className="callInfo" id="call">
			{eyebrow && <p className="sectionEyebrow">{eyebrow}</p>}
			<h2 className="sectionHeading">{heading}</h2>
			{intro && <p className="callIntro">{intro}</p>}
			<a href={`tel:${phone.tel}`} className="callPhone">
				{phone.display}
			</a>
			{hours && <p className="callHours">{hours}</p>}
			<a
				href="#questionnaire"
				className="callSwitchLink"
				onClick={(event) => {
					event.preventDefault();
					onPreferEmail();
				}}
			>
				{switchToEmailLabel}
			</a>
		</section>
	);
};

export default CallInfo;
