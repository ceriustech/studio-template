import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'
import {altTextField} from '../fields/altText'

export const servicesPage = defineType({
	name: 'servicesPage',
	title: 'Services page',
	type: 'document',
	icon: icons.list,
	groups: [
		{name: 'hero', title: 'Hero'},
		{name: 'about', title: 'About'},
		{name: 'services', title: 'Services'},
		{name: 'pricing', title: 'Pricing'},
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
			name: 'about',
			title: 'About',
			type: 'object',
			group: 'about',
			description:
				'Credential badges shown alongside this section are pulled from Site Settings, not authored here.',
			fields: [
				defineField({
					name: 'photo',
					title: 'Founder photo',
					type: 'image',
					options: {hotspot: true},
					fields: [altTextField],
				}),
				defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
				defineField({name: 'heading', title: 'Heading', type: 'string'}),
				defineField({name: 'bio', title: 'Bio', type: 'text', rows: 6}),
				defineField({
					name: 'signature',
					title: 'Signature line',
					description: 'e.g. "— Rina, Founder and Lead Curator"',
					type: 'string',
				}),
			],
		}),
		defineField({
			name: 'services',
			title: 'Services',
			type: 'array',
			group: 'services',
			of: [{type: 'servicesPageItem'}],
		}),
		defineField({
			name: 'pricing',
			title: 'Pricing',
			type: 'object',
			group: 'pricing',
			fields: [
				defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
				defineField({name: 'heading', title: 'Heading', type: 'string'}),
				defineField({name: 'note', title: 'Note', type: 'text', rows: 2}),
				defineField({
					name: 'tiers',
					title: 'Tiers',
					type: 'array',
					of: [{type: 'pricingTier'}],
				}),
			],
		}),
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
			group: 'seo',
		}),
	],
	preview: {
		prepare: () => ({title: 'Services page'}),
	},
})
