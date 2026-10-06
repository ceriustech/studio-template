import {Card, Stack, Text} from '@sanity/ui'
import {useEditState, type ObjectInputProps} from 'sanity'
import {BACKUP_BUSINESS_NAME, BACKUP_DESCRIPTION, composeTitle} from './seoTitle'

const SITE_ADDRESS = 'curatedorganization.com'

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null

const readText = (source: unknown, key: string): string | undefined => {
	const value = isRecord(source) ? source[key] : undefined
	return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

// Shows the page as a Google result above the standard fields. Empty fields preview
// the Site Settings default, so the owner sees what will actually be published.
export function SeoInput(props: ObjectInputProps) {
	const {draft, published} = useEditState('siteSettings', 'siteSettings')
	const settings = draft ?? published
	const defaults = settings?.defaultSeo

	const businessName = readText(settings, 'businessName') ?? BACKUP_BUSINESS_NAME
	const baseTitle = readText(props.value, 'title') ?? readText(defaults, 'title') ?? BACKUP_BUSINESS_NAME
	const title = composeTitle(baseTitle, businessName)
	const description = (
		readText(props.value, 'description') ??
		readText(defaults, 'description') ??
		BACKUP_DESCRIPTION
	).replace(/\s*\n\s*/g, ' ')

	return (
		<Stack gap={4}>
			<Stack gap={2}>
				<Text size={1} weight="semibold">
					Preview in Google
				</Text>
				<Card padding={3} radius={2} border tone="default">
					<Stack gap={2}>
						<Text size={1} muted>
							{SITE_ADDRESS}
						</Text>
						<Text size={2} weight="medium" style={{color: '#1a0dab'}}>
							{title}
						</Text>
						<Text size={1}>{description}</Text>
						<Text size={0} muted>
							Title {title.length} / 60 · Summary {description.length} / 160
						</Text>
					</Stack>
				</Card>
			</Stack>
			{props.renderDefault(props)}
		</Stack>
	)
}
