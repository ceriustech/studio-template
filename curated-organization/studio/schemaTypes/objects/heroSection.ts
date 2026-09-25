import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const heroSection = defineType({
	name: 'heroSection',
	title: 'Hero section',
	type: 'object',
	icon: icons.images,
	description:
		'Eyebrow + heading + body used across every page hero, and reused for text-only intro sections (leave images/CTA empty when not needed).',
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
			of: [{type: 'image', options: {hotspot: true}}],
		}),
		defineField({
			name: 'linkLabel',
			title: 'Link/button label',
			type: 'string',
		}),
		defineField({
			name: 'linkHref',
			title: 'Link/button destination',
			type: 'string',
			description: 'Internal path (e.g. /booking) or external URL.',
			hidden: ({parent}) => !parent?.linkLabel,
		}),
	],
})
