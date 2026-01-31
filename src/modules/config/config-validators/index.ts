import { validateAppConfig } from "./app.config.validator";
import { validateDatabaseConfig } from "./database.config.validator";

export const validateEnvConfig = (config: Record<string, unknown>) => {
    validateAppConfig(config);
    validateDatabaseConfig(config);
    return config;
};
