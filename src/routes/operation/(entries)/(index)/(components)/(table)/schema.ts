import { z } from 'zod';

export const departmentSchema = z.object({
	id: z.string(),
	name: z.string(),
	code: z.string(),
	color: z.string()
});

export type DepartmentTable = z.output<typeof departmentSchema>;
