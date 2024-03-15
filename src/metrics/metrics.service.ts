import { Inject, Injectable } from "@nestjs/common";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { ClickHouse } from "clickhouse";
import { PrismaService } from "src/prisma/prisma.service";
import { MetricsV1Dto } from "./dto/metrics.v1.dto";

@Injectable()
export class MetricsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
    this.ajv = new Ajv();
    addFormats(this.ajv);
    this.clickhouse = new ClickHouse({
      host: 'localhost',
      port: 18123,
      database: 'default',
      user: '',
      password: '',
      basicAuth: null
    });
  }
  
  private ajv: Ajv;
  private clickhouse: ClickHouse;

  async saveMetrics(eventData: MetricsV1Dto[]) {
    let isRequestValid = true;
    let errorData = {};
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
    this.processData(eventData)
    return {
      error: false,
      message: 'Metric stored successfully'
    }
  }
  
  async validateEventData(eventData: any) {
    const eventSchema = await this.prismaService.eventSchemaV1.findUnique({
      where: {
        EventSubEventCompositeKey: {
          subEvent: eventData.subEvent,
          event: eventData.event,
        }
      }
    })
    const validator = this.ajv.compile(JSON.parse(JSON.stringify(eventSchema.schema)));
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
      }
    });
    const formattedData = formattedEventData.map(row => JSON.stringify(row)).join('\n');
    const insertQuery = `
      INSERT INTO events_v1
      FORMAT JSONEachRow
      ${formattedData}
    `
    const res = await this.clickhouse.query(insertQuery).toPromise();
    // const res = await this.clickhouse.insert(`INSERT INTO events_v1`, formattedEventData);
    // await this.clickhouse.query('INSERT INTO events_v1', formattedEventData).exec(function (error, rows) {
    //   console.log(error);
    //   console.log(rows);
    // })
    console.log(res);
    // const ws = this.clickhouse.insert('INSERT INTO events_v1').stream();
  }
}