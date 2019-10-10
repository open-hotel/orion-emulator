/// <reference types="mongodb" />
import { Model, Document, SaveOptions, QueryFindOneAndRemoveOptions, QueryFindOneAndUpdateOptions, ModelUpdateOptions } from 'mongoose';
export declare class ModelService<T extends Document> {
    readonly ModelConstructor: Model<T>;
    constructor(ModelConstructor: Model<T>);
    save(dto: T, options?: SaveOptions): Promise<T>;
    find(conditions?: any, projection?: any, options?: any): Promise<T[]>;
    findOne(conditions?: any, projection?: any, options?: any): Promise<T>;
    findById(id: string, projection?: any, options?: any): Promise<T>;
    deleteById(id: string, options?: QueryFindOneAndRemoveOptions): Promise<import("mongodb").FindAndModifyWriteOpResultObject<T>>;
    deleteMany(conditions: any): Promise<{
        ok?: number;
        n?: number;
    } & {
        deletedCount?: number;
    }>;
    updateById(id: string, update: T, options: {
        rawResult: true;
    } & {
        upsert: true;
    } & {
        new: true;
    } & QueryFindOneAndUpdateOptions): Promise<T>;
    updateMany(conditions: any, doc: T, options: ModelUpdateOptions): Promise<any>;
    updateOne(conditions: any, doc: T, options: ModelUpdateOptions): Promise<any>;
}
