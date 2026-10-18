# Contract: `BOOKING_QUERY`

`BOOKING_QUERY` is defined in `app/routes/pages/booking/booking.query.ts` and fetched only by `booking.loader.server.ts`.

```groq
{
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
}
```

The result has the shape `{ page: CmsBookingPage | null; settings: CmsBookingSettings | null }`, and any field may be `null`. The client uses the published perspective, so drafts are excluded.

## Studio field contract

```ts
// In bookingPage.calendar.fields
defineField({
	name: 'calendlyUrl',
	title: 'Calendly scheduling link',
	description: 'The Calendly event visitors book. Overrides the link the developer set; leave blank to use it.',
	type: 'url',
	validation: (rule) =>
		rule.uri({ scheme: ['https'] }).custom((value) =>
			!value || isCalendlyUrl(value) ? true : 'Use your Calendly link, e.g. https://calendly.com/your-name'),
})
```
