#!/usr/bin/env node

/**
 * OpenTelemetry Tracing Initialization Script
 * Must be loaded before the application starts using -r flag
 *
 * Usage:
 *   node -r ./scripts/tracing.js dist/main.js
 */

const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
    getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
    OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");
const { resourceFromAttributes } = require("@opentelemetry/resources");
const { ATTR_SERVICE_NAME } = require("@opentelemetry/semantic-conventions");

const otelEnabled = process.env.OTEL_ENABLED === "true";

if (otelEnabled) {
    const serviceName = process.env.OTEL_SERVICE_NAME || "nestjs-app";
    const otlpEndpoint =
        process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318";
    const metricsPort = parseInt(process.env.OTEL_METRICS_PORT || "9464", 10);

    const traceExporter = new OTLPTraceExporter({
        url: `${otlpEndpoint}/v1/traces`,
    });

    const prometheusExporter = new PrometheusExporter({
        port: metricsPort,
    });

    const opentelemetrySDK = new NodeSDK({
        resource: resourceFromAttributes({
            [ATTR_SERVICE_NAME]: serviceName,
        }),
        traceExporter,
        metricReader: prometheusExporter,
        instrumentations: [getNodeAutoInstrumentations()],
    });

    opentelemetrySDK.start();

    process.on("SIGTERM", () => {
        opentelemetrySDK.shutdown().finally(() => process.exit(0));
    });

    console.log(
        `[OpenTelemetry] Tracing initialized for service: ${serviceName}`,
    );
    console.log(
        `[OpenTelemetry] Metrics endpoint: http://localhost:${metricsPort}/metrics`,
    );
    console.log(`[OpenTelemetry] Trace exporter: ${otlpEndpoint}/v1/traces`);
}
