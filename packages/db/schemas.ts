import { z } from 'zod';

export const SmolSchema = z.object({
	id: z.string().cuid(),
	status: z.literal('active').or(z.literal('inactive')),
	slug: z.string().length(4),
	url: z.string().url(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
