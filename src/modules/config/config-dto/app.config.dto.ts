import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Environment } from '../config.types';

export class AppConfigDto {
    @IsEnum(['development', 'production', 'test'])
    nodeEnv: Environment;

    @IsNumber()
    @Type(() => Number)
    port: number;
}
