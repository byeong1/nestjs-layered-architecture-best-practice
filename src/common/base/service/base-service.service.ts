import { BaseRepository } from "../repository/base-repository.service";
import { BaseResponse } from "../responses/base.response";
import { IResponse } from "../responses/response.interfaces";
import {
    IQuery,
    ICreateParams,
    IUpdateParams,
    IBulkCreateResult,
    IBulkUpdateResult,
} from "./base-service.interfaces";
import { ExceptionFactory } from "#common/exceptions/exception.factory";
import { BaseException } from "#common/exceptions/base.exception";
import {
    FindOptionsWhere,
    FindOptionsSelect,
    FindOptionsRelations,
    Between,
    IsNull,
    ObjectLiteral,
} from "typeorm";

export abstract class BaseService<T extends ObjectLiteral> {
    constructor(
        protected readonly repository: BaseRepository<T>,
        protected readonly response: BaseResponse,
        protected readonly RESPONSE_CODE_PREFIX: string,
    ) {}

    /**
     * 전체 조회
     */
    async findAll({
        where = {},
        query = {},
        relations,
        select,
        callback,
    }: {
        where?: FindOptionsWhere<T>;
        query?: IQuery;
        relations?: FindOptionsRelations<T>;
        select?: FindOptionsSelect<T>;
        callback?: (data: T[]) => Promise<T[]>;
    }): Promise<IResponse> {
        const pagination = this.getPagination(query);
        const order = this.getOrderBy(query);
        const finalWhere = this.buildWhere(where, query);

        const count = await this.repository.count(finalWhere);
        let data = await this.repository.findAll({
            where: finalWhere,
            relations,
            select,
            order: order as any,
            skip: pagination.skip,
            take: pagination.take,
        });

        if (callback) {
            data = await callback(data);
        }

        return this.response.findSuccess({ items: data, count });
    }

    /**
     * 상세 조회
     */
    async findOne({
        where = {},
        relations,
        select,
        callback,
    }: {
        where?: FindOptionsWhere<T>;
        relations?: FindOptionsRelations<T>;
        select?: FindOptionsSelect<T>;
        callback?: (data: T) => Promise<T>;
    }): Promise<IResponse> {
        let data = await this.repository.findOneWithRelations(
            where,
            relations,
            select,
        );

        if (!data) {
            throw ExceptionFactory.notFound(
                this.RESPONSE_CODE_PREFIX,
                `일치하는 조건의 데이터가 없습니다. [${JSON.stringify(where)}]`,
            );
        }

        if (callback) {
            data = await callback(data);
        }

        return this.response.findSuccess(data);
    }

    /**
     * 생성
     */
    async create({
        createDto = {},
        checkFields = null,
        callback,
    }: ICreateParams<T>): Promise<IResponse> {
        try {
            if (checkFields && !Array.isArray(createDto)) {
                const existing = await this.repository.findOne(
                    checkFields as FindOptionsWhere<T>,
                );
                if (existing) {
                    throw ExceptionFactory.duplicate(
                        this.RESPONSE_CODE_PREFIX,
                        `중복된 데이터: ${JSON.stringify(checkFields)}`,
                    );
                }
            }

            let data: T | IBulkCreateResult;

            if (Array.isArray(createDto)) {
                const result = await this.repository.createMany(
                    createDto as any,
                );
                data = { successCount: result.count, createDto };
            } else {
                data = await this.repository.create(createDto as any);
            }

            if (callback) {
                data = await callback(data);
            }

            return this.response.createSuccess(data);
        } catch (error) {
            if (error instanceof BaseException) throw error;
            throw ExceptionFactory.internalServerError(
                this.RESPONSE_CODE_PREFIX,
                `데이터 생성 중 오류가 발생했습니다: ${error.message}`,
            );
        }
    }

