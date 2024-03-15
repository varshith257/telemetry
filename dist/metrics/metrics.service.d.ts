import { PrismaService } from "src/prisma/prisma.service";
import { MetricsV1Dto } from "./dto/metrics.v1.dto";
export declare class MetricsService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    private ajv;
    private clickhouse;
    saveMetrics(eventData: MetricsV1Dto[]): Promise<{
        error: boolean;
        message: string;
        errorData: {};
    } | {
        error: boolean;
        message: string;
        errorData?: undefined;
    }>;
    validateEventData(eventData: any): Promise<{
        error: boolean;
        errorList: import("ajv").ErrorObject<string, Record<string, any>, unknown>[];
    }>;
    processData(eventDataList: MetricsV1Dto[]): Promise<void>;
}
