import { Controller, Get, Post, Body, Param, UseInterceptors, Req, UsePipes, ValidationPipe, Res } from '@nestjs/common';
import { MetricsV2Service } from './metrics.v2.service';
import { AddUserDetails } from 'src/interceptors/addUserDetails.interceptor';
import { GetMaterialViewRequestBody } from './dto/material-view-fetch.dto';
import { Response as ExpressResponse } from 'express';

@Controller('/metrics/v2')
export class MetricsV2Controller {
    constructor(private readonly metricsV2Service: MetricsV2Service) { }

    @Post('mv-data')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(AddUserDetails)
    async getCombinedView(
        @Body() queryRequestBody: GetMaterialViewRequestBody,
        @Req() reqBody: Request,
        @Res() res: ExpressResponse
    ) {
        const headers: Record<string, any> = reqBody.headers
        queryRequestBody.bot_ids = headers.botid || queryRequestBody?.bot_ids;
        const orgId = headers.orgid // || queryRequestBody.org_id;
        return this.metricsV2Service.getMaterialViewData(null, queryRequestBody, res)
    }

    @Get('mv-colums/:material_view')
    async getColumns(@Param('material_view') material_view: string) {
        return this.metricsV2Service.getMaterialViewColumns(material_view)
    }
}
