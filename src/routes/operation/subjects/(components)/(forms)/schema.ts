import { z } from 'zod';

const baseSchema = {
	name: z.string().min(1, 'Subject name is required.'),
	code: z.string().min(1, 'Subject code is required.'),
	description: z.string().min(1, 'Subject description is required.')
};

export const createSubSchema = z.object(baseSchema);
export const updateSubSchema = z.object(baseSchema).extend({
	id: z.string()
});
export const deleteSubSchema = z.object({
	id: z.string()
});

export type CreateSubSchema = z.output<typeof createSubSchema>;
export type UpdateSubSchema = z.output<typeof updateSubSchema>;
export type DeleteSubSchema = z.output<typeof deleteSubSchema>;
