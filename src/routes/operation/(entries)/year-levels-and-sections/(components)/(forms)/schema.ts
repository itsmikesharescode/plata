import { z } from 'zod';

const baseSchema = {
	year: z.coerce.number().positive({ message: 'Year must be a positive number.' }),
	section: z.string().min(1, 'Section is required.')
};

export const createYnsSchema = z.object(baseSchema);
export const updateYnsSchema = z.object(baseSchema).extend({
	id: z.string()
});
export const deleteYnsSchema = z.object({
	id: z.string()
});

export type CreateYnsSchema = z.output<typeof createYnsSchema>;
export type UpdateYnsSchema = z.output<typeof updateYnsSchema>;
export type DeleteYnsSchema = z.output<typeof deleteYnsSchema>;
