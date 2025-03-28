import { z } from 'zod';

export const historySchema = z.object({
	id: z.string(),
	location_name: z.string(),
	cp_fullname: z.string(),
	activity_type: z.string()
});

export type HistoryTable = z.output<typeof historySchema>;
