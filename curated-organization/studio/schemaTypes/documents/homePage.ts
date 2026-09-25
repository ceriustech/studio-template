import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'

export const homePage = defineType({
	name: 'homePage',
	title: 'Home page',
	type: 'document',
	icon: icons.home,
	groups: [
		{name: 'hero', title: 'Hero'},
		{name: 'intro', title: 'Intro'},
		{name: 'services', title: 'Services teaser'},
		{name: 'process', title: 'Process'},
		{name: 'beforeAfter', title: 'Before/after'},
		{name: 'testimonials', title: 'Testimonials'},
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
			name: 'intro',
			title: 'Intro',
			description: 'Uses the same eyebrow/heading/body/link shape as a hero; no images needed here.',
			type: 'heroSection',
			group: 'intro',
		}),
		defineField({
			name: 'servicesTeaser',
			title: 'Services teaser',
			type: 'object',
			group: 'services',
			fields: [
				defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
				defineField({name: 'heading', title: 'Heading', type: 'string'}),
				defineField({
					name: 'cards',
					title: 'Cards',
					type: 'array',
					of: [{type: 'serviceCard'}],
				}),
				defineField({name: 'linkLabel', title: 'Link label', type: 'string'}),
				defineField({name: 'linkHref', title: 'Link destination', type: 'string'}),
			],
		}),
		defineField({
			name: 'process',
			title: 'Process',
			type: 'object',
			group: 'process',
			fields: [
				defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
				defineField({name: 'heading', title: 'Heading', type: 'string'}),
				defineField({
					name: 'steps',
					title: 'Steps',
					type: 'array',
					of: [{type: 'step'}],
				}),
			],
		}),
		defineField({
			name: 'beforeAfter',
			title: 'Before/after',
			type: 'object',
			group: 'beforeAfter',
			fields: [
				defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
				defineField({name: 'heading', title: 'Heading', type: 'string'}),
				defineField({name: 'beforeImage', title: 'Before image', type: 'imageMedia'}),
				defineField({name: 'afterImage', title: 'After image', type: 'imageMedia'}),
				defineField({name: 'caption', title: 'Caption', type: 'text', rows: 2}),
				defineField({name: 'linkLabel', title: 'Link label', type: 'string'}),
				defineField({name: 'linkHref', title: 'Link destination', type: 'string'}),
			],
		}),
		defineField({
			name: 'testimonials',
			title: 'Testimonials',
			type: 'array',
			group: 'testimonials',
			of: [{type: 'reference', to: [{type: 'testimonial'}]}],
		}),
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
			group: 'seo',
		}),
	],
	preview: {
		prepare: () => ({title: 'Home page'}),
	},
})
