import {defineField, defineType} from 'sanity'
import {icons} from '@sanity/icons'
import {VIDEO_TAGS} from '../constants'

export const videoMedia = defineType({
	name: 'videoMedia',
	title: 'Video',
	type: 'object',
	icon: icons.play,
	fields: [
		defineField({
			name: 'video',
			title: 'Video file',
			type: 'file',
			options: {accept: 'video/*'},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'poster',
			title: 'Poster image',
			type: 'image',
			options: {hotspot: true},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'posterOffset',
			title: 'Poster focal offset',
			description: 'Optional vertical offset (%) used to reposition the poster crop.',
			type: 'number',
		}),
		defineField({
			name: 'tag',
			title: 'Before / after',
			type: 'string',
			options: {list: VIDEO_TAGS, layout: 'radio'},
			validation: (rule) => rule.required(),
		}),
		defineField({
			name: 'duration',
			title: 'Duration (seconds)',
			type: 'number',
			validation: (rule) => rule.required().positive(),
		}),
		defineField({
			name: 'captions',
			title: 'Captions (.vtt)',
			type: 'file',
			options: {accept: '.vtt'},
		}),
		defineField({
			name: 'alt',
			title: 'Alt/description text',
			type: 'string',
			validation: (rule) => rule.required(),
		}),
	],
	preview: {
		select: {title: 'alt', subtitle: 'tag', media: 'poster'},
	},
})
