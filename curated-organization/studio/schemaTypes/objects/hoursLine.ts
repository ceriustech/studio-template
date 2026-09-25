import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const hoursLine = defineType({
	name: 'hoursLine',
	title: 'Hours line',
	type: 'object',
	icon: icons.clock,
	fields: [
		defineField({
			name: 'label',
			title: 'Label',
			description: 'e.g. "Mon–Fri"',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'value',
			title: 'Value',
			description: 'e.g. "9am–5pm ET"',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {title: 'label', subtitle: 'value'},
	},
})
