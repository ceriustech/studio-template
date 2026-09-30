import type {StructureResolver} from 'sanity/structure'
import type {ComponentType} from 'react'
import {icons} from '@sanity/icons'
import type {StructureBuilder} from 'sanity/structure'

const SINGLETONS = ['homePage', 'servicesPage', 'galleryPage', 'bookingPage', 'siteSettings', 'siteCta']

function createSingleton(S: StructureBuilder, typeName: string, title: string, icon?: ComponentType) {
	return S.listItem()
		.title(title)
		.icon(icon)
		.child(S.document().schemaType(typeName).documentId(typeName).title(title))
}

export const structure: StructureResolver = (S) =>
	S.list()
		.title('Content')
		.items([
			S.listItem()
				.title('Pages')
				.child(
					S.list()
						.title('Pages')
						.items([
							createSingleton(S, 'homePage', 'Home', icons.home),
							createSingleton(S, 'servicesPage', 'Services', icons.list),
							createSingleton(S, 'galleryPage', 'Gallery', icons.images),
							createSingleton(S, 'bookingPage', 'Booking', icons.calendar),
						]),
				),

			S.divider(),

			S.documentTypeListItem('portfolioPiece').title('Portfolio pieces'),

			S.divider(),

			createSingleton(S, 'siteSettings', 'Site settings', icons.cog),
			createSingleton(S, 'siteCta', 'Site CTA', icons.launch),

			S.divider(),

			...S.documentTypeListItems().filter(
				(listItem) => !SINGLETONS.includes(listItem.getId() as string) && listItem.getId() !== 'portfolioPiece',
			),
		])
