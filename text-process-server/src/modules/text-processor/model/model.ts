import { z } from 'zod';

export const TextProcessorSchema = z.object({
  text: z.string(),
  truncated: z.boolean(),
});

export type TextProcessor = z.infer<typeof TextProcessorSchema>;
