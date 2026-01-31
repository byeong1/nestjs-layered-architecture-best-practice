import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

/* Constants */
import { CONFIG_NAMESPACE } from "./config.constants";

/* Types */
import { IAppConfig, IDatabaseConfig, ITelemetryConfig } from "./config.types";

@Injectable()
export class ConfigService {
    constructor(private readonly configService: NestConfigService) {}

    get appConfig(): IAppConfig {
        return this.configService.get<IAppConfig>(CONFIG_NAMESPACE.APP)!;
    }

    get dbConfig(): IDatabaseConfig {
        return this.configService.get<IDatabaseConfig>(
            CONFIG_NAMESPACE.DATABASE,
        )!;
    }

    get telemetryConfig(): ITelemetryConfig {
        return this.configService.get<ITelemetryConfig>(
            CONFIG_NAMESPACE.TELEMETRY,
        )!;
    }

    get port(): number {
        return this.appConfig.port;
    }

    get nodeEnv(): string {
        return this.appConfig.nodeEnv;
    }

    get isDevelopment(): boolean {
        return this.nodeEnv === "development";
    }

    get isProduction(): boolean {
        return this.nodeEnv === "production";
    }

    get databaseConfig(): TypeOrmModuleOptions {
        const db = this.dbConfig;
        return {
            type: "mysql",
            host: db.host,
            port: db.port,
            username: db.username,
            password: db.password,
            database: db.database,
            entities: [__dirname + "/../../**/*.entity{.ts,.js}"],
            synchronize: !this.isDevelopment,
            logging: this.isDevelopment,
            charset: "utf8mb4",
        };
    }
}
