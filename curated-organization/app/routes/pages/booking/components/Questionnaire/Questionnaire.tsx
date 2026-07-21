import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import './questionnaire.css';
import type { QuestionnaireProps } from './Questionnaire.types';
import {
	parseInquiry,
	type Inquiry,
	SPACE_LABELS,
	TIMEFRAME_LABELS,
	SERVICE_LABELS,
	REFERRAL_LABELS,
} from '../../utils';

const Questionnaire = ({ onSubmit }: QuestionnaireProps) => {
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof Inquiry, string>>
	>({});
	const [spaces, setSpaces] = useState<string[]>([]);
	const [spacesOpen, setSpacesOpen] = useState(false);
	const spacesRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!spacesOpen) {
			return;
		}

		const handlePointerDown = (event: PointerEvent) => {
			if (!spacesRef.current?.contains(event.target as Node)) {
				setSpacesOpen(false);
			}
		};
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setSpacesOpen(false);
			}
		};

		document.addEventListener('pointerdown', handlePointerDown);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('pointerdown', handlePointerDown);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [spacesOpen]);

	const toggleSpace = (value: string) => {
		setSpaces((prev) =>
			prev.includes(value)
				? prev.filter((v) => v !== value)
				: [...prev, value],
		);
	};

	const spacesSummary = spaces
		.map((value) => SPACE_LABELS[value as keyof typeof SPACE_LABELS])
		.join(', ');

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
					<label className="formLabel" id="spaces-label">
						Which spaces need attention?
					</label>
					<div className="formMultiSelect" ref={spacesRef}>
						<button
							type="button"
							className="formMultiSelectButton"
							aria-haspopup="true"
							aria-expanded={spacesOpen}
							aria-labelledby="spaces-label"
							aria-invalid={
								fieldErrors.spaces && spaces.length === 0 ? true : undefined
							}
							aria-describedby={
								fieldErrors.spaces && spaces.length === 0
									? 'spaces-error'
									: undefined
							}
							onClick={() => setSpacesOpen((open) => !open)}
						>
							{spaces.length > 0 ? (
								<span className="formMultiSelectButtonValue">
									{spacesSummary}
								</span>
							) : (
								<span className="formMultiSelectButtonPlaceholder">
									Select all that apply
								</span>
							)}
							<svg
								className="formMultiSelectChevron"
								viewBox="0 0 12 12"
								fill="none"
								aria-hidden="true"
							>
								<path d="M6 8L1 3h10z" fill="currentColor" />
							</svg>
						</button>
						{/* Always rendered (not just while open) so the checked boxes stay
						    part of the form submission — hidden visually via the `hidden`
						    attribute rather than unmounted, which would drop them from
						    FormData whenever the panel is closed at submit time. */}
						<div className="formMultiSelectPanel" hidden={!spacesOpen}>
							{Object.entries(SPACE_LABELS).map(([value, label]) => (
								<label key={value} className="formMultiSelectOption">
									<input
										type="checkbox"
										name="spaces"
										value={value}
										checked={spaces.includes(value)}
										onChange={() => toggleSpace(value)}
									/>
									{label}
								</label>
							))}
						</div>
					</div>
					{fieldErrors.spaces && spaces.length === 0 && (
						<p className="formError" id="spaces-error" aria-live="polite">
							{fieldErrors.spaces}
						</p>
					)}
				</div>

				<div className="formRow">
					<label className="formLabel" htmlFor="timeframe">
						What is your ideal timeframe?
					</label>
					<select
						id="timeframe"
						name="timeframe"
						className="formSelect"
						aria-invalid={fieldErrors.timeframe ? true : undefined}
						aria-describedby={
							fieldErrors.timeframe ? 'timeframe-error' : undefined
						}
					>
						<option value="">Select a timeframe</option>
						{Object.entries(TIMEFRAME_LABELS).map(([value, label]) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
					{fieldErrors.timeframe && (
						<p className="formError" id="timeframe-error" aria-live="polite">
							{fieldErrors.timeframe}
						</p>
					)}
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
