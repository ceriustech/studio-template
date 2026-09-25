import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const pricingTier = defineType({
	name: 'pricingTier',
	title: 'Pricing tier',
	type: 'object',
	icon: icons.tag,
	description:
		'All fields except eyebrow/title are optional — some tiers (e.g. fees) show a feature list instead of a price/description.',
	fields: [
		defineField({
			name: 'eyebrow',
			title: 'Eyebrow',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'price',
			title: 'Price',
			type: 'string',
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			rows: 2,
		}),
		defineField({
			name: 'features',
			title: 'Features',
			type: 'array',
			of: [{type: 'string'}],
		}),
		defineField({
			name: 'featured',
			title: 'Featured',
			description: 'Highlights this tier (e.g. "Lead Organizer").',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'ctaLabel',
			title: 'CTA label',
			type: 'string',
		}),
	],
	preview: {
		select: {title: 'title', subtitle: 'price'},
	},
})
