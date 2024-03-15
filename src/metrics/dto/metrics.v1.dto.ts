import { Type } from "class-transformer";
import { IsArray, IsDateString, IsEmail, IsJSON, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

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

  @IsOptional()
  @IsString()
  sessionId: string;
  
  @IsOptional()
  @IsString()
  deviceId: string;
  
  @IsString()
  env: string;

  @IsString()
  eventId: string;

  @IsString()
  event: string;

  @IsString()
  subEvent: string;

  @IsNumber()
  timeTaken: number;

  @IsOptional()
  @IsString()
  os: string;

  @IsOptional()
  @IsString()
  browser: string;

  @IsOptional()
  @IsString()
  browserVersion: string;

  @IsOptional()
  @IsString()
  deviceType: string;

  @IsOptional()
  @IsString()
  platform: string;

  @IsOptional()
  @IsString()
  ip: string;

  @IsObject()
  eventData: any; 
}

export class MetricsV1ListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetricsV1Dto)
  metrics: MetricsV1Dto[];
}