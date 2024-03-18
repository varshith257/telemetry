import { PrismaService } from "src/prisma/prisma.service";
import { MetricsV1Dto } from "./dto/metrics.v1.dto";
export declare class MetricsService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    private ajv;
    private validateMap;
    private clickhouse;
    updateValidateMap(): Promise<void>;
    saveMetrics(eventData: MetricsV1Dto[]): Promise<{
        error: boolean;
        message: string;
        errorData: {};
    } | {
        error: boolean;
        message: string;
        errorData?: undefined;
    }>;
    validateEventData(eventData: MetricsV1Dto): Promise<{
        error: boolean;
        errorList: string[];
    } | {
        error: boolean;
        errorList: import("ajv").ErrorObject<string, Record<string, any>, unknown>[];
    }>;
    convertDatetime(jsonData: any): any;
    processData(eventDataList: MetricsV1Dto[]): Promise<void>;
}
