import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const rawResponse: string | Record<string, unknown> =
      exception instanceof HttpException
        ? (exception.getResponse() as string | Record<string, unknown>)
        : 'INTERNAL SERVER ERROR';

    const errorResponse =
      typeof rawResponse === 'object' && 'message' in rawResponse
        ? (rawResponse.message as string | string[])
        : rawResponse;

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
