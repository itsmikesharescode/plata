import { z } from 'zod';

export const subjectSchema = z.object({
	id: z.string(),
	course_name: z.string(),
	course_code: z.string(),
	lecture_hours: z.number(),
	lab_hours: z.number(),
	unit: z.number()
});

export type SubjectTable = z.output<typeof subjectSchema>;
