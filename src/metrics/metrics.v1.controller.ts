import { Body, Controller, Get, ParseArrayPipe, Post, Query, Req, UseInterceptors } from "@nestjs/common";
import { MetricsService } from "./metrics.service";
import { MetricsV1Dto } from "./dto/metrics.v1.dto";
import { UpdateSchemaDto } from "./dto/update.schema.dto";
import { SkipThrottle } from "@nestjs/throttler/dist/throttler.decorator";
import { AddUserDetails, NoAuth } from "src/interceptors/addUserDetails.interceptor";
import { GetCombinedData } from "./dto/get.combined.data.dto";

@SkipThrottle()
@UseInterceptors(AddUserDetails)
@Controller('/metrics/v1')
export class MetricsV1Controller {
  constructor(private readonly metricsService: MetricsService) { }

  @Post('save')
  @NoAuth()
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

  @Post('combined-view')
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