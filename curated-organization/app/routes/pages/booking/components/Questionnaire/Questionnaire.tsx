import { useState, type SubmitEvent } from 'react';
import './questionnaire.css';
import type { QuestionnaireProps } from './Questionnaire.types';
import { parseInquiry, formatPhoneNumber } from '../../utils';

type RequiredFieldErrors = Partial<
	Record<'firstName' | 'lastName' | 'email', string>
>;

const Questionnaire = ({ onSubmit }: QuestionnaireProps) => {
	const [phone, setPhone] = useState('');
	const [errors, setErrors] = useState<RequiredFieldErrors>({});

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const parsed = parseInquiry(formData);

		if (!parsed.success) {
			const fieldErrors = parsed.error.flatten().fieldErrors;
			setErrors({
				firstName: fieldErrors.firstName?.[0],
				lastName: fieldErrors.lastName?.[0],
				email: fieldErrors.email?.[0],
			});
			return;
		}

		setErrors({});
		onSubmit(parsed.data);
	};

	return (
		<section className="questionnaire" id="questionnaire">
			<div className="questionnaireHeader">
				<p className="sectionEyebrow">New client intake</p>
				<h2 className="sectionHeading">Tell us about your space</h2>
				<p>
					Just your contact details and anything you'd like us to know.
					We'll cover the rest during your consultation.
				</p>
			</div>

			<form className="formContainer" onSubmit={handleSubmit} noValidate>
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
							placeholder="First name"
							aria-invalid={Boolean(errors.firstName)}
							aria-describedby={
								errors.firstName ? 'firstName-error' : undefined
							}
						/>
						{errors.firstName && (
							<p id="firstName-error" role="alert" className="formError">
								{errors.firstName}
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
							placeholder="Last name"
							aria-invalid={Boolean(errors.lastName)}
							aria-describedby={
								errors.lastName ? 'lastName-error' : undefined
							}
						/>
						{errors.lastName && (
							<p id="lastName-error" role="alert" className="formError">
								{errors.lastName}
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
							placeholder="youremail@example.com"
							aria-invalid={Boolean(errors.email)}
							aria-describedby={errors.email ? 'email-error' : undefined}
						/>
						{errors.email && (
							<p id="email-error" role="alert" className="formError">
								{errors.email}
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
							value={phone}
							onChange={(event) =>
								setPhone(formatPhoneNumber(event.target.value))
							}
						/>
					</div>
				</div>

				<div className="formDivider" />
				<div className="formSectionLabel">Anything else</div>

				<div className="formRow">
					<label className="formLabel" htmlFor="notes">
						Anything you'd like us to know?
					</label>
					<textarea
						id="notes"
						name="notes"
						className="formTextarea"
						placeholder="Goals, challenges, or anything that would help us prepare..."
					/>
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
