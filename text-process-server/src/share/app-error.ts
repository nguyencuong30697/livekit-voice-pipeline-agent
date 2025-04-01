import type { Response } from 'express';
import { ZodError } from 'zod';
import { config } from './component/config';
import { WinstonLogger } from './component/winston-logger';

/**
 * AppError is a custom error class
 */
export class AppError extends Error {
  private statusCode: number = 500;
  private rootCause?: Error;
  private details: Record<string, any> = {};

  private constructor(err: Error, options?: ErrorOptions) {
    super(err.message, options);
  }

  // Add the status code to the error
  static from(err: Error, statusCode: number = 500) {
    const appError = new AppError(err);
    appError.statusCode = statusCode;
    return appError;
  }

  // Get the root cause of the error
  getRootCause(): Error | null {
    if (this.rootCause) {
      return this.rootCause instanceof AppError ? this.rootCause.getRootCause() : this.rootCause;
    }
    return null;
  }

  // Wrap error to custom message when send response
  wrap(rootCause: Error): AppError {
    const appError = AppError.from(this, this.statusCode);
    appError.rootCause = rootCause;
    return appError;
  }

  // Add details to the error (Setter chain)
  withDetail(key: string, value: any): AppError {
    this.details[key] = value;
    return this;
  }

  // Convert error to JSON format based on production environment
  toJSON(isProduction: boolean = true) {
    const rootCause = this.getRootCause();

    return isProduction
      ? {
          message: this.message,
          statusCode: this.statusCode,
          details: this.details,
        }
      : {
          message: this.message,
          statusCode: this.statusCode,
          rootCause: rootCause ? rootCause.message : this.message,
          details: this.details,
        };
  }

  // Get status code
  getStatusCode(): number {
    return this.statusCode;
  }
}

// Util error function
export const responseErr = (err: Error, res: Response) => {
  const logger = new WinstonLogger();
  const isProduction = config.envStage === 'production';
  // Log error in the console
  logger.error(err.stack || 'Unknown error');

  // Handle with AppError
  if (err instanceof AppError) {
    const appErr = err as AppError;
    res.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
    return;
  }

  // Handle with ZodError (Validation parameter error)
  if (err instanceof ZodError) {
    const zErr = err as ZodError;
    const appErr = ErrInvalidRequest.wrap(zErr);

    zErr.issues.forEach((issue) => {
      // Custom log message
      appErr.withDetail(issue.path.join('.'), issue.message);
    });

    res.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
    return;
  }

  const appErr = ErrInternalServer.wrap(err);
  res.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
};

// Error class
export const ErrInternalServer = AppError.from(
  new Error('Something went wrong, please try again later.'),
  500,
);
export const ErrInvalidRequest = AppError.from(new Error('Invalid request'), 400);
