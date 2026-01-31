import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

/**
 * 단일 ID 파라미터 DTO
 * @example GET /users/:id
 */
export class IdParamDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    id: number;
}

/**
 * 상위-하위 관계 ID 파라미터 DTO
 * @example GET /users/:parentId/posts/:id
 */
export class ParentIdParamDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    parentId: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    id: number;
}
