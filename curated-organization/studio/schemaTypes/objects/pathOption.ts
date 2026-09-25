import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const pathOption = defineType({
	name: 'pathOption',
	title: 'Path option',
	type: 'object',
	icon: icons['chevron-right'],
	fields: [
		defineField({
			name: 'icon',
			title: 'Icon',
			type: 'string',
			options: {
				list: [
					{title: 'Phone', value: 'phone'},
					{title: 'Email', value: 'email'},
				],
				layout: 'radio',
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'label',
			title: 'Label',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {title: 'label', subtitle: 'icon'},
	},
})
