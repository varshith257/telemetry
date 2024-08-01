import { Injectable, Logger } from '@nestjs/common';
import { UserData } from 'src/interceptors/addUserDetails.interceptor';
import { ClickHouseClient } from '@clickhouse/client';
import * as Clickhouse from '@clickhouse/client'
import { PrismaService } from '../prisma/prisma.service';
import { GetMaterialViewRequestBody } from './dto/material-view-fetch.dto';
import * as WhereClauseHelperFunction from './supportFunctions/whereClauseBuilder';

@Injectable()
export class MetricsV2Service {
	private clickhouse: ClickHouseClient;
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
		materialViewRequest: GetMaterialViewRequestBody
	) {
		let selectClause = '';
		let whereClause = '';
		let orderClause = '';
		let limiters = '';

		selectClause += `SELECT * FROM ${materialViewRequest.material_view} `;

		const offset = materialViewRequest.per_page * (materialViewRequest.page - 1);
		const limit = materialViewRequest.per_page;
		whereClause = `\nWHERE botId ${typeof (materialViewRequest.bot_ids) === 'string' ? `= '${materialViewRequest.bot_ids}'` : `in (${materialViewRequest.bot_ids.join(',')})`}`;

		if (materialViewRequest.dynamic_filters.length > 0) {
			whereClause += WhereClauseHelperFunction.whereClauseBuilder(materialViewRequest.dynamic_filters);
		}

		if (materialViewRequest.sortBy) {
			orderClause = `\nORDER BY ${materialViewRequest.sortBy == 'timestamp' ? 'e_timestamp' : materialViewRequest.sortBy} ${materialViewRequest.sort}`;
		}

		limiters += `\nLIMIT ${limit} OFFSET ${offset};`;
		const query = selectClause + whereClause + orderClause + limiters;

		let content;
		try {
			content = await this.clickhouse.query({
				query: query,
				format: 'JSONEachRow'
			});
		} catch (err) {
			console.error(err)
			return Response.json({
				success: false,
				message: 'Error while fetching data from base'
			}, { status: 500 })
		}

		const selectQueryResponse: any[] = await content.json();

		let countQuery;
		try {
			// getting count
			countQuery = await this.clickhouse.query({
				query: `SELECT COUNT(*) FROM ${materialViewRequest.material_view} ` + WhereClauseHelperFunction.whereClauseBuilder(materialViewRequest.dynamic_filters) + `;`,
			});
		} catch (err) {
			console.error(err)
			return Response.json({
				success: false,
				message: 'Error while fetching data from count'
			}, { status: 500 })
		}
		const countQueryJsonRes = await countQuery.json();
		const count = countQueryJsonRes['data'][0]['count()'];


		const totalPages = Math.ceil(count / limit);
		selectQueryResponse.map((res) => {
			const { e_timestamp, ...rest } = res;
			return {
				...rest,
				timestamp: e_timestamp
			}
		})
		return Response.json({
			success: true,
			pagination: {
				page: materialViewRequest.page,
				perPage: limit,
				totalPages: totalPages,
				totalCount: +count
			},
			data: selectQueryResponse
		}, { status: 200 })
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
