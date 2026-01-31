import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { DatabaseConfigDto } from '../config-dto/database.config.dto';

export const validateDatabaseConfig = (config: Record<string, unknown>): DatabaseConfigDto => {
    const validatedConfig = plainToInstance(DatabaseConfigDto, {
        host: config.DB_HOST,
        port: config.DB_PORT,
        username: config.DB_USERNAME,
        password: config.DB_PASSWORD,
        database: config.DB_DATABASE,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
        forbidUnknownValues: true,
    });

    if (errors.length > 0) {
        throw new Error(`Database config validation failed: ${errors.toString()}`);
    }

    return validatedConfig;
};
