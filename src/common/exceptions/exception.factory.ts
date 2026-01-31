import { BaseException } from "./base.exception";
import { EXCEPTION_TYPE } from "#common/exceptions/constants/exception.constants";

export class ExceptionFactory {
    static badRequest(prefix: string, message: string): BaseException {
        return new BaseException(
            `${prefix}_${EXCEPTION_TYPE.BAD_REQUEST.suffix}`,
            message,
            EXCEPTION_TYPE.BAD_REQUEST.status,
        );
    }

    static unauthorized(prefix: string, message: string): BaseException {
        return new BaseException(
            `${prefix}_${EXCEPTION_TYPE.UNAUTHORIZED.suffix}`,
            message,
            EXCEPTION_TYPE.UNAUTHORIZED.status,
        );
    }

    static forbidden(prefix: string, message: string): BaseException {
        return new BaseException(
            `${prefix}_${EXCEPTION_TYPE.FORBIDDEN.suffix}`,
            message,
            EXCEPTION_TYPE.FORBIDDEN.status,
        );
    }

    static notFound(prefix: string, message: string): BaseException {
        return new BaseException(
            `${prefix}_${EXCEPTION_TYPE.NOT_FOUND.suffix}`,
            message,
            EXCEPTION_TYPE.NOT_FOUND.status,
        );
    }

    static duplicate(prefix: string, message: string): BaseException {
        return new BaseException(
            `${prefix}_${EXCEPTION_TYPE.DUPLICATE.suffix}`,
            message,
            EXCEPTION_TYPE.DUPLICATE.status,
        );
    }

    static internalServerError(prefix: string, message: string): BaseException {
        return new BaseException(
            `${prefix}_${EXCEPTION_TYPE.INTERNAL_SERVER_ERROR.suffix}`,
            message,
            EXCEPTION_TYPE.INTERNAL_SERVER_ERROR.status,
        );
    }
}
