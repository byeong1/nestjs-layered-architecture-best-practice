import { Injectable } from "@nestjs/common";
import { IResponse, IFindAllResponse } from "./response.interfaces";

@Injectable()
export class BaseResponse {
    findSuccess<T>(
        data: T | IFindAllResponse<T>,
    ): IResponse<T | IFindAllResponse<T>> {
        return {
            success: true,
            statusCode: 200,
            message: "조회 성공",
            data,
        };
    }

    createSuccess<T>(data: T): IResponse<T> {
        return {
            success: true,
            statusCode: 201,
            message: "생성 성공",
            data,
        };
    }

    updateSuccess<T>(data: T): IResponse<T> {
        return {
            success: true,
            statusCode: 200,
            message: "수정 성공",
            data,
        };
    }

    deleteSuccess<T>(data: T): IResponse<T> {
        return {
            success: true,
            statusCode: 200,
            message: "삭제 성공",
            data,
        };
    }
}
