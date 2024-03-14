import { Body, Controller, Post } from "@nestjs/common";
import { MetricsService } from "./metrics.service";
import { MetricsV1Dto } from "./dto/metrics.v1.dto";

@Controller('/metrics/v1')
export class MetricsV1Controller {
  constructor(private readonly metricsService: MetricsService) { }

  @Post('save')
  async saveMetrics(
    @Body() metrics: MetricsV1Dto
  ) {
    return await this.metricsService.saveMetrics(metrics);
  }
}