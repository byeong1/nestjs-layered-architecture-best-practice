import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { QueryFailedError, EntityNotFoundError } from "typeorm";
import { Request, Response } from "express";
import { CustomLogger } from "#common/logger/custom-logger.service";
import {
    FileLoggerService,
    LogEntry,
} from "#common/logger/file-logger.service";

@Catch(QueryFailedError, EntityNotFoundError)
@Injectable()
export class TypeOrmExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly logger: CustomLogger,
        private readonly fileLogger: FileLoggerService,
    ) {
        this.logger.setContext(TypeOrmExceptionFilter.name);
    }

    catch(
        exception: QueryFailedError | EntityNotFoundError,
        host: ArgumentsHost,
    ) {
        const ctx = host.switchToHttp();

        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { method, url, ip } = request;

        const userAgent = request.get("user-agent") || "";
        const traceId =
            (request as any).traceId || this.fileLogger.generateTraceId();

        const isProduction = process.env.NODE_ENV === "production";

        let status: number;
        let message: string;
        let errorCode: string;

        if (exception instanceof EntityNotFoundError) {
            status = HttpStatus.NOT_FOUND;
            message = "Resource not found";
            errorCode = "DB_ENTITY_NOT_FOUND";
        } else {
            /* QueryFailedError */
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = "Database error";
            errorCode = "DB_QUERY_FAILED";
        }

        /* 콘솔 로깅 */
        if (isProduction) {
            this.logger.error(
                `[${status}] ${method} ${url} - ${errorCode}: ${message}`,
            );
        } else {
            this.logger.error(
                `[${status}] ${method} ${url} - ${errorCode}: ${message}`,
                exception.stack,
            );
        }

        /* 파일 로깅 */
        const errorEntry: LogEntry = {
            traceId,
            timestamp: this.fileLogger.getKSTTimestamp(),
            level: "error",
            type: "ERROR",
            method,
            url,
            statusCode: status,
            ip,
            userAgent,
            error: {
                code: errorCode,
                message: isProduction ? message : exception.message,
            },
            stack: isProduction ? undefined : exception.stack,
        };
        this.fileLogger.writeLog("error", errorEntry);

        /* 프로덕션에서는 상세 에러 숨김 */
        const error = isProduction
            ? null
            : {
                  name: exception.name,
                  message: exception.message,
              };

        response.status(status).json({
            success: false,
            statusCode: status,
            errorCode,
            message,
            error,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
