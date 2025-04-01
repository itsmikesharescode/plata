import { z } from 'zod';
import type { Department } from '../../../../+layout.svelte';

export const facultySchema = z.object({
	id: z.string(),
	department_id: z.string(),
	fullname: z.string(),
	academic_rank: z.string(),
	employment_status: z.string(),
	departments_tb: z.custom<Department>()
});

export type FacultyTable = z.output<typeof facultySchema>;
