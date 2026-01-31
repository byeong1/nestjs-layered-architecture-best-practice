import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException, IExceptionResponse } from '../base.exception';
import { CustomLogger } from '#common/logger/custom-logger.service';
import { FileLoggerService, LogEntry } from '#common/logger/file-logger.service';

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly logger: CustomLogger,
        private readonly fileLogger: FileLoggerService,
    ) {
        this.logger.setContext(HttpExceptionFilter.name);
    }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const { method, url, ip } = request;
        const userAgent = request.get('user-agent') || '';
        const traceId = (request as any).traceId || this.fileLogger.generateTraceId();
        const isProduction = process.env.NODE_ENV === 'production';

        let status: number;
        let errorResponse: IExceptionResponse;

        if (exception instanceof BaseException) {
            status = exception.getStatus();
            errorResponse = exception.getResponse() as IExceptionResponse;
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            errorResponse = {
                success: false,
                statusCode: status,
                errorCode: 'HTTP_EXCEPTION',
                message:
                    typeof exceptionResponse === 'string'
                        ? exceptionResponse
                        : (exceptionResponse as any).message || 'An error occurred',
                timestamp: new Date().toISOString(),
            };
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;

            /* 프로덕션에서는 상세 에러 메시지 숨김 */
            const message = isProduction
                ? 'Internal server error'
                : (exception instanceof Error ? exception.message : 'Internal server error');

            errorResponse = {
                success: false,
                statusCode: status,
                errorCode: 'INTERNAL_SERVER_ERROR',
                message,
                timestamp: new Date().toISOString(),
            };
        }

        /* 콘솔 로깅 */
        if (isProduction) {
            this.logger.error(`[${status}] ${method} ${url} - ${errorResponse.message}`);
        } else {
            this.logger.error(
                `[${status}] ${method} ${url} - ${errorResponse.message}`,
                exception instanceof Error ? exception.stack : undefined,
            );
        }

        /* 파일 로깅 */
        const errorEntry: LogEntry = {
            traceId,
            timestamp: this.fileLogger.getKSTTimestamp(),
            level: 'error',
            type: 'ERROR',
            method,
            url,
            statusCode: status,
            ip,
            userAgent,
            error: {
                code: errorResponse.errorCode,
                message: errorResponse.message,
            },
            stack: isProduction ? undefined : (exception instanceof Error ? exception.stack : undefined),
        };
        this.fileLogger.writeLog('error', errorEntry);

        response.status(status).json({
            ...errorResponse,
            path: request.url,
        });
    }
}
