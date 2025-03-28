import { z } from 'zod';

const baseSchema = {
	course_name: z.string().min(1, 'Course name is required.'),
	course_code: z.string().min(1, 'Course code is required.'),
	lecture_hours: z.number().nonnegative(),
	lab_hours: z.number().nonnegative(),
	unit: z.number().nonnegative()
};

export const createSubSchema = z.object(baseSchema);
export const updateSubSchema = z.object(baseSchema).extend({
	id: z.string()
});
export const deleteSubSchema = z.object({
	id: z.string()
});

export type CreateSubSchema = z.output<typeof createSubSchema>;
export type UpdateSubSchema = z.output<typeof updateSubSchema>;
export type DeleteSubSchema = z.output<typeof deleteSubSchema>;
