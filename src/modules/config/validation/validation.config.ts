import { ValidationPipe } from "@nestjs/common";
import { createValidationExceptionFactory } from "./validation.exception-factory";

export const validationPipeConfig = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: createValidationExceptionFactory(),
});
