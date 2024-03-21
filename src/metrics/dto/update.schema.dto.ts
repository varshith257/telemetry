import { IsJSON, IsString } from "class-validator";

export class UpdateSchemaDto {
  @IsString()
  eventId: string;
  
  @IsString()
  event: string;
  
  @IsString()
  subEvent: string;
  
  @IsJSON()
  schema: any
}