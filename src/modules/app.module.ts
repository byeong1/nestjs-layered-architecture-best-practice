/* THIRD-PARTY */
import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";

/* MODULE */
import { ConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { RoutesModule } from "./routes/routes.module";
import { TelemetryModule } from "./telemetry/telemetry.module";
import { LoggerModule } from "#common/logger/logger.module";

/* CONTROLLER */
import { AppController } from "./app.controller";

/* FILTER */
import { HttpExceptionFilter } from "#common/exceptions/filters/http-exception.filter";
import { TypeOrmExceptionFilter } from "#common/exceptions/filters/typeorm-exception.filter";

/* INTERCEPTOR */
import { LoggingInterceptor } from "#common/interceptors/logging.interceptor";
import { TransformInterceptor } from "#common/interceptors/transform.interceptor";

@Module({
    imports: [
        /* 전역 설정 모듈 */
        ConfigModule.forRoot(),

        /* Database 모듈 */
        DatabaseModule,

        /* Logger 모듈 */
        LoggerModule,

        /* Health 모듈 */
        HealthModule,

        /* Telemetry 모듈 */
        TelemetryModule,

        /* 라우트 모듈 */
        RoutesModule,
    ],
    controllers: [AppController],
    providers: [
        /* 전역 필터 등록 */
        {
            provide: APP_FILTER,
            useClass: TypeOrmExceptionFilter,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        /* 전역 인터셉터 등록 */
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
})
export class AppModule {}
