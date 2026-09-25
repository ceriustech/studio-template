import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const contactLink = defineType({
	name: 'contactLink',
	title: 'Contact link',
	type: 'object',
	icon: icons.link,
	description: 'A single footer "Connect" or social link (e.g. Email, Phone, Instagram).',
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
			type: 'string',
			description: 'mailto:, tel:, or https:// link.',
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {title: 'label', subtitle: 'url'},
	},
})
