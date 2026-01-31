import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Request, Response } from "express";
import { CustomLogger } from "#common/logger/custom-logger.service";
import {
    FileLoggerService,
    LogEntry,
} from "#common/logger/file-logger.service";

/**
 * LoggingInterceptor - HTTP 요청/응답 로깅 인터셉터
 *
 * 모든 HTTP 요청의 시작과 완료를 로깅합니다.
 * - 콘솔 로깅: CustomLogger
 * - 파일 로깅: FileLoggerService
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        private readonly logger: CustomLogger,
        private readonly fileLogger: FileLoggerService,
    ) {
        this.logger.setContext(LoggingInterceptor.name);
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();
        const { method, url, ip } = request;
        const userAgent = request.get("user-agent") || "";
        const startTime = Date.now();
        const traceId = this.fileLogger.generateTraceId();

        /* traceId를 request에 저장 (다른 곳에서 사용 가능) */
        (request as any).traceId = traceId;

        /* 콘솔 로깅 */
        this.logger.log(`[Request] ${method} ${url}`);

        /* 파일 로깅 - 요청 */
        const requestEntry: LogEntry = {
            traceId,
            timestamp: this.fileLogger.getKSTTimestamp(),
            level: "info",
            type: "REQUEST",
            method,
            url,
            ip,
            userAgent,
            data: {
                query: request.query,
                params: request.params,
                body: request.body,
            },
        };

        this.fileLogger.writeLog("api", requestEntry);

        return next.handle().pipe(
            tap({
                next: () => {
                    const responseTime = Date.now() - startTime;

                    /* 콘솔 로깅 */
                    this.logger.log(
                        `[Response] ${method} ${url} - ${responseTime}ms`,
                    );

                    /* 파일 로깅 - 응답 */
                    const responseEntry: LogEntry = {
                        traceId,
                        timestamp: this.fileLogger.getKSTTimestamp(),
                        level: "info",
                        type: "RESPONSE",
                        method,
                        url,
                        statusCode: response.statusCode,
                        responseTime,
                    };
                    this.fileLogger.writeLog("api", responseEntry);
                },
                error: (error: Error) => {
                    const responseTime = Date.now() - startTime;

                    /* 콘솔 로깅 */
                    this.logger.error(
                        `[Error] ${method} ${url} - ${responseTime}ms - ${error.message}`,
                    );
                },
            }),
        );
    }
}
