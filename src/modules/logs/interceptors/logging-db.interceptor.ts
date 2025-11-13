import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LogsService } from 'src/modules/logs/logs.service';

interface JwtUserPayload {
  userId: number;
  email: string;
  role: string;
}

@Injectable()
export class LoggingDbInterceptor implements NestInterceptor {
  constructor(private readonly logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const http = context.switchToHttp();
        const req = http.getRequest<Request & { user?: JwtUserPayload }>();
        const res = http.getResponse<Response>();

        const { method, url } = req;
        const status = res.statusCode;
        const duration = Date.now() - start;
        const user = req.user ?? null;

        void this.logsService
          .saveLog({
            method,
            url,
            status,
            durationMs: duration,
            userId: user?.userId ?? null,
            userEmail: user?.email ?? null,
          })
          .catch((e: unknown) => {
            console.error('Error saving log to DB:', e);
          });
      }),

      catchError((err: unknown) => {
        const http = context.switchToHttp();
        const req = http.getRequest<Request & { user?: JwtUserPayload }>();

        const { method, url } = req;
        const duration = Date.now() - start;
        const user = req.user ?? null;

        const status =
          typeof err === 'object' && err !== null && 'status' in err
            ? ((err as { status?: number }).status ?? 500)
            : 500;

        void this.logsService
          .saveLog({
            method,
            url,
            status,
            durationMs: duration,
            userId: user?.userId ?? null,
            userEmail: user?.email ?? null,
          })
          .catch((e: unknown) => {
            console.error('Error saving the error log to the database:', e);
          });

        return throwError(() => err as Error);
      }),
    );
  }
}
