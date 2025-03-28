import { z } from 'zod';

export const chairpersonSchema = z.object({
	user_id: z.string(),
	department_id: z.string(),
	program_id: z.string(),
	email: z.string(),
	fullname: z.string(),
	academic_rank: z.string(),
	employment_status: z.string()
});

export type ChairpersonTable = z.output<typeof chairpersonSchema>;
