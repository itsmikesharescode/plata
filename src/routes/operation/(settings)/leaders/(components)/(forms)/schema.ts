import { z } from 'zod';

const baseSchema = {
	id: z.string(),
	fullname: z.string().min(2, 'Fullname is required.')
};

export const universityPresidentUpdateSchema = z.object(baseSchema);
export const universityRegistrarUpdateSchema = z.object(baseSchema);
export const programChairUpdateSchema = z.object(baseSchema);
export const vicePresidentAcademicUpdateSchema = z.object(baseSchema);

export type UniversityPresidentUpdateSchema = z.output<typeof universityPresidentUpdateSchema>;
export type UniversityRegistrarUpdateSchema = z.output<typeof universityRegistrarUpdateSchema>;
export type ProgramChairUpdateSchema = z.output<typeof programChairUpdateSchema>;
export type VicePresidentAcademicUpdateSchema = z.output<typeof vicePresidentAcademicUpdateSchema>;
