import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const siteCta = defineType({
	name: 'siteCta',
	title: 'Site CTA',
	type: 'document',
	icon: icons.launch,
	description:
		'The global call-to-action banner shown on every page except Booking (which shows "What to expect" instead).',
	fields: [
		defineField({
			name: 'backgroundImage',
			title: 'Background image',
			type: 'image',
			options: {hotspot: true},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'heading',
			title: 'Heading',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'subheading',
			title: 'Subheading',
			type: 'text',
			rows: 2,
		}),
		defineField({
			name: 'buttonLabel',
			title: 'Button label',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'buttonLink',
			title: 'Button destination',
			type: 'string',
			initialValue: '/booking',
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {title: 'heading', media: 'backgroundImage'},
	},
})
