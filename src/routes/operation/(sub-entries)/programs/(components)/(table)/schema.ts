import { z } from 'zod';
import type { Department } from '../../../../+layout.svelte';

export const programSchema = z.object({
	id: z.string(),
	department_id: z.string(),
	program_name: z.string(),
	program_code: z.string(),
	departments_tb: z.custom<Department>()
});

export type ProgramTable = z.output<typeof programSchema>;
