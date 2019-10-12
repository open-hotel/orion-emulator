import {
  Model,
  Document,
  SaveOptions,
  QueryFindOneAndRemoveOptions,
  QueryFindOneAndUpdateOptions,
  ModelUpdateOptions,
} from 'mongoose';

export class ModelService<T extends Document> {
  constructor(public readonly ModelConstructor: Model<T>) {}

  async save(dto: T, options?: SaveOptions) {
    const instance = new this.ModelConstructor(dto);
    return instance.save(options);
  }

  async find(conditions?, projection?, options?) {
    return this.ModelConstructor.find(conditions, projection, options);
  }

  async findOne(conditions?, projection?, options?) {
    return this.ModelConstructor.findOne(conditions, projection, options);
  }

  async findById(id: string, projection?, options?) {
    return this.ModelConstructor.findById(id, projection, options);
  }

  async deleteById(id: string, options?: QueryFindOneAndRemoveOptions) {
    return this.ModelConstructor.findByIdAndDelete(id, options);
  }

  async deleteMany(conditions) {
    return this.ModelConstructor.deleteMany(conditions);
  }

  async updateById(
    id: string,
    update: T,
    options: { rawResult: true } & { upsert: true } & {
      new: true;
    } & QueryFindOneAndUpdateOptions,
  ) {
    return this.ModelConstructor.findByIdAndUpdate(id, update, options);
  }

  async updateMany (conditions, doc: T, options:ModelUpdateOptions) {
    return this.ModelConstructor.updateMany(conditions, doc, options)
  }

  async updateOne (conditions, doc: T, options:ModelUpdateOptions) {
    return this.ModelConstructor.updateOne(conditions, doc, options)
  }
}
