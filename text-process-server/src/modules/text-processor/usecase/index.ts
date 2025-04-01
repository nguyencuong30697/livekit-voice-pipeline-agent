import { config } from '../../../share/component/config';
import { WinstonLogger } from '../../../share/component/winston-logger';
import type { ITextProcessorUseCase } from '../interface';
import type { TextProcessorRequestDTO, TextProcessorResponseDTO } from '../model/dto';
import { TextProcessorRequestSchema } from '../model/dto';
import { TextProcessStatus } from '../model/enum';

export class TextProcessorUseCase implements ITextProcessorUseCase {
  private readonly MAX_SECONDS = config.maxSeconds;
  private readonly WORDS_PER_MINUTE = config.wordsPerMinute;
  private readonly MAX_WORDS = Math.floor((this.MAX_SECONDS * this.WORDS_PER_MINUTE) / 60);
  private logger = new WinstonLogger();

  async truncate(data: TextProcessorRequestDTO): Promise<TextProcessorResponseDTO> {
    try {
      // Validate input data with Zod
      const { success, data: parsedData, error } = TextProcessorRequestSchema.safeParse(data);
      if (!success) throw error;

      const originalText = parsedData.text;
      this.logger.debug(`The before message: ${originalText}`);

      // Calculate readingTimeSeconds is the estimated reading time
      const wordCount = originalText.split(/\s+/).length;
      const readingTimeSeconds = (wordCount / this.WORDS_PER_MINUTE) * 60;
      this.logger.debug(`Estimated reading time: ${readingTimeSeconds.toFixed(2)} seconds`);

      if (readingTimeSeconds > this.MAX_SECONDS) {
        this.logger.debug(`Text exceeds maximum reading time, start to truncate`);

        // Split the text into words
        const words = originalText.split(/\s+/);

        // Get the middle segment
        const startIndex = Math.floor((words.length - this.MAX_WORDS) / 2);
        // Get the trimmed words
        const trimmedWords = words.slice(startIndex, startIndex + this.MAX_WORDS);
        const trimmedText = trimmedWords.join(' ');

        this.logger.debug(`Text after processing: ${trimmedText}`);

        return {
          message: trimmedText,
          status: TextProcessStatus.CHANGED,
        };
      }

      // If reading time is within limits return unchanged
      this.logger.debug(`Text is within limits, return unchanged`);
      return {
        message: originalText,
        status: TextProcessStatus.UNCHANGED,
      };
    } catch (error) {
      throw error;
    }
  }
}
