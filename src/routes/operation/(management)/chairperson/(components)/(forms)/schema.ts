import { z } from 'zod';

const baseSchema = {
	department_id: z.string().min(1, 'Department is required.'),
	program_id: z.string().min(1, 'Program is required.'),
	email: z.string().min(1, 'Email is required.'),
	fullname: z.string().min(1, 'Faculty fullname is required.'),
	academic_rank: z.string().min(1, 'Academic rank is required.'),
	employment_status: z.string().min(1, 'Employment status is required.')
};

export const createChairpersonSchema = z
	.object(baseSchema)
	.extend({
		password: z.string().min(8, 'Password must be at least 8 characters long.'),
		confirm_password: z.string()
	})
	.refine((data) => data.password === data.confirm_password, {
		message: 'Passwords do not match.',
		path: ['confirm_password']
	});

export const updateChairpersonInfoSchema = z
	.object(baseSchema)
	.omit({
		email: true
	})
	.extend({
		user_id: z.string()
	});

export const updateChairpersonEmailSchema = z.object({
	user_id: z.string(),
	email: z.string().min(1, 'Email is required.')
});

export const updateChairpersonPwdSchema = z
	.object({
		user_id: z.string(),
		password: z.string().min(8, 'Must choose a strong password.'),
		confirmPassword: z.string()
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (password !== confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Must confirm password.',
				path: ['confirmPassword']
			});
		}
	});

export const deleteChairpersonSchema = z.object({
	id: z.string()
});

export type CreateChairpersonSchema = z.output<typeof createChairpersonSchema>;
export type UpdateChairpersonEmailSchema = z.output<typeof updateChairpersonEmailSchema>;
export type UpdateChairpersonInfoSchema = z.output<typeof updateChairpersonInfoSchema>;
export type UpdateChairpersonPwdSchema = z.output<typeof updateChairpersonPwdSchema>;
export type DeleteChairpersonSchema = z.output<typeof deleteChairpersonSchema>;
