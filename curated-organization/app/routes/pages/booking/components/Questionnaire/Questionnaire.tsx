import { useState, type SubmitEvent } from 'react';
import './questionnaire.css';
import type { QuestionnaireProps } from './Questionnaire.types';
import {
	parseInquiry,
	type Inquiry,
	SERVICE_LABELS,
	INVESTMENT_LABELS,
	DECISION_LABELS,
	REFERRAL_LABELS,
} from '../../utils';

const Questionnaire = ({ onSubmit }: QuestionnaireProps) => {
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof Inquiry, string>>
	>({});

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const parsed = parseInquiry(formData);

		if (!parsed.success) {
			const errors: Partial<Record<keyof Inquiry, string>> = {};
			for (const issue of parsed.error.issues) {
				const key = issue.path[0] as keyof Inquiry;
				if (!errors[key]) {
					errors[key] = issue.message;
				}
			}
			setFieldErrors(errors);
			return;
		}

		setFieldErrors({});
		onSubmit(parsed.data);
	};

	return (
		<section className="questionnaire" id="questionnaire">
			<div className="questionnaireHeader">
				<p className="sectionEyebrow">New client intake</p>
				<h2 className="sectionHeading">Tell us about your space</h2>
				<p>
					Your answers help us prepare for a productive consultation.
					Everything here is confidential.
				</p>
			</div>

			<form className="formContainer" onSubmit={handleSubmit}>
				<div className="formSectionLabel">About you</div>

				<div className="formRowDouble">
					<div>
						<label className="formLabel" htmlFor="firstName">
							First name
						</label>
						<input
							id="firstName"
							name="firstName"
							type="text"
							className="formInput"
							placeholder="Jane"
							aria-invalid={fieldErrors.firstName ? true : undefined}
							aria-describedby={
								fieldErrors.firstName ? 'firstName-error' : undefined
							}
						/>
						{fieldErrors.firstName && (
							<p className="formError" id="firstName-error" aria-live="polite">
								{fieldErrors.firstName}
							</p>
						)}
					</div>
					<div>
						<label className="formLabel" htmlFor="lastName">
							Last name
						</label>
						<input
							id="lastName"
							name="lastName"
							type="text"
							className="formInput"
							placeholder="Smith"
							aria-invalid={fieldErrors.lastName ? true : undefined}
							aria-describedby={
								fieldErrors.lastName ? 'lastName-error' : undefined
							}
						/>
						{fieldErrors.lastName && (
							<p className="formError" id="lastName-error" aria-live="polite">
								{fieldErrors.lastName}
							</p>
						)}
					</div>
				</div>

				<div className="formRowDouble">
					<div>
						<label className="formLabel" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							className="formInput"
							placeholder="jane@example.com"
							aria-invalid={fieldErrors.email ? true : undefined}
							aria-describedby={fieldErrors.email ? 'email-error' : undefined}
						/>
						{fieldErrors.email && (
							<p className="formError" id="email-error" aria-live="polite">
								{fieldErrors.email}
							</p>
						)}
					</div>
					<div>
						<label className="formLabel" htmlFor="phone">
							Phone
						</label>
						<input
							id="phone"
							name="phone"
							type="tel"
							className="formInput"
							placeholder="(555) 123-4567"
						/>
					</div>
				</div>

				<div className="formRow">
					<label className="formLabel" htmlFor="location">
						Your location (city or zip code)
					</label>
					<input
						id="location"
						name="location"
						type="text"
						className="formInput"
						placeholder="Arlington, VA 22201"
					/>
				</div>

				<div className="formDivider" />
				<div className="formSectionLabel">About your project</div>

				<div className="formRow">
					<label className="formLabel" htmlFor="service">
						Which service are you interested in?
					</label>
					<select id="service" name="service" className="formSelect">
						<option value="">Select a service</option>
						{Object.entries(SERVICE_LABELS).map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
				</div>

				<div className="formRow">
					<label className="formLabel" htmlFor="deadline">
						If you have a project deadline, please specify here:
					</label>
					<input
						id="deadline"
						name="deadline"
						type="text"
						className="formInput"
						placeholder="e.g., move-in date, event date, or no rush"
					/>
				</div>

				<div className="formRow">
					<label className="formLabel" htmlFor="investmentTarget">
						What is your rough investment target for this project?
					</label>
					<select
						id="investmentTarget"
						name="investmentTarget"
						className="formSelect"
					>
						<option value="">Select a range</option>
						{Object.entries(INVESTMENT_LABELS).map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
				</div>

				<div className="formRow">
					<label className="formLabel" htmlFor="decisionMakersReady">
						Are all key decision-makers on board and available to join the
						initial consultation?
					</label>
					<select
						id="decisionMakersReady"
						name="decisionMakersReady"
						className="formSelect"
					>
						<option value="">Select one</option>
						{Object.entries(DECISION_LABELS).map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
				</div>

				<div className="formRow">
					<label className="formLabel" htmlFor="referral">
						How did you hear about us?
					</label>
					<select id="referral" name="referral" className="formSelect">
						<option value="">Select one</option>
						{Object.entries(REFERRAL_LABELS).map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
				</div>

				<div className="formRow">
					<label className="formLabel" htmlFor="notes">
						Anything else you'd like us to know?
					</label>
					<textarea
						id="notes"
						name="notes"
						className="formTextarea"
						placeholder="Tell us about your goals, challenges, or any specific needs..."
						aria-invalid={fieldErrors.notes ? true : undefined}
						aria-describedby={fieldErrors.notes ? 'notes-error' : undefined}
					/>
					{fieldErrors.notes && (
						<p className="formError" id="notes-error" aria-live="polite">
							{fieldErrors.notes}
						</p>
					)}
				</div>

				<div className="formDivider" />

				<div className="formSubmitArea">
					<button type="submit" className="formSubmit">
						Continue to scheduling →
					</button>
					<p className="formSubmitNote">
						You'll choose a consultation time on the next step
					</p>
				</div>
			</form>
		</section>
	);
};

export default Questionnaire;
