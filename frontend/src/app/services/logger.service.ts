import { Injectable } from '@angular/core';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

/**
 * Enterprise Frontend Logger Service.
 * Provides structured, color-formatted, and high-readability logs
 * compatible with console inspection and browser observability tools.
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private readonly appPrefix = 'SMP-FRONTEND';

  info(context: string, message: string, data?: any): void {
    this.log('INFO', context, message, data, '#3b82f6');
  }

  success(context: string, message: string, data?: any): void {
    this.log('INFO', context, message, data, '#10b981');
  }

  warn(context: string, message: string, data?: any): void {
    this.log('WARN', context, message, data, '#f59e0b');
  }

  error(context: string, message: string, error?: any): void {
    this.log('ERROR', context, message, error, '#ef4444');
  }

  debug(context: string, message: string, data?: any): void {
    this.log('DEBUG', context, message, data, '#6b7280');
  }

  private log(level: LogLevel, context: string, message: string, payload: any, badgeColor: string): void {
    const timestamp = new Date().toISOString();
    const badgeStyle = `background: ${badgeColor}; color: #ffffff; font-weight: bold; padding: 2px 6px; border-radius: 4px; font-size: 10px;`;
    const contextStyle = `color: #38bdf8; font-weight: 600; font-size: 11px;`;
    const messageStyle = `color: #f1f5f9; font-size: 11px;`;

    const formattedPrefix = `%c${this.appPrefix} [${level}]%c [${context}]%c ${message}`;

    switch (level) {
      case 'ERROR':
        if (payload !== undefined) {
          console.error(formattedPrefix, badgeStyle, contextStyle, messageStyle, payload);
        } else {
          console.error(formattedPrefix, badgeStyle, contextStyle, messageStyle);
        }
        break;
      case 'WARN':
        if (payload !== undefined) {
          console.warn(formattedPrefix, badgeStyle, contextStyle, messageStyle, payload);
        } else {
          console.warn(formattedPrefix, badgeStyle, contextStyle, messageStyle);
        }
        break;
      default:
        if (payload !== undefined) {
          console.log(formattedPrefix, badgeStyle, contextStyle, messageStyle, payload);
        } else {
          console.log(formattedPrefix, badgeStyle, contextStyle, messageStyle);
        }
        break;
    }
  }
}

