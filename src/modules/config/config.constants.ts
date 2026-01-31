import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CONFIG_NAMESPACE = {
    APP: 'app',
    DATABASE: 'database',
};

export const CORS_CONFIG: CorsOptions = {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};
