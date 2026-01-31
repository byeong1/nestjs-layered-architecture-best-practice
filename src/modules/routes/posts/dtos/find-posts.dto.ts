import { ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsOptional,
    IsInt,
    Min,
    IsString,
    IsDateString,
    IsBoolean,
} from "class-validator";
import { Type, Transform } from "class-transformer";

export class FindAllPostsDto {
    @ApiPropertyOptional({ description: "페이지 번호", default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: "페이지당 항목 수", default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({ description: "제목 검색" })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ description: "작성자 검색" })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiPropertyOptional({
        description: "정렬 (예: createdAt-desc, title-asc)",
    })
    @IsOptional()
    @IsString()
    sort?: string;

    @ApiPropertyOptional({ description: "시작 날짜" })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: "종료 날짜" })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({
        description: "삭제된 데이터 포함 여부",
        default: false,
    })
    @IsOptional()
    @Transform(({ value }) => value === "true" || value === true)
    @IsBoolean()
    isDeleted?: boolean = false;
}
