import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class TelemetryConfigDto {
    @IsBoolean()
    @Type(() => Boolean)
    enabled: boolean;

    @IsString()
    @IsNotEmpty()
    serviceName: string;

    @IsString()
    @IsNotEmpty()
    exporterEndpoint: string;

    @IsNumber()
    @Type(() => Number)
    metricsPort: number;
}
