import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, throwError } from 'rxjs';
import { LoggerService } from '../services/logger.service';

/**
 * Functional HTTP Interceptor for Observability.
 * Attaches X-Correlation-ID to outgoing requests and logs request/response telemetry.
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const startTime = performance.now();

  // Generate trace ID for end-to-end distributed tracing with Spring Boot backend
  const traceId = 'smp-ui-' + Math.random().toString(36).substring(2, 9);

  const tracedReq = req.clone({
    setHeaders: {
      'X-Correlation-ID': traceId
    }
  });

  logger.info('HTTP-CLIENT', `--> [${traceId}] ${tracedReq.method} ${tracedReq.urlWithParams}`);

  return next(tracedReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const duration = (performance.now() - startTime).toFixed(1);
        logger.success('HTTP-CLIENT', `<-- [${traceId}] ${tracedReq.method} ${tracedReq.urlWithParams} [${event.status} ${event.statusText}] in ${duration}ms`);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const duration = (performance.now() - startTime).toFixed(1);
      logger.error('HTTP-CLIENT', `<-- [${traceId}] ${tracedReq.method} ${tracedReq.urlWithParams} FAILED with status ${error.status} in ${duration}ms`, {
        error: error.message,
        url: error.url,
        status: error.status
      });
      return throwError(() => error);
    })
  );
};

