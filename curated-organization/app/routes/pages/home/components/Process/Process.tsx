import React from 'react';
import './process.css';
import type { ProcessProps } from './Process.types';

const Process: React.FC<ProcessProps> = ({ eyebrow, heading, steps }) => {
	return (
		<section className="process">
			<div className="processHeader">
				{eyebrow && <p className="sectionEyebrow">{eyebrow}</p>}
				<h2 className="sectionHeading">{heading}</h2>
			</div>

			<div className="processGrid">
				{steps.map((step, index) => (
					<div key={`${step.number}-${step.title}`} className="processStep">
						<div className="processNum">{step.number}</div>
						<h3 className="processTitle">{step.title}</h3>
						{step.description && <p className="processDesc">{step.description}</p>}
						{index < steps.length - 1 && (
							<div className="processConnector" aria-hidden="true" />
						)}
					</div>
				))}
			</div>
		</section>
	);
};

export default Process;
