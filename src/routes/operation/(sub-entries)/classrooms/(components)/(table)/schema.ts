import { z } from 'zod';

export const classroomSchema = z.object({
	id: z.string(),
	department_id: z.string(),
	classroom_name: z.string(),
	building_name: z.string()
});

export type ClassroomTable = z.output<typeof classroomSchema>;
