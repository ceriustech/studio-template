import { defineQuery } from 'groq';

export const BOOKING_QUERY = defineQuery(`{
	"page": *[_id == "bookingPage"][0]{
		hero{ eyebrow, heading, body },
		twoPaths[]{
			kind, icon, title, description,
			options[]{ icon, label },
			ctaLabel, ctaHref, variant
		},
		callInfo{ eyebrow, heading, intro, switchToEmailLabel },
		questionnaire{
			eyebrow, heading, intro,
			aboutYouSectionLabel,
			firstNameLabel, firstNamePlaceholder,
			lastNameLabel, lastNamePlaceholder,
			emailLabel, emailPlaceholder,
			phoneLabel, phonePlaceholder,
			anythingElseSectionLabel,
			notesLabel, notesPlaceholder,
			submitLabel, submitNote,
			validationMessages{ firstNameRequired, lastNameRequired, emailRequired, emailInvalid }
		},
		calendar{ eyebrow, heading, calendlyUrl, errorIcon, errorTitle, errorDescription },
		whatToExpect{ eyebrow, heading, steps[]{ number, title, description } },
		seo{ title, description, image{ asset, crop, hotspot, alt } }
	},
	"settings": *[_id == "siteSettings"][0]{
		businessName, businessPhoneDisplay, businessPhoneTel, businessHours
	}
}`);
