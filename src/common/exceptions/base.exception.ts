import { HttpException, HttpStatus } from '@nestjs/common';

export interface IExceptionResponse {
    success: boolean;
    statusCode: number;
    errorCode: string;
    message: string;
    timestamp: string;
}

export class BaseException extends HttpException {
    constructor(
        private readonly errorCode: string,
        message: string,
        statusCode: HttpStatus,
    ) {
        const response: IExceptionResponse = {
            success: false,
            statusCode,
            errorCode,
            message,
            timestamp: new Date().toISOString(),
        };
        super(response, statusCode);
    }

    getErrorCode(): string {
        return this.errorCode;
    }
}
