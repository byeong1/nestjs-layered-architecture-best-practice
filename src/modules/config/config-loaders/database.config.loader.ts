import { registerAs } from '@nestjs/config';
import { CONFIG_NAMESPACE } from '../config.constants';
import { IDatabaseConfig } from '../config.types';

export default registerAs(
    CONFIG_NAMESPACE.DATABASE,
    (): IDatabaseConfig => ({
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT!, 10),
        username: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_DATABASE!,
    }),
);
