import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'
import {GALLERY_CATEGORIES} from '../constants'

export const portfolioPiece = defineType({
	name: 'portfolioPiece',
	title: 'Portfolio piece',
	type: 'document',
	icon: icons.images,
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {source: 'title'},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'category',
			title: 'Category',
			type: 'string',
			options: {list: GALLERY_CATEGORIES},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'location',
			title: 'Location',
			description: 'e.g. "Arlington, VA"',
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
			name: 'videos',
			title: 'Before/after videos',
			type: 'array',
			of: [{type: 'videoMedia'}],
			validation: (rule) => rule.max(2),
		}),
		defineField({
			name: 'images',
			title: 'Images',
			type: 'array',
			of: [{type: 'imageMedia'}],
			validation: (rule) => rule.min(1),
		}),
	],
	preview: {
		select: {title: 'title', subtitle: 'location', media: 'images.0.image'},
	},
})
