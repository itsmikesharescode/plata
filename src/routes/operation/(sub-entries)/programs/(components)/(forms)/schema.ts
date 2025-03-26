import { z } from 'zod';

const baseSchema = {
	department_id: z.string().min(1, 'Department is required.'),
	name: z.string().min(1, 'Program name is required.'),
	code: z.string().min(1, 'Code is required.')
};

export const createProgramSchema = z.object(baseSchema);
export const updateProgramSchema = z.object(baseSchema).extend({
	id: z.string()
});
export const deleteProgramSchema = z.object({
	id: z.string()
});

export type CreateProgramSchema = z.output<typeof createProgramSchema>;
export type UpdateProgramSchema = z.output<typeof updateProgramSchema>;
export type DeleteProgramSchema = z.output<typeof deleteProgramSchema>;
