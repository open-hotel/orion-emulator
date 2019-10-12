"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModelService {
    constructor(ModelConstructor) {
        this.ModelConstructor = ModelConstructor;
    }
    async save(dto, options) {
        const instance = new this.ModelConstructor(dto);
        return instance.save(options);
    }
    async find(conditions, projection, options) {
        return this.ModelConstructor.find(conditions, projection, options);
    }
    async findOne(conditions, projection, options) {
        return this.ModelConstructor.findOne(conditions, projection, options);
    }
    async findById(id, projection, options) {
        return this.ModelConstructor.findById(id, projection, options);
    }
    async deleteById(id, options) {
        return this.ModelConstructor.findByIdAndDelete(id, options);
    }
    async deleteMany(conditions) {
        return this.ModelConstructor.deleteMany(conditions);
    }
    async updateById(id, update, options) {
        return this.ModelConstructor.findByIdAndUpdate(id, update, options);
    }
    async updateMany(conditions, doc, options) {
        return this.ModelConstructor.updateMany(conditions, doc, options);
    }
    async updateOne(conditions, doc, options) {
        return this.ModelConstructor.updateOne(conditions, doc, options);
    }
}
exports.ModelService = ModelService;
//# sourceMappingURL=ModelService.js.map