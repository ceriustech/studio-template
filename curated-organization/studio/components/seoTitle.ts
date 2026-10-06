export const BACKUP_BUSINESS_NAME = 'Curated Organization'
export const BACKUP_DESCRIPTION = 'Professional organizing services'

// Mirrors mapSeo() in app/root.loader.server.ts; keep the two in sync.
export function composeTitle(title: string, businessName: string): string {
	return title.toLowerCase().includes(businessName.toLowerCase()) ? title : `${title} | ${businessName}`
}
