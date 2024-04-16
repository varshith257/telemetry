import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { PrismaService } from "src/prisma/prisma.service";
import { MetricsV1Dto } from "./dto/metrics.v1.dto";
import { ClickHouseClient, createClient } from "@clickhouse/client";
import { UpdateSchemaDto } from "./dto/update.schema.dto";
import { UserData, UserRole } from "src/interceptors/addUserDetails.interceptor";

@Injectable()
export class MetricsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
    this.ajv = new Ajv();
    addFormats(this.ajv);
    this.clickhouse = createClient({
      host: process.env.CLICKHOUSE_HOST,
      username: process.env.CLICKHOUSE_USER,
      password: process.env.CLICKHOUSE_PASSWORD,
      database: process.env.CLICKHOUSE_DB
    });
    this.validateMap = new Map();
    this.updateValidateMap(true);
  }
  
  private ajv: Ajv;
  private validateMap: Map<string, ValidateFunction>;
  private clickhouse: ClickHouseClient;
  private logger = new Logger(MetricsService.name);

  async updateValidateMap(force: boolean) {
    const schemeSchema = await this.prismaService.eventSchemaV1.findMany();
    if (schemeSchema.length === this.validateMap.size && !force) return;
    schemeSchema.forEach((event) => {
      if (!this.validateMap.has(event.event_id)) {
        this.validateMap.set(
          event.event_id,
          this.ajv.compile(JSON.parse(JSON.stringify(event.schema))),
        );
      }
    });
  }

  removeNullKeys(obj: any): any {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (obj[key] === null) {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          this.removeNullKeys(obj[key]);
        }
      });
    }
    return obj;
  }

  async saveMetrics(eventData: MetricsV1Dto[]) {
    let isRequestValid = true;
    let errorData = {};
    await this.updateValidateMap(false);
    for (let i = 0; i < eventData.length; i++) {
      eventData[i] = this.removeNullKeys(eventData[i]);
      const validationResponse = await this.validateEventData(eventData[i]);
      if (validationResponse.error) {
        isRequestValid = false;
        errorData[`${i}`] = validationResponse.errorList;
      }
    }
    if (!isRequestValid) {
      const response = {
        error: true,
        message: 'Request body does not satisfies the schema',
        errorData: errorData
      }
      this.logger.error(response);
      return Response.json(response, { status: 400 });
    }
    this.processData(eventData);
    return Response.json({
      error: false,
      message: 'Metric stored succesfully'
    }, { status: 200 })
  }
  
  async validateEventData(eventData: MetricsV1Dto) {
    if (!this.validateMap.has(eventData.eventId)) {
      return {
        error: true,
        errorList: [`No event found with eventId: ${eventData.eventId}`]
      }
    }
    const validator = this.validateMap.get(eventData.eventId);
    validator(eventData.eventData)
    if (validator.errors !== null) {
      return {
        error: true,
        errorList: validator.errors
      }
    }
    return {
      error: false,
      errorList: []
    }
  }
  
  async processData(eventDataList: MetricsV1Dto[]) {
    const formattedEventData = eventDataList.map((event) => {
      const { eventData, ...otherMetric } = event;
      return { 
        ...otherMetric,
        ...eventData,
      };
    });
    await this.clickhouse.insert({
      table: `event`,
      values: formattedEventData,
      format: 'JSONEachRow'
    });
  }

  async updateSchema(updateSchemaDto: UpdateSchemaDto) {
    let schema;
    try {
      schema = await this.prismaService.eventSchemaV1.upsert({
        where: {
          event_id: updateSchemaDto.eventId
        },
        create: {
          event_id: updateSchemaDto.eventId,
          event: updateSchemaDto.event,
          subEvent: updateSchemaDto.subEvent,
          schema: updateSchemaDto.schema
        },
        update: {
          event: updateSchemaDto.event,
          subEvent: updateSchemaDto.subEvent,
          schema: updateSchemaDto.schema
        }
      })
    } catch(error) {
      this.logger.error(error);
      return {
        error: true,
        message: 'Error updating/adding event schema',
        errorData: error
      }
    }
    this.updateValidateMap(true);
    return {
      error: false,
      message: 'Created/Updated Event schema',
      data: schema,
    }
  }

  async searchContent(
      userData: UserData,
      limit: number, 
      page: number, 
      orderBy?: string, 
      order?: string,
      filter?: any
  ) {
    if (!(userData.role == UserRole.ORG_ADMIN || userData.role == UserRole.OWNER || userData.role == UserRole.SUPER_ADMIN)) {
      throw new UnauthorizedException();
    }
    let selectClause = '';
		let whereClause = '';
		let rangeClause = '';

    const queryColumns = [
      'queryId',
      'timestamp',
      'phoneNumber',
      'timeTaken',
      'feedback',
      'error',
      'subEvent',
      'audioUrl',
      'text',
      'spellCorrectedText',
      'spellCheckTimeTaken',
      'textInEnglish',
      'response',
      'responseInEnglish',
      'reaction'
    ]
		selectClause += `SELECT ${queryColumns.join(', ')} FROM event`;

    const offset = limit * (page - 1);

		whereClause = `\nWHERE eventId='E002' \nAND orgId='${userData.orgId}'`;
    if (filter) {
      for(const column of Object.keys(filter)) {
        whereClause += `\nAND ${column}='${filter[column]}'`
      }
    }

    if (orderBy) {
      if (order) {
        rangeClause += `\nORDER BY ${orderBy} ${order}`
      } else {
        rangeClause += `\nORDER BY ${orderBy}`
      }
    }
    rangeClause += `\nLIMIT ${limit} OFFSET ${offset};`;
		const query = selectClause + whereClause + rangeClause;
    console.log(query);
    const content = await this.clickhouse.query({
      query: query,
      format: 'JSONEachRow'
    });
    const selectQueryResponse = await content.json();

    // getting count
    const countQuery = await this.clickhouse.query({
      query: `SELECT COUNT(*) FROM event` + whereClause,
    });
    const countQueryJsonRes = await countQuery.json();
    const count = countQueryJsonRes['data'][0]['count()'];
    
    const totalPages = Math.ceil(count / limit);
    return Response.json({
      pagination: {
        page: page,
        perPage: limit,
        totalPages: totalPages,
        totalCount: +count
      },
      data: selectQueryResponse
    }, { status: 200 })
  }

  async combinedView(
    userData: UserData,
    limit: number, 
    page: number, 
    orderBy?: string, 
    order?: string,
    filter?: any,
  ) {
    if (!(userData.role == UserRole.ORG_ADMIN || userData.role == UserRole.OWNER || userData.role == UserRole.SUPER_ADMIN)) {
      throw new UnauthorizedException();
    }
    let selectClause = '';
		let whereClause = '';
		let rangeClause = '';

		selectClause += `SELECT * FROM combined_data`;
    
    const offset = limit * (page - 1);

		whereClause = `\nWHERE orgId='${userData.orgId}'`;
    if (filter) {
      for(const column of Object.keys(filter)) {
        whereClause += `\nAND ${column}='${filter[column]}'`
      }
    }

    if (orderBy) {
      if (order) {
        rangeClause += `\nORDER BY ${orderBy} ${order}`
      } else {
        rangeClause += `\nORDER BY ${orderBy}`
      }
    } else {
      rangeClause += `\n ORDER BY timestamp DESC`
    }
    rangeClause += `\nLIMIT ${limit} OFFSET ${offset};`;
		const query = selectClause + whereClause + rangeClause;
    console.log(query);
    const content = await this.clickhouse.query({
      query: query,
      format: 'JSONEachRow'
    });
    const selectQueryResponse = await content.json();

    // getting count
    const countQuery = await this.clickhouse.query({
      query: `SELECT COUNT(*) FROM combined_data` + whereClause,
    });
    const countQueryJsonRes = await countQuery.json();
    const count = countQueryJsonRes['data'][0]['count()'];
    
    const totalPages = Math.ceil(count / limit);
    return Response.json({
      pagination: {
        page: page,
        perPage: limit,
        totalPages: totalPages,
        totalCount: +count
      },
      data: selectQueryResponse
    }, { status: 200 })
  }
}