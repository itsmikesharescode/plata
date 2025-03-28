import { z } from 'zod';

const baseSchema = {
	department_id: z.string().min(1, 'Department is required.'),
	fullname: z.string().min(1, 'Faculty fullname is required.'),
	academic_rank: z.string().min(1, 'Academic rank is required.'),
	employment_status: z.string().min(1, 'Employment status is required.')
};

export const createFacultySchema = z.object(baseSchema);
export const updateFacultySchema = z.object(baseSchema).extend({
	faculty_id: z.string()
});
export const deleteFacultySchema = z.object({
	faculty_id: z.string()
});

export type CreateFacultySchema = z.output<typeof createFacultySchema>;
export type UpdateFacultySchema = z.output<typeof updateFacultySchema>;
export type DeleteFacultySchema = z.output<typeof deleteFacultySchema>;
