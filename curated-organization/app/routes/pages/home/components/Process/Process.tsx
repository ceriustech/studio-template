import React from 'react';
import './process.css';
import type { ProcessProps, ProcessStep } from './Process.types';

const processSteps: ProcessStep[] = [
	{
		number: '01',
		title: 'Consultation',
		description:
			'Free 30-minute video or in-person assessment of your space and goals',
	},
	{
		number: '02',
		title: 'Design + curate personalized plan',
		description:
			'Custom plan, product sourcing, and everything you need before we arrive',
	},
	{
		number: '03',
		title: 'Edit + Organizing',
		description:
			'We sort, declutter, build systems, label, and style your space to perfection',
	},
	{
		number: '04',
		title: 'Ongoing Support',
		description:
			'options for regular check-ins and scheduled maintenance/ maintenance packages',
	},
];

const Process: React.FC<ProcessProps> = () => {
	return (
		<section className="process">
			<div className="processHeader">
				<p className="sectionEyebrow">Our process</p>
				<h2 className="sectionHeading">How it works</h2>
			</div>

			<div className="processGrid">
				{processSteps.map((step, index) => (
					<div key={step.number} className="processStep">
						<div className="processNum">{step.number}</div>
						<h3 className="processTitle">{step.title}</h3>
						<p className="processDesc">{step.description}</p>
						{index < processSteps.length - 1 && (
							<div className="processConnector" aria-hidden="true" />
						)}
					</div>
				))}
			</div>
		</section>
	);
};

export default Process;
