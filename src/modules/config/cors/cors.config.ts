import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { CORS_CONFIG } from "../config.constants";

export const corsConfig: CorsOptions = {
    ...CORS_CONFIG,
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
};
