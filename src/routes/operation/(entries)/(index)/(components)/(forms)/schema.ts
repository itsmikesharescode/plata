import { z } from 'zod';

const baseSchema = {
	name: z.string().min(1, 'Department name is required.'),
	code: z.string().min(1, 'Department code is required.'),
	color: z.string().min(1, 'Department color is required.')
};

export const createDepSchema = z.object(baseSchema);
export const updateDepSchema = z.object(baseSchema).extend({
	id: z.string()
});
export const deleteDepSchema = z.object({
	id: z.string()
});

export type CreateDepSchema = z.output<typeof createDepSchema>;
export type UpdateDepSchema = z.output<typeof updateDepSchema>;
export type DeleteDepSchema = z.output<typeof deleteDepSchema>;
