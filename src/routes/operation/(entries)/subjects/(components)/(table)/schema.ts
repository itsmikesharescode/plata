import { z } from 'zod';

export const subjectSchema = z.object({
	id: z.string(),
	name: z.string(),
	code: z.string(),
	description: z.string()
});

export type SubjectTable = z.output<typeof subjectSchema>;
