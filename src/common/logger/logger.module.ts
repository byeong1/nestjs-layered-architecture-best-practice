import { Global, Module } from '@nestjs/common';
import { CustomLogger } from '#common/logger/custom-logger.service';
import { FileLoggerService } from '#common/logger/file-logger.service';

/**
 * LoggerModule - 전역 로거 모듈
 *
 * CustomLogger와 FileLoggerService를 애플리케이션 전체에서 사용할 수 있도록 전역 모듈로 제공합니다.
 * @Global() 데코레이터로 인해 한 번만 import하면 모든 모듈에서 주입받을 수 있습니다.
 */
@Global()
@Module({
  providers: [CustomLogger, FileLoggerService],
  exports: [CustomLogger, FileLoggerService],
})
export class LoggerModule {}
