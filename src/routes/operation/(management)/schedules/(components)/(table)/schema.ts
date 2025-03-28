import { z } from 'zod';
import type { AssignedSubjectSchema } from '../(forms)/schema';

export const scheduleSchema = z.object({
	id: z.string(),
	faculty_id: z.string(),
	program_id: z.string(),
	department_id: z.string(),
	year_and_section_id: z.string(),
	semester: z.string(),
	assigned_subjects: z.custom<AssignedSubjectSchema[]>()
});

export type ScheduleTable = z.output<typeof scheduleSchema>;
