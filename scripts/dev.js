#!/usr/bin/env node

/**
 * Development Startup Script
 * Uses env/.env.development file to run NestJS development server
 *
 * Usage:
 *   node scripts/dev.js
 *   yarn start:dev
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const rootDir = path.resolve(__dirname, "..");
const envFile = path.join(rootDir, "env", ".env.development");

if (!fs.existsSync(envFile)) {
    console.error(
        "\x1b[31m%s\x1b[0m",
        "Error: env/.env.development file not found!",
    );
    console.log(
        "\x1b[33m%s\x1b[0m",
        "Create .env.development file in the env/ directory.",
    );
    process.exit(1);
}

console.log("\x1b[36m%s\x1b[0m", "Starting development server...");
console.log("\x1b[36m%s\x1b[0m", `Using: ${envFile}`);
console.log("");

const child = spawn(
    "npx",
    [
        "dotenv",
        "-e",
        "env/.env.development",
        "--",
        "node",
        "-r",
        "./scripts/tracing.js",
        "dist/main.js",
    ],
    {
        cwd: rootDir,
        stdio: "inherit",
        shell: true,
    },
);

child.on("close", (code) => {
    if (code !== 0) {
        console.error("\x1b[31m%s\x1b[0m", `\nProcess exited with code ${code}`);
        process.exit(code);
    }
});

process.on("SIGINT", () => {
    console.log("\n\x1b[33m%s\x1b[0m", "Shutting down development server...");
    child.kill("SIGINT");
});

process.on("SIGTERM", () => {
    child.kill("SIGTERM");
});
