import { Body, Controller, ParseArrayPipe, Post, Req } from "@nestjs/common";
import { MetricsService } from "./metrics.service";
import { MetricsV1Dto } from "./dto/metrics.v1.dto";
import { UpdateSchemaDto } from "./dto/update.schema.dto";
import { SkipThrottle } from "@nestjs/throttler/dist/throttler.decorator";

@SkipThrottle()
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

  @Post('update-schema')
  async updateSchema(
    @Body() updateSchemaDto: UpdateSchemaDto
  ) {
    return await this.metricsService.updateSchema(updateSchemaDto);
  }
}