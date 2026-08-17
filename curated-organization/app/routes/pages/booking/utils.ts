import { z } from 'zod';

const InquirySchema = z.object({
	firstName: z.string().trim().min(1, 'Please enter your first name'),
	lastName: z.string().trim().min(1, 'Please enter your last name'),
	email: z
		.string()
		.trim()
		.min(1, 'Please enter your email')
		.email('Please enter a valid email'),
	phone: z.string().trim().max(30).optional().default(''),
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
		notes: form.get('notes') ?? '',
	});
}
