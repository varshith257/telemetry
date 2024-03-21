import { IsDateString, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class MetricsV1Dto {
  @IsString()
  generator: string;
  
  @IsString()
  version: string;

  @IsNumber()
  timestamp: number;

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

  @IsOptional()
  @IsNumber()
  timeElapsed: number;

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