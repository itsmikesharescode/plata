import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Must enter a valid email address.'),
	password: z.string().min(1, 'Password is required.')
});

export type LoginSchema = z.output<typeof loginSchema>;
