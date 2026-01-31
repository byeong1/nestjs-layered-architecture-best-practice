export interface IResponse<T = any> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    count?: number;
}

export interface IFindAllResponse<T = any> {
    items: T[];
    count: number;
}
