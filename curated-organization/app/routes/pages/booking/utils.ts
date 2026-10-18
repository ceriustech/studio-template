import { z } from 'zod';
import type {
	InquiryMessages,
	PathCardIcon,
	PathCardKind,
	PathCardVariant,
	PathOptionIcon,
} from './booking.types';

// The rules are fixed in code; only the messages are editable in the Studio.
export const createInquirySchema = (messages: InquiryMessages) =>
	z.object({
		firstName: z.string().trim().min(1, messages.firstNameRequired),
		lastName: z.string().trim().min(1, messages.lastNameRequired),
		email: z
			.string()
			.trim()
			.min(1, messages.emailRequired)
			.email(messages.emailInvalid),
		phone: z.string().trim().max(30).optional().default(''),
		notes: z
			.string()
			.trim()
			.transform((s) => s.slice(0, 2000))
			.optional()
			.default(''),
	});

export type Inquiry = z.infer<ReturnType<typeof createInquirySchema>>;

export function formatPhoneNumber(value: string): string {
	const digits = value.replace(/\D/g, '').slice(0, 10);

	if (digits.length === 0) return '';
	if (digits.length <= 3) return `(${digits}`;
	if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
	return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function parseInquiry(form: FormData, messages: InquiryMessages) {
	return createInquirySchema(messages).safeParse({
		firstName: form.get('firstName') ?? '',
		lastName: form.get('lastName') ?? '',
		email: form.get('email') ?? '',
		phone: form.get('phone') ?? '',
		notes: form.get('notes') ?? '',
	});
}

const CALENDLY_HOSTS = ['calendly.com', 'www.calendly.com'];

// Mirrors the calendlyUrl validation in studio/schemaTypes/documents/bookingPage.ts; keep the two in sync.
export function isCalendlyUrl(value: string): boolean {
	try {
		const url = new URL(value);
		return url.protocol === 'https:' && CALENDLY_HOSTS.includes(url.hostname);
	} catch {
		return false;
	}
}

type MaybeString = string | null | undefined;

export const isPathCardIcon = (value: MaybeString): value is PathCardIcon =>
	value === 'plus' || value === 'refresh';

export const isPathOptionIcon = (value: MaybeString): value is PathOptionIcon =>
	value === 'phone' || value === 'email';

export const isPathCardKind = (value: MaybeString): value is PathCardKind =>
	value === 'options' || value === 'cta';

export const isPathCardVariant = (value: MaybeString): value is PathCardVariant =>
	value === 'primary' || value === 'secondary';
