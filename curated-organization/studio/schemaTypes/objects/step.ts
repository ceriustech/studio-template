import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const step = defineType({
	name: 'step',
	title: 'Step',
	type: 'object',
	icon: icons.number,
	description: 'A single numbered step, used by both the Process and What to Expect sections.',
	fields: [
		defineField({
			name: 'number',
			title: 'Number',
			type: 'string',
			description: 'Displayed label, e.g. "01".',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 2,
		}),
	],
	preview: {
		select: {title: 'title', subtitle: 'number'},
	},
})
