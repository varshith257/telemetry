import { Body, Controller, ParseArrayPipe, Post } from "@nestjs/common";
import { MetricsService } from "./metrics.service";
import { MetricsV1ListDto, MetricsV1Dto } from "./dto/metrics.v1.dto";

@Controller('/metrics/v1')
export class MetricsV1Controller {
  constructor(private readonly metricsService: MetricsService) { }

  @Post('save')
  async saveMetrics(
    @Body(new ParseArrayPipe({ items: MetricsV1Dto })) 
    metricList: MetricsV1Dto[]
  ) {
    return await this.metricsService.saveMetrics(metricList);
  }
}