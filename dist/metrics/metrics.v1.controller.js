"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsV1Controller = void 0;
const common_1 = require("@nestjs/common");
const metrics_service_1 = require("./metrics.service");
const metrics_v1_dto_1 = require("./dto/metrics.v1.dto");
const update_schema_dto_1 = require("./dto/update.schema.dto");
const throttler_decorator_1 = require("@nestjs/throttler/dist/throttler.decorator");
const get_s2t_dto_1 = require("./dto/get.s2t.dto");
let MetricsV1Controller = class MetricsV1Controller {
    constructor(metricsService) {
        this.metricsService = metricsService;
    }
    async saveMetrics(metricList) {
        return await this.metricsService.saveMetrics(metricList);
    }
    async updateSchema(updateSchemaDto) {
        return await this.metricsService.updateSchema(updateSchemaDto);
    }
    async searchContent(queryBody) {
        return await this.metricsService.searchContent(queryBody.limit, queryBody.page, queryBody.sortBy, queryBody.sort.toUpperCase(), queryBody.filterObj, queryBody.searchObj);
    }
};
exports.MetricsV1Controller = MetricsV1Controller;
__decorate([
    (0, common_1.Post)('save'),
    __param(0, (0, common_1.Body)(new common_1.ParseArrayPipe({ items: metrics_v1_dto_1.MetricsV1Dto }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], MetricsV1Controller.prototype, "saveMetrics", null);
__decorate([
    (0, common_1.Post)('update-schema'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_schema_dto_1.UpdateSchemaDto]),
    __metadata("design:returntype", Promise)
], MetricsV1Controller.prototype, "updateSchema", null);
__decorate([
    (0, common_1.Post)('s2t'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_s2t_dto_1.GetS2TDto]),
    __metadata("design:returntype", Promise)
], MetricsV1Controller.prototype, "searchContent", null);
exports.MetricsV1Controller = MetricsV1Controller = __decorate([
    (0, throttler_decorator_1.SkipThrottle)(),
    (0, common_1.Controller)('/metrics/v1'),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService])
], MetricsV1Controller);
//# sourceMappingURL=metrics.v1.controller.js.map