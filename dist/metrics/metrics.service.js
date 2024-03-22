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
var MetricsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const ajv_1 = require("ajv");
const ajv_formats_1 = require("ajv-formats");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@clickhouse/client");
let MetricsService = MetricsService_1 = class MetricsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.logger = new common_1.Logger(MetricsService_1.name);
        this.ajv = new ajv_1.default();
        (0, ajv_formats_1.default)(this.ajv);
        this.clickhouse = (0, client_1.createClient)({
            host: process.env.CLICKHOUSE_HOST,
            username: process.env.CLICKHOUSE_USER,
            password: process.env.CLICKHOUSE_PASSWORD,
            database: process.env.CLICKHOUSE_DB
        });
        this.validateMap = new Map();
        this.updateValidateMap(true);
    }
    async updateValidateMap(force) {
        const schemeSchema = await this.prismaService.eventSchemaV1.findMany();
        if (schemeSchema.length === this.validateMap.size && !force)
            return;
        schemeSchema.forEach((event) => {
            if (!this.validateMap.has(event.event_id)) {
                this.validateMap.set(event.event_id, this.ajv.compile(JSON.parse(JSON.stringify(event.schema))));
            }
        });
    }
    removeNullKeys(obj) {
        if (obj && typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                if (obj[key] === null) {
                    delete obj[key];
                }
                else if (typeof obj[key] === 'object') {
                    this.removeNullKeys(obj[key]);
                }
            });
        }
        return obj;
    }
    async saveMetrics(eventData) {
        let isRequestValid = true;
        let errorData = {};
        await this.updateValidateMap(false);
        for (let i = 0; i < eventData.length; i++) {
            eventData[i] = this.removeNullKeys(eventData[i]);
            const validationResponse = await this.validateEventData(eventData[i]);
            if (validationResponse.error) {
                isRequestValid = false;
                errorData[`${i}`] = validationResponse.errorList;
            }
        }
        if (!isRequestValid) {
            const response = {
                error: true,
                message: 'Request body does not satisfies the schema',
                errorData: errorData
            };
            this.logger.error(response);
            return Response.json(response, { status: 400 });
        }
        this.processData(eventData);
        return Response.json({
            error: false,
            message: 'Metric stored succesfully'
        }, { status: 200 });
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
    async processData(eventDataList) {
        const formattedEventData = eventDataList.map((event) => {
            const { eventData, ...otherMetric } = event;
            return {
                ...otherMetric,
                ...eventData,
            };
        });
        await this.clickhouse.insert({
            table: `event`,
            values: formattedEventData,
            format: 'JSONEachRow'
        });
    }
    async updateSchema(updateSchemaDto) {
        let schema;
        try {
            schema = await this.prismaService.eventSchemaV1.upsert({
                where: {
                    event_id: updateSchemaDto.eventId
                },
                create: {
                    event_id: updateSchemaDto.eventId,
                    event: updateSchemaDto.event,
                    subEvent: updateSchemaDto.subEvent,
                    schema: updateSchemaDto.schema
                },
                update: {
                    event: updateSchemaDto.event,
                    subEvent: updateSchemaDto.subEvent,
                    schema: updateSchemaDto.schema
                }
            });
        }
        catch (error) {
            this.logger.error(error);
            return {
                error: true,
                message: 'Error updating/adding event schema',
                errorData: error
            };
        }
        this.updateValidateMap(true);
        return {
            error: false,
            message: 'Created/Updated Event schema',
            data: schema,
        };
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = MetricsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map