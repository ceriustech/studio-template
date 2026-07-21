import { z } from 'zod';

const SPACE_VALUES = [
	'kitchen-pantry',
	'closet-wardrobe',
	'garage',
	'office',
	'living-areas',
	'whole-home',
] as const;

const TIMEFRAME_VALUES = [
	'asap',
	'within-2-weeks',
	'within-a-month',
	'flexible',
] as const;

const SERVICE_VALUES = [
	'home-organizing',
	'unpacking-move-in',
	'business-office',
	'not-sure',
] as const;

const REFERRAL_VALUES = [
	'instagram',
	'google-search',
	'referral-friend',
	'other',
] as const;

const InquirySchema = z.object({
	firstName: z.string().trim().min(1, 'Please enter your first name').max(100),
	lastName: z.string().trim().min(1, 'Please enter your last name').max(100),
	email: z.string().trim().email('Please enter a valid email'),
	phone: z.string().trim().max(30).optional().default(''),
	location: z.string().trim().max(200).optional().default(''),
	service: z.enum(SERVICE_VALUES).optional(),
	spaces: z.array(z.enum(SPACE_VALUES)).min(1, 'Select at least one space'),
	timeframe: z.enum(TIMEFRAME_VALUES, {
		message: 'Please select a timeframe',
	}),
	referral: z.enum(REFERRAL_VALUES).optional(),
	notes: z.string().trim().max(2000, 'Please keep notes under 2000 characters').optional().default(''),
});

export type Inquiry = z.infer<typeof InquirySchema>;

export function parseInquiry(form: FormData) {
	return InquirySchema.safeParse({
		firstName: form.get('firstName') ?? '',
		lastName: form.get('lastName') ?? '',
		email: form.get('email') ?? '',
		phone: form.get('phone') ?? '',
		location: form.get('location') ?? '',
		service: form.get('service') || undefined,
		spaces: form.getAll('spaces').map(String),
		timeframe: form.get('timeframe') ?? '',
		referral: form.get('referral') || undefined,
		notes: form.get('notes') ?? '',
	});
}

export const SPACE_LABELS: Record<Inquiry['spaces'][number], string> = {
	'kitchen-pantry': 'Kitchen / Pantry',
	'closet-wardrobe': 'Closet / Wardrobe',
	garage: 'Garage',
	office: 'Office',
	'living-areas': 'Living areas',
	'whole-home': 'Whole home',
};

export const TIMEFRAME_LABELS: Record<Inquiry['timeframe'], string> = {
	asap: 'As soon as possible',
	'within-2-weeks': 'Within 2 weeks',
	'within-a-month': 'Within a month',
	flexible: 'Flexible / no rush',
};

export const SERVICE_LABELS: Record<
	NonNullable<Inquiry['service']>,
	string
> = {
	'home-organizing': 'Home organizing',
	'unpacking-move-in': 'Unpacking + move-in',
	'business-office': 'Business + office',
	'not-sure': 'Not sure yet',
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

