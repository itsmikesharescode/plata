import { z } from 'zod';

export const facultySchema = z.object({
	id: z.string(),
	department_id: z.string(),
	fullname: z.string(),
	academic_rank: z.string(),
	status: z.string()
});

export type FacultyTable = z.output<typeof facultySchema>;
