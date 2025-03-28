import { z } from 'zod';

export const programSchema = z.object({
	id: z.string(),
	department_id: z.string(),
	program_name: z.string(),
	program_code: z.string()
});

export type ProgramTable = z.output<typeof programSchema>;
