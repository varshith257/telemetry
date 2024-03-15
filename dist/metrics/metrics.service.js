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
const clickhouse_1 = require("clickhouse");
const prisma_service_1 = require("../prisma/prisma.service");
let MetricsService = class MetricsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.ajv = new ajv_1.default();
        (0, ajv_formats_1.default)(this.ajv);
        this.clickhouse = new clickhouse_1.ClickHouse({
            host: 'localhost',
            port: 18123,
            database: 'default',
            user: '',
            password: '',
            basicAuth: null
        });
    }
    async saveMetrics(eventData) {
        let isRequestValid = true;
        let errorData = {};
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
        const eventSchema = await this.prismaService.eventSchemaV1.findUnique({
            where: {
                EventSubEventCompositeKey: {
                    subEvent: eventData.subEvent,
                    event: eventData.event,
                }
            }
        });
        const validator = this.ajv.compile(JSON.parse(JSON.stringify(eventSchema.schema)));
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
    async processData(eventDataList) {
        const formattedEventData = eventDataList.map((event) => {
            const { eventData, ...otherMetric } = event;
            return {
                ...otherMetric,
                ...eventData,
            };
        });
        const formattedData = formattedEventData.map(row => JSON.stringify(row)).join('\n');
        const insertQuery = `
      INSERT INTO events_v1
      FORMAT JSONEachRow
      ${formattedData}
    `;
        const res = await this.clickhouse.query(insertQuery).toPromise();
        console.log(res);
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map