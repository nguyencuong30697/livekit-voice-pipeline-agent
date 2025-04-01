import { axiosInstance } from '../component/axios.js';
import { WinstonLogger } from '../component/winston-logger.js';
import type { ApiResponse, IHttpTextProcessorAdapter } from '../interface/index.js';
import { TEXT_CHANGE_STATUS } from '../interface/index.js';

/**
 * HTTP API implementation of the TextProcessorPort
 */
export class HttpTextProcessorAdapter implements IHttpTextProcessorAdapter {
  private readonly logger = new WinstonLogger();

  // Processes text by calling the truncate API endpoint
  async truncate(text: string): Promise<string> {
    try {
      const result = await axiosInstance
        .post<ApiResponse>('/v1/text-processor/truncate', {
          text: text,
        })
        .then((res) => res.data);

      if (result && result.status === TEXT_CHANGE_STATUS.CHANGED) {
        this.logger.info(`[MSG_NEEDED_PROCESS] Message after process: ${result.message}`);
        return result.message;
      }

      this.logger.info('[MSG_NEEDED_PROCESS] Not change message');
      return text;
    } catch (error) {
      this.logger.error(`[MSG_NEEDED_PROCESS] Error: ${error}`);
      return text;
    }
  }
}
