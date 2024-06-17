import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit, UnauthorizedException } from "@nestjs/common";
import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { PrismaService } from "src/prisma/prisma.service";
import { MetricsV1Dto } from "./dto/metrics.v1.dto";
import { ClickHouseClient, createClient } from "@clickhouse/client";
import { UpdateSchemaDto } from "./dto/update.schema.dto";
import { UserData, UserRole } from "src/interceptors/addUserDetails.interceptor";
import { TELEMETRY_BROKER, TELEMETRY_QUEUE } from "src/constants";
import { ClientProxy } from "@nestjs/microservices";
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { IsArray, ValidateNested, validateOrReject } from "class-validator";
import { Type } from "class-transformer";
import * as os from 'os';

export class EventDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetricsV1Dto)
  events: MetricsV1Dto
}

@Injectable()
export class MetricsService implements OnModuleInit, OnModuleDestroy {
  private eventQueue: any[] = [];
  private errorQueueList: any[] = [];
  private totalPostCalls = 0;
  private responseFromWorkers = 0;
  private readonly queueSizeLimit = 10000;
  private intervalId: NodeJS.Timeout;
  private workers: Worker[] = [];
  private ajv: Ajv;
  private validateMap: Map<string, ValidateFunction>;
  private clickhouse: ClickHouseClient;
  private logger = new Logger(MetricsService.name);
  
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(TELEMETRY_BROKER) private readonly telemetryBroker: ClientProxy
  ) {
    this.ajv = new Ajv({removeAdditional: 'all'});
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

  private startQueueProcessing() {
    this.intervalId = setInterval(() => {
      console.log(`Queue Size: ${this.eventQueue.length}\t\t|\t\tPost Calls: ${this.totalPostCalls}\t\t|\t\tResponse from workers: ${this.responseFromWorkers}\t\t|\t\tError Queue Size: ${this.errorQueueList.length}`);
      this.processQueue();
    }, 500);
  }

  async onModuleInit() {
    const eventSchema = await this.prismaService.eventSchemaV1.findMany();
    for (let i = 0; i < os.cpus().length; i++) {
      const worker = new Worker(`${__dirname}/worker.js`, {
        workerData: {
          eventSchema: eventSchema
        }
      });
      worker.on('message', (data) => this.handleWorkerMessage(data));
      this.workers.push(worker);
    }
    this.startQueueProcessing();
  }

  onModuleDestroy() {
    this.workers.forEach(worker => worker.terminate());
  }

  async handleWorkerMessage(data: any) {
    this.eventQueue.push(...data.validatedData)
    this.errorQueueList.push(...data.errorData)
    this.responseFromWorkers++;
  }

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

  async saveMetrics(body: any[]) {
    this.workers[this.totalPostCalls % os.cpus().length].postMessage(body);
    this.totalPostCalls++;
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
      validator.errors[0]['eventId'] = eventData.eventId;
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
    this.eventQueue.push(...eventDataList);
    if (this.eventQueue.length >= this.queueSizeLimit) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.eventQueue.length === 0) return;
    const eventsToProcess = [...this.eventQueue];
    this.eventQueue = [];
    
    const formattedEventData = eventsToProcess.map((event) => {
      const { eventData, ...otherMetric } = event;
      return { 
        ...otherMetric,
        ...eventData,
      };
    });

    try {
      this.clickhouse.insert({
        table: `event`,
        values: formattedEventData,
        format: 'JSONEachRow'
      });
    } catch (error) {
      console.error('Failed to insert data into ClickHouse:', error);
      this.eventQueue.unshift(...eventsToProcess);
    }
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

  async combinedView(
    userData: UserData,
    limit: number, 
    page: number, 
    botId: string,
    orgId: string,
    orderBy?: string, 
    order?: string,
    filter?: any
  ) {
    let selectClause = '';
		let whereClause = '';
		let rangeClause = '';

		selectClause += `SELECT * FROM combined_data_v1`;
    
    const offset = limit * (page - 1);

		whereClause = `\nWHERE botId='${botId}'`;
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
      rangeClause += `\n ORDER BY e_timestamp DESC`
    }
    rangeClause += `\nLIMIT ${limit} OFFSET ${offset};`;
		const query = selectClause + whereClause + rangeClause;
    console.log(query);

     let content; 
    try {
      content = await this.clickhouse.query({
        query: query,
        format: 'JSONEachRow'
      });
    } catch (err) {
      console.error(err)
    }
    
    const selectQueryResponse: any[] = await content.json();

    let countQuery;
    try {
      // getting count
      countQuery = await this.clickhouse.query({
        query: `SELECT COUNT(*) FROM combined_data_v1` + whereClause,
      });
    } catch (err) {
      console.error(err)
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