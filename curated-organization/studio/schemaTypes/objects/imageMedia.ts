import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const imageMedia = defineType({
	name: 'imageMedia',
	title: 'Image',
	type: 'object',
	icon: icons.image,
	fields: [
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
		defineField({
			name: 'caption',
			title: 'Caption',
			type: 'string',
		}),
		defineField({
			name: 'fullImage',
			title: 'Full-resolution override',
			description: 'Optional. Used for the lightbox view when it should differ from the gallery thumbnail.',
			type: 'image',
			options: {hotspot: true},
		}),
	],
	preview: {
		select: {title: 'caption', subtitle: 'alt', media: 'image'},
	},
})
