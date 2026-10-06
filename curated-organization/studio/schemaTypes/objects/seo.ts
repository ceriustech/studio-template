import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'
import {altTextField} from '../fields/altText'
import {SeoInput} from '../../components/SeoInput'

// Field names match the page tags they feed: title → <title>/og:title,
// description → description/og:description, image → og:image.
export const seo = defineType({
	name: 'seo',
	title: 'Search & sharing',
	type: 'object',
	icon: icons.search,
	components: {input: SeoInput},
	fields: [
		defineField({
			name: 'title',
			title: 'Page title',
			description:
				'Shown in the browser tab and as the blue headline in Google. The business name is added automatically.',
			type: 'string',
			validation: (rule) =>
				rule.max(60).warning('Google usually shows about 60 characters; longer titles may be cut off.'),
		}),
		defineField({
			name: 'description',
			title: 'Page summary',
			description:
				'The 1–2 sentences under the headline in Google, and in link previews when the page is shared.',
			type: 'text',
			rows: 3,
			validation: (rule) =>
				rule
					.max(160)
					.warning('Google usually shows about 160 characters; longer summaries may be cut off.'),
		}),
		defineField({
			name: 'image',
			title: 'Share image',
			description:
				"The picture shown when this page's link is shared on social media or in a text message. Best size: 1200×630.",
			type: 'image',
			options: {hotspot: true},
			fields: [altTextField],
		}),
	],
})
