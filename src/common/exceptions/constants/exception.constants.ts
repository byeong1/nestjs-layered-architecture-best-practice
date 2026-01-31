import { HttpStatus } from "@nestjs/common";

export const EXCEPTION_TYPE = {
    NOT_FOUND: {
        status: HttpStatus.NOT_FOUND,
        suffix: "NOT_FOUND",
    },
    DUPLICATE: {
        status: HttpStatus.CONFLICT,
        suffix: "DUPLICATE",
    },
    BAD_REQUEST: {
        status: HttpStatus.BAD_REQUEST,
        suffix: "BAD_REQUEST",
    },
    UNAUTHORIZED: {
        status: HttpStatus.UNAUTHORIZED,
        suffix: "UNAUTHORIZED",
    },
    FORBIDDEN: {
        status: HttpStatus.FORBIDDEN,
        suffix: "FORBIDDEN",
    },
    INTERNAL_SERVER_ERROR: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        suffix: "INTERNAL_SERVER_ERROR",
    },
};
