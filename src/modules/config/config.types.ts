import { AppConfigDto } from "./config-dto/app.config.dto";
import { DatabaseConfigDto } from "./config-dto/database.config.dto";
import { TelemetryConfigDto } from "./config-dto/telemetry.config.dto";

export type Environment = "development" | "production" | "test";

export type IAppConfig = AppConfigDto;
export type IDatabaseConfig = DatabaseConfigDto;
export type ITelemetryConfig = TelemetryConfigDto;

export type IConfig = {
    app: IAppConfig;
    database: IDatabaseConfig;
    telemetry: ITelemetryConfig;
};
