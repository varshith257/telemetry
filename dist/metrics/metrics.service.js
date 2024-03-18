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
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const ajv_1 = require("ajv");
const ajv_formats_1 = require("ajv-formats");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@clickhouse/client");
let MetricsService = class MetricsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.ajv = new ajv_1.default();
        (0, ajv_formats_1.default)(this.ajv);
        this.clickhouse = (0, client_1.createClient)({
            host: process.env.CLICKHOUSE_HOST,
            username: process.env.CLICKHOUSE_USER,
            password: process.env.CLICKHOUSE_PASSWORD,
            database: process.env.CLICKHOUSE_DB
        });
        this.validateMap = new Map();
        this.updateValidateMap();
    }
    async updateValidateMap() {
        const schemeSchema = await this.prismaService.eventSchemaV1.findMany();
        if (schemeSchema.length === this.validateMap.size)
            return;
        schemeSchema.forEach((event) => {
            if (!this.validateMap.has(event.event_id)) {
                this.validateMap.set(event.event_id, this.ajv.compile(JSON.parse(JSON.stringify(event.schema))));
            }
        });
    }
    async saveMetrics(eventData) {
        let isRequestValid = true;
        let errorData = {};
        await this.updateValidateMap();
        for (let i = 0; i < eventData.length; i++) {
            const validationResponse = await this.validateEventData(eventData[i]);
            if (validationResponse.error) {
                isRequestValid = false;
                errorData[`${i}`] = validationResponse.errorList;
            }
        }
        if (!isRequestValid) {
            return {
                error: true,
                message: 'Request body does not satisfies the schema',
                errorData: errorData
            };
        }
        this.processData(eventData);
        return {
            error: false,
            message: 'Metric stored successfully'
        };
    }
    async validateEventData(eventData) {
        if (!this.validateMap.has(eventData.eventId)) {
            return {
                error: true,
                errorList: [`No event found with eventId: ${eventData.eventId}`]
            };
        }
        const validator = this.validateMap.get(eventData.eventId);
        validator(eventData.eventData);
        if (validator.errors !== null) {
            return {
                error: true,
                errorList: validator.errors
            };
        }
        return {
            error: false,
            errorList: []
        };
    }
    convertDatetime(jsonData) {
        const pattern = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/;
        for (const key in jsonData) {
            if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
                if (typeof jsonData[key] === 'object') {
                    jsonData[key] = this.convertDatetime(jsonData[key]);
                }
                else if (typeof jsonData[key] === 'string' && pattern.test(jsonData[key])) {
                    jsonData[key] = jsonData[key].split('.')[0];
                }
            }
        }
        return jsonData;
    }
    async processData(eventDataList) {
        const formattedEventData = eventDataList.map((event) => {
            const { eventData, ...otherMetric } = event;
            return {
                ...otherMetric,
                ...eventData,
            };
        });
        this.convertDatetime(formattedEventData);
        await this.clickhouse.insert({
            table: 'events_v1',
            values: formattedEventData,
            format: 'JSONEachRow'
        });
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map