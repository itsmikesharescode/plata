import { z } from 'zod';
import type { Department } from '../../../../+layout.svelte';

export const classroomSchema = z.object({
	id: z.string(),
	department_id: z.string(),
	classroom_name: z.string(),
	building_name: z.string(),
	departments_tb: z.custom<Department>()
});

export type ClassroomTable = z.output<typeof classroomSchema>;
