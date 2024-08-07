import { Injectable, Logger } from '@nestjs/common';
import { UserData } from 'src/interceptors/addUserDetails.interceptor';
import { ClickHouseClient, Row } from '@clickhouse/client';
import * as Clickhouse from '@clickhouse/client'
import { PrismaService } from '../prisma/prisma.service';
import { GetMaterialViewRequestBody } from './dto/material-view-fetch.dto';
import * as WhereClauseHelperFunction from './supportFunctions/whereClauseBuilder';
import { Readable } from 'stream';
import { Response as ExpressResponse } from 'express';
import { createThrottlerProviders } from '@nestjs/throttler/dist/throttler.providers';

@Injectable()
export class MetricsV2Service {
	private clickhouse: ClickHouseClient<Readable>;
	private logger = new Logger(MetricsV2Service.name);

	constructor(
		private readonly prismaService: PrismaService
	) {
		this.clickhouse = Clickhouse.createClient({
			host: process.env.CLICKHOUSE_HOST,
			username: process.env.CLICKHOUSE_USER,
			password: process.env.CLICKHOUSE_PASSWORD,
			database: process.env.CLICKHOUSE_DB
		});
	}

	async getMaterialViewData(
		userData: UserData,
		materialViewRequest: GetMaterialViewRequestBody,
		res: ExpressResponse
	) {
		let selectClause = '';
		let whereClause = '';
		let orderClause = '';
		let cols = materialViewRequest.cols;
		let limiters = '';
		let params = {};
		const stream = materialViewRequest.stream;
		const outputFormat = materialViewRequest.download ? 'csv' : 'json';
	
		const selectColumns = cols.length === 1 && cols[0] === '*' ? '*' : cols.map(col => `"${col}"`).join(', ');
	
		selectClause += `SELECT ${selectColumns} FROM {table:Identifier} `;
		params["table"] = materialViewRequest.material_view;
	
		const offset = materialViewRequest.per_page ? materialViewRequest.per_page * (materialViewRequest.page - 1) : 0;
		const limit = materialViewRequest.per_page ? materialViewRequest.per_page : 10;
		params["limit"] = limit;
		params["offset"] = offset;
	
		if (typeof materialViewRequest.bot_ids === 'string') {
			whereClause = `\nWHERE botId = {botId: String}`;
			params["botId"] = materialViewRequest.bot_ids;
		} else {
			whereClause = `\nWHERE botId in (`;
			for (let i = 0; i < materialViewRequest.bot_ids.length; i++) {
				whereClause += `{botId${i}: String},`;
				params[`botId${i}`] = materialViewRequest.bot_ids[i];
			}
			whereClause = whereClause.slice(0, -1) + ')';
		}
		if (materialViewRequest.dynamic_filters.length > 0) {
			let whereBuilderData = WhereClauseHelperFunction.whereClauseBuilder(materialViewRequest.dynamic_filters);
			whereClause += whereBuilderData.whereStatement;
			params = { ...params, ...whereBuilderData.params };
		}
	
		if (materialViewRequest.sort_by) {
			orderClause = `\nORDER BY {orderColumn: String} ${materialViewRequest.sort}`;
			params["orderColumn"] = materialViewRequest.sort_by == 'timestamp' ? 'e_timestamp' : materialViewRequest.sort_by;
		}
	
		limiters += `\nLIMIT {limit: Int} OFFSET {offset: Int};`;
	
		if (outputFormat === 'csv') limiters = '\n;';
	
		const query = selectClause + whereClause + orderClause + limiters;
	
		if (outputFormat === 'csv') {
			const result = await this.clickhouse.query({
				query: query,
				query_params: params,
				format: 'CSVWithNames'
			});
	
			if (stream) {
				res.status(501).send('Streaming not implemented');
			} else {
				const data = await result.text();
				res.header('Content-Disposition', `attachment; filename="debugging_view_${new Date().toLocaleString()}.csv"`);
				res.header('Content-Type', 'text/csv');
				res.send(data);
			}
		} else {
			let content;
			try {
				content = await this.clickhouse.query({
					query: query,
					format: 'JSONEachRow',
					query_params: params,
				});
			} catch (err) {
				this.logger.error(err);
				res.status(500).json({
					success: false,
					message: 'Error while fetching data from base'
				});
				return;
			}
	
			const selectQueryResponse = await content.json();
	
			let countQuery;
			try {
				// getting count
				countQuery = await this.clickhouse.query({
					query: `SELECT COUNT(*) FROM {table: Identifier} ` + whereClause + ';',
					query_params: params,
					format: 'JSONCompact'
				});
			} catch (err) {
				res.status(500).json({
					success: false,
					message: 'Error while fetching data from count'
				});
				return;
			}
	
			const countQueryJsonRes = await countQuery.json();
			const count = countQueryJsonRes["data"][0];
	
			const totalPages = Math.ceil(count / limit);
			const formattedResponse = selectQueryResponse.map((res) => {
				const { e_timestamp, ...rest } = res;
				return {
					...rest,
					timestamp: e_timestamp
				};
			});
	
			res.status(200).send({
				success: true,
				pagination: {
					page: materialViewRequest.page,
					perPage: limit,
					totalPages: totalPages,
					totalCount: +count
				},
				data: formattedResponse
			});
		}
	}
	
	/**
	 * Function to get columns of a material view
	 * @param matrialView : Name of the material view
	 * @returns : Columns of the material view
	 */
	async getMaterialViewColumns(matrialView: string) {
		let columns;
		try {
			columns = await this.clickhouse.query({
				query: `DESCRIBE TABLE ${matrialView};`,
				format: 'JSONEachRow'
			});
		} catch (err) {
			console.error(err)
			throw new Error('Error while fetching data');
		}
		const columnsJsonRes = await columns.json();
		return Response.json({
			success: true,
			data: columnsJsonRes
		}, { status: 200 })
	}
}
