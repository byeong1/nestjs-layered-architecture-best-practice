import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AppConfigDto } from '../config-dto/app.config.dto';

export const validateAppConfig = (config: Record<string, unknown>): AppConfigDto => {
    const validatedConfig = plainToInstance(AppConfigDto, {
        nodeEnv: config.NODE_ENV,
        port: config.PORT,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
        forbidUnknownValues: true,
    });

    if (errors.length > 0) {
        throw new Error(`App config validation failed: ${errors.toString()}`);
    }

    return validatedConfig;
};
