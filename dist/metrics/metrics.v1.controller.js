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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsV1Controller = void 0;
const common_1 = require("@nestjs/common");
const metrics_service_1 = require("./metrics.service");
let MetricsV1Controller = class MetricsV1Controller {
    constructor(metricsService) {
        this.metricsService = metricsService;
    }
};
exports.MetricsV1Controller = MetricsV1Controller;
exports.MetricsV1Controller = MetricsV1Controller = __decorate([
    (0, common_1.Controller)('/metrics/v1'),
    __metadata("design:paramtypes", [metrics_service_1.MetricsService])
], MetricsV1Controller);
//# sourceMappingURL=metrics.v1.controller.js.map