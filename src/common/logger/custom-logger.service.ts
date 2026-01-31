import { Injectable, ConsoleLogger, LoggerService } from '@nestjs/common';

/**
 * CustomLogger - NestJS 공식 문서 방식의 커스텀 로거
 *
 * ConsoleLogger를 확장하여 타임스탬프와 컨텍스트를 포함한 로깅 기능을 제공합니다.
 * LoggerService 인터페이스를 구현하여 NestJS 애플리케이션 전체에서 사용 가능합니다.
 *
 * @see https://docs.nestjs.com/techniques/logger
 */
@Injectable()
export class CustomLogger extends ConsoleLogger implements LoggerService {
  constructor(context?: string) {
    super(context ?? 'Application', { timestamp: true });
  }

  /**
   * 일반 로그 메시지 출력
   * @param message - 로그 메시지
   * @param optionalParams - 추가 파라미터 (컨텍스트 등)
   */
  log(message: unknown, ...optionalParams: unknown[]): void {
    super.log(message, ...optionalParams);
  }

  /**
   * 에러 로그 메시지 출력
   * @param message - 에러 메시지
   * @param optionalParams - 추가 파라미터 (스택 트레이스, 컨텍스트 등)
   */
  error(message: unknown, ...optionalParams: unknown[]): void {
    super.error(message, ...optionalParams);
  }

  /**
   * 경고 로그 메시지 출력
   * @param message - 경고 메시지
   * @param optionalParams - 추가 파라미터 (컨텍스트 등)
   */
  warn(message: unknown, ...optionalParams: unknown[]): void {
    super.warn(message, ...optionalParams);
  }

  /**
   * 디버그 로그 메시지 출력
   * @param message - 디버그 메시지
   * @param optionalParams - 추가 파라미터 (컨텍스트 등)
   */
  debug(message: unknown, ...optionalParams: unknown[]): void {
    super.debug(message, ...optionalParams);
  }

  /**
   * 상세 로그 메시지 출력
   * @param message - 상세 메시지
   * @param optionalParams - 추가 파라미터 (컨텍스트 등)
   */
  verbose(message: unknown, ...optionalParams: unknown[]): void {
    super.verbose(message, ...optionalParams);
  }

  /**
   * 치명적 에러 로그 메시지 출력
   * @param message - 치명적 에러 메시지
   * @param optionalParams - 추가 파라미터 (스택 트레이스, 컨텍스트 등)
   */
  fatal(message: unknown, ...optionalParams: unknown[]): void {
    super.fatal(message, ...optionalParams);
  }

  /**
   * 로거 컨텍스트 설정
   * @param context - 새로운 컨텍스트 문자열
   */
  setContext(context: string): void {
    super.setContext(context);
  }
}
