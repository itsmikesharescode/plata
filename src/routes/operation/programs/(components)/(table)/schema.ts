import { z } from 'zod';

export const programSchema = z.object({
	id: z.string(),
	department_id: z.string(),
	name: z.string(),
	code: z.string()
});

export type ProgramTable = z.output<typeof programSchema>;
