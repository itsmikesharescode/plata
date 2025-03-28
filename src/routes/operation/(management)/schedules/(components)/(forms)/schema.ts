import { z } from 'zod';

const assignedSubjectSchema = z.object({
	code: z.string().optional(),
	subject_id: z.string().min(1, 'Subject is required.'),
	classroom_id: z.string().min(1, 'Classroom is required.'),
	start_time: z.string().min(1, 'Start Time is required.'),
	end_time: z.string().min(1, 'End Time is required.'),
	day: z.string().refine((v) => ['MWF', 'TTH'].includes(v), 'Select the right day.')
});

const baseSchema = {
	faculty_id: z.string().min(1, 'Faculty is required.'),
	program_id: z.string().min(1, 'Program is required.'),
	department_id: z.string().min(1, 'Department is required.'),
	year_and_section_id: z.string().min(1, 'Year and Section is required.'),
	semester: z.string().min(1, 'Semester is required.'),
	assigned_subjects: z.array(assignedSubjectSchema).min(1, 'Assigned Subjects is required.')
};

export const createScheduleSchema = z.object(baseSchema);
export const updateScheduleSchema = z.object(baseSchema).extend({
	id: z.string()
});

export const deleteScheduleSchema = z.object({
	id: z.string()
});

export type CreateScheduleSchema = z.output<typeof createScheduleSchema>;
export type UpdateScheduleSchema = z.output<typeof updateScheduleSchema>;
export type DeleteScheduleSchema = z.output<typeof deleteScheduleSchema>;
export type AssignedSubjectSchema = z.output<typeof assignedSubjectSchema>;
