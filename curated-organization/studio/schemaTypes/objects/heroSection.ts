import {defineField, defineType, type ConditionalPropertyCallbackContext} from 'sanity'
import {icons} from '@sanity/icons'
import {altTextField} from '../fields/altText'

type HeroExtra = 'images' | 'link'

// Pages are text-only unless listed here: document type → hero field → extras it shows.
const HERO_EXTRAS: Record<string, Record<string, HeroExtra[]>> = {
	homePage: {
		hero: ['images', 'link'],
		intro: ['link'],
	},
}

const showsExtra = ({document, path}: ConditionalPropertyCallbackContext, extra: HeroExtra) => {
	const documentType = document?._type
	const field = path[0]
	if (typeof documentType !== 'string' || typeof field !== 'string') return false
	if (!Object.hasOwn(HERO_EXTRAS, documentType)) return false
	const fields = HERO_EXTRAS[documentType]
	return Object.hasOwn(fields, field) && fields[field].includes(extra)
}

const hasValue = (value: unknown) => (Array.isArray(value) ? value.length > 0 : Boolean(value))

// Hidden fields are still validated, so leftover data on a page that doesn't use an extra
// stays visible until it's cleared; otherwise it could block publishing with no way to fix it.
const hidesExtra = (context: ConditionalPropertyCallbackContext, extra: HeroExtra) =>
	!showsExtra(context, extra) && !hasValue(context.value)

export const heroSection = defineType({
	name: 'heroSection',
	title: 'Hero section',
	type: 'object',
	icon: icons.images,
	description:
		'Small line, heading and body for a page header. Slide images and a link/button appear only on pages that use them.',
	fields: [
		defineField({
			name: 'eyebrow',
			title: 'Eyebrow',
			type: 'string',
		}),
		defineField({
			name: 'heading',
			title: 'Heading',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'body',
			title: 'Body',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'images',
			title: 'Slide images',
			description: 'Leave empty for heroes without an image carousel.',
			type: 'array',
			of: [{type: 'image', options: {hotspot: true}, fields: [altTextField]}],
			hidden: (context) => hidesExtra(context, 'images'),
		}),
		defineField({
			name: 'linkLabel',
			title: 'Link/button label',
			type: 'string',
			hidden: (context) => hidesExtra(context, 'link'),
		}),
		defineField({
			name: 'linkHref',
			title: 'Link/button destination',
			type: 'string',
			description: 'Internal path (e.g. /booking) or external URL.',
			hidden: (context) =>
				showsExtra(context, 'link') ? !context.parent?.linkLabel : !hasValue(context.value),
		}),
	],
})
