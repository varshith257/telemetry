import { Inject, Injectable } from "@nestjs/common";
import Ajv from "ajv";
import { ClickHouse } from "clickhouse";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MetricsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('CLICKHOUSE_CONNECTION')
    private readonly clickhouse: ClickHouse
  ) {
    this.ajv = new Ajv();
  }
  
  private ajv: Ajv;

  async saveMetrics(eventData: any) {
    const validationResponse = await this.validateEventData(eventData);
    if (validationResponse.error) {
      return {
        error: true,
        message: 'Request body does not satisfies the schema',
        errorData: validationResponse.errorList
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
        EventSubEventCompositeKey: (eventData.event, eventData.subEvent),
      }
    })
    const validator = this.ajv.compile(JSON.parse(JSON.stringify(eventSchema.schema)));
    if (validator(eventData)) {
      return {
        error: true,
        errorList: validator.errors
      };
    }
    return {
      error: false,
      errorList: []
    }
  }
  
  async processData(eventData: any) {
    this.clickhouse.query('INSERT INTO events_v1 VALUES', eventData);
  }
}