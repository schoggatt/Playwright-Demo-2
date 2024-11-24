import { z } from 'zod';

export const personSchema = z.object({
  id: z.number(),
  name: z.string(),
  age: z.number(),
  relation: z.string(),
});

export type TPerson = z.infer<typeof personSchema>;
