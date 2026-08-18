import React from 'react';
import './whatToExpect.css';
import type { WhatToExpectProps, WhatToExpectStep } from './WhatToExpect.types';

const steps: WhatToExpectStep[] = [
	{
		number: '01',
		title: 'Confirmation email',
		description:
			"You'll receive a calendar invite with a Zoom or phone link within minutes",
	},
	{
		number: '02',
		title: '30-minute consultation',
		description:
			"We'll discuss your space, goals, timeline, and answer any questions you have",
	},
	{
		number: '03',
		title: 'Custom proposal',
		description:
			'Following our discussion, we’ll curate a custom project plan and detailed quote for your review',
	},
];

const WhatToExpect: React.FC<WhatToExpectProps> = () => {
	return (
		<section className="whatToExpect">
			<div className="whatToExpectHeader">
				<p className="sectionEyebrow">What to Expect</p>
				<h2 className="sectionHeading">After you book</h2>
			</div>

			<div className="whatToExpectGrid">
				{steps.map((step, index) => (
					<div key={step.number} className="whatToExpectStep">
						<div className="whatToExpectNum">{step.number}</div>
						<h3 className="whatToExpectTitle">{step.title}</h3>
						<p className="whatToExpectDesc">{step.description}</p>
						{index < steps.length - 1 && (
							<div className="whatToExpectConnector" aria-hidden="true" />
						)}
					</div>
				))}
			</div>
		</section>
	);
};

export default WhatToExpect;
