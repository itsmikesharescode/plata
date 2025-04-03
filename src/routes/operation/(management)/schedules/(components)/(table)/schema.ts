import { z } from 'zod';
import type { AssignedSubjectSchema } from '../(forms)/schema';
import type { Database } from '$lib/database.types';

type ProgramTable = Database['public']['Tables']['programs_tb']['Row'] & {
	departments_tb: Database['public']['Tables']['departments_tb']['Row'];
};
type FacultyTable = Database['public']['Tables']['faculties_tb']['Row'] & {
	departments_tb: Database['public']['Tables']['departments_tb']['Row'];
};
type DepartmentTable = Database['public']['Tables']['departments_tb']['Row'];
type YearLevelAndSectionTable = Database['public']['Tables']['yearlevels_and_sections_tb']['Row'];

export const scheduleSchema = z.object({
	id: z.string(),
	faculty_id: z.string(),
	faculties_tb: z.custom<FacultyTable>(),
	program_id: z.string(),
	programs_tb: z.custom<ProgramTable>(),
	department_id: z.string(),
	departments_tb: z.custom<DepartmentTable>(),
	year_and_section_id: z.string(),
	yearlevels_and_sections_tb: z.custom<YearLevelAndSectionTable>(),
	semester: z.string(),
	assigned_subjects: z.custom<AssignedSubjectSchema[]>()
});

export type ScheduleTable = z.output<typeof scheduleSchema>;
