import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const setupSwagger = (app: INestApplication): void => {
    const config = new DocumentBuilder()
        .setTitle("NestJS Layer Architecture API")
        .setDescription("NestJS Layer Architecture Best Practice API")
        .setVersion("1.0")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, document);
};
