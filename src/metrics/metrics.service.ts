import { Injectable } from "@nestjs/common";
import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import { ClickHouse } from "clickhouse";
import { PrismaService } from "src/prisma/prisma.service";
import { MetricsV1Dto } from "./dto/metrics.v1.dto";
import { ClickHouseClient, createClient } from "@clickhouse/client";

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
    // this.clickhouse = new ClickHouse({
    //   host: process.env.CLICKHOUSE_HOST,
    //   port: process.env.CLICKHOUSE_PORT,
    //   database: process.env.CLICKHOUSE_DB,
    //   basicAuth: {
    //     username: process.env.CLICKHOUSE_USER,
    //     password: process.env.CLICKHOUSE_PASSWORD,
    //   },
    //   format: 'json'
    // });
    // this.clickhouse.query('SELECT * FROM events_v1').exec((err, rows) => {
    //   console.error(err);
    //   console.log(rows);
    // });
    this.validateMap = new Map();
    this.updateValidateMap();
  }
  
  private ajv: Ajv;
  private validateMap: Map<string, ValidateFunction>;
  private clickhouse: ClickHouseClient;

  async updateValidateMap() {
    const schemeSchema = await this.prismaService.eventSchemaV1.findMany();
    if (schemeSchema.length === this.validateMap.size) return;
    schemeSchema.forEach((event) => {
      if (!this.validateMap.has(event.event_id)) {
        this.validateMap.set(
          event.event_id,
          this.ajv.compile(JSON.parse(JSON.stringify(event.schema))),
        );
      }
    });
  }

  async saveMetrics(eventData: MetricsV1Dto[]) {
    let isRequestValid = true;
    let errorData = {};
    await this.updateValidateMap();
    for (let i = 0; i < eventData.length; i++) {
      const validationResponse = await this.validateEventData(eventData[i]);
      if (validationResponse.error) {
        isRequestValid = false;
        errorData[`${i}`] = validationResponse.errorList;
      }
    }
    if (!isRequestValid) {
      return {
        error: true,
        message: 'Request body does not satisfies the schema',
        errorData: errorData
      };
    }
    this.processData(eventData);
    return {
      error: false,
      message: 'Metric stored successfully'
    }
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

  // Clickhouse doesn't take 2020-07-10 15:00:00.000 for some reason, feeding 2020-07-10 15:00:00 instead
  // TODO: Fix this
  convertDatetime(jsonData) {
    const pattern = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/;
    for (const key in jsonData) {
      if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
        if (typeof jsonData[key] === 'object') {
          jsonData[key] = this.convertDatetime(jsonData[key]);
        } else if (typeof jsonData[key] === 'string' && pattern.test(jsonData[key])) {
          jsonData[key] = jsonData[key].split('.')[0]; // Remove milliseconds
        }
      }
    }
    return jsonData;
}
  
  async processData(eventDataList: MetricsV1Dto[]) {
    const formattedEventData = eventDataList.map((event) => {
      const { eventData, ...otherMetric } = event;
      return { 
        ...otherMetric,
        ...eventData,
      }
    });
    this.convertDatetime(formattedEventData);
    await this.clickhouse.insert({
      table: 'events_v1',
      values: formattedEventData,
      format: 'JSONEachRow'
    });
  }
}