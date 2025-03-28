import { z } from 'zod';

const baseSchema = {
	department_id: z.string().min(1, 'Department is required.'),
	classroom_name: z.string().min(1, 'Classroom name is required.'),
	building_name: z.string().min(1, 'Building name is required.')
};

export const createClassroomSchema = z.object(baseSchema);
export const updateClassroomSchema = z.object(baseSchema).extend({
	id: z.string()
});
export const deleteClassroomSchema = z.object({
	id: z.string()
});

export type CreateClassroomSchema = z.output<typeof createClassroomSchema>;
export type UpdateClassroomSchema = z.output<typeof updateClassroomSchema>;
export type DeleteClassroomSchema = z.output<typeof deleteClassroomSchema>;
