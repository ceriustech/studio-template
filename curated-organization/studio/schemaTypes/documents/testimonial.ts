import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const testimonial = defineType({
	name: 'testimonial',
	title: 'Testimonial',
	type: 'document',
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
			description: 'Name only. The site adds the dash before it and the comma before the location.',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'clientLocation',
			title: 'Client location',
			type: 'string',
		}),
	],
	preview: {
		select: {title: 'clientName', subtitle: 'clientLocation'},
	},
})
