import { z } from 'zod';

const baseSchema = {
	department_id: z.string().min(1, 'Department is required.'),
	fullname: z.string().min(1, 'Faculty fullname is required.'),
	academic_rank: z.string().min(1, 'Academic rank is required.'),
	status: z.string().min(1, 'Status is required.')
};

export const createFacultySchema = z.object(baseSchema);
export const updateFacultySchema = z.object(baseSchema).extend({
	id: z.string()
});
export const deleteFacultySchema = z.object({
	id: z.string()
});

export type CreateFacultySchema = z.output<typeof createFacultySchema>;
export type UpdateFacultySchema = z.output<typeof updateFacultySchema>;
export type DeleteFacultySchema = z.output<typeof deleteFacultySchema>;
