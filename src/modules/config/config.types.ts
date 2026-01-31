import { AppConfigDto } from "./config-dto/app.config.dto";
import { DatabaseConfigDto } from "./config-dto/database.config.dto";

export type Environment = "development" | "production" | "test";

export type IAppConfig = AppConfigDto;
export type IDatabaseConfig = DatabaseConfigDto;

export type IConfig = {
    app: IAppConfig;
    database: IDatabaseConfig;
};
