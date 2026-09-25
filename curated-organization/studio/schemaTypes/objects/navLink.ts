import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const navLink = defineType({
	name: 'navLink',
	title: 'Nav link',
	type: 'object',
	icon: icons.link,
	fields: [
		defineField({
			name: 'label',
			title: 'Label',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'url',
			title: 'URL',
			description: 'Internal path (e.g. /services) or external URL.',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {title: 'label', subtitle: 'url'},
	},
})
