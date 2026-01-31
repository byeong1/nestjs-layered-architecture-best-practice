import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class DatabaseConfigDto {
    @IsString()
    @IsNotEmpty()
    host: string;

    @IsNumber()
    @Type(() => Number)
    port: number;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    password: string;

    @IsString()
    @IsNotEmpty()
    database: string;
}
