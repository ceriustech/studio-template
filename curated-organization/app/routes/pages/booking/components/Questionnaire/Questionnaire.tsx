import { useState, type SubmitEvent } from 'react';
import './questionnaire.css';
import type { QuestionnaireProps } from './Questionnaire.types';
import { parseInquiry, formatPhoneNumber } from '../../utils';

type RequiredFieldErrors = Partial<
	Record<'firstName' | 'lastName' | 'email', string>
>;

const Questionnaire = ({ content, onSubmit }: QuestionnaireProps) => {
	const [phone, setPhone] = useState('');
	const [errors, setErrors] = useState<RequiredFieldErrors>({});
	const { fields } = content;

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		const parsed = parseInquiry(formData, content.messages);

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
				{content.eyebrow && <p className="sectionEyebrow">{content.eyebrow}</p>}
				<h2 className="sectionHeading">{content.heading}</h2>
				{content.intro && <p>{content.intro}</p>}
			</div>

			<form className="formContainer" onSubmit={handleSubmit} noValidate>
				<div className="formSectionLabel">{content.aboutYouLabel}</div>

				<div className="formRowDouble">
					<div>
						<label className="formLabel" htmlFor="firstName">
							{fields.firstName.label}
						</label>
						<input
							id="firstName"
							name="firstName"
							type="text"
							className="formInput"
							placeholder={fields.firstName.placeholder}
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
							{fields.lastName.label}
						</label>
						<input
							id="lastName"
							name="lastName"
							type="text"
							className="formInput"
							placeholder={fields.lastName.placeholder}
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
							{fields.email.label}
						</label>
						<input
							id="email"
							name="email"
							type="email"
							className="formInput"
							placeholder={fields.email.placeholder}
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
							{fields.phone.label}
						</label>
						<input
							id="phone"
							name="phone"
							type="tel"
							className="formInput"
							placeholder={fields.phone.placeholder}
							value={phone}
							onChange={(event) =>
								setPhone(formatPhoneNumber(event.target.value))
							}
						/>
					</div>
				</div>

				<div className="formDivider" />
				<div className="formSectionLabel">{content.anythingElseLabel}</div>

				<div className="formRow">
					<label className="formLabel" htmlFor="notes">
						{fields.notes.label}
					</label>
					<textarea
						id="notes"
						name="notes"
						className="formTextarea"
						placeholder={fields.notes.placeholder}
					/>
				</div>

				<div className="formDivider" />

				<div className="formSubmitArea">
					<button type="submit" className="formSubmit">
						{content.submitLabel}
					</button>
					{content.submitNote && (
						<p className="formSubmitNote">{content.submitNote}</p>
					)}
				</div>
			</form>
		</section>
	);
};

export default Questionnaire;
