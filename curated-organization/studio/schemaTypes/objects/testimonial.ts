import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const testimonial = defineType({
	name: 'testimonial',
	title: 'Testimonial',
	type: 'object',
	icon: icons.comment,
	fields: [
		defineField({
			name: 'quote',
			title: 'Quote',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'clientName',
			title: 'Client name',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'clientLocation',
			title: 'Client location',
			type: 'string',
		}),
		defineField({
			name: 'rating',
			title: 'Rating',
			type: 'number',
			options: {
				list: [1, 2, 3, 4, 5],
				layout: 'radio',
			},
			initialValue: 5,
			validation: (rule) => rule.required().min(1).max(5),
		}),
	],
	preview: {
		select: {title: 'clientName', subtitle: 'clientLocation'},
	},
})
