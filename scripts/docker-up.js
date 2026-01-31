#!/usr/bin/env node

/**
 * Docker Monitoring Stack Startup Script
 * Starts NestJS App, Prometheus, Grafana, Jaeger, Node Exporter
 *
 * Usage:
 *   node scripts/docker-up.js
 *   yarn docker:up
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const rootDir = path.resolve(__dirname, "..");
const composeFile = path.join(rootDir, "docker", "docker-compose.monitoring.yml");

if (!fs.existsSync(composeFile)) {
    console.error("\x1b[31m%s\x1b[0m", "Error: docker/docker-compose.monitoring.yml not found!");
    process.exit(1);
}

console.log("\x1b[36m%s\x1b[0m", "Starting NestJS app with monitoring stack...");
console.log("");

const child = spawn(
    "docker-compose",
    ["-f", "docker/docker-compose.monitoring.yml", "up", "-d"],
    {
        cwd: rootDir,
        stdio: "inherit",
        shell: true,
    },
);

child.on("close", (code) => {
    if (code === 0) {
        console.log("");
        console.log("\x1b[32m%s\x1b[0m", "============================================");
        console.log("\x1b[32m%s\x1b[0m", "  NestJS App + Monitoring Started Successfully");
        console.log("\x1b[32m%s\x1b[0m", "============================================");
        console.log("");
        console.log("\x1b[33m%s\x1b[0m", "Access URLs:");
        console.log("");
        console.log("  \x1b[1mNestJS App\x1b[0m           : \x1b[36mhttp://localhost:3000\x1b[0m");
        console.log("  NestJS Metrics       : \x1b[36mhttp://localhost:9464/metrics\x1b[0m");
        console.log("");
        console.log("  Grafana (Dashboard)  : \x1b[36mhttp://localhost:3001\x1b[0m");
        console.log("                         Login: admin / admin");
        console.log("");
        console.log("  Prometheus (Metrics) : \x1b[36mhttp://localhost:9090\x1b[0m");
        console.log("  Jaeger (Tracing)     : \x1b[36mhttp://localhost:16686\x1b[0m");
        console.log("  cAdvisor (Container) : \x1b[36mhttp://localhost:8080\x1b[0m");
        console.log("  Node Exporter        : \x1b[36mhttp://localhost:9100/metrics\x1b[0m");
        console.log("");
        console.log("\x1b[33m%s\x1b[0m", "Dashboards (auto-provisioned):");
        console.log("");
        console.log("  - NestJS Application");
        console.log("  - Container Metrics");
        console.log("  - System Metrics");
        console.log("  - Prometheus Stats");
        console.log("");
        console.log("\x1b[90m%s\x1b[0m", "Run 'yarn docker:logs' to view logs");
        console.log("\x1b[90m%s\x1b[0m", "Run 'yarn docker:down' to stop");
        console.log("");
    } else {
        console.error("\x1b[31m%s\x1b[0m", `\nFailed to start monitoring stack (exit code: ${code})`);
        process.exit(code);
    }
});

process.on("SIGINT", () => {
    child.kill("SIGINT");
});

process.on("SIGTERM", () => {
    child.kill("SIGTERM");
});
