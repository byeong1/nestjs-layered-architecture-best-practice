#!/usr/bin/env node

/**
 * Local Development Startup Script
 * Uses env/.env.local file to run NestJS development server
 *
 * Usage:
 *   node scripts/local.js
 *   yarn start:local
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const rootDir = path.resolve(__dirname, "..");
const envFile = path.join(rootDir, "env", ".env.local");

if (!fs.existsSync(envFile)) {
    console.error("\x1b[31m%s\x1b[0m", "Error: env/.env.local file not found!");
    console.log(
        "\x1b[33m%s\x1b[0m",
        "Create .env.local file in the env/ directory.",
    );
    process.exit(1);
}

console.log("\x1b[36m%s\x1b[0m", "Starting local development server...");
console.log("\x1b[36m%s\x1b[0m", `Using: ${envFile}`);
console.log("");

const child = spawn(
    "npx",
    [
        "dotenv",
        "-e",
        "env/.env.local",
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
    console.log("\n\x1b[33m%s\x1b[0m", "Shutting down local server...");
    child.kill("SIGINT");
});

process.on("SIGTERM", () => {
    child.kill("SIGTERM");
});
