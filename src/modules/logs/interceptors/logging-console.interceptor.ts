import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();

        const method = req.method;
        const url = req.url;
        const status = res.statusCode;
        const duration = Date.now() - start;

        const timestamp = new Date().toLocaleString('es-CO');

        console.log(
          `[${timestamp}] ${method} ${url} = ${status} | ${duration}ms`,
        );
      }),
    );
  }
}
