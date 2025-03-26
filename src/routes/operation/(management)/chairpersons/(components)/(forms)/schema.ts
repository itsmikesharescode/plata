import { z } from 'zod';

const baseSchema = {
	department_id: z.string().min(1, 'Department is required.'),
	email: z.string().min(1, 'Email is required.'),
	fullname: z.string().min(1, 'Faculty fullname is required.'),
	academic_rank: z.string().min(1, 'Academic rank is required.'),
	status: z.string().min(1, 'Status is required.')
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
export const updateChairpersonSchema = z.object(baseSchema).extend({
	id: z.string()
});
export const deleteChairpersonSchema = z.object({
	id: z.string()
});

export type CreateChairpersonSchema = z.output<typeof createChairpersonSchema>;
export type UpdateChairpersonSchema = z.output<typeof updateChairpersonSchema>;
export type DeleteChairpersonSchema = z.output<typeof deleteChairpersonSchema>;
