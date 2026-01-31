import { registerAs } from '@nestjs/config';
import { CONFIG_NAMESPACE } from '../config.constants';
import { IAppConfig } from '../config.types';

export default registerAs(
    CONFIG_NAMESPACE.APP,
    (): IAppConfig => ({
        nodeEnv: process.env.NODE_ENV as any,
        port: parseInt(process.env.PORT!, 10),
    }),
);
