import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("App")
@Controller()
export class AppController {
    @Get()
    @ApiOperation({ summary: "헬스 체크" })
    healthCheck() {
        return {
            success: true,
            message: "Server is running",
            timestamp: new Date().toISOString(),
        };
    }
}
