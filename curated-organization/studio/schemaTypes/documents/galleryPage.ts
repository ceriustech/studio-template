import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const galleryPage = defineType({
	name: 'galleryPage',
	title: 'Gallery page',
	type: 'document',
	icon: icons.images,
	description: 'Portfolio pieces are managed as their own documents and queried by category, not listed here.',
	groups: [
		{name: 'hero', title: 'Hero'},
		{name: 'seo', title: 'SEO'},
	],
	fields: [
		defineField({
			name: 'hero',
			title: 'Hero',
			type: 'heroSection',
			group: 'hero',
		}),
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
			group: 'seo',
		}),
	],
	preview: {
		prepare: () => ({title: 'Gallery page'}),
	},
})
