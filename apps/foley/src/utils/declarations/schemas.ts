import { z } from 'zod';

export const urlSchema = z.string().min(1).url({ message: 'url invalid' });
