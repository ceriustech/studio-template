import {at, createIfNotExists, defineMigration, patch, transaction, unset} from 'sanity/migrate'

type TestimonialItem = {
	_key: string
	_type: string
	quote?: string
	clientName?: string
	clientLocation?: string
}

// Names were saved as e.g. "— Sarah M.,"; the site adds its own dash and comma.
const cleanName = (name: string) =>
	name
		.trim()
		.replace(/^[—–-]+\s*/, '')
		.replace(/[\s,]+$/, '')

/**
 * Moves the Home page's testimonials list into separate Testimonial documents and removes the list.
 * Ratings aren't copied: the site always shows 5 stars.
 * Everything runs in one transaction so the new documents share a _createdAt; the Home page orders
 * by _createdAt desc, _id asc, so testimonial-migrated-1..n keep the list's current order.
 */
export default defineMigration({
	title: 'Move Home page testimonials into their own Testimonial documents',
	documentTypes: ['homePage'],

	migrate: {
		document(doc) {
			// Already migrated.
			if (doc.testimonials === undefined) return

			const removeList = patch(doc._id, at('testimonials', unset()))

			// Only the published Home page creates documents, so a draft can't create them twice.
			if (doc._id.startsWith('drafts.')) return removeList

			const items = (doc.testimonials ?? []) as TestimonialItem[]
			const creates = items.map(({quote, clientName, clientLocation}, index) =>
				createIfNotExists({
					_id: `testimonial-migrated-${index + 1}`,
					_type: 'testimonial',
					...(quote !== undefined && {quote}),
					clientName: cleanName(clientName ?? ''),
					...(clientLocation !== undefined && {clientLocation}),
				}),
			)

			return transaction([...creates, removeList])
		},
	},
})
