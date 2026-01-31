import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";

/* Module */
import { AppModule } from "#modules/app.module";

/* Configs */
import { validationPipeConfig } from "#modules/config/validation/validation.config";
import { setupSwagger } from "#modules/config/swagger/swagger.config";
import { corsConfig } from "#modules/config/cors/cors.config";

/* Common */
import { CustomLogger } from "#common/logger/custom-logger.service";
import { ProcessHandler } from "#common/bootstrap/process.handler";

/**
 * The main function that bootstraps the NestJS application.
 */
async function bootstrap() {
    /* 프로세스 핸들러 초기화 */
    ProcessHandler.initialize();

    /* 커스텀 로거 인스턴스 생성 */
    const logger = new CustomLogger("Bootstrap");

    /* 커스텀 로거를 사용하여 앱 생성 */
    const app = await NestFactory.create(AppModule, { logger });

    /* 쿠키 파서 설정 */
    app.use(cookieParser());

    /* 전역 파이프 설정 */
    app.useGlobalPipes(validationPipeConfig);

    /* CORS 설정 */
    app.enableCors(corsConfig);

    /* Swagger 설정 */
    setupSwagger(app);

    const port = process.env.PORT || 3000;
    await app.listen(port);

    logger.log(`Application is running on: http://localhost:${port}`);
    logger.log(`Swagger docs: http://localhost:${port}/api-docs`);
}

bootstrap();
