# NestJS Rayer Architecture

NestJS 기반의 프로덕션 레디 아키텍처 보일러플레이트입니다. 레이어드 아키텍처와 버티컬 슬라이스 패턴을 결합하여 확장성과 유지보수성을 갖춘 구조를 제공합니다.

## Rayer 아키텍처란?

Rayer 아키텍처는 기능 단위로 수직 분할된 레이어드 아키텍처입니다.

```
Controller Layer  →  HTTP 요청/응답 처리
Service Layer     →  비즈니스 로직 (Find, Create, Update, Delete 분리)
Repository Layer  →  데이터 영속성 처리
Entity Layer      →  데이터베이스 엔티티 정의
```

### 핵심 특징

- **Operation-Based Service Separation**: 서비스를 CRUD 작업별로 분리하여 단일 책임 원칙 준수
- **Base Class Inheritance**: 공통 로직을 베이스 클래스로 추상화하여 코드 중복 제거
- **Vertical Slice**: 기능별로 모든 레이어를 하나의 모듈에 응집

## 프로젝트 구조

```
src/
├── common/                          # 공통 모듈
│   ├── base/                        # 베이스 클래스
│   │   ├── repository/              # BaseRepository
│   │   ├── responses/               # 응답 포맷 인터페이스
│   │   └── service/                 # BaseService
│   ├── bootstrap/                   # 앱 초기화
│   ├── dto/                         # 공통 DTO
│   ├── exceptions/                  # 예외 처리
│   │   ├── filters/                 # HTTP, TypeORM 예외 필터
│   │   └── constants/               # 예외 타입 정의
│   ├── interceptors/                # 인터셉터
│   │   ├── logging.interceptor.ts   # 요청/응답 로깅
│   │   └── transform.interceptor.ts # 응답 표준화
│   ├── logger/                      # 커스텀 로거
│   └── middlewares/                 # 미들웨어
│
├── modules/
│   ├── app.module.ts                # 루트 모듈
│   ├── config/                      # 설정 관리
│   │   ├── config.module.ts         # 설정 모듈
│   │   ├── config.service.ts        # 설정 서비스
│   │   ├── config-loaders/          # 환경 변수 로더
│   │   ├── config-validators/       # 환경 변수 검증
│   │   └── swagger/                 # Swagger 설정
│   ├── database/                    # 데이터베이스
│   ├── health/                      # 헬스 체크
│   ├── telemetry/                   # OpenTelemetry
│   └── routes/                      # 기능 모듈
│       └── posts/                   # Posts CRUD 예시
│           ├── posts.module.ts
│           ├── posts.controller.ts
│           ├── posts.repository.ts
│           ├── posts.response.ts
│           ├── entities/
│           ├── dtos/
│           └── services/
│               ├── posts.find.service.ts
│               ├── posts.create.service.ts
│               ├── posts.update.service.ts
│               └── posts.delete.service.ts
│
└── main.ts                          # 엔트리 포인트
```

## 기술 스택

| 카테고리      | 기술                               |
| ------------- | ---------------------------------- |
| Framework     | NestJS 11                          |
| Language      | TypeScript 5                       |
| Database      | MySQL + TypeORM                    |
| Validation    | class-validator, class-transformer |
| Documentation | Swagger (OpenAPI)                  |
| Monitoring    | OpenTelemetry, Prometheus, Grafana |
| Health Check  | @nestjs/terminus                   |
