import { z } from 'zod';

const SERVICE_VALUES = [
	'home-organizing',
	'unpacking-move-in',
	'business-office',
	'legacy-organizing',
	'not-sure',
] as const;

const INVESTMENT_VALUES = ['under-1500', '1500-5000', '5000-plus'] as const;

const DECISION_VALUES = ['yes', 'no', 'not-sure'] as const;

const REFERRAL_VALUES = [
	'instagram',
	'google-search',
	'referral-friend',
	'other',
] as const;

const InquirySchema = z.object({
	firstName: z.string().trim().optional().default(''),
	lastName: z.string().trim().optional().default(''),
	email: z.string().trim().optional().default(''),
	phone: z.string().trim().max(30).optional().default(''),
	location: z.string().trim().max(200).optional().default(''),
	service: z.enum(SERVICE_VALUES).optional(),
	deadline: z.string().trim().max(200).optional().default(''),
	investmentTarget: z.enum(INVESTMENT_VALUES).optional(),
	decisionMakersReady: z.enum(DECISION_VALUES).optional(),
	referral: z.enum(REFERRAL_VALUES).optional(),
	notes: z
		.string()
		.trim()
		.transform((s) => s.slice(0, 2000))
		.optional()
		.default(''),
});

export type Inquiry = z.infer<typeof InquirySchema>;

export function formatPhoneNumber(value: string): string {
	const digits = value.replace(/\D/g, '').slice(0, 10);

	if (digits.length === 0) return '';
	if (digits.length <= 3) return `(${digits}`;
	if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
	return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function parseInquiry(form: FormData) {
	return InquirySchema.safeParse({
		firstName: form.get('firstName') ?? '',
		lastName: form.get('lastName') ?? '',
		email: form.get('email') ?? '',
		phone: form.get('phone') ?? '',
		location: form.get('location') ?? '',
		service: form.get('service') || undefined,
		deadline: form.get('deadline') ?? '',
		investmentTarget: form.get('investmentTarget') || undefined,
		decisionMakersReady: form.get('decisionMakersReady') || undefined,
		referral: form.get('referral') || undefined,
		notes: form.get('notes') ?? '',
	});
}

export const SERVICE_LABELS: Record<NonNullable<Inquiry['service']>, string> = {
	'home-organizing': 'Home organizing',
	'unpacking-move-in': 'Unpacking + move-in',
	'business-office': 'Business + office',
	'legacy-organizing': 'Legacy Organizing (Downsizing, memorabilia, estates)',
	'not-sure': 'Not sure yet',
};

export const INVESTMENT_LABELS: Record<
	NonNullable<Inquiry['investmentTarget']>,
	string
> = {
	'under-1500': 'Under $1,500',
	'1500-5000': '$1,500 – $5,000',
	'5000-plus': '$5,000+',
};

export const DECISION_LABELS: Record<
	NonNullable<Inquiry['decisionMakersReady']>,
	string
> = {
	yes: 'Yes',
	no: 'No',
	'not-sure': 'Not yet — still confirming',
};

export const REFERRAL_LABELS: Record<
	NonNullable<Inquiry['referral']>,
	string
> = {
	instagram: 'Instagram',
	'google-search': 'Google search',
	'referral-friend': 'Referral from a friend',
	other: 'Other',
};
