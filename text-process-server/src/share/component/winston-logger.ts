import type { ILogger } from '../interface';
import fs from 'fs';
import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    const logDir = path.resolve(__dirname, '../../../logs');

    // Check if the logs directory exists; if not, create it (with recursive option)
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    this.logger = winston.createLogger({
      level: 'debug',
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

  info(message: string, ...meta: any[]): void {
    this.logger.info(message, ...meta);
  }

  error(message: string, ...meta: any[]): void {
    this.logger.error(message, ...meta);
  }

  warn(message: string, ...meta: any[]): void {
    this.logger.warn(message, ...meta);
  }

  debug(message: string, ...meta: any[]): void {
    this.logger.debug(message, ...meta);
  }
}
