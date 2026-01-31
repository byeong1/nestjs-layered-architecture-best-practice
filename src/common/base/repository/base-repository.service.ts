import {
    Repository,
    FindOptionsWhere,
    DeepPartial,
    FindManyOptions,
    FindOptionsSelect,
    FindOptionsRelations,
    ObjectLiteral,
} from "typeorm";

export abstract class BaseRepository<T extends ObjectLiteral> {
    constructor(protected readonly repository: Repository<T>) {}

    async count(where: FindOptionsWhere<T> = {}): Promise<number> {
        return this.repository.count({ where });
    }

    async findAll(options: FindManyOptions<T> = {}): Promise<T[]> {
        return this.repository.find(options);
    }

    async findOne(
        where: FindOptionsWhere<T>,
        select?: FindOptionsSelect<T>,
    ): Promise<T | null> {
        return this.repository.findOne({ where, select });
    }

    async findOneWithRelations(
        where: FindOptionsWhere<T>,
        relations?: FindOptionsRelations<T>,
        select?: FindOptionsSelect<T>,
    ): Promise<T | null> {
        return this.repository.findOne({ where, relations, select });
    }

    async create(createDto: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(createDto);
        return this.repository.save(entity);
    }

    async createMany(createDtos: DeepPartial<T>[]): Promise<{ count: number }> {
        const entities = this.repository.create(createDtos);
        const saved = await this.repository.save(entities);
        return { count: saved.length };
    }

    async update(
        where: FindOptionsWhere<T>,
        updateDto: DeepPartial<T>,
    ): Promise<T | null> {
        await this.repository.update(where, updateDto as any);
        return this.findOne(where);
    }

    async delete(where: FindOptionsWhere<T>): Promise<T | null> {
        const entity = await this.findOne(where);
        if (entity) {
            await this.repository.delete(where);
        }
        return entity;
    }

    async softDelete(where: FindOptionsWhere<T>): Promise<T | null> {
        const entity = await this.findOne(where);
        if (entity) {
            await this.repository.softDelete(where);
        }
        return entity;
    }
}
