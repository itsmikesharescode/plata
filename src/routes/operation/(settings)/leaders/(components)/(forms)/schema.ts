import { z } from 'zod';

const baseSchema = {
	id: z.string(),
	fullname: z.string().min(2, 'Fullname is required.')
};

export const modeSchema = z.object(baseSchema);

export type ModeSchema = z.output<typeof modeSchema>;
