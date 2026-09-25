import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const seo = defineType({
	name: 'seo',
	title: 'SEO',
	type: 'object',
	icon: icons.search,
	fields: [
		defineField({
			name: 'metaTitle',
			title: 'Meta title',
			type: 'string',
			validation: (rule) => rule.required().max(70),
		}),
		defineField({
			name: 'metaDescription',
			title: 'Meta description',
			type: 'text',
			rows: 3,
			validation: (rule) => rule.required().max(200),
		}),
		defineField({
			name: 'keywords',
			title: 'Keywords',
			type: 'array',
			of: [{type: 'string'}],
			options: {layout: 'tags'},
		}),
		defineField({
			name: 'ogImage',
			title: 'Social share image',
			type: 'image',
			options: {hotspot: true},
		}),
	],
})
