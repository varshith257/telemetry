import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { MetricsV2Service } from './metrics.v2.service';
import { AddUserDetails } from 'src/interceptors/addUserDetails.interceptor';
import { GetMaterialViewRequestBody } from './dto/material-view-fetch.dto';

@Controller('/metrics/v2')
export class MetricsV2Controller {
    constructor(private readonly metricsV2Service: MetricsV2Service) { }

    @Post('mv-data')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(AddUserDetails)
    async getCombinedView(
        @Body() queryRequestBody: GetMaterialViewRequestBody,
        @Req() reqBody: Request
    ) {
        const headers: Record<string, any> = reqBody.headers
        queryRequestBody.bot_ids = headers.botid || queryRequestBody?.bot_ids;
        const orgId = headers.orgid // || queryRequestBody.org_id;
        return this.metricsV2Service.getMaterialViewData(null, queryRequestBody)
    }

    @Get('mv-colums/:material_view')
    async getColumns(@Param('material_view') material_view: string) {
        return this.metricsV2Service.getMaterialViewColumns(material_view)
    }
}
