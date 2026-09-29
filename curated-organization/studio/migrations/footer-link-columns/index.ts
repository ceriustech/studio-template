import {at, defineMigration, set, unset} from 'sanity/migrate'

type LinkItem = {_key: string; _type: string; label?: string; url?: string}

/**
 * Moves footer links into the fields that match their columns:
 * connectLinks (page links) → footerNavLinks, socialLinks (contact links) → connectLinks.
 * socialLinks is removed; the footer no longer has a bottom-row social links field.
 */
export default defineMigration({
	title: 'Move footer links into their Navigate and Connect columns',
	documentTypes: ['siteSettings'],

	migrate: {
		document(doc) {
			// Already migrated; running it again would overwrite the Connect column.
			if (doc.footerNavLinks !== undefined) return

			const pageLinks = (doc.connectLinks ?? []) as LinkItem[]
			const contactLinks = (doc.socialLinks ?? []) as LinkItem[]

			return [
				at('footerNavLinks', set(pageLinks.map((link) => ({...link, _type: 'navLink'})))),
				at('connectLinks', set(contactLinks)),
				at('socialLinks', unset()),
			]
		},
	},
})
