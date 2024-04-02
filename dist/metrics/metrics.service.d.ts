import { PrismaService } from "src/prisma/prisma.service";
import { MetricsV1Dto } from "./dto/metrics.v1.dto";
import { UpdateSchemaDto } from "./dto/update.schema.dto";
export declare class MetricsService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    private ajv;
    private validateMap;
    private clickhouse;
    private logger;
    updateValidateMap(force: boolean): Promise<void>;
    removeNullKeys(obj: any): any;
    saveMetrics(eventData: MetricsV1Dto[]): Promise<Response>;
    validateEventData(eventData: MetricsV1Dto): Promise<{
        error: boolean;
        errorList: string[];
    } | {
        error: boolean;
        errorList: import("ajv").ErrorObject<string, Record<string, any>, unknown>[];
    }>;
    processData(eventDataList: MetricsV1Dto[]): Promise<void>;
    updateSchema(updateSchemaDto: UpdateSchemaDto): Promise<{
        error: boolean;
        message: string;
        errorData: any;
        data?: undefined;
    } | {
        error: boolean;
        message: string;
        data: any;
        errorData?: undefined;
    }>;
    searchContent(limit: number, page: number, orderBy?: string, order?: string, filterObj?: any, searchObj?: any): Promise<string | Response>;
}
