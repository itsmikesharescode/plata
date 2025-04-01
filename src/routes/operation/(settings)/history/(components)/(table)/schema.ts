import { z } from 'zod';

export const historySchema = z.object({
	id: z.string(),
	created_at: z.string(),
	user_id: z.string(),
	tb_location: z.string(),
	action_type: z.string()
});

export type HistoryTable = z.output<typeof historySchema>;
