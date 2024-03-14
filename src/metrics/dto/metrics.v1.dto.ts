import { IsDateString, IsJSON, IsNumber, IsString } from "class-validator";

export class MetricsV1Dto {
  @IsString()
  generator: string;
  
  @IsString()
  version: string;

  @IsDateString()
  timestamp: Date;

  @IsString()
  actorId: string;

  @IsString()
  actorType: string;

  sid: string;
  
  did: string;

  @IsString()
  env: string;

  @IsString()
  event: string;

  @IsString()
  subEvent: string;

  @IsNumber()
  timeTaken: number;

  @IsJSON()
  eventData: any; 
}