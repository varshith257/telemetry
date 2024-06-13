import { Body, Controller, ParseArrayPipe, Post, UseInterceptors } from "@nestjs/common";
import { MetricsService } from "./metrics.service";
import { MetricsV1Dto } from "./dto/metrics.v1.dto";
import { UpdateSchemaDto } from "./dto/update.schema.dto";
import { SkipThrottle } from "@nestjs/throttler/dist/throttler.decorator";
import { AddUserDetails } from "src/interceptors/addUserDetails.interceptor";
import { GetCombinedData } from "./dto/get.combined.data.dto";
import { EventPattern, Payload } from "@nestjs/microservices";
import { TELEMETRY_QUEUE } from "src/constants";

@SkipThrottle()
@Controller('/metrics/v1')
export class MetricsV1Controller {
  constructor(private readonly metricsService: MetricsService) { }

  @Post('save')
  async saveMetrics(
    // @Body(new ParseArrayPipe({ items: MetricsV1Dto })) 
    // metricList: MetricsV1Dto[]
    @Body() metricList: MetricsV1Dto[]
  ) {
    this.metricsService.saveMetrics(metricList);
    return {
      
    }
  }

  @EventPattern(TELEMETRY_QUEUE)
  async handleEvent(@Payload() data: any) {
    console.log('Received data:', data);
  }

  @Post('update-schema')
  @UseInterceptors(AddUserDetails)
  async updateSchema(
    @Body() updateSchemaDto: UpdateSchemaDto
  ) {
    return await this.metricsService.updateSchema(updateSchemaDto);
  }

  @Post('combined-view')
  @UseInterceptors(AddUserDetails)
  async getCombinedView(
    @Body() queryBody: GetCombinedData
  ) {
    console.log(queryBody)
    return await this.metricsService.combinedView(
      (queryBody as any).userData,
      queryBody.perPage, 
      queryBody.page, 
      queryBody.sortBy,
      queryBody.sort?.toUpperCase(),
      queryBody.filter
    )
  }
}