import { Body, Controller, Get, ParseArrayPipe, Post, Query, Req } from "@nestjs/common";
import { MetricsService } from "./metrics.service";
import { MetricsV1Dto } from "./dto/metrics.v1.dto";
import { UpdateSchemaDto } from "./dto/update.schema.dto";
import { SkipThrottle } from "@nestjs/throttler/dist/throttler.decorator";
import { GetS2TDto } from "./dto/get.s2t.dto";

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

  @Get('s2t')
  async searchContent(
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: string,
    @Body() queryBody: GetS2TDto
  ) {
    
    const validatedLimit = parseInt(limit) || 10;
    const validatedPage = parseInt(page) || 1;

    if (isNaN(validatedLimit) || isNaN(validatedPage)) {
      return Response.json({
        error: true,
        message: 'Invalid type for limit or page'
      }, { status: 400 })
    }

    if (order) {
      if (order.toUpperCase() !== 'ASC' && order.toUpperCase() !== 'DESC'){
        return Response.json({
          error: true,
          message: 'Invalid order type. Should be ASC or DESC'
        }, { status: 400 })
      }
    }

    return await this.metricsService.searchContent(validatedLimit, validatedPage, orderBy, order);
  }
}