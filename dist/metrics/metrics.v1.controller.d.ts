import { MetricsService } from "./metrics.service";
import { MetricsV1Dto } from "./dto/metrics.v1.dto";
export declare class MetricsV1Controller {
    private readonly metricsService;
    constructor(metricsService: MetricsService);
    saveMetrics(metricList: MetricsV1Dto[]): Promise<{
        error: boolean;
        message: string;
        errorData: {};
    } | {
        error: boolean;
        message: string;
        errorData?: undefined;
    }>;
}
