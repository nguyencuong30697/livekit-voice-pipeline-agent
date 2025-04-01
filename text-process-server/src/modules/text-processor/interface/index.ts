import type { TextProcessorRequestDTO, TextProcessorResponseDTO } from '../model/dto';

export interface ITextProcessorUseCase {
  truncate(data: TextProcessorRequestDTO): Promise<TextProcessorResponseDTO>;
}