    /**
     * 수정
     */
    async update({
        target,
        updateDto = {},
        checkFields = null,
        callback,
    }: IUpdateParams<T>): Promise<IResponse> {
        try {
            if (!target) {
                throw ExceptionFactory.badRequest(
                    this.RESPONSE_CODE_PREFIX,
                    "수정 대상이 지정되지 않았습니다.",
                );
            }

            const where = this.buildTargetWhere(target);

            const existing = await this.repository.findOne(where);
            if (!existing) {
                throw ExceptionFactory.notFound(
                    this.RESPONSE_CODE_PREFIX,
                    `일치하는 조건의 데이터가 없습니다. [${JSON.stringify(where)}]`,
                );
            }

            if (checkFields) {
                const duplicate = await this.repository.findOne(
                    checkFields as FindOptionsWhere<T>,
                );
                if (
                    duplicate &&
                    JSON.stringify(duplicate) !== JSON.stringify(existing)
                ) {
                    throw ExceptionFactory.duplicate(
                        this.RESPONSE_CODE_PREFIX,
                        `중복된 데이터: ${JSON.stringify(checkFields)}`,
                    );
                }
            }

            let data = await this.repository.update(where, updateDto as any);

            if (callback && data) {
                data = await callback(data);
            }

            return this.response.updateSuccess(data);
        } catch (error) {
            if (error instanceof BaseException) throw error;
            throw ExceptionFactory.internalServerError(
                this.RESPONSE_CODE_PREFIX,
                `데이터 수정 중 오류가 발생했습니다: ${error.message}`,
            );
        }
    }

    /**
     * 삭제
     */
    async delete({
        target,
        callback,
    }: {
        target?: number | object;
        callback?: (data: T) => Promise<T>;
    }): Promise<IResponse> {
        if (!target) {
            throw ExceptionFactory.badRequest(
                this.RESPONSE_CODE_PREFIX,
                "삭제 대상이 지정되지 않았습니다.",
            );
        }

        const where = this.buildTargetWhere(target);

        const existing = await this.repository.findOne(where);
        if (!existing) {
            throw ExceptionFactory.notFound(
                this.RESPONSE_CODE_PREFIX,
                `일치하는 조건의 데이터가 없습니다. [${JSON.stringify(where)}]`,
            );
        }

        let data = await this.repository.softDelete(where);

        if (callback && data) {
            data = await callback(data);
        }

        return this.response.deleteSuccess(data);
    }

    /**
     * 페이지네이션 설정
     */
    private getPagination(query: IQuery): { skip: number; take: number } {
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        return {
            skip: (page - 1) * limit,
            take: limit,
        };
    }

    /**
     * 정렬 설정
     */
    private getOrderBy(query: IQuery): Record<string, "ASC" | "DESC"> {
        if (!query?.sort) {
            return { createdAt: "DESC" };
        }

        const sortArray = Array.isArray(query.sort)
            ? query.sort
            : query.sort.split(",");
        const order: Record<string, "ASC" | "DESC"> = {};

        for (const sortField of sortArray) {
            const [field, direction] = sortField.trim().split("-");
            if (
                field &&
                direction &&
                ["asc", "desc"].includes(direction.toLowerCase())
            ) {
                order[field] = direction.toUpperCase() as "ASC" | "DESC";
            }
        }

        return Object.keys(order).length > 0 ? order : { createdAt: "DESC" };
    }

    /**
     * Where 조건 빌드
     */
    private buildWhere(
        where: FindOptionsWhere<T>,
        query: IQuery,
    ): FindOptionsWhere<T> {
        const result = { ...where };

        if (query?.startDate && query?.endDate) {
            (result as any).createdAt = Between(query.startDate, query.endDate);
        }

        if (!query?.isDeleted) {
            (result as any).deletedAt = IsNull();
        }

        return result;
    }

    /**
     * 대상 Where 조건 빌드
     */
    private buildTargetWhere(target: number | object): FindOptionsWhere<T> {
        if (typeof target === "number") {
            return { id: target } as unknown as FindOptionsWhere<T>;
        }
        return target as FindOptionsWhere<T>;
    }
}
