import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsOptional,
    IsBoolean,
} from "class-validator";

export class CreatePostDto {
    @ApiProperty({ description: "게시글 제목", maxLength: 200 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string;

    @ApiProperty({ description: "게시글 내용" })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional({ description: "작성자", maxLength: 100 })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    author?: string;

    @ApiPropertyOptional({ description: "게시 여부", default: true })
    @IsBoolean()
    @IsOptional()
    isPublished?: boolean;
}
