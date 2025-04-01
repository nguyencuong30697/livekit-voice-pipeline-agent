export interface ILogger {
  info(message: string, ...meta: unknown[]): void;
  error(message: string, ...meta: unknown[]): void;
  warn(message: string, ...meta: unknown[]): void;
  debug(message: string, ...meta: unknown[]): void;
}

export interface ApiResponse {
  message: string;
  status: TEXT_CHANGE_STATUS;
}

export enum TEXT_CHANGE_STATUS {
  CHANGED = 'changed',
  UNCHANGED = 'unchanged',
}

export interface IHttpTextProcessorAdapter {
  truncate(text: string): Promise<string>;
}
