import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import type { ILogger } from '../interface/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Winston logger implementation
 */
export class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    const logDir = path.resolve(__dirname, '../../../logs');

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DDTHH:mm:ss',
        }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] [${level.toUpperCase()}] ${message}`.trim();
        }),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message }) => `${level}: ${message}`),
          ),
        }),
        new DailyRotateFile({
          filename: path.join(logDir, '%DATE%', 'error.log'),
          datePattern: 'YYYY-MM-DD',
          level: 'error',
        }),
        new DailyRotateFile({
          filename: path.join(logDir, '%DATE%', 'combined.log'),
          datePattern: 'YYYY-MM-DD',
        }),
      ],
    });
  }

  info(message: string, ...meta: unknown[]): void {
    this.logger.info(message, ...meta);
  }

  error(message: string, ...meta: unknown[]): void {
    this.logger.error(message, ...meta);
  }

  warn(message: string, ...meta: unknown[]): void {
    this.logger.warn(message, ...meta);
  }

  debug(message: string, ...meta: unknown[]): void {
    this.logger.debug(message, ...meta);
  }
}
