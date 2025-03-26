import { z } from 'zod';

export const yearAndSectionSchema = z.object({
	id: z.string(),
	year: z.string(),
	section: z.string()
});

export type YnsTable = z.output<typeof yearAndSectionSchema>;
