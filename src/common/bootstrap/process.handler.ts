import { Logger } from "@nestjs/common";

export class ProcessHandler {
    private static readonly logger = new Logger(ProcessHandler.name);
    private static isHandlingExit = false;

    static initialize(): void {
        /* 1. unhandledRejection 핸들러 */
        process.on(
            "unhandledRejection",
            (reason: unknown, promise: Promise<unknown>) => {
                this.logger.error(
                    "Unhandled Rejection at:",
                    promise,
                    "reason:",
                    reason,
                );
            },
        );

        /* 2. uncaughtException 핸들러 */
        process.on("uncaughtException", (error: Error) => {
            this.logger.error("Uncaught Exception:", error);

            if (!this.isFatalError(error)) return;

            this.safeExit(1, "Uncaught Exception");
        });

        /* 3. 종료 신호 핸들러 (SIGTERM, SIGINT, SIGQUIT) */
        const signals: NodeJS.Signals[] = ["SIGTERM", "SIGINT", "SIGQUIT"];

        signals.forEach((signal) => {
            process.on(signal, () => {
                this.logger.log(`Received ${signal}. Graceful shutdown start`);
                this.gracefulShutdown(signal);
            });
        });
    }

    private static async gracefulShutdown(signal: string): Promise<void> {
        if (this.isHandlingExit) return;

        this.isHandlingExit = true;
        this.logger.log(`Graceful shutdown for ${signal}...`);

        try {
            /* 여기에 정리 로직 추가 (DB 연결 종료 등) */
            this.logger.log("Graceful shutdown completed");

            process.exit(0);
        } catch (error) {
            this.logger.error("Error during graceful shutdown:", error);

            process.exit(1);
        }
    }

    private static safeExit(code: number, reason: string): void {
        this.logger.warn(
            `Process will exit with code ${code}. Reason: ${reason}`,
        );

        setTimeout(() => {
            this.logger.error(
                "Could not close connections in time, forcefully shutting down",
            );
            process.exit(code);
        }, 5000).unref();

        process.exit(code);
    }

    private static isFatalError(error: Error): boolean {
        const name = error.name || "";
        const message = error.message || "";

        if (name === "FATAL_ERROR" || message.includes("heap out of memory")) {
            return true;
        }

        return false;
    }
}
