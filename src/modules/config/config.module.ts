import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { ConfigService } from "./config.service";
import { validateEnvConfig } from "./config-validators";
import configLoaders from "./config-loaders";

@Global()
@Module({})
export class ConfigModule {
    static forRoot(): DynamicModule {
        return {
            module: ConfigModule,
            imports: [
                NestConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: [`env/.env.${process.env.NODE_ENV}`],
                    load: configLoaders,
                    validate: validateEnvConfig,
                    cache: true,
                    expandVariables: true,
                }),
            ],
            providers: [ConfigService],
            exports: [ConfigService],
        };
    }
}
