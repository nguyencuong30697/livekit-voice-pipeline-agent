import { z } from 'zod';
import type { TextProcessStatus } from './enum';

export const TextProcessorRequestSchema = z.object({
  text: z.string(),
});

export type TextProcessorRequestDTO = z.infer<typeof TextProcessorRequestSchema>;

export interface TextProcessorResponseDTO {
  message: string;
  status: TextProcessStatus;
}
