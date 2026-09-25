import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const serviceCard = defineType({
	name: 'serviceCard',
	title: 'Service card',
	type: 'object',
	icon: icons['stack-compact'],
	description: 'Home page services teaser card (authored independently from the full Services page list).',
	fields: [
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
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			options: {hotspot: true},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'alt',
			title: 'Alt text',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {title: 'title', media: 'image'},
	},
})
