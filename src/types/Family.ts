import { z } from 'zod';
import { personSchema } from './Person';

export const familySchema = z.object({
  id: z.number(),
  name: z.string(),
  members: personSchema.array(),
});

export type TFamily = z.infer<typeof familySchema>;
