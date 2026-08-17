import './callInfo.css';
import type { CallInfoProps } from './CallInfo.types';

const BUSINESS_PHONE = '(703) 555-0182';
const BUSINESS_PHONE_TEL = 'tel:+17035550182';
const BUSINESS_HOURS = 'Mon-Fri, 9am-5pm ET · Sat by appointment';

const CallInfo = ({ onPreferEmail }: CallInfoProps) => {
	return (
		<section className="callInfo" id="call">
			<p className="sectionEyebrow">Give us a call</p>
			<h2 className="sectionHeading">We'd love to hear from you</h2>
			<p className="callIntro">
				Call and we'll talk through your space, answer questions, and find a
				time that works — no forms required.
			</p>
			<a href={BUSINESS_PHONE_TEL} className="callPhone">
				{BUSINESS_PHONE}
			</a>
			<p className="callHours">{BUSINESS_HOURS}</p>
			<a
				href="#questionnaire"
				className="callSwitchLink"
				onClick={(event) => {
					event.preventDefault();
					onPreferEmail();
				}}
			>
				Prefer to write? Send us your details instead →
			</a>
		</section>
	);
};

export default CallInfo;
