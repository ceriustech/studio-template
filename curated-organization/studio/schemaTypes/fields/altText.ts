import {defineField} from 'sanity'

export const altTextField = defineField({
	name: 'alt',
	title: 'Alt text',
	type: 'string',
	description: 'Describe what the image shows for people who can\'t see it. Leave out "image of".',
	validation: (rule) => [
		rule.required().error('Add alt text describing this image.'),
		rule.max(125).warning('Keep alt text under 125 characters; some screen readers cut off longer text.'),
	],
})
