export interface IQuery {
    page?: number;
    limit?: number;
    startDate?: Date | string;
    endDate?: Date | string;
    sort?: string | string[];
    isDeleted?: boolean;
}

export interface ICreateParams<T> {
    createDto?: Partial<T> | Partial<T>[];
    checkFields?: object | null;
    callback?: (data: any) => Promise<any>;
}

export interface IUpdateParams<T> {
    target?: number | object | (number | object)[];
    updateDto?: Partial<T> | Partial<T>[];
    checkFields?: object | null;
    callback?: (data: any) => Promise<any>;
}

export interface IBulkCreateResult {
    successCount: number;
    createDto: any[];
}

export interface IBulkUpdateResult {
    successCount: number;
    updateData: IUpdateItem[];
}

export interface IUpdateItem {
    where: object;
    data: any;
}

export interface IDuplicateCheckResult {
    hasDuplicates: boolean;
    duplicateItems: any[];
}
