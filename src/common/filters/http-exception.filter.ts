import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface RequestUser {
  userId: number;
  email: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { user?: RequestUser }>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const raw =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'INTERNAL SERVER ERROR';

    const errorResponse =
      typeof raw === 'object' && raw !== null && 'message' in raw
        ? (raw.message as string | string[])
        : raw;

    const errorPayload = {
      success: false,
      statusCode: status,
      message: errorResponse,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    console.error(
      `[Error ${status}] ${request.method} ${request.url} -`,
      errorResponse,
    );

    response.status(status).json(errorPayload);
  }
}
