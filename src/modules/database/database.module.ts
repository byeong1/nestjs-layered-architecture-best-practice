import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "../config/config.service";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) =>
                configService.databaseConfig,
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
