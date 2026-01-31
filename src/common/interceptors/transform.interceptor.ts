import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CustomLogger } from "#common/logger/custom-logger.service";

/**
 * 표준 응답 포맷 인터페이스
 */
export interface TransformedResponse<T> {
    success: boolean;
    data: T;
}

/**
 * TransformInterceptor - 응답 데이터 변환 인터셉터
 *
 * 모든 HTTP 응답을 표준 포맷으로 래핑합니다.
 * 출력 형식: { success: true, data: ... }
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
    T,
    TransformedResponse<T>
> {
    constructor(private readonly logger: CustomLogger) {
        this.logger.setContext(TransformInterceptor.name);
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<TransformedResponse<T>> {
        return next.handle().pipe(
            map((data) => {
                this.logger.debug("Response transformed to standard format");
                return {
                    success: true,
                    data,
                };
            }),
        );
    }
}
