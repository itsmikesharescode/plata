import { z } from 'zod';

export const departmentSchema = z.object({
	id: z.string(),
	department_name: z.string(),
	department_code: z.string(),
	department_color: z.string()
});

export type DepartmentTable = z.output<typeof departmentSchema>;
