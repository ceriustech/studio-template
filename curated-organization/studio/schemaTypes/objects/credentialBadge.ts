import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'
import {altTextField} from '../fields/altText'

export const credentialBadge = defineType({
	name: 'credentialBadge',
	title: 'Credential badge',
	type: 'object',
	icon: icons['star-filled'],
	description: 'A certification/membership logo with its label (e.g. "CPO Certified", "NAPO Member").',
	fields: [
		defineField({
			name: 'label',
			title: 'Label',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'image',
			title: 'Logo',
			type: 'image',
			fields: [altTextField],
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {title: 'label', media: 'image'},
	},
})
