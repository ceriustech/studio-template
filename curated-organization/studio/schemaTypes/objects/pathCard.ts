import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const pathCard = defineType({
	name: 'pathCard',
	title: 'Path card',
	type: 'object',
	icon: icons['th-list'],
	description: 'One of the two Booking-page path cards ("Get started" and "Book again").',
	fields: [
		defineField({
			name: 'kind',
			title: 'Kind',
			type: 'string',
			options: {
				list: [
					{title: 'Options list (e.g. Call / Email)', value: 'options'},
					{title: 'Single CTA (e.g. Book again)', value: 'cta'},
				],
				layout: 'radio',
			},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'icon',
			title: 'Icon',
			type: 'string',
			options: {
				list: [
					{title: 'Plus', value: 'plus'},
					{title: 'Refresh', value: 'refresh'},
				],
				layout: 'radio',
			},
			validation: (rule) => rule.required(),
		}),
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
			name: 'options',
			title: 'Options',
			type: 'array',
			of: [{type: 'pathOption'}],
			hidden: ({parent}) => parent?.kind !== 'options',
		}),
		defineField({
			name: 'ctaLabel',
			title: 'CTA label',
			type: 'string',
			hidden: ({parent}) => parent?.kind !== 'cta',
		}),
		defineField({
			name: 'ctaHref',
			title: 'CTA destination',
			type: 'string',
			hidden: ({parent}) => parent?.kind !== 'cta',
		}),
		defineField({
			name: 'variant',
			title: 'Visual variant',
			type: 'string',
			options: {
				list: [
					{title: 'Primary', value: 'primary'},
					{title: 'Secondary', value: 'secondary'},
				],
				layout: 'radio',
			},
			hidden: ({parent}) => parent?.kind !== 'cta',
		}),
	],
	preview: {
		select: {title: 'title', subtitle: 'kind'},
	},
})
