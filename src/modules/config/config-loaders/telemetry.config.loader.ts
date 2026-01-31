import { registerAs } from "@nestjs/config";
import { CONFIG_NAMESPACE } from "../config.constants";
import { ITelemetryConfig } from "../config.types";

export default registerAs(
    CONFIG_NAMESPACE.TELEMETRY,
    (): ITelemetryConfig => ({
        enabled: process.env.OTEL_ENABLED === "true",
        serviceName: process.env.OTEL_SERVICE_NAME!,
        exporterEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT!,
        metricsPort: parseInt(process.env.OTEL_METRICS_PORT!, 10),
    }),
);
