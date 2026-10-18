import React from 'react';
import './whatToExpect.css';
import type { WhatToExpectProps } from './WhatToExpect.types';

const WhatToExpect: React.FC<WhatToExpectProps> = ({ eyebrow, heading, steps }) => {
	return (
		<section className="whatToExpect">
			<div className="whatToExpectHeader">
				{eyebrow && <p className="sectionEyebrow">{eyebrow}</p>}
				<h2 className="sectionHeading">{heading}</h2>
			</div>

			<div className="whatToExpectGrid">
				{steps.map((step, index) => (
					<div key={index} className="whatToExpectStep">
						<div className="whatToExpectNum">{step.number}</div>
						<h3 className="whatToExpectTitle">{step.title}</h3>
						{step.description && <p className="whatToExpectDesc">{step.description}</p>}
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
