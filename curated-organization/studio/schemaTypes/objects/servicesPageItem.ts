import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'
import {altTextField} from '../fields/altText'

export const servicesPageItem = defineType({
	name: 'servicesPageItem',
	title: 'Service',
	type: 'object',
	icon: icons.list,
	description: 'A full entry in the Services page service list (image, description, and feature bullets).',
	fields: [
		defineField({
			name: 'eyebrow',
			title: 'Eyebrow',
			description: 'Displayed number label, e.g. "01".',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'heading',
			title: 'Heading',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 3,
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			options: {hotspot: true},
			fields: [altTextField],
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'items',
			title: 'Feature bullets',
			type: 'array',
			of: [{type: 'string'}],
		}),
		defineField({
			name: 'ctaLabel',
			title: 'CTA label',
			type: 'string',
			initialValue: 'Get started',
		}),
	],
	preview: {
		select: {title: 'heading', subtitle: 'eyebrow', media: 'image'},
	},
})
