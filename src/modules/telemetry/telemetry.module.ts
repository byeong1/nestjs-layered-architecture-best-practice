import { Module } from "@nestjs/common";
import { OpenTelemetryModule } from "nestjs-otel";
import { ConfigService } from "../config/config.service";

@Module({
    imports: [
        OpenTelemetryModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                metrics: {
                    hostMetrics: true,
                    apiMetrics: {
                        enable: true,
                        defaultAttributes: {
                            service: configService.telemetryConfig.serviceName,
                        },
                    },
                },
            }),
        }),
    ],
})
export class TelemetryModule {}
