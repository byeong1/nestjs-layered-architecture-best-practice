import { BadRequestException, ValidationError } from "@nestjs/common";

interface FormattedError {
    property: string;
    value?: unknown;
    constraints: Record<string, string>;
    children?: FormattedError[];
}

/**
 * ValidationPipe에서 사용할 커스텀 예외 팩토리
 * 유효성 검증 실패 시 일관된 에러 응답 포맷을 제공합니다.
 */
export const createValidationExceptionFactory = () => {
    return (errors: ValidationError[]) => {
        const formattedErrors = errors.map((error) => {
            /* 중첩된 유효성 검증 오류 처리 */
            if (error.children && error.children.length > 0) {
                return {
                    property: error.property,
                    constraints: error.constraints || {},
                    children: formatNestedErrors(error.children),
                };
            }

            return {
                property: error.property,
                value: error.value,
                constraints: error.constraints || {},
            };
        });

        return new BadRequestException({
            code: "VALIDATION_FAILED",
            message: "Validation failed",
            errors: formattedErrors,
        });
    };
};

/**
 * 중첩된 유효성 검증 오류를 재귀적으로 포맷팅
 */
const formatNestedErrors = (children: ValidationError[]): FormattedError[] => {
    return children.map((child) => ({
        property: child.property,
        value: child.value,
        constraints: child.constraints || {},
        ...(child.children &&
            child.children.length > 0 && {
                children: formatNestedErrors(child.children),
            }),
    }));
};
