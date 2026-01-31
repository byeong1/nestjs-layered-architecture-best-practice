import { Injectable, OnModuleInit } from "@nestjs/common";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";

export type LogLevel = "error" | "warn" | "info" | "debug";

export interface LogEntry {
    traceId: string;
    timestamp: string;
    level: LogLevel;
    type: "REQUEST" | "RESPONSE" | "ERROR";
    method: string;
    url: string;
    statusCode?: number;
    responseTime?: number;
    ip?: string;
    userAgent?: string;
    data?: unknown;
    error?: unknown;
    stack?: string;
}

export interface FileLoggerOptions {
    baseLogDir?: string;
    maxFileSize?: number; // 바이트 단위 (기본: 20MB)
    maxRetentionDays?: number; // 보관 일수 (기본: 14일)
    logLevel?: LogLevel; // 최소 로그 레벨
}

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

/**
 * FileLoggerService - 파일 기반 로깅 서비스
 *
 * 기능:
 * - 비동기 파일 쓰기
 * - 날짜/시간별 로그 파일 분리
 * - 로그 레벨 관리
 * - 파일 크기 제한 (초과 시 새 파일 생성)
 * - 오래된 로그 자동 삭제 (로테이션)
 */
@Injectable()
export class FileLoggerService implements OnModuleInit {
    private readonly baseLogDir: string;
    private readonly maxFileSize: number;
    private readonly maxRetentionDays: number;
    private readonly logLevel: LogLevel;
    private fileIndex: Map<string, number> = new Map();

    constructor() {
        const options: FileLoggerOptions = {
            baseLogDir: "./logs",
            maxFileSize: 20 * 1024 * 1024, // 20MB
            maxRetentionDays: 30,
            logLevel: (process.env.LOG_LEVEL as LogLevel) || "info",
        };

        this.baseLogDir = options.baseLogDir!;
        this.maxFileSize = options.maxFileSize!;
        this.maxRetentionDays = options.maxRetentionDays!;
        this.logLevel = options.logLevel!;
    }

    /**
     * 모듈 초기화 시 오래된 로그 정리
     */
    async onModuleInit(): Promise<void> {
        await this.cleanupOldLogs();
    }

    /**
     * 로그 엔트리를 파일에 비동기로 기록합니다
     */
    async writeLog(logType: "api" | "error", entry: LogEntry): Promise<void> {
        /* 로그 레벨 체크 */
        if (!this.shouldLog(entry.level)) {
            return;
        }

        try {
            const filePath = await this.getAvailableLogFilePath(logType);
            await this.ensureDirectoryExists(path.dirname(filePath));

            const logLine = JSON.stringify(entry) + "\n";
            await fsPromises.appendFile(filePath, logLine, "utf8");
        } catch (error) {
            console.error("Failed to write log file:", error);
        }
    }

    /**
     * 동기 방식으로 로그 기록 (필요한 경우)
     */
    writeLogSync(logType: "api" | "error", entry: LogEntry): void {
        if (!this.shouldLog(entry.level)) {
            return;
        }

        try {
            const filePath = this.getLogFilePath(logType);
            this.ensureDirectoryExistsSync(path.dirname(filePath));

            const logLine = JSON.stringify(entry) + "\n";
            fs.appendFileSync(filePath, logLine, "utf8");
        } catch (error) {
            console.error("Failed to write log file:", error);
        }
    }

    /**
     * 트레이스 ID를 생성합니다
     */
    generateTraceId(): string {
        return uuidv4();
    }

    /**
     * KST 타임스탬프를 생성합니다
     */
    getKSTTimestamp(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * 로그 레벨 체크
     */
    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[this.logLevel];
    }

    /**
     * 사용 가능한 로그 파일 경로 반환 (크기 제한 체크)
     */
    private async getAvailableLogFilePath(
        logType: "api" | "error",
    ): Promise<string> {
        const basePath = this.getLogFilePath(logType);
        const key = basePath;

        /* 현재 파일 인덱스 가져오기 */
        let index = this.fileIndex.get(key) || 0;
        let filePath =
            index === 0 ? basePath : this.addIndexToPath(basePath, index);

        /* 파일 크기 체크 */
        try {
            const stats = await fsPromises.stat(filePath);
            if (stats.size >= this.maxFileSize) {
                index++;
                this.fileIndex.set(key, index);
                filePath = this.addIndexToPath(basePath, index);
            }
        } catch {
            /* 파일이 없으면 새로 생성 */
        }

        return filePath;
    }

    /**
     * 파일 경로에 인덱스 추가
     */
    private addIndexToPath(filePath: string, index: number): string {
        const ext = path.extname(filePath);
        const base = filePath.slice(0, -ext.length);
        return `${base}_${index}${ext}`;
    }

    /**
     * 로그 파일 경로를 생성합니다
     */
    private getLogFilePath(logType: "api" | "error"): string {
        const now = new Date();
        const date = now.toISOString().split("T")[0];
        const hour = now.getHours();
        const timeSlot = `${hour.toString().padStart(2, "0")}00-${(hour + 1).toString().padStart(2, "0")}00`;

        return path.join(this.baseLogDir, date, logType, `${timeSlot}.log`);
    }

    /**
     * 디렉토리가 존재하지 않으면 생성합니다 (비동기)
     */
    private async ensureDirectoryExists(dirPath: string): Promise<void> {
        try {
            await fsPromises.access(dirPath);
        } catch {
            await fsPromises.mkdir(dirPath, { recursive: true });
        }
    }

    /**
     * 디렉토리가 존재하지 않으면 생성합니다 (동기)
     */
    private ensureDirectoryExistsSync(dirPath: string): void {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    /**
     * 오래된 로그 파일 정리
     */
    private async cleanupOldLogs(): Promise<void> {
        try {
            const exists = await fsPromises
                .access(this.baseLogDir)
                .then(() => true)
                .catch(() => false);
            if (!exists) {
                return;
            }

            const entries = await fsPromises.readdir(this.baseLogDir, {
                withFileTypes: true,
            });
            const now = new Date();
            const cutoffDate = new Date(
                now.getTime() - this.maxRetentionDays * 24 * 60 * 60 * 1000,
            );

            for (const entry of entries) {
                if (!entry.isDirectory()) continue;

                /* 날짜 형식 폴더인지 확인 (YYYY-MM-DD) */
                const dateMatch = entry.name.match(/^\d{4}-\d{2}-\d{2}$/);
                if (!dateMatch) continue;

                const folderDate = new Date(entry.name);
                if (isNaN(folderDate.getTime())) continue;

                /* 보관 기간 초과 시 삭제 */
                if (folderDate < cutoffDate) {
                    const folderPath = path.join(this.baseLogDir, entry.name);
                    await fsPromises.rm(folderPath, {
                        recursive: true,
                        force: true,
                    });
                    console.log(`Deleted old log folder: ${folderPath}`);
                }
            }
        } catch (error) {
            console.error("Failed to cleanup old logs:", error);
        }
    }
}
